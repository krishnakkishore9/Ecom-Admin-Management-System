/**
 * api.ts — Typed fetch helper for the FastAPI backend
 *
 * Usage (in a Server Component or Route Handler):
 *   import { apiFetch } from '@/lib/api'
 *   const { data } = await apiFetch('/products', session.access_token)
 *
 * For Client Components, retrieve the token from Supabase client:
 *   const { data: { session } } = await supabase.auth.getSession()
 *   const { data } = await apiFetch('/products', session?.access_token)
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

interface ApiFetchOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  accessToken?: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers ?? {}),
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  const url = `${BASE_URL}/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  const res = await fetch(url, { ...options, headers })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(error?.detail ?? `API error: ${res.status}`)
  }

  return res.json() as Promise<T>
}
