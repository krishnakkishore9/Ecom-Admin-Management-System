from fastapi import APIRouter, Depends, HTTPException, Query
from app.auth import get_current_user
from app.database import get_supabase

router = APIRouter()


# GET /api/customers — list all customers with optional search
@router.get("")
async def list_customers(
    query: str = Query(default=""),
    user=Depends(get_current_user),
):
    supabase = get_supabase()
    db_query = (
        supabase.from_("customers")
        .select("id, name, email, created_at, orders(id)", count="exact")
        .order("created_at", desc=True)
    )
    if query:
        db_query = db_query.or_(f"name.ilike.%{query}%,email.ilike.%{query}%")

    response = db_query.execute()
    if response.data is None:
        raise HTTPException(status_code=500, detail="Failed to fetch customers")

    # Compute order counts and strip nested orders array
    enriched = [
        {
            **{k: v for k, v in c.items() if k != "orders"},
            "order_count": len(c.get("orders", []) or []),
        }
        for c in response.data
    ]
    return {"data": enriched, "count": response.count}


# GET /api/customers/{id}/orders — fetch order history for a specific customer
@router.get("/{customer_id}/orders")
async def get_customer_orders(customer_id: str, user=Depends(get_current_user)):
    supabase = get_supabase()
    response = (
        supabase.from_("orders")
        .select("""
            id, status, total_amount, created_at,
            order_items(
                id, quantity, price_at_purchase,
                products(name)
            )
        """)
        .eq("customer_id", customer_id)
        .order("created_at", desc=True)
        .execute()
    )
    if response.data is None:
        raise HTTPException(status_code=500, detail="Failed to fetch customer orders")
    return {"data": response.data}
