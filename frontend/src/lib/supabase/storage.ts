import { createClient } from './client'

/**
 * Uploads a file to the Supabase 'images' storage bucket.
 * Returns the public URL of the uploaded file, or throws on error.
 */
export async function uploadProductImage(file: File): Promise<string> {
  const supabase = createClient()
  const ext = file.name.split('.').pop()
  const fileName = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from('images')
    .upload(fileName, file, { cacheControl: '3600', upsert: false })

  if (error) throw new Error(`Image upload failed: ${error.message}`)

  const { data } = supabase.storage.from('images').getPublicUrl(fileName)
  return data.publicUrl
}

/**
 * Deletes an image from the storage bucket by its full public URL.
 */
export async function deleteProductImage(publicUrl: string): Promise<void> {
  const supabase = createClient()
  const path = publicUrl.split('/storage/v1/object/public/images/')[1]
  if (!path) return
  await supabase.storage.from('images').remove([path])
}
