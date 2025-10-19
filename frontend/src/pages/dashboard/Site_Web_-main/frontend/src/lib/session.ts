import { supabase } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'

let inFlight: Promise<Session | null> | null = null
let lastAttempt = 0
let cached: { ts: number; session: Session | null } | null = null

export async function ensureSession(): Promise<Session | null> {
  // Short cache to avoid frequent refresh checks
  if (cached && Date.now() - cached.ts < 5000) {
    return cached.session
  }

  if (inFlight) return inFlight

  const now = Date.now()
  if (now - lastAttempt < 1200) {
    await new Promise((r) => setTimeout(r, 400))
  }
  lastAttempt = Date.now()

  inFlight = (async () => {
    let retried = false
    try {
      const { data, error } = await supabase.auth.getSession()
      const status = (error as any)?.status
      if (status === 429 && !retried) {
        retried = true
        await new Promise((r) => setTimeout(r, 1200))
        const { data: d2, error: e2 } = await supabase.auth.getSession()
        if ((e2 as any)?.status === 429) {
          // No forzamos signOut en 429 persistente; dejamos que ProtectedRoute maneje la gracia
          cached = { ts: Date.now(), session: null }
          return null
        }
        cached = { ts: Date.now(), session: d2?.session ?? null }
        return d2?.session ?? null
      }
      cached = { ts: Date.now(), session: data?.session ?? null }
      return data?.session ?? null
    } finally {
      inFlight = null
    }
  })()

  return inFlight
}
