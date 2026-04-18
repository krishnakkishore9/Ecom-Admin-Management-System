from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from app.auth import get_current_user
from app.database import get_supabase

router = APIRouter()

STATUS_FLOW = ["pending", "packed", "shipped", "delivered"]

# ── Synthetic walk-in orders (mirrors frontend mock data) ──────────────────────
def _synthetic_orders():
    now = datetime.now(timezone.utc)
    return [
        {"id": "syn-ord-001", "status": "pending",   "total_amount": 1180, "created_at": now.isoformat(),                              "customers": {"id": "syn-cus-001", "name": "Walk-in Customer 1", "email": "walkin1@freshmarket.local"}, "order_items": []},
        {"id": "syn-ord-002", "status": "packed",    "total_amount": 940,  "created_at": (now - timedelta(minutes=10)).isoformat(),    "customers": {"id": "syn-cus-002", "name": "Walk-in Customer 2", "email": "walkin2@freshmarket.local"}, "order_items": []},
        {"id": "syn-ord-003", "status": "shipped",   "total_amount": 1520, "created_at": (now - timedelta(minutes=20)).isoformat(),    "customers": {"id": "syn-cus-003", "name": "Walk-in Customer 3", "email": "walkin3@freshmarket.local"}, "order_items": []},
        {"id": "syn-ord-004", "status": "delivered", "total_amount": 1840, "created_at": (now - timedelta(minutes=30)).isoformat(),    "customers": {"id": "syn-cus-004", "name": "Walk-in Customer 4", "email": "walkin4@freshmarket.local"}, "order_items": []},
        {"id": "syn-ord-005", "status": "delivered", "total_amount": 1260, "created_at": (now - timedelta(minutes=40)).isoformat(),    "customers": {"id": "syn-cus-005", "name": "Walk-in Customer 5", "email": "walkin5@freshmarket.local"}, "order_items": []},
        {"id": "syn-ord-006", "status": "delivered", "total_amount": 2090, "created_at": (now - timedelta(minutes=50)).isoformat(),    "customers": {"id": "syn-cus-006", "name": "Walk-in Customer 6", "email": "walkin6@freshmarket.local"}, "order_items": []},
    ]


# GET /api/orders — list all orders with pagination
@router.get("")
async def list_orders(
    limit: int = Query(default=50),
    offset: int = Query(default=0),
    user=Depends(get_current_user),
):
    supabase = get_supabase()
    response = (
        supabase.from_("orders")
        .select("""
            id, status, total_amount, created_at,
            customers(id, name, email),
            order_items(
                id, quantity, price_at_purchase,
                products(id, name, image_url)
            )
        """, count="exact")
        .order("created_at", desc=True)
        .range(offset, offset + limit - 1)
        .execute()
    )
    if response.data is None:
        raise HTTPException(status_code=500, detail="Failed to fetch orders")

    sanitized = [
        {
            **o,
            "total_amount": float(o["total_amount"]),
            "order_items": [
                {**item, "price_at_purchase": float(item["price_at_purchase"])}
                for item in (o.get("order_items") or [])
            ],
        }
        for o in response.data
    ]

    synthetic = _synthetic_orders()
    synthetic_ids = {s["id"] for s in synthetic}
    merged = synthetic + [o for o in sanitized if o["id"] not in synthetic_ids]
    paginated = merged[offset: offset + limit]
    merged_count = (response.count or 0) + len(synthetic)

    return {"data": paginated, "count": merged_count}


class StatusUpdate(BaseModel):
    status: str


# PUT /api/orders/{id}/status — update order status
@router.put("/{order_id}/status")
async def update_order_status(order_id: str, body: StatusUpdate, user=Depends(get_current_user)):
    if body.status not in STATUS_FLOW:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of: {', '.join(STATUS_FLOW)}",
        )

    supabase = get_supabase()

    # Fetch current status
    fetch = supabase.from_("orders").select("status").eq("id", order_id).single().execute()
    if not fetch.data:
        raise HTTPException(status_code=404, detail="Order not found")

    current_index = STATUS_FLOW.index(fetch.data["status"])
    new_index = STATUS_FLOW.index(body.status)
    is_backward = new_index < current_index

    update = (
        supabase.from_("orders")
        .update({"status": body.status})
        .eq("id", order_id)
        .select()
        .single()
        .execute()
    )
    if not update.data:
        raise HTTPException(status_code=500, detail="Failed to update order status")
    return {"data": update.data, "isBackward": is_backward}
