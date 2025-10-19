import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { ensureSession } from '@/lib/session'

// Centraliza un refresh controlado cuando:
// - la app gana foco o vuelve a ser visible
// - cambia la ruta (navegación)
// Aplica un throttle para evitar ráfagas.
export function SessionGuard() {
  const lastRun = useRef<number>(0)
  const location = useLocation()

  const maybeEnsure = async (minGapMs = 8000) => {
    const now = Date.now()
    if (now - lastRun.current < minGapMs) return
    lastRun.current = now
    try { await ensureSession() } catch {}
  }

  useEffect(() => {
    // Primer preflight al montar
    maybeEnsure(0)

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        maybeEnsure(6000)
      }
    }

    const onFocus = () => {
      maybeEnsure(6000)
    }

    window.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('focus', onFocus)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Preflight suave en cambio de ruta
    maybeEnsure(5000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search])

  return null
}

export default SessionGuard

