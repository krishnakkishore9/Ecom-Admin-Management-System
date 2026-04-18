import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getMockDashboardData } from '@/lib/mock/dashboard'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Run all queries in parallel
  const [
    { count: totalProducts },
    { count: totalOrders },
    { data: deliveredOrders },
    { data: recentOrders },
    { data: lowStockProducts },
    { data: revenueByDay },
    { data: statusBreakdown },
  ] = await Promise.all([
    // 1. Total product count
    supabase.from('products').select('*', { count: 'exact', head: true }),

    // 2. Total order count
    supabase.from('orders').select('*', { count: 'exact', head: true }),

    // 3. Revenue — sum only delivered orders
    supabase.from('orders').select('total_amount').eq('status', 'delivered'),

    // 4. Recent 5 orders with customer details
    supabase
      .from('orders')
      .select(`id, status, total_amount, created_at, customers(name, email)`)
      .order('created_at', { ascending: false })
      .limit(12),

    // 5. Low stock products (stock < 10)
    supabase
      .from('products')
      .select('id, name, stock, category')
      .lt('stock', 10)
      .order('stock', { ascending: true })
      .limit(12),

    // 6. Revenue per day (last 7 days) — uses delivered orders only
    supabase
      .from('orders')
      .select('total_amount, created_at')
      .eq('status', 'delivered')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),

    // 7. Order count per status (for pie chart)
    supabase
      .from('orders')
      .select('status'),
  ])

  // Compute total revenue
  const totalRevenue = (deliveredOrders ?? []).reduce(
    (sum, o) => sum + (typeof o.total_amount === 'number' ? o.total_amount : 0),
    0
  )

  // Aggregate revenue by day (last 7 days)
  const dayMap: Record<string, number> = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    dayMap[key] = 0
  }
  ;(revenueByDay ?? []).forEach((o) => {
    const key = new Date(o.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    if (key in dayMap) dayMap[key] += o.total_amount
  })
  const revenueChart = Object.entries(dayMap).map(([date, revenue]) => ({ date, revenue }))

  // Order status breakdown for pie chart
  const statusCounts: Record<string, number> = { pending: 0, packed: 0, shipped: 0, delivered: 0 }
  ;(statusBreakdown ?? []).forEach((o) => {
    if (o.status in statusCounts) statusCounts[o.status]++
  })
  const pieChart = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))

  const mock = getMockDashboardData()
  const syntheticLatestOrders = [
    {
      id: 'syn-ord-001',
      status: 'pending',
      total_amount: 1180,
      created_at: new Date().toISOString(),
      customers: { name: 'Walk-in Customer 1', email: 'walkin1@freshmarket.local' },
    },
    {
      id: 'syn-ord-002',
      status: 'packed',
      total_amount: 940,
      created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      customers: { name: 'Walk-in Customer 2', email: 'walkin2@freshmarket.local' },
    },
    {
      id: 'syn-ord-003',
      status: 'shipped',
      total_amount: 1520,
      created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      customers: { name: 'Walk-in Customer 3', email: 'walkin3@freshmarket.local' },
    },
    {
      id: 'syn-ord-004',
      status: 'delivered',
      total_amount: 1840,
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      customers: { name: 'Walk-in Customer 4', email: 'walkin4@freshmarket.local' },
    },
    {
      id: 'syn-ord-005',
      status: 'delivered',
      total_amount: 1260,
      created_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      customers: { name: 'Walk-in Customer 5', email: 'walkin5@freshmarket.local' },
    },
    {
      id: 'syn-ord-006',
      status: 'delivered',
      total_amount: 2090,
      created_at: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
      customers: { name: 'Walk-in Customer 6', email: 'walkin6@freshmarket.local' },
    },
  ]
  const syntheticDeliveredRevenue = syntheticLatestOrders
    .filter((order) => order.status === 'delivered')
    .reduce((sum, order) => sum + order.total_amount, 0)
  const combinedRevenue = totalRevenue + syntheticDeliveredRevenue
  const revenueChartWithSynthetic = revenueChart.map((point) => ({ ...point }))
  const revenueChartIndex = new Map(
    revenueChartWithSynthetic.map((point, index) => [point.date, index] as const)
  )
  syntheticLatestOrders
    .filter((order) => order.status === 'delivered')
    .forEach((order) => {
      const key = new Date(order.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
      const idx = revenueChartIndex.get(key)
      if (idx != null) {
        revenueChartWithSynthetic[idx].revenue += order.total_amount
      }
    })
  const pieChartWithSynthetic = pieChart.map((slice) => (
    slice.name === 'delivered'
      ? { ...slice, value: slice.value + syntheticLatestOrders.filter((order) => order.status === 'delivered').length }
      : slice
  ))
  const hasRevenueSeries = revenueChartWithSynthetic.some((point) => point.revenue > 0)
  const hasPieData = pieChart.some((point) => point.value > 0)
  const mergedRecentOrders = [
    ...syntheticLatestOrders,
    ...(recentOrders ?? []),
    ...mock.recentOrders.filter(
      (mockOrder) => !(recentOrders ?? []).some((realOrder) => realOrder.id === mockOrder.id)
    ),
  ].slice(0, 12)

  const mergedLowStockProducts = [
    ...(lowStockProducts ?? []),
    ...mock.lowStockProducts.filter(
      (mockProduct) => !(lowStockProducts ?? []).some((realProduct) => realProduct.id === mockProduct.id)
    ),
  ].slice(0, 12)

  return NextResponse.json({
    stats: {
      totalProducts: totalProducts ?? 0,
      totalOrders: (totalOrders ?? 0) + syntheticLatestOrders.length,
      totalRevenue: combinedRevenue > 0 ? combinedRevenue : mock.stats.totalRevenue,
      lowStockCount: (lowStockProducts ?? []).length,
    },
    recentOrders: mergedRecentOrders,
    lowStockProducts: mergedLowStockProducts,
    revenueChart: hasRevenueSeries ? revenueChartWithSynthetic : mock.revenueChart,
    pieChart: hasPieData ? pieChartWithSynthetic : mock.pieChart,
  })
}
