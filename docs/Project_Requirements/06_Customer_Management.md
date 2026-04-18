# Part 6: Customer Management

## 👥 1. Overview
A CRM-light feature allowing administrators to view who is purchasing from the platform and analyze their historical ordering habits.

## 🔌 2. API Design & Implementation

### **GET `/api/customers`**
- Fetches all customers.
- Ideally includes computed fields like `total_orders_count` and `lifetime_value`. This can be done via a Postgres View or complex queries.
- A basic query groups orders by customer.

### **GET `/api/customers/:id/orders`**
- Fetches the order history for a specific customer ID.
- Useful for populating the details panel.

## 🖥️ 3. UI Implementation

### **Customers List (`/app/customers/page.tsx`)**
- A data table containing: Name, Email, Date Joined, and Total Orders.
- Search bar to locate a specific customer by email or name.

### **Customer Slide-over/Drawer**
- When a row is clicked, a pane slides from the right side.
- **Top section:** Customer basic info and avatar.
- **Scrollable region:** A timeline or list of all historical orders placed by the customer, showing the date, amount, and fulfillment status for each.

## ⚠️ 4. Edge Cases
- **Duplicate Emails:** The database schema enforces `UNIQUE` on customer emails. The application must appropriately handle error codes if a new customer creation attempt duplicates an email.
- **Orphan Orders:** The `orders` schema uses `ON DELETE CASCADE`. If an admin manually deleting a customer (if implemented) is performed, all their historical orders will instantly vanish, destroying historical revenue metrics. Therefore, Customer deletion should either be disabled, or restricted using `ON DELETE RESTRICT` / soft-delete flags.
