# 🌿 FreshMarket Admin Dashboard

A premium, glassmorphic management system designed specifically for a fresh fruit and vegetable marketplace. Built with a "Lush Harvest" aesthetic to reflect freshness, growth, and vibrancy.

![Dashboard Preview](https://img.shields.io/badge/Design-Lush_Harvest-064e3b?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

---

## ✨ Features

- **📊 Dynamic Dashboard**: Real-time revenue tracking, order status breakdown, and low-stock alerts.
- **🍎 Inventory Management**: Full CRUD for products with categorical filtering and search.
- **🛒 Order Processing**: Detailed order history with status management (Pending, Packed, Shipped, Delivered).
- **👥 Customer Insights**: Centralized database for managing user accounts and purchase history.
- **🎨 Lush Harvest Theme**: A curated design system using organic greens, sun-kissed oranges, and autumn reds with soft glassmorphism.

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database & Auth**: Supabase (PostgreSQL)
- **Animation**: Framer Motion
- **Charts**: Recharts (Custom Emerald Theme)
- **Icons**: Lucide React
- **Styling**: Vanilla CSS with Design Tokens

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js (Latest LTS)
- Supabase Project

### 2. Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Installation
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```

## 🧹 Troubleshooting

### Infinite Loading / UI Stalls
If the dashboard appears to be stuck loading or data is not populating despite active server logs, it may be due to a **Turbopack Build Cache** issue. 

**Fix:**
1. Stop the development server.
2. Run the cleanup command:
   ```powershell
   rm -Recurse -Force .next
   ```
3. Restart the server:
   ```bash
   npm run dev
   ```

---

## 📸 Design Philosophy
The "Lush Harvest" theme uses:
- **#022c22 (Deep Emerald)**: Stability and freshness.
- **#10b981 (Emerald Green)**: Growth and primary actions.
- **#f59e0b (Mango Orange)**: Energy and highlights.
- **#ef4444 (Sunset Red)**: Critical alerts and accents.

Managed with ❤️ by the FreshMarket Admin Team.
