# 🤖 Agent Prompts for E-Commerce Admin System Development

This document contains specialized prompt blocks to feed your AI agent sequentially. Each prompt connects the current architectural state to the next phase, preserving context and guaranteeing a seamless transition. 

Copy and paste these blocks one by one to your agent.

---

## 🚀 Prompt 1: Phase 1 - Project Initialization
**Copy the text below and paste it to your agent:**

```text
You are an expert Full-stack Developer. We are starting Phase 1 of our E-Commerce Admin Management System. Please read the `./Project_Requirements/01_Architecture_and_Database.md` and `./design.md` files thoroughly.

Your task:
1. Scaffold a Next.js (App Router) project in the root directory and install dependencies: @supabase/supabase-js @supabase/ssr framer-motion lucide-react react-hook-form @hookform/resolvers zod recharts react-query zustand.
2. Configure `tailwind.config.ts` exactly as defined in `design.md` using the dark-glassmorphic palette. Apply the global background styles to `globals.css`.
3. Provide me the raw SQL snippets to execute in my Supabase query editor to create the `products`, `customers`, `orders`, and `order_items` tables, as well as the 'images' storage bucket.
4. Set up the `.env.local` connections. 

**IMPORTANT POST-PHASE INSTRUCTION:** Once you finish this phase, you MUST ask me if there are any missing details or parameterized keys/URLs that need to be added to the `.env.local` file before we proceed. Do not begin the next phase until I confirm.
```

---

## 🚀 Prompt 2: Phase 2 - Authentication & Layout Shell
**Copy the text below and paste it to your agent:**

```text
Excellent. Building upon our existing Next.js framework and Supabase setup from Phase 1, we are moving to Phase 2. Please read `./Project_Requirements/02_Authentication_and_Security.md` and review `./design.md`.

Your task:
1. Implement Supabase Email/Password Auth using `@supabase/ssr`. 
2. Create `middleware.ts` to protect all routes under `/` EXCEPT the `/login` route.
3. Build the `/app/login/page.tsx` UI strictly adhering to the glassmorphic aesthetics in `design.md`.
4. Construct the Dashboard Layout Shell (`/app/(admin)/layout.tsx`) featuring a fixed sticky navigation sidebar and a top-header bar. 

**IMPORTANT POST-PHASE INSTRUCTION:** Once you finish this phase, you MUST ask me if you need me to define any missing details, provide specific test-admin credentials, or update any `.env` variables. Do not proceed to Phase 3 until I confirm.
```

---

## 🚀 Prompt 3: Phase 3 - UI Component Library
**Copy the text below and paste it to your agent:**

```text
Great job integrating Auth. Now, relying on the layout shell from Phase 2, we must build our atomic UI components so we don't repeat Tailwind classes. Please read `./Development_Phases/Phase_3_UI_Component_Library.md` and review `./design.md`.

Your task:
Build the highly reusable components inside `/components/ui/` taking direct styling, color, and `framer-motion` animation cues from `design.md`:
1. `GlassCard.tsx`
2. `Button.tsx` (primary gradient and secondary/glass variants)
3. `Input.tsx` & `SelectDropdown.tsx`
4. `Badge.tsx` (success, warning, danger, info variants)
5. `DataTable.tsx` skeleton.

**IMPORTANT POST-PHASE INSTRUCTION:** Once you finish this phase, stop and ask me if there are any missing details, icons, or environment parameters required before we proceed to data management.
```

---

## 🚀 Prompt 4: Phase 4 - Product Management
**Copy the text below and paste it to your agent:**

```text
The UI library is ready. Now we connect the frontend to the backend schema created in Phase 1. We are using our generic UI components from Phase 3. Read `./Project_Requirements/04_Product_Management.md`.

Your task:
1. Initialize the `/api/products` and `/api/products/[id]` Next.js Route Handlers handling GET, POST, PUT, DELETE with Supabase server clients.
2. Write a utility to handle image uploads to our Supabase `images` bucket first, before creating the Postgres record.
3. Build `/app/products/page.tsx` integrating actual data into the `DataTable` component.
4. Build `/app/products/new` containing the React Hook Form + Zod configuration to add products.

**IMPORTANT POST-PHASE INSTRUCTION:** Once you finish this phase, stop and ask me to verify if there are any missing environment parameters, schema mismatches, or bucket URL configurations required before we move to Phase 5.
```

---

## 🚀 Prompt 5: Phase 5 - Order & Customer Management
**Copy the text below and paste it to your agent:**

```text
Products are rendering successfully. Moving sequentially, we rely on the product data structure from Phase 4 to construct the fulfillment lifecycle. Read `./Project_Requirements/05_Order_Management.md` and `./Project_Requirements/06_Customer_Management.md`.

Your task:
1. Create the API routes for `/api/orders` (fetching structured relations of customers -> orders -> items -> products) and `/api/orders/[id]/status` for mutating status.
2. Build `/app/orders/page.tsx` with inline `<SelectDropdown>` components triggering status updates via React Query.
3. Build `/app/customers/page.tsx` showing the customer lists.
4. Implement a Framer Motion slide-over drawer triggered by clicking a customer row to view their history.

**IMPORTANT POST-PHASE INSTRUCTION:** Once you finish this phase, pause and double-check. Highlight to me any missing details, database trigger requirements, or `.env` parameters I might need to securely authorize status changes. Do not proceed until I approve.
```

---

## 🚀 Prompt 6: Phase 6 - Dashboard & Analytics Engine
**Copy the text below and paste it to your agent:**

```text
We have our Products, Customers, and Orders operating seamlessly. Let's finish the architecture by bringing all this unified data into the layout wrapper we built in Phase 2. Read `./Project_Requirements/03_Dashboard_and_Analytics.md`.

Your task:
1. Create `/api/dashboard/summary` performing heavy data aggregation: counting active products, summing *delivered* order amounts, calculating doughnut chart distributions, and fetching low stock items.
2. Build `/app/dashboard/page.tsx` mapping data into `GlassCard` widgets.
3. Implement `Recharts` for the Revenue Area chart and Orders Doughnut pie chart avoiding grid lines based on `design.md`.

**IMPORTANT POST-PHASE INSTRUCTION:** You have finished the final phase. Please pause to ask me if I need any final configurations for frontend URLs, Supabase credentials, or Analytics tokens inside `.env.local`, and summarize the entire system build.
```
