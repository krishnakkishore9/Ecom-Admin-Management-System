'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { Package, ShoppingCart, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react'
import { GlassCard, Badge, SkeletonCard } from '@/components/ui'
import Link from 'next/link'

type DashboardData = {
  stats: { totalProducts: number; totalOrders: number; totalRevenue: number; lowStockCount: number }
  recentOrders: {
    id: string; status: string; total_amount: number; created_at: string
    customers: { name: string; email: string } | null
  }[]
  lowStockProducts: { id: string; name: string; stock: number; category: string }[]
  revenueChart: { date: string; revenue: number }[]
  pieChart: { name: string; value: number }[]
}

const PIE_COLORS: Record<string, string> = {
  pending: '#f59e0b', packed: '#fbbf24', shipped: '#38bdf8', delivered: '#10b981',
}
const STATUS_VARIANT: Record<string, 'warning' | 'purple' | 'info' | 'success'> = {
  pending: 'warning', packed: 'warning', shipped: 'info', delivered: 'success',
}

function GlassTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'rgba(10,12,30,0.97)', border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: '10px', padding: '10px 14px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)', fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <p style={{ color: '#64748b', fontSize: '0.72rem', margin: '0 0 4px' }}>{label}</p>
      <p style={{ color: '#10b981', fontWeight: 700, margin: 0, fontSize: '0.9rem' }}>
        ₹{(payload[0]?.value ?? 0).toLocaleString('en-IN')}
      </p>
    </div>
  )
}

function PieTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'rgba(10,12,30,0.97)', border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: '10px', padding: '8px 12px', fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.8rem' }}>
        {payload[0]?.name}: <strong style={{ color: '#f8fafc' }}>{payload[0]?.value}</strong>
      </p>
    </div>
  )
}

/**
 * DashboardPage: The main analytical view for the admin system.
 * 
 * Logic:
 * - Fetches aggregated summary data from /api/dashboard/summary.
 * - Displays interactive charts using Recharts with a custom emerald theme.
 * - Handles numeric sanitization to ensure Supabase types are rendered correctly.
 */
