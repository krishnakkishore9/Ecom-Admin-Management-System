# Part 4: Product Management

## 📦 1. Overview
Products are the core entities. The admin must be able to Create, Read, Update, and Delete (with restrictions) products from the database.

## 🔌 2. API Design & Implementation
### **GET `/api/products`**
- Supports pagination (`limit`, `offset`) and search (`?query=apple`).
- Returns a list of products ordered by `created_at` descending.

### **POST `/api/products`**
- **Payload:** `{ name, category, price, stock, status, image_url }`
- **Validation:** Price and stock must be positive numbers. Name must not be empty.
- **Action:** Inserts standard record into `products`.

### **PUT `/api/products/:id`**
- **Payload:** Disjunctive updating of matching fields.
- **Action:** Updates a specific product based on its ID.

### **DELETE `/api/products/:id`**
- **Business Rule:** A product **cannot** be deleted if it exists in the `order_items` table (to preserve order history and revenue calculations).
- **Fallback Action:** If deletion is blocked by the foreign key constraint (`RESTRICT`), the API should return a 409 Conflict. The UI should prompt the user to change the product status to `inactive` instead.

## 🌄 3. Image Upload Implementation
- Use Supabase Storage (e.g., an `images` bucket).
- **Flow:**
  1. Admin selects a file on the client.
  2. The client uploads the file directly to Supabase Storage using `supabase.storage.from('images').upload()`.
  3. Retrieve the public URL.
  4. Include this `publicUrl` as `image_url` when calling `POST /api/products`.

## 🖥️ 4. UI Implementation
### **Products List (`/app/products/page.tsx`)**
- A data table displaying all properties.
- Global search input that filters via API or client-side caching.
- 'Edit' and 'Delete' quick action buttons.

### **Add/Edit Form (`/app/products/new` & `/app/products/edit/[id]`)**
- Form using `react-hook-form` and `zod` for validation.
- Drag-and-drop zone for image uploads.
- Clear error states for invalid inputs (e.g., negative price).
