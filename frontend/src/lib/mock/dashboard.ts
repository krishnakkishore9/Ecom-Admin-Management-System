type RecentOrder = {
  id: string
  status: 'pending' | 'packed' | 'shipped' | 'delivered'
  total_amount: number
  created_at: string
  customers: { name: string; email: string } | null
}

type LowStockProduct = {
  id: string
  name: string
  stock: number
  category: string
}

function isoDaysAgo(daysAgo: number) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString()
}

export function getMockDashboardData() {
  const recentOrders: RecentOrder[] = [
    { id: 'a1f8c2e1-9b31-4f7a-a001-101', status: 'delivered', total_amount: 2240, created_at: isoDaysAgo(0), customers: { name: 'Rohan Sharma', email: 'rohan@example.com' } },
    { id: 'b2f8c2e1-9b31-4f7a-a001-102', status: 'shipped', total_amount: 1680, created_at: isoDaysAgo(0), customers: { name: 'Priya Verma', email: 'priya@example.com' } },
    { id: 'c3f8c2e1-9b31-4f7a-a001-103', status: 'packed', total_amount: 920, created_at: isoDaysAgo(1), customers: { name: 'Amit Rao', email: 'amit@example.com' } },
    { id: 'd4f8c2e1-9b31-4f7a-a001-104', status: 'pending', total_amount: 1340, created_at: isoDaysAgo(1), customers: { name: 'Neha Jain', email: 'neha@example.com' } },
    { id: 'e5f8c2e1-9b31-4f7a-a001-105', status: 'delivered', total_amount: 2760, created_at: isoDaysAgo(2), customers: { name: 'Karan Mehta', email: 'karan@example.com' } },
    { id: 'f6f8c2e1-9b31-4f7a-a001-106', status: 'delivered', total_amount: 1980, created_at: isoDaysAgo(2), customers: { name: 'Sneha Kulkarni', email: 'sneha@example.com' } },
    { id: 'g7f8c2e1-9b31-4f7a-a001-107', status: 'shipped', total_amount: 1140, created_at: isoDaysAgo(3), customers: { name: 'Vikram Singh', email: 'vikram@example.com' } },
    { id: 'h8f8c2e1-9b31-4f7a-a001-108', status: 'packed', total_amount: 860, created_at: isoDaysAgo(3), customers: { name: 'Asha Patil', email: 'asha@example.com' } },
    { id: 'i9f8c2e1-9b31-4f7a-a001-109', status: 'pending', total_amount: 740, created_at: isoDaysAgo(4), customers: { name: 'Manoj Iyer', email: 'manoj@example.com' } },
    { id: 'j1a8c2e1-9b31-4f7a-a001-110', status: 'delivered', total_amount: 3120, created_at: isoDaysAgo(4), customers: { name: 'Divya Nair', email: 'divya@example.com' } },
    { id: 'k2a8c2e1-9b31-4f7a-a001-111', status: 'shipped', total_amount: 1490, created_at: isoDaysAgo(5), customers: { name: 'Arjun Bhat', email: 'arjun@example.com' } },
    { id: 'l3a8c2e1-9b31-4f7a-a001-112', status: 'pending', total_amount: 990, created_at: isoDaysAgo(6), customers: { name: 'Meera Das', email: 'meera@example.com' } },
  ]

  const lowStockProducts: LowStockProduct[] = [
    { id: 'p-101', name: 'Alphonso Mango', stock: 2, category: 'Fruits' },
    { id: 'p-102', name: 'Baby Spinach', stock: 4, category: 'Leafy Greens' },
    { id: 'p-103', name: 'Cherry Tomato', stock: 6, category: 'Vegetables' },
    { id: 'p-104', name: 'Dragon Fruit', stock: 1, category: 'Fruits' },
    { id: 'p-105', name: 'Broccoli', stock: 5, category: 'Vegetables' },
    { id: 'p-106', name: 'Green Apple', stock: 3, category: 'Fruits' },
    { id: 'p-107', name: 'Avocado', stock: 7, category: 'Fruits' },
    { id: 'p-108', name: 'Button Mushroom', stock: 2, category: 'Vegetables' },
    { id: 'p-109', name: 'Coriander Leaves', stock: 0, category: 'Herbs' },
    { id: 'p-110', name: 'Red Bell Pepper', stock: 8, category: 'Vegetables' },
    { id: 'p-111', name: 'Kiwi', stock: 4, category: 'Fruits' },
    { id: 'p-112', name: 'Mint Leaves', stock: 1, category: 'Herbs' },
  ]

  const revenuePoints = [1240, 1860, 1420, 2280, 2010, 2640, 2980]
  const revenueChart = revenuePoints.map((revenue, index) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - index))
    return {
      date: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      revenue,
    }
  })

  const pieChart = [
    { name: 'pending', value: 9 },
    { name: 'packed', value: 11 },
    { name: 'shipped', value: 16 },
    { name: 'delivered', value: 24 },
  ]

  return {
    stats: {
      totalProducts: 128,
      totalOrders: 62,
      totalRevenue: 90340,
      lowStockCount: lowStockProducts.length,
    },
    recentOrders,
    lowStockProducts,
    revenueChart,
    pieChart,
  }
}
