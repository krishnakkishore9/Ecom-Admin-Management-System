# 🚀 FreshMarket Admin — Vercel & Git Deployment Guide

> This document covers the complete strategy for hosting the FreshMarket Admin
> monorepo on GitHub and deploying the **frontend** (Next.js) and **backend**
> (FastAPI) as two separate Vercel projects from a single Git repository.

---

## 📁 Monorepo Folder Structure

```
Ecom-Admin-Management-System/   ← One Git repository (monorepo)
│
├── docs/                       ← All project documentation (you are here)
│   ├── vercel_deployment_guide.md   ← This file
│   ├── PRD.md
│   ├── design.md
│   ├── Project_Requirements/
│   └── Development_Phases/
│
├── frontend/                   ← Next.js 16 Admin UI  (Vercel Project #1)
│   ├── src/
│   ├── package.json
│   ├── vercel.json
│   ├── .env.local              ← gitignored — never commit secrets
│   └── README.md
│
├── backend/                    ← FastAPI REST API  (Vercel Project #2)
│   ├── app/
│   │   ├── main.py             ← FastAPI entry point + CORS
│   │   ├── auth.py             ← Supabase JWT validation
│   │   ├── database.py         ← Supabase service-role client
│   │   └── routes/             ← products, customers, orders, dashboard
│   ├── requirements.txt
│   ├── vercel.json
│   ├── .env                    ← gitignored — never commit secrets
│   └── README.md
│
├── .gitignore                  ← Root-level gitignore (covers both apps)
└── README.md                   ← Monorepo overview & quick-start
```

> **Key principle:** One GitHub repo, two Vercel projects.
> Docs live in Git but are never deployed to Vercel.

---

## 🔑 Important Limitations to Know

> **FastAPI on Vercel runs as Serverless Functions**, meaning:
> - No persistent in-memory state between requests
> - No background tasks or long-running `asyncio` loops
> - Cold starts may add ~500 ms latency on first request
> - WebSockets are **not supported** on Vercel Serverless
>
> If you need persistent connections or background workers, consider deploying
> the FastAPI backend on **Railway**, **Render**, or **Fly.io** instead,
> while keeping the frontend on Vercel.

> **Python Dependency Note**:
> The `supabase` python client must be pinned strictly to `>=2.4.0,<2.10.0` in `requirements.txt`. Version 2.10.0+ introduces a dependency on `pyiceberg`, which fails compiling via Vercel's linux AL2 builder environment due to missing C++ extensions.

---

## Step 1 — Root `.gitignore`

Create a **single root `.gitignore`** in `Ecom-Admin-Management-System/` that covers both
the frontend and backend:

```gitignore
# ── Secrets (NEVER commit these) ──────────────────────────
frontend/.env.local
frontend/.env*.local
backend/.env

# ── Frontend ───────────────────────────────────────────────
frontend/node_modules/
frontend/.next/
frontend/out/
frontend/.turbo/
frontend/tsconfig.tsbuildinfo

# ── Backend ────────────────────────────────────────────────
backend/__pycache__/
backend/*.pyc
backend/.venv/
backend/venv/

# ── OS / Editor ────────────────────────────────────────────
.DS_Store
Thumbs.db
.vscode/
.idea/
```

---

## Step 2 — Push the Monorepo to GitHub

Run the following from the **`Ecom-Admin-Management-System/` root**:

```bash
git init                        # skip if you already have a git repo
git add .
git commit -m "chore: restructure monorepo with frontend, backend, and docs"
git remote add origin https://github.com/your-username/Ecom-Admin-Management-System.git
git push -u origin main
```

> All of `docs/`, `frontend/`, `backend/`, and `README.md` live in the
> **same GitHub repo**. This is the monorepo pattern.

---

## Step 3 — Create Two Vercel Projects from One Repo

This is the core concept. Vercel lets you point multiple projects at different
subdirectories of the same GitHub repo.

```
GitHub Repo: Ecom-Admin-Management-System
        │
        ├──▶ Vercel Project #1: "ecom-admin-frontend"
        │         Root Directory : frontend
        │         Framework      : Next.js (auto-detected)
        │
        └──▶ Vercel Project #2: "ecom-admin-backend"
                  Root Directory : backend
                  Framework      : Other / Python
```

