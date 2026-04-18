from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
from app.auth import get_current_user
from app.database import get_supabase

router = APIRouter()


class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    stock: int
    status: Optional[str] = "active"
    image_url: Optional[str] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    status: Optional[str] = None
    image_url: Optional[str] = None


# GET /api/products — list all products with optional search
@router.get("")
async def list_products(
    query: str = Query(default=""),
    limit: int = Query(default=50),
    offset: int = Query(default=0),
    user=Depends(get_current_user),
):
    supabase = get_supabase()
    db_query = (
        supabase.from_("products")
        .select("id, name, category, price, stock, status, image_url, created_at", count="exact")
        .order("created_at", desc=True)
        .range(offset, offset + limit - 1)
    )
    if query:
        db_query = db_query.ilike("name", f"%{query}%")

    response = db_query.execute()
    if response.data is None:
        raise HTTPException(status_code=500, detail="Failed to fetch products")

    sanitized = [
        {**p, "price": float(p["price"]), "stock": int(p["stock"])}
        for p in response.data
    ]
    return {"data": sanitized, "count": response.count}


# GET /api/products/{id} — fetch single product
@router.get("/{product_id}")
async def get_product(product_id: str, user=Depends(get_current_user)):
    supabase = get_supabase()
    response = supabase.from_("products").select("*").eq("id", product_id).single().execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"data": response.data}


# POST /api/products — create a new product
@router.post("", status_code=201)
async def create_product(body: ProductCreate, user=Depends(get_current_user)):
    if body.price < 0:
        raise HTTPException(status_code=400, detail="Price cannot be negative")
    if body.stock < 0:
        raise HTTPException(status_code=400, detail="Stock cannot be negative")

    supabase = get_supabase()
    response = (
        supabase.from_("products")
        .insert([{
            "name": body.name,
            "category": body.category,
            "price": body.price,
            "stock": body.stock,
            "status": body.status,
            "image_url": body.image_url,
        }])
        .select()
        .single()
        .execute()
    )
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create product")
    return {"data": response.data}


# PUT /api/products/{id} — update a product
@router.put("/{product_id}")
async def update_product(product_id: str, body: ProductUpdate, user=Depends(get_current_user)):
    updates = {}
    if body.name is not None:
        updates["name"] = body.name
    if body.category is not None:
        updates["category"] = body.category
    if body.price is not None:
        if body.price < 0:
            raise HTTPException(status_code=400, detail="Price cannot be negative")
        updates["price"] = body.price
    if body.stock is not None:
        if body.stock < 0:
            raise HTTPException(status_code=400, detail="Stock cannot be negative")
        updates["stock"] = body.stock
    if body.status is not None:
        updates["status"] = body.status
    if body.image_url is not None:
        updates["image_url"] = body.image_url

    supabase = get_supabase()
    response = (
        supabase.from_("products")
        .update(updates)
        .eq("id", product_id)
        .select()
        .single()
        .execute()
    )
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to update product")
    return {"data": response.data}


# DELETE /api/products/{id} — delete product (blocked if used in orders)
@router.delete("/{product_id}")
async def delete_product(product_id: str, user=Depends(get_current_user)):
    supabase = get_supabase()

    # Check if product is referenced in any order
    ref_response = (
        supabase.from_("order_items")
        .select("*", count="exact", head=True)
        .eq("product_id", product_id)
        .execute()
    )
    if ref_response.count and ref_response.count > 0:
        raise HTTPException(
            status_code=409,
            detail="Cannot delete: product is part of existing orders. Set it to inactive instead.",
        )

    supabase.from_("products").delete().eq("id", product_id).execute()
    return {"success": True}
