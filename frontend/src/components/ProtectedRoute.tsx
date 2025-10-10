import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth()

  console.log('🛡️ ProtectedRoute - Estado:', { 
    hasUser: !!user, 
    isLoading, 
    isAuthenticated,
    userId: user?.id 
  })

  if (isLoading) {
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

  if (!isAuthenticated) {
    console.log('❌ No hay usuario autenticado, redirigiendo a login')
    return <Navigate to="/login" replace />
  }

  console.log('✅ Usuario autenticado, mostrando contenido protegido')
  return <>{children}</>
}