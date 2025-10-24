import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useThemeColors } from '../hooks/useThemeColors'
import { useIsMobile } from '../hooks/use-mobile'
import { LynxLogo } from './ui/LynxLogo'
import { cn } from '../lib/utils'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from './ui/field'
import { Input } from './ui/input'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { language } = useLanguage()
  const colors = useThemeColors()
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    console.log('🚀 LoginForm - Iniciando login con:', { email, password: '***' })
    
    try {
      await login(email, password)
      console.log('✅ LoginForm - Login completado exitosamente')
      
      // Pequeño delay para asegurar que el estado se actualice
      setTimeout(() => {
        console.log('🎯 LoginForm - Navegando al dashboard...')
        navigate('/dashboard')
      }, 100)
      
    } catch (error) {
      console.error('❌ LoginForm - Error en login:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      alert(language === 'es' ? `Error: ${errorMessage}` : `Error: ${errorMessage}`)
    } finally {
      setIsLoading(false)
      console.log('🏁 LoginForm - Proceso de login finalizado')
    }
  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card 
        className={cn(
          "overflow-hidden p-0",
          isMobile ? "border-0 rounded-2xl shadow-2xl bg-white/90" : "border shadow-2xl"
        )}
        style={
          isMobile
            ? {
                backgroundColor: "rgba(255,255,255,0.9)",
                boxShadow:
                  "6px 6px 20px rgba(15,23,42,0.08), -6px -6px 16px rgba(255,255,255,0.85)",
              }
            : {
                borderColor: colors.cardBorder,
                backgroundColor: colors.foreground,
                boxShadow: colors.cardShadow,
              }
        }
      >
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className={cn(isMobile ? "p-12" : "p-8 md:p-10")}> 
            <FieldGroup>
              {/* Logo y Header */}
              <div className="flex flex-col items-center gap-4 text-center mb-8">
                <div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                  style={
                    isMobile
                      ? {
                          background:
                            "linear-gradient(145deg, #F6FBFF 0%, #FFFFFF 100%)",
                          boxShadow:
                            "6px 6px 12px rgba(15,23,42,0.06), -6px -6px 12px rgba(255,255,255,0.9)",
                        }
                      : {
                          background: `linear-gradient(135deg, #1b1b1b 0%, #262626 100%)`,
                          boxShadow: `0 10px 15px -3px rgba(0,0,0,0.5)`
                        }
                  }
                >
                  <LynxLogo size={32} />
                </div>
                <div>
                  <h1 
                    className={cn(
                      "mb-2 font-semibold",
                      isMobile ? "text-[32px] leading-tight text-slate-800" : "text-3xl"
                    )}
                    style={!isMobile ? { color: colors.textPrimary } : undefined}
                  >
                    {language === 'es' ? 'Bienvenido de vuelta' : 'Welcome back'}
                  </h1>
                  <p 
                    className={cn(isMobile ? "text-sm text-slate-500" : "text-lg")}
                    style={!isMobile ? { color: colors.textSecondary } : undefined}
                  >
                    {language === 'es' 
                      ? 'Accede a tu cuenta de WorkEz' 
                      : 'Login to your WorkEz account'
                    }
                  </p>
                </div>
              </div>

              {/* Campo Email */}
              <Field>
                <FieldLabel 
                  htmlFor="email" 
                  className="text-sm font-medium"
                  style={{ color: colors.textPrimary }}
                >
                  {language === 'es' ? 'Correo electrónico' : 'Email'}
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder={language === 'es' ? 'tu@ejemplo.com' : 'm@example.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={cn(
                    "mt-1 transition-all duration-300",
                    isMobile ? "bg-white/60 backdrop-blur-sm border-0 border-b-2 border-slate-300 rounded-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:border-sky-500 placeholder:text-slate-400" : ""
                  )}
                  style={
                    isMobile
                      ? undefined
                      : {
                          backgroundColor: colors.background,
                          borderColor: colors.border,
                          color: colors.textPrimary,
                        }
                  }
                />
              </Field>

              {/* Campo Password */}
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel 
                    htmlFor="password"
                    className="text-sm font-medium"
                    style={{ color: colors.textPrimary }}
                  >
                    {language === 'es' ? 'Contraseña' : 'Password'}
                  </FieldLabel>
                  <a
                    href="#"
                    className="text-sm underline-offset-2 hover:underline transition-colors duration-300"
                    style={{ color: colors.textSecondary }}
                    onClick={(e) => {
                      e.preventDefault()
                      alert(language === 'es' 
                        ? 'Recuperación de contraseña próximamente...' 
                        : 'Password recovery coming soon...'
                      )
                    }}
                  >
                    {language === 'es' ? '¿Olvidaste tu contraseña?' : 'Forgot your password?'}
                  </a>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    className={cn(
                      "mt-1 pr-10 transition-all duration-300",
                      isMobile ? "bg-white/60 backdrop-blur-sm border-0 border-b-2 border-slate-300 rounded-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:border-sky-500 placeholder:text-slate-400" : ""
                    )}
                    style={
                      isMobile
                        ? undefined
                        : {
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                            color: colors.textPrimary,
                          }
                    }
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? (language === 'es' ? 'Ocultar contraseña' : 'Hide password') : (language === 'es' ? 'Mostrar contraseña' : 'Show password')}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 px-3 py-2 text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M3 3l18 18" strokeLinecap="round" strokeLinejoin="round"/><path d="M10.58 10.58a2 2 0 102.83 2.83"/><path d="M16.68 16.68A10.94 10.94 0 0112 18c-5 0-9-4-9-6a10.94 10.94 0 013.22-4.79"/><path d="M14.12 9.88A3 3 0 009.88 14.12"/><path d="M17.94 13.12A10.94 10.94 0 0021 12c0-2-4-6-9-6a10.94 10.94 0 00-3.17.46"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </Field>

              {/* Botón Login */}
              <Field>
                <Button 
                  type="submit" 
                  className={cn(
                    "w-full font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg",
                    isMobile ? "text-white hover:-translate-y-0.5" : "text-white hover:scale-105"
                  )}
                  disabled={isLoading}
                  style={{
                    background: (colors.isDark
                      ? "linear-gradient(180deg, #2563EB 0%, #1D4ED8 100%)"
                      : "linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)"),
                    boxShadow: "0 14px 30px rgba(37, 99, 235, 0.35)"
                  }}
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.background = `linear-gradient(135deg, #2a2a2a 0%, #333333 100%)`
                      e.currentTarget.style.boxShadow = `0 15px 20px -3px rgba(0,0,0,0.6)`
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.background = `linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)`
                      e.currentTarget.style.boxShadow = `0 10px 15px -3px rgba(0,0,0,0.5)`
                    }
                  }}
                >
                  {isLoading 
                    ? (language === 'es' ? 'Iniciando sesión...' : 'Logging in...') 
                    : (language === 'es' ? 'Iniciar Sesión' : 'Login')
                  }
                </Button>
              </Field>

              {/* Link de registro */}
              <FieldDescription className="text-center mt-6">
                <span style={{ color: colors.textSecondary }}>
                  {language === 'es' ? '¿No tienes una cuenta?' : "Don't have an account?"}{' '}
                </span>
                <a 
                  href="#" 
                  className="underline font-medium transition-colors duration-300"
                  style={{ color: colors.textSecondary }}
                  onClick={(e) => {
                    e.preventDefault()
                    alert(language === 'es' ? 'Registro próximamente...' : 'Sign up coming soon...')
                  }}
                >
                  {language === 'es' ? 'Regístrate' : 'Sign up'}
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>

          {/* Panel lateral con logo grande */}
          <div 
            className="relative hidden md:block"
            style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)`
            }}
          >
            <div className="absolute inset-0 h-full w-full flex items-center justify-center">
              <div className="text-center">
                <div 
                  className="w-32 h-32 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, #1b1b1b 0%, #262626 100%)`,
                    boxShadow: `0 25px 50px -12px rgba(0,0,0,0.6)`
                  }}
                >
                  <LynxLogo size={64} />
                </div>
                <h3 
                  className="text-4xl font-bold mb-3"
                  style={{ color: colors.textPrimary }}
                >
                  WorkEz
                </h3>
                <p 
                  className="text-xl font-light"
                  style={{ color: colors.textSecondary }}
                >
                  {language === 'es' ? 'Tu futuro digital' : 'Your digital future'}
                </p>
                <div className="mt-8 space-y-2 text-sm" style={{ color: colors.textTertiary }}>
                  <p>{language === 'es' ? 'Soluciones innovadoras' : 'Innovative solutions'}</p>
                  <p>{language === 'es' ? 'Tecnología de vanguardia' : 'Cutting-edge technology'}</p>
                  <p>{language === 'es' ? 'Seguridad garantizada' : 'Guaranteed security'}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <FieldDescription className="px-6 text-center text-xs" style={{ color: colors.textTertiary }}>
        {language === 'es' ? 'Al continuar, aceptas nuestros' : 'By clicking continue, you agree to our'}{' '}
        <a href="#" className="underline" style={{ color: colors.textSecondary }}>
          {language === 'es' ? 'Términos de Servicio' : 'Terms of Service'}
        </a>{' '}
        {language === 'es' ? 'y' : 'and'}{' '}
        <a href="#" className="underline" style={{ color: colors.textSecondary }}>
          {language === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}
        </a>.
      </FieldDescription>
    </div>
  )
}





