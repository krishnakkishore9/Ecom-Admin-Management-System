# Phase 6: Dashboard & Analytics Engine

## 🎯 Goal
Provide the system administrator with immediately actionable analytics, revenue overviews, and system alerts by implementing the complex dashboard layout.

## 🛠️ Tasks

### 1. Dashboard API Engine (`/api/dashboard/summary`)
- Write an aggregating Next.js endpoint performing:
  - Row calculations for Total products & orders.
  - Aggregation logic totaling `amount` strings ONLY where `status == "delivered"`.
  - Fetch of recent 5 orders.
  - Extraction of inventory logic where `product.stock < 10`.

### 2. Metric Cards Implementation
- Map the backend data into four high-level UI `GlassCard` blocks at the top of `/dashboard`.
- Attach relevant icons from Lucide React to visually distinguish Revenue, Alerts, Products, and Orders.

### 3. Data Visualization Charts
- Configure `<ResponsiveContainer>` wrappers using Recharts.
- Render the Revenue Area Chart mapping trailing revenue using the glass-ready design logic (hidden grid, smooth bezier lines).
- Render the order breakdown Doughnut pie chart.

### 4. Action Lists
- Construct lightweight list components on the Dashboard displaying the array of trailing Orders and the array of Low Stock alerts for immediate action.

## ✅ Milestones
- The dashboard successfully loads data dynamically based on database actions (e.g., adding an order modifies the pie chart live).
- UI achieves a finished, premium aesthetic aligned identically to the original intent of `design.md`.
