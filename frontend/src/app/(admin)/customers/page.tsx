'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Users, Package } from 'lucide-react'
import { Badge, DataTable } from '@/components/ui'
import type { Column } from '@/components/ui/DataTable'

type Customer = {
  id: string
  name: string
  email: string
  created_at: string
  order_count: number
}

type OrderItem = { id: string; quantity: number; price_at_purchase: number; products: { name: string } | null }
type CustomerOrder = {
  id: string
  status: string
  total_amount: number
  created_at: string
  order_items: OrderItem[]
}

const statusVariant: Record<string, 'warning' | 'info' | 'purple' | 'success'> = {
  pending: 'warning', packed: 'info', shipped: 'info', delivered: 'success',
}

function CustomerDrawer({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  const [orders, setOrders] = useState<CustomerOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const res = await fetch(`/api/customers/${customer.id}/orders`)
        if (!res.ok) throw new Error(`Status ${res.status}`)
        const json = await res.json()
        if (active) setOrders(json.data ?? [])
      } catch (err) {
        console.error('Failed to fetch customer orders:', err)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [customer.id])

  const initials = customer.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 50,
          width: '420px', maxWidth: '95vw',
          background: 'rgba(2,12,10,0.98)',
          backdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(16,185,129,0.1)',
          boxShadow: '-16px 0 60px rgba(0,0,0,0.5)',
          display: 'flex', flexDirection: 'column',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '24px 24px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
              background: 'linear-gradient(135deg, #10b981, #f59e0b)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', fontWeight: 700, color: 'white',
              boxShadow: '0 4px 16px rgba(16,185,129,0.4)',
            }}>{initials}</div>
            <div>
              <h2 style={{ color: '#f8fafc', fontWeight: 700, margin: '0 0 3px', fontSize: '1rem' }}>{customer.name}</h2>
              <p style={{ color: '#64748b', margin: 0, fontSize: '0.8rem' }}>{customer.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px', height: '32px', borderRadius: '8px', border: 'none',
              background: 'rgba(255,255,255,0.06)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#f8fafc' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#94a3b8' }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '16px 24px' }}>
          {[
            { label: 'Total Orders', value: customer.order_count },
            { label: 'Member Since', value: new Date(customer.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '12px', padding: '14px 16px',
            }}>
              <p style={{ color: '#475569', fontSize: '0.7rem', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
              <p style={{ color: '#f1f5f9', fontWeight: 700, margin: 0, fontSize: '1rem' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Order History */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>
          <p style={{
            color: '#475569', fontSize: '0.7rem', textTransform: 'uppercase',
            letterSpacing: '0.08em', marginBottom: '12px', fontWeight: 600,
          }}>
            Order History
          </p>

          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{
                height: '72px', borderRadius: '12px', marginBottom: '8px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
              }} />
            ))
          ) : orders.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '32px 0', gap: '10px', color: '#334155',
            }}>
              <Package size={32} />
              <p style={{ margin: 0, fontSize: '0.85rem' }}>No orders placed yet</p>
            </div>
          ) : (
            orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '12px', padding: '14px 16px', marginBottom: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                    #{order.id.slice(0, 8).toUpperCase()}
                  </span>
                  <Badge variant={statusVariant[order.status] ?? 'default'} dot>{order.status}</Badge>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ color: '#64748b', fontSize: '0.72rem', margin: '0 0 2px' }}>
                      {order.order_items?.length ?? 0} item(s) · {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    {order.order_items?.slice(0, 2).map(item => (
                      <p key={item.id} style={{ color: '#475569', margin: 0, fontSize: '0.72rem' }}>
                        {item.products?.name} × {item.quantity}
                      </p>
                    ))}
                  </div>
                  <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.95rem' }}>
                    ₹{order.total_amount.toFixed(2)}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </>
  )
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const fetchCustomers = useCallback(async (query: string) => {
    setLoading(true)
    try {
      const params = query ? `?query=${encodeURIComponent(query)}` : ''
      const res = await fetch(`/api/customers${params}`)
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error ?? `Request failed with status ${res.status}`)
      }
      const json = await res.json()
      setCustomers(json.data ?? [])
    } catch (err) {
      console.error('Failed to fetch customers:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => fetchCustomers(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery, fetchCustomers])

  const columns: Column<Customer>[] = [
    {
      key: 'name', header: 'Customer',
      render: (row) => {
        const initials = row.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(16,185,129,0.25), rgba(245,158,11,0.25))',
              border: '1px solid rgba(16,185,129,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#10b981', fontWeight: 700, fontSize: '0.8rem',
            }}>{initials}</div>
            <div>
              <p style={{ margin: 0, color: '#f1f5f9', fontWeight: 600, fontSize: '0.875rem' }}>{row.name}</p>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.75rem' }}>{row.email}</p>
            </div>
          </div>
        )
      },
    },
    {
      key: 'order_count', header: 'Orders',
      render: (row) => (
        <span style={{ color: '#94a3b8', fontWeight: 500 }}>
          {row.order_count} {row.order_count === 1 ? 'order' : 'orders'}
        </span>
      ),
    },
    {
      key: 'created_at', header: 'Joined',
      render: (row) => (
        <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
          {new Date(row.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
  ]

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 4px' }}>Customers</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            {loading ? 'Loading...' : `${customers.length} registered customers`}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '0.8rem' }}>
          <Users size={15} /> Click a row to view order history
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '400px' }}>
        <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
        <input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%', boxSizing: 'border-box',
            paddingLeft: '36px', paddingRight: '14px', paddingTop: '9px', paddingBottom: '9px',
            background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px', color: '#f8fafc', fontSize: '0.875rem', outline: 'none',
            fontFamily: 'inherit', transition: 'border-color 0.15s',
          }}
          onFocus={(e) => e.target.style.borderColor = 'rgba(16,185,129,0.6)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        />
      </div>

      <div>
        <DataTable
          columns={columns}
          data={customers}
          loading={loading}
          emptyMessage="No customers found."
          onRowClick={(row) => setSelectedCustomer(row)}
        />
      </div>

      <AnimatePresence>
        {selectedCustomer && (
          <CustomerDrawer customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