export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await fetch('/api/dashboard/summary')
        const json = await res.json()
        if (!res.ok) {
          setError(json.error ?? `Request failed with status ${res.status}`)
          return
        }
        setData(json)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    fetchSummary()
  }, [])

  const stats = data?.stats

  return (
    <div style={{
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex', flexDirection: 'column', gap: '20px',
    }}>
      {/* ── Page Header ── */}
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 4px' }}>Dashboard</h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
          Welcome back, Admin 👋 — Here&apos;s your store at a glance.
        </p>
      </div>

      {/* ── Error Banner ── */}
      {error && !loading && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)',
          borderRadius: '12px', padding: '14px 18px',
          color: '#fb7185', fontSize: '0.875rem',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{error}</span>
          <button
            onClick={() => { setError(null); setLoading(true); fetch('/api/dashboard/summary').then(r => r.json()).then(json => { setData(json); setLoading(false) }).catch(() => { setError('Failed to reload'); setLoading(false) }) }}
            style={{
              marginLeft: 'auto', padding: '4px 14px', borderRadius: '8px',
              background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)',
              color: '#fb7185', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500,
            }}
          >Retry</button>
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className="dashboard-stats-grid">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : [
              { label: 'Total Revenue', value: `₹${(stats!.totalRevenue).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, note: 'From delivered orders', icon: TrendingUp, color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.2)' },
              { label: 'Total Orders', value: stats!.totalOrders, note: 'All time', icon: ShoppingCart, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.2)' },
              { label: 'Products', value: stats!.totalProducts, note: 'In inventory', icon: Package, color: '#34d399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.2)' },
              { label: 'Low Stock', value: stats!.lowStockCount, note: 'Below 10 units', icon: AlertTriangle, color: '#fb7185', bg: 'rgba(251,113,133,0.12)', border: 'rgba(251,113,133,0.2)' },
            ].map((card, i) => {
              const Icon = card.icon
              return (
                <motion.div key={card.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                  <GlassCard hoverable padding="18px">
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '11px', marginBottom: '12px',
                      background: card.bg, border: `1px solid ${card.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={19} color={card.color} />
                    </div>
                    <p style={{ color: '#64748b', fontSize: '0.75rem', margin: '0 0 4px', fontWeight: 500, whiteSpace: 'nowrap' }}>{card.label}</p>
                    <p style={{ color: '#f8fafc', fontSize: '1.55rem', fontWeight: 800, margin: '0 0 3px', lineHeight: 1.1 }}>{card.value}</p>
                    <p style={{ color: '#334155', fontSize: '0.7rem', margin: 0 }}>{card.note}</p>
                  </GlassCard>
                </motion.div>
              )
            })}
      </div>

      {/* ── Charts Row ── */}
      <div className="dashboard-charts-grid">

        {/* Revenue Area Chart */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard padding="20px">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 3px', fontWeight: 600 }}>Revenue · Last 7 Days</p>
                <p style={{ color: '#f8fafc', fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                  {loading ? '...' : `₹${(data?.stats.totalRevenue ?? 0).toLocaleString('en-IN')}`}
                </p>
              </div>
              <Badge variant="success" dot>Delivered only</Badge>
            </div>
            <div style={{ height: '200px' }}>
              {loading ? (
                <div style={{ height: '100%', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', fontSize: '0.85rem' }}>
                  Loading...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%" debounce={100}>
                  <AreaChart data={data?.revenueChart ?? []} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<GlassTooltip />} />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#revenueGrad)" dot={false} activeDot={{ r: 4, fill: '#34d399' }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Pie Chart */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}>
          <GlassCard padding="20px">
            <p style={{ color: '#64748b', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px', fontWeight: 600 }}>
              Order Status Breakdown
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0 0 8px' }}>
              {loading ? '...' : `${data?.stats.totalOrders ?? 0} total orders`}
            </p>
            <div style={{ height: '228px' }}>
              {loading ? (
                <div style={{ height: '100%', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }} />
              ) : (
                <ResponsiveContainer width="100%" height="100%" debounce={100}>
                  <PieChart>
                    <Pie
                      data={data?.pieChart ?? []}
                      cx="50%" cy="42%"
                      innerRadius={52} outerRadius={78}
                      paddingAngle={3} dataKey="value" stroke="none"
                    >
                      {(data?.pieChart ?? []).map((entry) => (
                        <Cell key={entry.name} fill={PIE_COLORS[entry.name] ?? '#475569'} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                    <Legend
                      iconType="circle" iconSize={8}
                      wrapperStyle={{ paddingTop: '4px' }}
                      formatter={(value) => (
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* ── Bottom Lists ── */}
      <div className="dashboard-bottom-grid">

        {/* Recent Orders */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}>
          <GlassCard padding="20px">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <p style={{ color: '#64748b', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, fontWeight: 600 }}>
                Recent Orders
              </p>
              <Link href="/orders" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.73rem', fontWeight: 600, textDecoration: 'none' }}>
                View all <ArrowRight size={12} />
              </Link>
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{ height: '50px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }} />
                ))}
              </div>
            ) : (data?.recentOrders ?? []).length === 0 ? (
              <p style={{ color: '#334155', fontSize: '0.85rem', textAlign: 'center', padding: '24px 0', margin: 0 }}>No orders yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(data?.recentOrders ?? []).map((order, i) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.42 + i * 0.05 }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 12px', borderRadius: '10px',
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1, marginRight: '12px' }}>
                      <p style={{ color: '#e2e8f0', margin: '0 0 2px', fontSize: '0.83rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {order.customers?.name ?? 'Unknown'}
                      </p>
                      <p style={{ color: '#475569', margin: 0, fontSize: '0.7rem', fontFamily: 'monospace' }}>
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px', flexShrink: 0 }}>
                      <Badge variant={STATUS_VARIANT[order.status] ?? 'default'} dot>{order.status}</Badge>
                      <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.78rem' }}>
                        ₹{order.total_amount.toFixed(2)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* Low Stock Alerts */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48 }}>
          <GlassCard padding="20px">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <p style={{ color: '#64748b', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, fontWeight: 600 }}>
                Low Stock Alerts
              </p>
              <Link href="/products" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '0.73rem', fontWeight: 600, textDecoration: 'none' }}>
                Manage <ArrowRight size={12} />
              </Link>
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{ height: '50px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }} />
                ))}
              </div>
            ) : (data?.lowStockProducts ?? []).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <p style={{ color: '#10b981', fontSize: '0.85rem', margin: 0 }}>✓ All products well-stocked</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(data?.lowStockProducts ?? []).map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.48 + i * 0.05 }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 12px', borderRadius: '10px',
                      background: product.stock === 0 ? 'rgba(244,63,94,0.06)' : 'rgba(245,158,11,0.04)',
                      border: `1px solid ${product.stock === 0 ? 'rgba(244,63,94,0.15)' : 'rgba(245,158,11,0.12)'}`,
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1, marginRight: '12px' }}>
                      <p style={{ color: '#e2e8f0', margin: '0 0 2px', fontSize: '0.83rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {product.name}
                      </p>
                      <p style={{ color: '#475569', margin: 0, fontSize: '0.72rem' }}>{product.category}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ color: product.stock === 0 ? '#fb7185' : '#fbbf24', fontWeight: 700, margin: '0 0 1px', fontSize: '1rem' }}>
                        {product.stock}
                      </p>
                      <p style={{ color: '#475569', margin: 0, fontSize: '0.68rem' }}>units</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}
