"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { ensureSession } from '@/lib/session'

interface User {
  id: string
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isReauthing: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
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
  const [isReauthing, setIsReauthing] = useState(false)

  // Robust init + subscription that works under React StrictMode (double-mount in dev)
  useEffect(() => {
    let isMounted = true

    const init = async () => {
      const attempt = async () => {
        try {
          const session = await ensureSession()
          if (!isMounted) return
          const u = session?.user
          if (u) {
            setUser({
              id: u.id,
              email: u.email ?? '',
              name: (u.user_metadata as any)?.name || u.email?.split('@')[0]
            })
          } else {
            setUser(null)
          }
        } finally {
          if (isMounted) setIsLoading(false)
          if (isMounted) setIsReauthing(false)
        }
      }

      attempt()
    }

    init()

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return
      const u = session?.user
      if (u) {
        setUser({
          id: u.id,
          email: u.email ?? '',
          name: (u.user_metadata as any)?.name || u.email?.split('@')[0]
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
      setIsReauthing(false)
    })

    return () => {
      isMounted = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      const u = data.user
      if (!u) throw new Error('No se pudo obtener el usuario')
      setUser({
        id: u.id,
        email: u.email ?? '',
        name: (u.user_metadata as any)?.name || u.email?.split('@')[0]
      })
      setIsLoginVisible(false)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string): Promise<void> => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      const u = data.user
      if (!u) return
      setUser({ id: u.id, email: u.email ?? '', name: (u.user_metadata as any)?.name || u.email?.split('@')[0] })
      setIsLoginVisible(false)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
      setUser(null)
      setIsLoginVisible(false)
    } finally {
      setIsLoading(false)
    }
  }

  const showLogin = () => setIsLoginVisible(true)
  const hideLogin = () => setIsLoginVisible(false)

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isReauthing,
    login,
    register,
    logout,
    showLogin,
    hideLogin,
    isLoginVisible,
  }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
