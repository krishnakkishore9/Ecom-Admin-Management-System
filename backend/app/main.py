from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import products, customers, orders, dashboard

app = FastAPI(
    title="FreshMarket Admin API",
    description="Backend API for FreshMarket Admin Dashboard",
    version="1.0.0",
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
# Add your deployed Vercel frontend URL here before deploying
origins = [
    "https://your-frontend.vercel.app",   # ← replace with actual Vercel frontend URL
    "http://localhost:3000",              # Next.js local dev
    "http://localhost:5173",              # Vite local dev (if used)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ──────────────────────────────────────────────────────────────────
app.include_router(products.router,   prefix="/api/products",   tags=["Products"])
app.include_router(customers.router,  prefix="/api/customers",  tags=["Customers"])
app.include_router(orders.router,     prefix="/api/orders",     tags=["Orders"])
app.include_router(dashboard.router,  prefix="/api/dashboard",  tags=["Dashboard"])


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "FreshMarket Admin API"}
