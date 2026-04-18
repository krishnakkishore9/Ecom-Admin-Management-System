'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Pencil, Trash2, Package, AlertCircle, RefreshCw, X } from 'lucide-react'
import { Button, Badge, DataTable } from '@/components/ui'
import type { Column } from '@/components/ui/DataTable'

type Product = {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: string
  image_url: string | null
  created_at: string
}

/**
 * ProductsPage: Full inventory management with CRUD support.
 * 
 * Features:
 * - Debounced search for performance.
 * - Custom modal flow for creating and editing products.
 * - Glassmorphic DataTable for a premium inventory view.
 */
export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchProducts = useCallback(async (query: string) => {
    setLoading(true)
    setError(null)
    try {
      const params = query ? `?query=${encodeURIComponent(query)}` : ''
      const res = await fetch(`/api/products${params}`)
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error ?? `Request failed with status ${res.status}`)
      }
      const json = await res.json()
      setProducts(json.data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery, fetchProducts])

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    setDeleteError(null)
    try {
      const res = await fetch(`/api/products/${deleteTarget.id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) {
        setDeleteError(json.error ?? 'Failed to delete product')
        return
      }
      setDeleteTarget(null)
      fetchProducts(searchQuery)
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete product')
    } finally {
      setDeleting(false)
    }
  }

  const columns: Column<Product>[] = [
    {
      key: 'name',
      header: 'Product',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
            background: row.image_url
              ? `url(${row.image_url}) center/cover no-repeat`
              : 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(245,158,11,0.2))',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {!row.image_url && <Package size={14} color="#10b981" />}
          </div>
          <div>
            <p style={{ margin: 0, color: '#f1f5f9', fontWeight: 600, fontSize: '0.875rem' }}>{row.name}</p>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.75rem' }}>{row.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      render: (row) => <span style={{ color: '#34d399', fontWeight: 600 }}>₹{row.price.toFixed(2)}</span>,
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (row) => (
        <span style={{ color: row.stock <= 10 ? '#fbbf24' : '#94a3b8', fontWeight: row.stock <= 10 ? 600 : 400 }}>
          {row.stock <= 10 && '⚠ '}{row.stock} units
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'active' ? 'success' : 'default'} dot>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            icon={<Pencil size={13} />}
            onClick={() => router.push(`/products/edit/${row.id}`)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 size={13} />}
            onClick={() => setDeleteTarget(row)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 2px' }}>Products</h1>
          <p style={{ fontSize: '0.81rem', color: '#64748b', margin: 0 }}>
            {loading ? 'Updating inventory...' : error ? 'Failed to load' : `${products.length} products total`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => fetchProducts(searchQuery)}
            disabled={loading}
            title="Refresh"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '36px', height: '36px', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#64748b', transition: 'all 0.15s', opacity: loading ? 0.5 : 1,
            }}
            onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.color = '#f8fafc'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' } }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
          >
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>
          <Button variant="primary" icon={<Plus size={15} />} onClick={() => router.push('/products/new')}>
            Add Product
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: '16px', maxWidth: '400px' }}>
        <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
        <input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%', boxSizing: 'border-box',
            paddingLeft: '36px', paddingRight: searchQuery ? '36px' : '14px',
            paddingTop: '9px', paddingBottom: '9px',
            background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px', color: '#f8fafc', fontSize: '0.85rem', outline: 'none',
            fontFamily: 'inherit', transition: 'all 0.2s',
          }}
          onFocus={(e) => { e.target.style.borderColor = 'rgba(16,185,129,0.5)'; e.target.style.background = 'rgba(0,0,0,0.25)' }}
          onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(0,0,0,0.15)' }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: '#475569',
              display: 'flex', alignItems: 'center', padding: '2px',
            }}
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Error Banner */}
      <AnimatePresence>
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)',
              borderRadius: '12px', padding: '14px 18px', marginBottom: '16px',
              color: '#fb7185', fontSize: '0.875rem',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
            <button
              onClick={() => fetchProducts(searchQuery)}
              style={{
                marginLeft: 'auto', padding: '4px 12px', borderRadius: '8px',
                background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)',
                color: '#fb7185', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500,
              }}
            >Try again</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div>
        <DataTable
          columns={columns}
          data={products}
          loading={loading}
          emptyMessage={
            searchQuery
              ? `No products found matching "${searchQuery}"`
              : 'No products yet. Click "Add Product" to get started.'
          }
        />
      </div>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 50,
              background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
            }}
            onClick={() => { setDeleteTarget(null); setDeleteError(null) }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'rgba(2,44,34,0.98)', border: '1px solid rgba(16,185,129,0.15)',
                borderRadius: '16px', padding: '28px', maxWidth: '420px', width: '100%',
                boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(244,63,94,0.15)', display: 'flex' }}>
                  <Trash2 size={20} color="#fb7185" />
                </div>
                <h2 style={{ color: '#f8fafc', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Delete Product</h2>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0 0 20px', lineHeight: 1.6 }}>
                Are you sure you want to delete{' '}
                <strong style={{ color: '#f1f5f9' }}>{deleteTarget.name}</strong>?
                This action cannot be undone.
              </p>

              {deleteError && (
                <div style={{
                  display: 'flex', gap: '8px', alignItems: 'flex-start',
                  background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)',
                  borderRadius: '10px', padding: '12px', marginBottom: '16px',
                  color: '#fb7185', fontSize: '0.8rem',
                }}>
                  <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{deleteError}</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <Button
                  variant="secondary"
                  onClick={() => { setDeleteTarget(null); setDeleteError(null) }}
                >
                  Cancel
                </Button>
                <Button variant="danger" loading={deleting} onClick={handleDelete}>
                  {deleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