### How to Set the Root Directory in Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Select your GitHub repo (`Ecom-Admin-Management-System`)
3. On the configuration screen, click **Edit** next to **Root Directory**
4. Type `frontend`  *(for Project #1)* or `backend` *(for Project #2)*
5. Vercel will **only watch that subfolder** for changes and deploy accordingly

> Repeat the above steps as a **second new project** for the other folder.

---

## Step 4 — Set Environment Variables in Vercel Dashboard

**Never put secrets in `.env` files committed to Git.**
Always use the Vercel Dashboard → Project Settings → Environment Variables.

### Frontend Project (`ecom-admin-frontend`)

| Variable | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://eyathafgxmqrvmwxmhqe.supabase.co` | Safe to expose |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `<your anon key>` | Safe to expose |
| `SUPABASE_SERVICE_ROLE_KEY` | `<your service role key>` | Server-side only |
| `NEXT_PUBLIC_API_URL` | `https://<your-backend>.vercel.app` | Set **after** deploying backend |

### Backend Project (`ecom-admin-backend`)

| Variable | Value | Notes |
|---|---|---|
| `SUPABASE_URL` | `https://eyathafgxmqrvmwxmhqe.supabase.co` | |
| `SUPABASE_ANON_KEY` | `<your anon key>` | Used to validate user JWTs |
| `SUPABASE_SERVICE_ROLE_KEY` | `<your service role key>` | ⚠️ Never expose on client |

---

## Step 5 — Update CORS in the Backend

After Vercel gives you the frontend URL (e.g. `https://ecom-admin-frontend.vercel.app`),
open `backend/app/main.py` and add it to `origins`:

```python
origins = [
    "https://ecom-admin-frontend.vercel.app",   # ← your real frontend URL
    "http://localhost:3000",
]
```

Commit and push — the backend Vercel project will auto-redeploy.

---

## Step 6 — First-Time Deployment Order

Follow this exact order to avoid circular dependency on URLs:

```
1.  Push monorepo to GitHub
          ↓
2.  Deploy backend on Vercel first
    → Get the backend URL: https://ecom-admin-backend.vercel.app
          ↓
3.  Update CORS in backend/app/main.py
    → Add your frontend Vercel URL (even if not deployed yet — use expected URL)
    → Push → backend auto-redeploys
          ↓
4.  Deploy frontend on Vercel
    → Set NEXT_PUBLIC_API_URL = https://ecom-admin-backend.vercel.app
          ↓
5.  Done ✅ — both projects are live and connected
```

---

## Step 7 — How Auto-Deploy Works After Setup

Every `git push` to the `main` branch triggers Vercel to check which files changed:

```
You push code to GitHub main branch
            │
            ├── Changes in frontend/ ?
            │         → Vercel auto-deploys ecom-admin-frontend ✅
            │
            ├── Changes in backend/ ?
            │         → Vercel auto-deploys ecom-admin-backend ✅
            │
            └── Changes in docs/ only ?
                      → Neither project redeploys 🚫 (intentional — keeps it fast)
```

---

## Local Development Workflow

### Backend (FastAPI)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# API:       http://localhost:8000
# Swagger:   http://localhost:8000/docs
# ReDoc:     http://localhost:8000/redoc
```

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

Ensure `frontend/.env.local` has:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Backend API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | List products (with optional `?query=`) |
| `POST` | `/api/products` | Create a product |
| `GET` | `/api/products/{id}` | Get product by ID |
| `PUT` | `/api/products/{id}` | Update a product |
| `DELETE` | `/api/products/{id}` | Delete a product |
| `GET` | `/api/customers` | List customers (with optional `?query=`) |
| `GET` | `/api/customers/{id}/orders` | Get order history for a customer |
| `GET` | `/api/orders` | List orders (paginated) |
| `PUT` | `/api/orders/{id}/status` | Update order status |
| `GET` | `/api/dashboard/summary` | Full dashboard aggregation |

> All endpoints require `Authorization: Bearer <supabase_access_token>` header.
> The frontend sends this automatically via `src/lib/api.ts`.

---

## Integration Summary

```
Browser (User)
      │
      │  HTTPS
      ▼
Vercel Frontend  (frontend/)
  Next.js 16
      │
      │  fetch /api/* + Bearer token
      ▼
Vercel Backend  (backend/)
  FastAPI + Supabase service-role
      │
      │  Supabase Python SDK
      ▼
Supabase (Database + Auth)
```

---

## Pre-Deployment Checklist

| # | Item | Detail |
|---|---|---|
| 1 | `CORS origins` updated | Add production frontend URL to `main.py` |
| 2 | `.gitignore` in place | `.env` and `.env.local` must be excluded |
| 3 | `requirements.txt` up to date | Must be in `backend/` root |
| 4 | `vercel.json` in both folders | Routes all traffic to correct entry point |
| 5 | Env vars set in Vercel Dashboard | Not in committed files |
| 6 | `NEXT_PUBLIC_API_URL` set | Points to deployed backend URL |
| 7 | Backend deployed first | So you have the URL for the frontend env var |
| 8 | CORS updated and redeployed | Frontend URL added before frontend goes live |
