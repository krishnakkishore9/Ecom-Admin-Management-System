# Phase 4: Product Management

## 🎯 Goal
Develop full CRUD capability for the admin's products, hooking up UI forms to Next.js API Routes and the Supabase database.

## 🛠️ Tasks

### 1. API Route Implementations
- Develop `/api/products` (GET) and `/api/products` (POST) endpoint.
- Develop `/api/products/[id]` (PUT, DELETE) endpoint.
- Enforce Supabase auth validation inside the route handlers to ensure only admins make mutations.

### 2. Image Upload Capability
- Establish a frontend utility interacting with `supabase.storage`.
- In the POST/PUT product workflows, orchestrate the file upload first, receive the URL, and then attach the URL to the product object being sent to the backend.

### 3. Build Products List Page (`/products`)
- Assemble the `DataTable` combining fetched data.
- Integrate the active/inactive `Badge` and action buttons.
- Implement search functionality.

### 4. Build Add/Edit Products Form
- Setup a React Hook Form hooked up with Zod for robust validation (price > 0, etc).
- Utilize the custom `Input`, `SelectDropdown`, and `Button` UI components.
- Develop the submit wrapper sending the object to the API routes.

## ✅ Milestones
- Admins can create new products with successful image uploads.
- Created products successfully reflect inside the Products list view and Supabase PostgreSQL.
- Validation appropriately halts incorrect form submissions.
