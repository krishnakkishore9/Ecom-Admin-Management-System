'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Leaf } from 'lucide-react'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/customers', label: 'Customers', icon: Users },
]

/**
 * Sidebar Component: The primary navigation drawer.
 * 
 * Design:
 * - Uses a deep emerald background with a high blur effect for a premium "Glass" feel.
 * - Logo uses the theme's core Green-to-Orange gradient.
 */
export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'rgba(2, 44, 34, 0.8)',
      backdropFilter: 'blur(32px)',
      WebkitBackdropFilter: 'blur(32px)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      fontFamily: 'Inter, system-ui, sans-serif',
      width: '100%', /* Occupy full container width */
    }}>

      {/* Logo */}
      <div style={{ padding: '24px 20px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '38px', height: '38px', borderRadius: '12px', flexShrink: 0,
          background: 'linear-gradient(135deg, #10b981, #f59e0b)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(16,185,129,0.3)',
        }}>
          <Leaf size={18} color="white" />
        </div>
        <div>
          <p style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.9rem', margin: 0, lineHeight: 1.2 }}>FreshMarket</p>
          <p style={{ color: '#475569', fontSize: '0.7rem', margin: 0 }}>Admin Panel</p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 16px' }} />

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <p style={{ color: '#334155', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '8px 10px 4px', margin: 0 }}>
          Menu
        </p>
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
                  background: isActive ? 'rgba(16,185,129,0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(16,185,129,0.3)' : '1px solid transparent',
                  color: isActive ? '#6ee7b7' : '#94a3b8',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.875rem',
                  transition: 'all 0.15s',
                  position: 'relative',
                }}
              >
                {isActive && (
                  <div style={{
                    position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                    width: '3px', height: '20px', borderRadius: '0 3px 3px 0',
                    background: 'linear-gradient(180deg, #10b981, #f59e0b)',
                  }} />
                )}
                <Icon size={17} color={isActive ? '#10b981' : '#475569'} />
                <span style={{ color: isActive ? '#d1fae5' : '#94a3b8' }}>{label}</span>
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Bottom — Logout */}
      <div style={{ padding: '12px 10px 32px' }}>
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '10px' }} />
        <motion.button
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          id="logout-btn"
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            width: '100%', padding: '10px 12px', borderRadius: '10px',
            borderWidth: '1px', borderStyle: 'solid', borderColor: 'transparent', background: 'transparent',
            color: '#64748b', fontSize: '0.875rem', fontWeight: 500,
            cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
          }}
          onMouseEnter={e => {
            const t = e.currentTarget
            t.style.background = 'rgba(244,63,94,0.1)'
            t.style.borderColor = 'rgba(244,63,94,0.2)'
            t.style.color = '#fb7185'
          }}
          onMouseLeave={e => {
            const t = e.currentTarget
            t.style.background = 'transparent'
            t.style.borderColor = 'transparent'
            t.style.color = '#64748b'
          }}
        >
          <LogOut size={17} />
          <span>Sign Out</span>
        </motion.button>
      </div>
    </aside>
  )
}
