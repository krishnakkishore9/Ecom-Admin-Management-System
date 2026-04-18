import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/products — list all products with optional search
export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const query = searchParams.get('query') ?? ''
  const limit = Number(searchParams.get('limit') ?? 50)
  const offset = Number(searchParams.get('offset') ?? 0)

  let dbQuery = supabase
    .from('products')
    .select('id, name, category, price, stock, status, image_url, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (query) {
    dbQuery = dbQuery.ilike('name', `%${query}%`)
  }

  const { data, error, count } = await dbQuery

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Ensure numeric types are definitely numbers for the client
  const sanitizedData = (data ?? []).map(p => ({
    ...p,
    price: Number(p.price),
    stock: Number(p.stock),
  }))

  return NextResponse.json({ data: sanitizedData, count })
}

// POST /api/products — create a new product
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, category, price, stock, status, image_url } = body

  if (!name || !category || price == null || stock == null) {
    return NextResponse.json({ error: 'Missing required fields: name, category, price, stock' }, { status: 400 })
  }
  if (price < 0) return NextResponse.json({ error: 'Price cannot be negative' }, { status: 400 })
  if (stock < 0) return NextResponse.json({ error: 'Stock cannot be negative' }, { status: 400 })

  const { data, error } = await supabase
    .from('products')
    .insert([{ name, category, price: Number(price), stock: Number(stock), status: status ?? 'active', image_url }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
