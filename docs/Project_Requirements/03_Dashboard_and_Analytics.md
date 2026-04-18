# Part 3: Dashboard and Analytics

## 🖥️ 1. Dashboard Overview
The dashboard is the landing page post-login. It provides key operational metrics at a glance.

## 📊 2. API Design & Implementation (`GET /api/dashboard/summary`)
This monolithic API route will aggregate data for the dashboard to reduce client-side fetches.

### **Required Data & Queries:**
1. **Total Products:** Count of all rows in the `products` table where `status = 'active'`.
2. **Total Orders:** Count of all rows in the `orders` table.
3. **Total Revenue:** Sum of `total_amount` in the `orders` table **ONLY WHERE** `status = 'delivered'`.
4. **Low Stock Alerts:** Fetch products where `stock <= 10` (threshold configurable).
5. **Recent Orders:** Fetch the latest 5 orders with nested customer names.

### **Supabase Query Example (Revenue):**
```javascript
const { data, error } = await supabase
  .from('orders')
  .select('total_amount')
  .eq('status', 'delivered');
// Sum the amounts natively in Postgres or in JS
```

## 🎨 3. Dashboard UI Implementation (`/app/dashboard/page.tsx`)
- **Metric Cards:** Use standard grid layout (4 columns on desktop, 1 on mobile). Display the aggregated numbers. Add sparklines if possible.
- **Charts:**
  - Implement a Recharts `<AreaChart>` mapping revenue over the last 30 days (requires a slightly more complex query fetching orders by date).
  - Implement a `<PieChart>` showing the distribution of order statuses (Pending vs Delivered vs Shipped).
- **Data Tables:**
  - A small widget rendering the critical low stock alerts (Item Name, Current Stock).
  - A widget showing the latest 5 orders and their current status badges.

## 🔄 4. Business Rules
- Revenue must strictly exclude orders that are not 'delivered'.
- Cancelled orders (if added in the future) must not count towards active metrics.
