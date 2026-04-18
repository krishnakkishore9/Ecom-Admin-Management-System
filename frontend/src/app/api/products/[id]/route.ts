import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// PUT /api/products/[id] — update a product
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { name, category, price, stock, status, image_url } = body

  const updates: Record<string, unknown> = {}
  if (name !== undefined) updates.name = name
  if (category !== undefined) updates.category = category
  if (price !== undefined) {
    if (Number(price) < 0) return NextResponse.json({ error: 'Price cannot be negative' }, { status: 400 })
    updates.price = Number(price)
  }
  if (stock !== undefined) {
    if (Number(stock) < 0) return NextResponse.json({ error: 'Stock cannot be negative' }, { status: 400 })
    updates.stock = Number(stock)
  }
  if (status !== undefined) updates.status = status
  if (image_url !== undefined) updates.image_url = image_url

  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

// DELETE /api/products/[id] — delete a product (blocked if in order_items)
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  // Check if product is referenced in any order
  const { count } = await supabase
    .from('order_items')
    .select('*', { count: 'exact', head: true })
    .eq('product_id', id)

  if (count && count > 0) {
    return NextResponse.json(
      { error: 'Cannot delete: product is part of existing orders. Set it to inactive instead.' },
      { status: 409 }
    )
  }

  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}

// GET /api/products/[id] — fetch single product
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })

  return NextResponse.json({ data })
}
