import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/customers — list all customers
export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const query = searchParams.get('query') ?? ''

  let dbQuery = supabase
    .from('customers')
    .select(`id, name, email, created_at, orders(id)`, { count: 'exact' })
    .order('created_at', { ascending: false })

  if (query) {
    dbQuery = dbQuery.or(`name.ilike.%${query}%,email.ilike.%${query}%`)
  }

  const { data, error, count } = await dbQuery
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Compute order counts
  const enriched = (data ?? []).map((c) => ({
    ...c,
    order_count: Array.isArray(c.orders) ? c.orders.length : 0,
    orders: undefined,
  }))

  return NextResponse.json({ data: enriched, count })
}
