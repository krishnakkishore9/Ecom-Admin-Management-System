# Part 2: Authentication and Security

## 🔐 1. Authentication Strategy
The application will utilize **Supabase Auth** with simple Email/Password login.
Since this is an admin-specific application, sign-ups should either be disabled from the UI, or restricted so that only pre-registered/invited emails can log in.

## 🛠️ 2. Detailed Implementation

### **A. Supabase Integration**
1. Enable Email/Password authentication in the Supabase Dashboard.
2. Create an admin user manually in the dashboard.
3. Use `@supabase/ssr` to handle authentication securely within the Next.js App Router.

### **B. Login Page (`/app/login/page.tsx`)**
- Implement a form with `email` and `password` fields.
- Use `supabase.auth.signInWithPassword()` to authenticate.
- On success, redirect the user to `/dashboard`.
- Handle error states gracefully (e.g., "Invalid credentials").

### **C. Route Protection (Middleware)**
Create `middleware.ts` in the root of the project to protect all routes except `/login`.

```typescript
// middleware.ts blueprint
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { /* cookies setup */ }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && !request.nextUrl.pathname.startsWith('/login')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

### **D. API Route Protection**
Every handler in `/app/api/` must verify the user's session before executing operations.
```typescript
const { data: { session } } = await supabase.auth.getSession()
if (!session) {
  return new Response('Unauthorized', { status: 401 })
}
```
