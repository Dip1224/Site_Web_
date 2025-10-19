import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import { ensureSession } from '@/lib/session'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated, isReauthing } = useAuth()
  const [readyToRedirect, setReadyToRedirect] = useState(false)

  console.log('🛡️ ProtectedRoute - Estado:', { 
    hasUser: !!user, 
    isLoading, 
    isAuthenticated,
    userId: user?.id 
  })

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!isAuthenticated && !isLoading) {
        // Intento extra de preflight antes de permitir redirección
        try { await ensureSession() } catch {}
        if (!cancelled) {
          const t = setTimeout(() => setReadyToRedirect(true), 2000)
          return () => clearTimeout(t)
        }
      } else {
        setReadyToRedirect(false)
      }
    }
    const cleanup = run()
    return () => { cancelled = true; if (typeof cleanup === 'function') cleanup() }
  }, [isAuthenticated, isLoading])

  if (isLoading || isReauthing || (!isAuthenticated && !readyToRedirect)) {
    console.log('⏳ Cargando autenticación...')
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated && readyToRedirect) {
    console.log('❌ No hay usuario autenticado, redirigiendo a login')
    return <Navigate to="/login" replace />
  }

  console.log('✅ Usuario autenticado, mostrando contenido protegido')
  return <>{children}</>
}
