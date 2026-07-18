import { supabase, PROOF_UPLOADS_BUCKET } from './supabase'

function extensionFromFile(file: File): string {
  const fromName = file.name.split('.').pop()
  if (fromName && fromName.length <= 5) return fromName.toLowerCase()
  const fromType = file.type.split('/').pop()
  return fromType ? fromType.toLowerCase() : 'jpg'
}

export async function uploadProofScreenshot(
  file: File,
  taskId: string,
  userId?: string,
): Promise<string> {
  const ext = extensionFromFile(file)
  const path = `${userId ?? 'anon'}/${taskId}-${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from(PROOF_UPLOADS_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'image/jpeg',
    })

  if (uploadError) {
    console.error('[Supabase] upload error:', uploadError)
    throw new Error(uploadError.message || 'Failed to upload screenshot.')
  }

  const { data } = supabase.storage.from(PROOF_UPLOADS_BUCKET).getPublicUrl(path)

  if (!data?.publicUrl) {
    throw new Error('Failed to get the uploaded screenshot URL.')
  }

  return data.publicUrl
}
