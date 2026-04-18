# Phase 2: Authentication & Application Shell

## 🎯 Goal
Secure the application using Supabase Auth and build the overarching layout shell (Sidebar & Header) that wraps all authorized pages.

## 🛠️ Tasks

### 1. Supabase Auth Configuration
- Enable Email/Password in Supabase Dashboard.
- Manually provision an initial admin account within the dashboard.
- Set up authentication utility helpers inside `utils/supabase` using `@supabase/ssr` (server client, browser client).

### 2. Implement Login Page
- Develop `/app/login/page.tsx` based on `design.md` specs.
- Form inputs for Email and Password.
- Glass card UI over a gradient background.
- Connect form to Supabase authentication.

### 3. Route Protection Overlay
- Implement `middleware.ts` in the project root.
- Validate the session; redirect unauthenticated users hitting `/dashboard` or `/products` back to `/login`.

### 4. Develop Main Application Shell Layout
- Create `/app/(admin)/layout.tsx` to wrap post-login routes.
- **Sidebar Navigation:** Build the left sidebar with links to Dashboard, Products, Orders, and Customers. Apply the `backdrop-blur-2xl bg-black/40` styles from the design doc.
- **Top Header:** Implement the sticky header with Breadcrumbs and admin profile info.
- Include Framer Motion `<AnimatePresence>` logic ready for page route transitions.

## ✅ Milestones
- Able to log in using Supabase Auth.
- Trying to access `/dashboard` without authentication redirects to `/login`.
- Post-login view shows the completed, persistent sidebar and header layout.
