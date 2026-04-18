from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException
from app.auth import get_current_user
from app.database import get_supabase

router = APIRouter()


def _iso_days_ago(days: int) -> str:
    return (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()


def _get_mock_dashboard_data():
    recent_orders = [
        {"id": "a1f8c2e1-9b31-4f7a-a001-101", "status": "delivered", "total_amount": 2240, "created_at": _iso_days_ago(0), "customers": {"name": "Rohan Sharma",    "email": "rohan@example.com"}},
        {"id": "b2f8c2e1-9b31-4f7a-a001-102", "status": "shipped",   "total_amount": 1680, "created_at": _iso_days_ago(0), "customers": {"name": "Priya Verma",     "email": "priya@example.com"}},
        {"id": "c3f8c2e1-9b31-4f7a-a001-103", "status": "packed",    "total_amount": 920,  "created_at": _iso_days_ago(1), "customers": {"name": "Amit Rao",        "email": "amit@example.com"}},
        {"id": "d4f8c2e1-9b31-4f7a-a001-104", "status": "pending",   "total_amount": 1340, "created_at": _iso_days_ago(1), "customers": {"name": "Neha Jain",       "email": "neha@example.com"}},
        {"id": "e5f8c2e1-9b31-4f7a-a001-105", "status": "delivered", "total_amount": 2760, "created_at": _iso_days_ago(2), "customers": {"name": "Karan Mehta",     "email": "karan@example.com"}},
        {"id": "f6f8c2e1-9b31-4f7a-a001-106", "status": "delivered", "total_amount": 1980, "created_at": _iso_days_ago(2), "customers": {"name": "Sneha Kulkarni",  "email": "sneha@example.com"}},
        {"id": "g7f8c2e1-9b31-4f7a-a001-107", "status": "shipped",   "total_amount": 1140, "created_at": _iso_days_ago(3), "customers": {"name": "Vikram Singh",    "email": "vikram@example.com"}},
        {"id": "h8f8c2e1-9b31-4f7a-a001-108", "status": "packed",    "total_amount": 860,  "created_at": _iso_days_ago(3), "customers": {"name": "Asha Patil",      "email": "asha@example.com"}},
        {"id": "i9f8c2e1-9b31-4f7a-a001-109", "status": "pending",   "total_amount": 740,  "created_at": _iso_days_ago(4), "customers": {"name": "Manoj Iyer",      "email": "manoj@example.com"}},
        {"id": "j1a8c2e1-9b31-4f7a-a001-110", "status": "delivered", "total_amount": 3120, "created_at": _iso_days_ago(4), "customers": {"name": "Divya Nair",      "email": "divya@example.com"}},
        {"id": "k2a8c2e1-9b31-4f7a-a001-111", "status": "shipped",   "total_amount": 1490, "created_at": _iso_days_ago(5), "customers": {"name": "Arjun Bhat",      "email": "arjun@example.com"}},
        {"id": "l3a8c2e1-9b31-4f7a-a001-112", "status": "pending",   "total_amount": 990,  "created_at": _iso_days_ago(6), "customers": {"name": "Meera Das",       "email": "meera@example.com"}},
    ]
    low_stock = [
        {"id": "p-101", "name": "Alphonso Mango",    "stock": 2, "category": "Fruits"},
        {"id": "p-102", "name": "Baby Spinach",       "stock": 4, "category": "Leafy Greens"},
        {"id": "p-103", "name": "Cherry Tomato",      "stock": 6, "category": "Vegetables"},
        {"id": "p-104", "name": "Dragon Fruit",       "stock": 1, "category": "Fruits"},
        {"id": "p-105", "name": "Broccoli",           "stock": 5, "category": "Vegetables"},
        {"id": "p-106", "name": "Green Apple",        "stock": 3, "category": "Fruits"},
        {"id": "p-107", "name": "Avocado",            "stock": 7, "category": "Fruits"},
        {"id": "p-108", "name": "Button Mushroom",    "stock": 2, "category": "Vegetables"},
        {"id": "p-109", "name": "Coriander Leaves",  "stock": 0, "category": "Herbs"},
        {"id": "p-110", "name": "Red Bell Pepper",    "stock": 8, "category": "Vegetables"},
        {"id": "p-111", "name": "Kiwi",               "stock": 4, "category": "Fruits"},
        {"id": "p-112", "name": "Mint Leaves",        "stock": 1, "category": "Herbs"},
    ]
    revenue_points = [1240, 1860, 1420, 2280, 2010, 2640, 2980]
    revenue_chart = [
        {
            "date": (datetime.now(timezone.utc) - timedelta(days=6 - i)).strftime("%-d %b"),
            "revenue": revenue_points[i],
        }
        for i in range(7)
    ]
    pie_chart = [
        {"name": "pending",   "value": 9},
        {"name": "packed",    "value": 11},
        {"name": "shipped",   "value": 16},
        {"name": "delivered", "value": 24},
    ]
    return {
        "stats": {"totalProducts": 128, "totalOrders": 62, "totalRevenue": 90340, "lowStockCount": len(low_stock)},
        "recentOrders": recent_orders,
        "lowStockProducts": low_stock,
        "revenueChart": revenue_chart,
        "pieChart": pie_chart,
    }


def _synthetic_orders():
    now = datetime.now(timezone.utc)
    return [
        {"id": "syn-ord-001", "status": "pending",   "total_amount": 1180, "created_at": now.isoformat(),                           "customers": {"name": "Walk-in Customer 1", "email": "walkin1@freshmarket.local"}},
        {"id": "syn-ord-002", "status": "packed",    "total_amount": 940,  "created_at": (now - timedelta(minutes=10)).isoformat(),  "customers": {"name": "Walk-in Customer 2", "email": "walkin2@freshmarket.local"}},
        {"id": "syn-ord-003", "status": "shipped",   "total_amount": 1520, "created_at": (now - timedelta(minutes=20)).isoformat(),  "customers": {"name": "Walk-in Customer 3", "email": "walkin3@freshmarket.local"}},
        {"id": "syn-ord-004", "status": "delivered", "total_amount": 1840, "created_at": (now - timedelta(minutes=30)).isoformat(),  "customers": {"name": "Walk-in Customer 4", "email": "walkin4@freshmarket.local"}},
        {"id": "syn-ord-005", "status": "delivered", "total_amount": 1260, "created_at": (now - timedelta(minutes=40)).isoformat(),  "customers": {"name": "Walk-in Customer 5", "email": "walkin5@freshmarket.local"}},
        {"id": "syn-ord-006", "status": "delivered", "total_amount": 2090, "created_at": (now - timedelta(minutes=50)).isoformat(),  "customers": {"name": "Walk-in Customer 6", "email": "walkin6@freshmarket.local"}},
    ]


# GET /api/dashboard/summary — full dashboard aggregation
@router.get("/summary")
async def get_dashboard_summary(user=Depends(get_current_user)):
    supabase = get_supabase()

    # ── 1. Total product count ────────────────────────────────────────────────
    prod_resp = supabase.from_("products").select("*", count="exact", head=True).execute()
    total_products = prod_resp.count or 0

    # ── 2. Total order count ──────────────────────────────────────────────────
    ord_resp = supabase.from_("orders").select("*", count="exact", head=True).execute()
    total_orders = ord_resp.count or 0

    # ── 3. Total revenue (delivered orders only) ──────────────────────────────
    rev_resp = supabase.from_("orders").select("total_amount").eq("status", "delivered").execute()
    total_revenue = sum(o["total_amount"] for o in (rev_resp.data or []))

    # ── 4. Recent 12 orders ───────────────────────────────────────────────────
    recent_resp = (
        supabase.from_("orders")
        .select("id, status, total_amount, created_at, customers(name, email)")
        .order("created_at", desc=True)
        .limit(12)
        .execute()
    )
    recent_orders = recent_resp.data or []

    # ── 5. Low stock (< 10) ───────────────────────────────────────────────────
    low_resp = (
        supabase.from_("products")
        .select("id, name, stock, category")
        .lt("stock", 10)
        .order("stock", desc=False)
        .limit(12)
        .execute()
    )
    low_stock = low_resp.data or []

    # ── 6. Revenue per day (last 7 days, delivered only) ──────────────────────
    since = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    rbd_resp = (
        supabase.from_("orders")
        .select("total_amount, created_at")
        .eq("status", "delivered")
        .gte("created_at", since)
        .execute()
    )

    day_map: dict[str, float] = {}
    for i in range(6, -1, -1):
        d = datetime.now(timezone.utc) - timedelta(days=i)
        key = d.strftime("%-d %b")
        day_map[key] = 0.0
    for o in rbd_resp.data or []:
        key = datetime.fromisoformat(o["created_at"]).strftime("%-d %b")
        if key in day_map:
            day_map[key] += float(o["total_amount"])
    revenue_chart = [{"date": k, "revenue": v} for k, v in day_map.items()]

    # ── 7. Status breakdown (pie chart) ──────────────────────────────────────
    status_resp = supabase.from_("orders").select("status").execute()
    status_counts = {"pending": 0, "packed": 0, "shipped": 0, "delivered": 0}
    for o in status_resp.data or []:
        if o["status"] in status_counts:
            status_counts[o["status"]] += 1
    pie_chart = [{"name": k, "value": v} for k, v in status_counts.items()]

    # ── Merge synthetic orders ────────────────────────────────────────────────
    synthetic = _synthetic_orders()
    synthetic_delivered_revenue = sum(o["total_amount"] for o in synthetic if o["status"] == "delivered")
    combined_revenue = total_revenue + synthetic_delivered_revenue

    # Add synthetic revenue to today's chart point
    revenue_chart_merged = [dict(p) for p in revenue_chart]
    today_key = datetime.now(timezone.utc).strftime("%-d %b")
    for point in revenue_chart_merged:
        if point["date"] == today_key:
            point["revenue"] += synthetic_delivered_revenue

    # Adjust pie chart delivered count
    pie_chart_merged = [
        {**p, "value": p["value"] + sum(1 for o in synthetic if o["status"] == "delivered")}
        if p["name"] == "delivered" else p
        for p in pie_chart
    ]

    mock = _get_mock_dashboard_data()
    has_revenue = any(p["revenue"] > 0 for p in revenue_chart_merged)
    has_pie = any(p["value"] > 0 for p in pie_chart)

    real_ids = {o["id"] for o in recent_orders}
    merged_recent = (
        synthetic + recent_orders + [o for o in mock["recentOrders"] if o["id"] not in real_ids]
    )[:12]

    real_low_ids = {p["id"] for p in low_stock}
    merged_low = (
        low_stock + [p for p in mock["lowStockProducts"] if p["id"] not in real_low_ids]
    )[:12]

    return {
        "stats": {
            "totalProducts": total_products,
            "totalOrders": total_orders + len(synthetic),
            "totalRevenue": combined_revenue if combined_revenue > 0 else mock["stats"]["totalRevenue"],
            "lowStockCount": len(low_stock),
        },
        "recentOrders": merged_recent,
        "lowStockProducts": merged_low,
        "revenueChart": revenue_chart_merged if has_revenue else mock["revenueChart"],
        "pieChart": pie_chart_merged if has_pie else mock["pieChart"],
    }
