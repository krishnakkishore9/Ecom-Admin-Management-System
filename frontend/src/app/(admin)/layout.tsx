'use client'

import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { LayoutProvider, useLayout } from '@/context/LayoutContext'

/**
 * AdminLayoutContent: The actual UI shell for the admin dashboard.
 * 
 * Features:
 * - Responsive Sidebar: Part of the flex flow on Desktop, fixed drawer on Mobile.
 * - Backdrop Overlay: Darkened glass effect when the mobile drawer is active.
 * - Custom Scrollbar: Ensuring a premium feel across all browsers.
 * - Backdrop Overlay: Darkens the page when the mobile drawer is active.
 * - Custom Scrollbar: Ensures a premium look across browsers.
 */
function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen, closeSidebar } = useLayout()

  return (
    <div className="admin-layout-root">
      {/* Sidebar Overlay: Only visible on mobile when the drawer is open */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}

      {/* Main Navigation Sidebar: Controlled by .sidebar-container (CSS) for drawer effect */}
      <div className={`sidebar-container ${!isSidebarOpen ? 'sidebar-hidden' : ''}`}>
        <Sidebar />
      </div>

      {/* Main Viewport Container */}
      <div className="main-content-wrapper">
        <Header />

        {/* Dynamic Page Content with custom scrollbar styling */}
        <main className="custom-scrollbar" style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '24px',
        }}>
          {/* Centered content container with max-width for better readability on large monitors */}
          <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider>
      <AdminLayoutContent>
        {children}
      </AdminLayoutContent>
    </LayoutProvider>
  )
}
