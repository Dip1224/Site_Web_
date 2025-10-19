import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { AuthFormData, AuthMode } from '../types'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [authMode, setAuthMode] = useState<AuthMode>('signin')
  const [authData, setAuthData] = useState<AuthFormData>({
    email: '',
    password: ''
  })

  // Verificar usuario actual al cargar (Supabase real)
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (err) {
        console.error('Error verificando usuario:', err)
      } finally {
        setLoading(false)
      }
    }
    
    checkUser()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Autenticar usuario
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      let result
      if (authMode === 'signup') {
        result = await supabase.auth.signUp({
          email: authData.email,
          password: authData.password
        })
      } else {
        result = await supabase.auth.signInWithPassword({
          email: authData.email,
          password: authData.password
        })
      }

      if (result.error) throw result.error
      
      if (result.data.user) {
        setUser(result.data.user)
        setAuthData({ email: '', password: '' })
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Cerrar sesión con Supabase real
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      console.log('✅ Logout exitoso con Supabase')
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    }
  }

  // Login con modo demo (permite cualquier credencial)
  const login = async (email: string, _password: string) => {
    setLoading(true)
    setError(null)
    console.log('🔑 Iniciando login:', { email })
    
    try {
      // Por ahora usar directamente modo demo para que funcione siempre
      console.log('🎭 Usando modo demo para desarrollo')
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Crear usuario demo
      const demoUser: any = {
        id: 'demo-' + Date.now(),
        email: email,
        user_metadata: {
          name: email.split('@')[0],
          full_name: email.split('@')[0]
        },
        created_at: new Date().toISOString(),
        app_metadata: {},
        aud: 'authenticated'
      }
      
      setUser(demoUser)
      console.log('✅ Login exitoso en modo demo:', { 
        email, 
        userId: demoUser.id, 
        userName: demoUser.user_metadata.name 
      })
      
    } catch (err: any) {
      console.error('❌ Error en login demo:', err)
      setError('Error al iniciar sesión')
      throw new Error('Login failed')
    } finally {
      setLoading(false)
    }
  }

  // Registro con Supabase
  const register = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      
      if (error) throw error
      
      if (data.user) {
        console.log('✅ Registro exitoso con Supabase:', { email })
        // Nota: El usuario puede necesitar verificar su email
        alert('¡Registro exitoso! Revisa tu email para verificar tu cuenta.')
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    error,
    authMode,
    authData,
    setAuthMode,
    setAuthData,
    handleAuth,
    handleSignOut,
    login,
    register,
    logout: handleSignOut
  }
}