export { fetchTrafficDaily } from './dashboard'
import { supabase } from '@/lib/supabase'

const ENABLE_ANALYTICS = String(import.meta.env.VITE_ENABLE_ANALYTICS ?? 'false') === 'true'

export async function track(route: string, device: 'desktop'|'mobile' = 'desktop') {
  try {
    if (!ENABLE_ANALYTICS) return
    const key = `track:${route}`
    const last = Number(localStorage.getItem(key) || '0')
    const now = Date.now()
    if (now - last < 30_000) return // throttle 30s por ruta
    localStorage.setItem(key, String(now))
    await supabase.from('analytics_events').insert({ route, device_type: device })
  } catch (_) {
    // best-effort
  }
}
