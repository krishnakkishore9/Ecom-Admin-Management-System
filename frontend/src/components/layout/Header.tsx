'use client'

import { usePathname } from 'next/navigation'
import { Bell, ChevronRight, Menu } from 'lucide-react'
import { useLayout } from '@/context/LayoutContext'

const routeLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/products': 'Products',
  '/orders': 'Orders',
  '/customers': 'Customers',
}

/**
 * Header Component: The sticky top bar for context and user actions.
 * 
 * Logic:
 * - Dynamically displays the current page label based on the active route.
 * - Provides a mobile-only menu toggle to engage the sidebar drawer.
 * - Showcases glassmorphic design with backdrop-blur and semi-transparent backgrounds.
 */
export default function Header() {
  const pathname = usePathname()
  const { toggleSidebar } = useLayout()
  const currentLabel = routeLabels[pathname] ?? 'Admin'

  return (
    <header style={{
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      background: 'rgba(2, 44, 34, 0.4)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      flexShrink: 0,
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Mobile Toggle */}
        <button
          onClick={toggleSidebar}
          id="mobile-menu-toggle"
          className="mobile-toggle"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '4px', borderRadius: '8px', color: '#64748b',
            display: 'none', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Menu size={20} />
        </button>

        {/* Breadcrumb */}
        <div className="desktop-breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}>
          <span style={{ color: '#065f46' }}>FreshMarket</span>
          <ChevronRight size={14} color="#064e3b" />
          <span style={{ color: '#d1fae5', fontWeight: 600 }}>{currentLabel}</span>
        </div>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Bell */}
        <button
          id="notifications-btn"
          style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', position: 'relative', color: '#64748b',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            const t = e.currentTarget
            t.style.background = 'rgba(255,255,255,0.1)'
            t.style.color = '#f8fafc'
          }}
          onMouseLeave={e => {
            const t = e.currentTarget
            t.style.background = 'rgba(255,255,255,0.05)'
            t.style.color = '#64748b'
          }}
        >
          <Bell size={16} />
          <span style={{
            position: 'absolute', top: '8px', right: '8px',
            width: '7px', height: '7px', borderRadius: '50%',
            background: '#f59e0b',
            boxShadow: '0 0 6px rgba(245,158,11,0.8)',
          }} />
        </button>

        {/* Admin avatar chip */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '6px 12px 6px 6px', borderRadius: '12px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
            background: 'linear-gradient(135deg, #10b981, #f59e0b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', fontWeight: 700, color: 'white',
          }}>A</div>
          <div>
            <p style={{ color: '#e2e8f0', fontSize: '0.8rem', fontWeight: 600, margin: 0, lineHeight: 1.2 }}>Admin</p>
            <p style={{ color: '#475569', fontSize: '0.65rem', margin: 0 }}>Administrator</p>
          </div>
        </div>
      </div>
    </header>
  )
}
