'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Upload, X, Save, ImageIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input, SelectDropdown, GlassCard } from '@/components/ui'
import { uploadProductImage } from '@/lib/supabase/storage'

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  category: z.string().min(1, 'Please select a category'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  status: z.enum(['active', 'inactive']),
})

interface ProductFormData {
  name: string
  category: string
  price: number
  stock: number
  status: 'active' | 'inactive'
}

interface ProductFormProps {
  mode: 'new' | 'edit'
}

export default function ProductForm({ mode }: ProductFormProps) {
  const router = useRouter()
  const params = useParams()
  const productId = params?.id as string | undefined

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: '',
      category: '',
      price: 0,
      stock: 0,
      status: 'active',
    },
  })

  // Load existing product for edit mode
  useEffect(() => {
    if (mode === 'edit' && productId) {
      fetch(`/api/products/${productId}`)
        .then(r => r.json())
        .then(({ data }) => {
          if (data) {
            setValue('name', data.name)
            setValue('category', data.category)
            setValue('price', data.price)
            setValue('stock', data.stock)
            setValue('status', data.status)
            setExistingImageUrl(data.image_url)
            setImagePreview(data.image_url)
          }
        })
    }
  }, [mode, productId, setValue])

  function handleFileSelect(file: File) {
    if (!file.type.startsWith('image/')) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  async function onSubmit(formData: ProductFormData) {
    setSaving(true)
    setApiError(null)

    let image_url: string | null = existingImageUrl

    // Upload new image if selected
    if (imageFile) {
      try {
        image_url = await uploadProductImage(imageFile)
      } catch (err) {
        setApiError(err instanceof Error ? err.message : 'Image upload failed')
        setSaving(false)
        return
      }
    }

    const payload = { ...formData, image_url }

    const res = await fetch(
      mode === 'edit' ? `/api/products/${productId}` : '/api/products',
      {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )

    const json = await res.json()
    if (!res.ok) {
      setApiError(json.error ?? 'Something went wrong')
      setSaving(false)
      return
    }

    router.push('/products')
  }

  const categoryValue = watch('category')
  const statusValue = watch('status')

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', maxWidth: '800px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
        <button
          onClick={() => router.back()}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer', color: '#94a3b8', transition: 'all 0.15s',
          }}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 2px' }}>
            {mode === 'new' ? 'Add New Product' : 'Edit Product'}
          </h1>
          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
            {mode === 'new' ? 'Fill in the details to add a product to your inventory' : 'Update the product information below'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Error Banner */}
          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)',
                borderRadius: '12px', padding: '14px 16px', color: '#fb7185', fontSize: '0.875rem',
              }}
            >
              ⚠ {apiError}
            </motion.div>
          )}

          {/* Image Upload */}
          <GlassCard padding="20px">
            <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>
              Product Image
            </p>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              {/* Preview */}
              <div style={{
                width: '100px', height: '100px', borderRadius: '12px', flexShrink: 0,
                background: imagePreview ? `url(${imagePreview}) center/cover` : 'rgba(99,102,241,0.08)',
                border: '2px dashed rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
                {!imagePreview && <ImageIcon size={28} color="#334155" />}
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null); setExistingImageUrl(null) }}
                    style={{
                      position: 'absolute', top: '4px', right: '4px',
                      width: '20px', height: '20px', borderRadius: '50%',
                      background: 'rgba(0,0,0,0.7)', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                    }}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInput.current?.click()}
                style={{
                  flex: 1, padding: '20px', borderRadius: '12px', cursor: 'pointer',
                  border: `2px dashed ${dragOver ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.08)'}`,
                  background: dragOver ? 'rgba(99,102,241,0.06)' : 'rgba(0,0,0,0.15)',
                  textAlign: 'center', transition: 'all 0.2s',
                }}
              >
                <Upload size={20} color="#475569" style={{ margin: '0 auto 8px' }} />
                <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0 0 4px' }}>
                  Drag & drop or <span style={{ color: '#818cf8' }}>browse</span>
                </p>
                <p style={{ color: '#334155', fontSize: '0.72rem', margin: 0 }}>PNG, JPG, WebP up to 5MB</p>
              </div>
              <input
                ref={fileInput} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f) }}
              />
            </div>
          </GlassCard>

          {/* Product Details */}
          <GlassCard padding="20px">
            <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px' }}>
              Product Details
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <Input
                  label="Product Name"
                  placeholder="e.g. Alphonso Mango"
                  error={errors.name?.message}
                  {...register('name')}
                />
              </div>
              <SelectDropdown
                label="Category"
                options={[
                  { value: 'Fruit', label: '🍎 Fruit' },
                  { value: 'Vegetable', label: '🥦 Vegetable' },
                ]}
                value={categoryValue}
                onChange={(v) => setValue('category', v)}
                error={errors.category?.message}
                placeholder="Select category"
              />
              <SelectDropdown
                label="Status"
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ]}
                value={statusValue}
                onChange={(v) => setValue('status', v as 'active' | 'inactive')}
                placeholder="Select status"
              />
              <Input
                label="Price (₹)"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                error={errors.price?.message}
                {...register('price', { valueAsNumber: true })}
              />
              <Input
                label="Stock (units)"
                type="number"
                min="0"
                placeholder="0"
                error={errors.stock?.message}
                {...register('stock', { valueAsNumber: true })}
              />
            </div>
          </GlassCard>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" variant="primary" loading={saving} icon={<Save size={14} />}>
              {saving ? 'Saving...' : mode === 'new' ? 'Add Product' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
