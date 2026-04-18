import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const STATUS_FLOW = ['pending', 'packed', 'shipped', 'delivered']

// PUT /api/orders/[id]/status — update order status
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { status: newStatus } = await req.json()

  if (!STATUS_FLOW.includes(newStatus)) {
    return NextResponse.json({ error: `Invalid status. Must be one of: ${STATUS_FLOW.join(', ')}` }, { status: 400 })
  }

  // Fetch current order status
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('status')
    .eq('id', id)
    .single()

  if (fetchError || !order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  const currentIndex = STATUS_FLOW.indexOf(order.status)
  const newIndex = STATUS_FLOW.indexOf(newStatus)

  // Warn on backward transitions (allow but flag it)
  const isBackward = newIndex < currentIndex

  const { data, error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data, isBackward })
}
