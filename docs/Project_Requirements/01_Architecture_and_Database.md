# Part 1: Architecture and Database Design

## 🏗️ 1. Tech Stack & Architecture
**Frontend & API Layer:** Next.js (App Router)
**State Management:** Zustand for global state, React Query for server data fetching.
**Styling:** Tailwind CSS (Glassmorphic design).
**Backend & Database:** Supabase (PostgreSQL, Auth, Storage).

### **System Data Flow**
1. Client (Admin User) accesses Next.js frontend.
2. Next.js components fetch data via internal API route handlers (`/api/*`).
3. Next.js API route handlers interact with Supabase PostgreSQL using the `@supabase/supabase-js` client securely using Service Role keys or authenticated tokens.

## 🗄️ 2. Database Schema (PostgreSQL via Supabase)
These tables need to be created in the Supabase SQL editor with proper Row Level Security (RLS) policies giving full access to the Admin role.

### **Types & Enums**
```sql
CREATE TYPE product_status AS ENUM ('active', 'inactive');
CREATE TYPE order_status AS ENUM ('pending', 'packed', 'shipped', 'delivered');
```

### **1. products**
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL CHECK (stock >= 0),
  status product_status DEFAULT 'active',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **2. customers**
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **3. orders**
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  status order_status DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **4. order_items**
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_purchase DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🛠️ 3. Implementation Details
- Initialize a Supabase project.
- Expose `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for client components.
- Secure `SUPABASE_SERVICE_ROLE_KEY` in `env.local` for API routes to bypass RLS if strictly relying on server-side validations.
