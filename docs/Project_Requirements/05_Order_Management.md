# Part 5: Order Management

## 🛒 1. Overview
Order management tracks the fulfillment lifecycle. It interacts with both the `customers` and `products` tables.

## 🔄 2. Business Rules & Edge Cases
- **Order Flow:** `Pending` → `Packed` → `Shipped` → `Delivered`.
  - **Rule:** Status transitions are largely sequential, though administrators might manually bypass steps. Reversion (backward transition) should ideally trigger a confirmation modal.
- **Stock Deductions:**
  - When an order is placed (or enters the system as `pending`), the system must decrement the corresponding `stock` in the `products` table.
  - **Edge Case Handling:** If `stock` is less than the requested order quantity, the transaction must abort, and an error must be surfaced.
- **Price Snapshots:** `order_items` must capture `price_at_purchase` to ensure historical order totals remain accurate even if the product's current base price changes.

## 🔌 3. API Design & Implementation

### **GET `/api/orders`**
- **Query:** Needs to perform a SQL JOIN (or Supabase nested select) fetching `orders` along with `customers` (for names) and `order_items` (with nested `products`).
- Example query: 
  ```javascript
  const { data } = await supabase.from('orders').select(`
    id, status, total_amount, created_at,
    customers(name, email),
    order_items(quantity, price_at_purchase, products(name))
  `);
  ```

### **PUT `/api/orders/:id/status`**
- **Payload:** `{ status: 'shipped' }`
- **Validation:** Check if the transition is allowed based on your business logic.

## 🖥️ 4. UI Implementation
- **Orders List (`/app/orders/page.tsx`):**
  - Use visual badges for statuses.
  - Implement a dropdown inline within the table row to quickly update the state without opening a new page.
  - Example: A dropdown on a pending order allows changing it to 'Packed'. Clicking it fires a React Query mutation to the PUT endpoint.
- **Order Details Modal:**
  - Clicking an order row should open a modal displaying the purchased items, quantities, and the price snapshot calculations.
