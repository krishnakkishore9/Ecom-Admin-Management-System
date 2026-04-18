# Phase 5: Order & Customer Management

## 🎯 Goal
Build the fulfillment system. This phase connects the orders with the customers who bought them, and allows order status manipulation.

## 🛠️ Tasks

### 1. Order & Customer API Routes
- Create `/api/orders` to fetch order strings dynamically mapping `customer_id` and fetching nested `order_items`.
- Create `/api/orders/[id]/status` to handle mutation flags (e.g., swapping 'pending' to 'shipped').
- Implement stock deduction logic handling in the backend when necessary.
- Create `/api/customers` and `/api/customers/[id]/orders` endpoints.

### 2. Orders View Implementation
- Use the `DataTable` to map orders.
- Integrate immediate inline dropdown menus into the `DataTable` for updating order states rapidly.
- Trigger React Query re-fetches when order status changes.

### 3. Customers View Implementation
- Construct the primary Customers data list.
- Build a Framer Motion `SlideOverDrawer` component.
- When an admin selects a customer row, slide the drawer to display the nested fetched `/orders` history related to that specific customer.

## ✅ Milestones
- Order statuses can be visually changed from the frontend and accurately updated in the database.
- Customer historical orders are reachable seamlessly via the sliding drawer component.
