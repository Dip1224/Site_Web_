import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const autoRefresh = (import.meta as any).env?.VITE_AUTH_AUTO_REFRESH ?? 'true'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

const globalForSupabase = globalThis as unknown as { supabase?: SupabaseClient }

export const supabase =
  globalForSupabase.supabase ??
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: String(autoRefresh).toLowerCase() !== 'false',
      detectSessionInUrl: true,
    },
  })

if (import.meta && (import.meta as any).env && (import.meta as any).env.DEV) {
  globalForSupabase.supabase = supabase
}
