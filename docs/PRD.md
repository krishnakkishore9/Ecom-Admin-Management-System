
📦 E-Commerce Admin & Order Management System (PRD)
🧠 Overview
An admin-focused e-commerce management system designed for managing fruits and vegetables grown in India. The system enables administrators to manage products, orders, and customers efficiently through a centralized dashboard.

🎯 Objectives
Provide a centralized admin panel for managing e-commerce operations
Enable CRUD operations for products
Track and manage customer orders
Monitor key business metrics via dashboard
Ensure secure admin authentication

🏗️ Tech Stack
Frontend & Backend
Next.js (App Router) – Fullstack framework (UI + API routes)
Backend Services
Supabase
PostgreSQL Database
Authentication
Storage (for images)
Styling & State
Tailwind CSS
React Query / Zustand

🧩 System Architecture
Next.js (Frontend + API Routes)
        ↓
Supabase (Database + Auth + Storage)


🗄️ Database Design
1. products
Field
Type
Description
id
UUID
Primary key
name
String
Product name
category
String
Fruit / Vegetable
price
Decimal
Product price
stock
Integer
Available quantity
status
String
active / inactive
image_url
String
Product image
created_at
Timestamp
Created time


2. customers
Field
Type
Description
id
UUID
Primary key
name
String
Customer name
email
String
Unique email
created_at
Timestamp
Created time


3. orders
Field
Type
Description
id
UUID
Primary key
customer_id
UUID
FK → customers
status
String
pending / packed / shipped / delivered
total_amount
Decimal
Total order value
created_at
Timestamp
Created time


4. order_items
Field
Type
Description
id
UUID
Primary key
order_id
UUID
FK → orders
product_id
UUID
FK → products
quantity
Integer
Quantity purchased
price_at_purchase
Decimal
Snapshot of price


🔐 Authentication & Authorization
Use Supabase Auth
Admin-only access
Protect routes using:
Middleware (middleware.ts)
Server-side validation

🖥️ Application Pages
1. Login Page
Admin authentication

2. Dashboard (/dashboard)
Total products
Total orders
Revenue summary (only delivered orders)
Low stock alerts

3. Products Page (/products)
Product listing table
Search and filter
Edit / Delete actions

4. Add/Edit Product (/products/new)
Form fields:
Name
Price
Category
Stock
Status
Image upload

5. Orders Page (/orders)
List of all orders
Update order status:
Pending → Packed → Shipped → Delivered

6. Customers Page (/customers)
List of customers
View order history per customer

🔌 API Design (Next.js API Routes)
Product APIs
GET /api/products
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id

Order APIs
GET /api/orders
PUT /api/orders/:id/status

Customer APIs
GET /api/customers
GET /api/customers/:id/orders

Dashboard APIs
GET /api/dashboard/summary

⚙️ Core Features
✅ Must Have
Admin authentication
Product CRUD operations
Order management with status updates
Customer management
Dashboard metrics

⭐ Good to Have
Pagination
Search & filtering
Product image upload
Toast notifications

🚀 Optional Features
Invoice download (PDF)
Analytics charts
Bulk upload (CSV)
Role-based access control

🔄 Business Rules
Order Status Flow
Pending → Packed → Shipped → Delivered

No backward transitions allowed

Stock Management
Reduce stock when order is placed
Prevent orders if stock = 0

Revenue Calculation
Only include orders with status = delivered

Product Deletion Rules
Prevent deletion if product exists in any order

⚠️ Edge Cases
Duplicate customer email prevention
Handling out-of-stock scenarios
Invalid order status updates
API error handling and validation

📁 Project Structure (Next.js)
/app
  /login
  /dashboard
  /products
  /orders
  /customers

  /api
    /products
    /orders
    /customers
    /dashboard

/components
/lib
/utils


🎯 Success Criteria
Fully functional admin panel
Secure authentication
Accurate order tracking
Real-time inventory updates
Clean and responsive UI

🚀 Deployment
Frontend & API: Vercel
Database & Auth: Supabase



