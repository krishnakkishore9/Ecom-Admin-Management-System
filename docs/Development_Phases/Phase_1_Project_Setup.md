# Phase 1: Project Initialization & Global Setup

## 🎯 Goal
Configure the Next.js foundational boilerplate, install necessary libraries, and establish the Supabase backend including database tables.

## 🛠️ Tasks

### 1. Initialize Application
- Create a new Next.js project using App Router (`create-next-app@latest`).
- Install essential design and utility dependencies:
  ```bash
  npm install @supabase/supabase-js @supabase/ssr framer-motion lucide-react react-hook-form @hookform/resolvers zod recharts react-query zustand
  ```

### 2. Design System Setup (Tailwind & CSS)
- Configure `tailwind.config.ts` with the specific color palette outlined in `design.md` (e.g., Indigo/Purple primaries, Emerald/Amber/Rose semantic colors).
- Define background utilities for the dark glassmorphic design and gradients.
- Clear initial Next.js boilerplate CSS and apply a global `bg-slate-900` or gradient mesh in `globals.css`.

### 3. Supabase Project Setup
- Create a new project on the Supabase dashboard.
- Grab the `URL` and `ANON_KEY`, saving them to `.env.local` as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Also save `SUPABASE_SERVICE_ROLE_KEY` securely in `.env.local` for API bypass if needed.

### 4. Database Schema Execution
- Open the Supabase SQL Editor.
- Run the schema definitions provided in `Project_Requirements/01_Architecture_and_Database.md` to create the `products`, `customers`, `orders`, and `order_items` tables.
- Create enum types (`product_status`, `order_status`).

### 5. Setup Supabase Storage
- Create a public bucket named `images` in Supabase Storage for upcoming product pictures.

## ✅ Milestones
- App builds locally without errors.
- Database tables are successfully visible in Supabase.
- Tailwind dark base is applied.
