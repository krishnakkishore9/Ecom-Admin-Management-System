'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Eye, ChevronDown, AlertCircle, RefreshCw, X } from 'lucide-react'
import { Badge, DataTable } from '@/components/ui'
import type { Column } from '@/components/ui/DataTable'

type OrderItem = {
  id: string
  quantity: number
  price_at_purchase: number
  products: { name: string; image_url: string | null } | null
}

type Order = {
  id: string
  status: string
  total_amount: number
  created_at: string
  customers: { id: string; name: string; email: string } | null
  order_items: OrderItem[]
}

const STATUS_OPTIONS = ['pending', 'packed', 'shipped', 'delivered']

const statusVariant: Record<string, 'warning' | 'info' | 'purple' | 'success'> = {
  pending: 'warning',
  packed: 'info',
  shipped: 'info',
  delivered: 'success',
}

/* ─── Status Dropdown ─── */
function StatusDropdown({ order, onUpdated }: { order: Order; onUpdated: () => void }) {
  const [updating, setUpdating] = useState(false)
  const [open, setOpen] = useState(false)

  async function updateStatus(newStatus: string) {
    if (newStatus === order.status) { setOpen(false); return }
    setUpdating(true)
    setOpen(false)
    try {
      await fetch(`/api/orders/${order.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
    } catch (err) {
      console.error('Failed to update status:', err)
    } finally {
      setUpdating(false)
      onUpdated()
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        disabled={updating}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '4px 10px', borderRadius: '20px', cursor: updating ? 'not-allowed' : 'pointer',
          background: updating ? 'rgba(255,255,255,0.04)' : 'transparent',
          border: 'none', outline: 'none', transition: 'all 0.15s',
          opacity: updating ? 0.6 : 1,
        }}
      >
        <Badge variant={statusVariant[order.status]} dot>{order.status}</Badge>
        <ChevronDown
          size={12}
          color="#475569"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.15s' }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.12 }}
              style={{
                position: 'absolute', top: '100%', left: 0, zIndex: 50, marginTop: '4px',
                background: 'rgba(15,23,42,0.98)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px', overflow: 'hidden', minWidth: '140px',
                boxShadow: '0 16px 40px rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)',
              }}
            >
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    width: '100%', padding: '9px 14px', border: 'none',
                    background: s === order.status ? 'rgba(16,185,129,0.12)' : 'transparent',
                    cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => { if (s !== order.status) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = s === order.status ? 'rgba(16,185,129,0.12)' : 'transparent' }}
                >
                  <Badge variant={statusVariant[s]} dot>{s}</Badge>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Order Detail Modal ─── */
function OrderDetailModal({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
    }} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'rgba(15,23,42,0.98)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px', padding: '28px', maxWidth: '520px', width: '100%',
          boxShadow: '0 32px 64px rgba(0,0,0,0.6)',
          fontFamily: 'Inter, system-ui, sans-serif',
          maxHeight: '85vh', overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <p style={{ color: '#475569', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Order ID</p>
            <p style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.9rem', margin: 0, fontFamily: 'monospace' }}>
              #{order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Badge variant={statusVariant[order.status]} dot>{order.status}</Badge>
            <button
              onClick={onClose}
              style={{
                width: '28px', height: '28px', borderRadius: '8px', display: 'flex',
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#64748b',
              }}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Customer */}
        {order.customers && (
          <div style={{
            background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '14px',
            marginBottom: '16px', border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <p style={{ color: '#475569', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>Customer</p>
            <p style={{ color: '#f1f5f9', fontWeight: 600, margin: '0 0 2px', fontSize: '0.9rem' }}>{order.customers.name}</p>
            <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>{order.customers.email}</p>
          </div>
        )}

        {/* Items */}
        <div style={{ marginBottom: '16px' }}>
          <p style={{ color: '#475569', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
            Order Items ({order.order_items?.length ?? 0})
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(order.order_items ?? []).map((item) => (
              <div key={item.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px', background: 'rgba(255,255,255,0.04)',
                borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div>
                  <p style={{ color: '#e2e8f0', fontWeight: 500, margin: '0 0 2px', fontSize: '0.85rem' }}>
                    {item.products?.name ?? 'Unknown Product'}
                  </p>
                  <p style={{ color: '#64748b', margin: 0, fontSize: '0.75rem' }}>Qty: {item.quantity} × ₹{item.price_at_purchase.toFixed(2)}</p>
                </div>
                <p style={{ color: '#10b981', fontWeight: 600, margin: 0, fontSize: '0.875rem' }}>
                  ₹{(item.price_at_purchase * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '16px',
        }}>
          <span style={{ color: '#94a3b8', fontWeight: 600 }}>Total Amount</span>
          <span style={{ color: '#f8fafc', fontSize: '1.2rem', fontWeight: 700 }}>
            ₹{order.total_amount.toFixed(2)}
          </span>
        </div>
      </motion.div>
    </div>
  )
}

/* ─── Orders Page ─── */
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/orders')
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error ?? `Request failed with status ${res.status}`)
      }
      const json = await res.json()
      setOrders(json.data ?? [])
    } catch (err) {
      console.error('Failed to fetch orders:', err)
      setError(err instanceof Error ? err.message : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const columns: Column<Order>[] = [
    {
      key: 'id', header: 'Order ID',
      render: (row) => (
        <span style={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.8rem' }}>
          #{row.id.slice(0, 8).toUpperCase()}
        </span>
      ),
    },
    {
      key: 'customer', header: 'Customer',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(16,185,129,0.3), rgba(245,158,11,0.3))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#10b981', fontSize: '0.8rem', fontWeight: 700,
          }}>
            {row.customers?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <p style={{ margin: 0, color: '#f1f5f9', fontSize: '0.85rem', fontWeight: 500 }}>{row.customers?.name ?? '—'}</p>
            <p style={{ margin: 0, color: '#475569', fontSize: '0.72rem' }}>{row.customers?.email ?? ''}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'total_amount', header: 'Amount',
      render: (row) => <span style={{ color: '#10b981', fontWeight: 600 }}>₹{row.total_amount.toFixed(2)}</span>,
    },
    {
      key: 'status', header: 'Status',
      render: (row) => <StatusDropdown order={row} onUpdated={fetchOrders} />,
    },
    {
      key: 'created_at', header: 'Date',
      render: (row) => (
        <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
          {new Date(row.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'actions', header: '',
      render: (row) => (
        <button
          onClick={(e) => { e.stopPropagation(); setSelectedOrder(row) }}
          style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '5px 12px', borderRadius: '8px',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#94a3b8', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#f8fafc' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8' }}
        >
          <Eye size={13} /> View
        </button>
      ),
    },
  ]

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 4px' }}>Orders</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            {loading ? 'Loading orders...' : error ? 'Failed to load' : `${orders.length} total orders`}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Refresh button */}
          <button
            onClick={fetchOrders}
            disabled={loading}
            title="Refresh orders"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#94a3b8', fontSize: '0.8rem', fontWeight: 500, transition: 'all 0.15s',
              opacity: loading ? 0.5 : 1,
            }}
            onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#f8fafc' } }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8' }}
          >
            <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
          {/* Status legend */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {STATUS_OPTIONS.map((s) => <Badge key={s} variant={statusVariant[s]} dot>{s}</Badge>)}
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && !loading && (
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)',
            borderRadius: '12px', padding: '14px 18px', marginBottom: '20px',
            color: '#fb7185', fontSize: '0.875rem',
          }}
        >
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{error}</span>
          <button
            onClick={fetchOrders}
            style={{
              marginLeft: 'auto', padding: '4px 12px', borderRadius: '8px',
              background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)',
              color: '#fb7185', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500,
            }}
          >Try again</button>
        </div>
      )}

      {/* Table */}
      <div>
        <DataTable
          columns={columns}
          data={orders}
          loading={loading}
          emptyMessage="No orders yet. Orders placed by customers will appear here."
          onRowClick={(row) => setSelectedOrder(row)}
        />
      </div>

      {/* Empty State Icon (only when truly empty) */}
      {orders.length === 0 && !loading && !error && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '48px 20px', color: '#475569', gap: '12px',
        }}>
          <ShoppingCart size={40} color="#1e293b" />
          <p style={{ margin: 0, fontSize: '0.875rem' }}>No orders have been placed yet</p>
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
