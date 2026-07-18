import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
      'Screenshot uploads will fail until these are set in .env',
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const PROOF_UPLOADS_BUCKET =
  (import.meta.env.VITE_SUPABASE_PROOF_BUCKET as string) || 'Taskora_proff_uploads'
