'use client'

import { Package, Pencil, Trash2, Plus } from 'lucide-react'
import { GlassCard, Button, Input, SelectDropdown, Badge, DataTable, SkeletonCard } from '@/components/ui'
import type { Column } from '@/components/ui/DataTable'

type SampleRow = { id: string; name: string; status: string; price: string }

const sampleData: SampleRow[] = [
  { id: '1', name: 'Alphonso Mango', status: 'active', price: '₹340' },
  { id: '2', name: 'Baby Spinach', status: 'inactive', price: '₹60' },
  { id: '3', name: 'Dragon Fruit', status: 'active', price: '₹220' },
]

const columns: Column<SampleRow>[] = [
  { key: 'name', header: 'Product Name' },
  {
    key: 'status', header: 'Status',
    render: (row) => (
      <Badge variant={row.status === 'active' ? 'success' : 'default'} dot>
        {row.status}
      </Badge>
    ),
  },
  { key: 'price', header: 'Price' },
  {
    key: 'actions', header: 'Actions',
    render: () => (
      <div style={{ display: 'flex', gap: '6px' }}>
        <Button variant="ghost" size="sm" icon={<Pencil size={13} />}>Edit</Button>
        <Button variant="danger" size="sm" icon={<Trash2 size={13} />}>Delete</Button>
      </div>
    ),
  },
]

export default function ComponentShowcasePage() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 4px' }}>
          🧩 UI Component Library
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>Phase 3 — All reusable components</p>
      </div>

      {/* Badges */}
      <GlassCard>
        <h2 style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 14px' }}>Badges</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <Badge variant="success" dot>Active</Badge>
          <Badge variant="warning" dot>Pending</Badge>
          <Badge variant="danger" dot>Inactive</Badge>
          <Badge variant="info" dot>Shipped</Badge>
          <Badge variant="purple" dot>Packed</Badge>
          <Badge variant="default">Default</Badge>
        </div>
      </GlassCard>

      {/* Buttons */}
      <GlassCard>
        <h2 style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 14px' }}>Buttons</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          <Button variant="primary" icon={<Plus size={15} />}>Add Product</Button>
          <Button variant="secondary" icon={<Package size={15} />}>View All</Button>
          <Button variant="danger" icon={<Trash2 size={15} />}>Delete</Button>
          <Button variant="ghost">Cancel</Button>
          <Button variant="primary" loading>Saving...</Button>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="lg">Large</Button>
        </div>
      </GlassCard>

      {/* Inputs */}
      <GlassCard>
        <h2 style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 14px' }}>Form Inputs</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Input label="Product Name" placeholder="e.g. Alphonso Mango" />
          <Input label="Price (₹)" placeholder="0.00" type="number" />
          <Input label="With Error" placeholder="Type here..." error="This field is required" />
          <Input label="With Hint" placeholder="Type here..." hint="This will be shown publicly." />
          <SelectDropdown
            label="Category"
            options={[
              { value: 'fruit', label: 'Fruit' },
              { value: 'vegetable', label: 'Vegetable' },
            ]}
            placeholder="Select category"
          />
          <SelectDropdown
            label="Status"
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            placeholder="Select status"
          />
        </div>
      </GlassCard>

      {/* Skeleton */}
      <GlassCard>
        <h2 style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 14px' }}>Skeleton Loaders</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </GlassCard>

      {/* DataTable */}
      <div>
        <h2 style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 14px' }}>Data Table</h2>
        <DataTable columns={columns} data={sampleData} />
      </div>
    </div>
  )
}
