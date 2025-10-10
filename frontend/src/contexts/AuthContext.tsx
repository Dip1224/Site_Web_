"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  showLogin: () => void
  hideLogin: () => void
  isLoginVisible: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoginVisible, setIsLoginVisible] = useState(false)

  useEffect(() => {
    // Limpiar cualquier dato de usuario previo para evitar estados inconsistentes
    console.log('🧹 AuthContext - Limpiando estado de autenticación al inicio')
    localStorage.removeItem('lynxtech_user')
    setUser(null)
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    console.log('🔑 AuthContext - Iniciando login:', { email })
    setIsLoading(true)
    
    try {
      // Simulación de autenticación - en producción esto sería una llamada a la API
      console.log('⏳ Simulando delay de autenticación...')
      await new Promise(resolve => setTimeout(resolve, 800)) // Simular delay de red
      
      // Validación básica simplificada para desarrollo
      if (!email || !password) {
        throw new Error('Email y contraseña son requeridos')
      }

      // Para desarrollo, aceptar cualquier email válido
      if (!email.includes('@')) {
        throw new Error('Formato de email inválido')
      }

      // Crear usuario simulado
      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        name: email.split('@')[0] // Usar la parte antes del @ como nombre
      }

      console.log('✅ AuthContext - Usuario creado:', newUser)
      setUser(newUser)
      localStorage.setItem('lynxtech_user', JSON.stringify(newUser))
      setIsLoginVisible(false)
      
      console.log('✅ AuthContext - Login completado exitosamente')
    } catch (error) {
      console.error('❌ AuthContext - Error en login:', error)
      throw error
    } finally {
      setIsLoading(false)
      console.log('🏁 AuthContext - Login process finished')
    }
  }

  const logout = () => {
    console.log('🚪 AuthContext - Logout ejecutado')
    setUser(null)
    localStorage.removeItem('lynxtech_user')
    setIsLoginVisible(false)
  }

  const showLogin = () => {
    setIsLoginVisible(true)
  }

  const hideLogin = () => {
    setIsLoginVisible(false)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    showLogin,
    hideLogin,
    isLoginVisible
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}