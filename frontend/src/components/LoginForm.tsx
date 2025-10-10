import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useThemeColors } from '../hooks/useThemeColors'
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
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { language } = useLanguage()
  const colors = useThemeColors()
  const navigate = useNavigate()

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
        className="overflow-hidden p-0 border shadow-2xl"
        style={{
          borderColor: colors.cardBorder,
          backgroundColor: colors.foreground,
          boxShadow: colors.cardShadow
        }}
      >
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-8 md:p-10">
            <FieldGroup>
              {/* Logo y Header */}
              <div className="flex flex-col items-center gap-4 text-center mb-8">
                <div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primaryGreen} 0%, ${colors.accentGreen} 100%)`,
                    boxShadow: `0 10px 15px -3px ${colors.primaryGreen}50`
                  }}
                >
                  <LynxLogo size={32} />
                </div>
                <div>
                  <h1 
                    className="text-3xl font-bold mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    {language === 'es' ? 'Bienvenido de vuelta' : 'Welcome back'}
                  </h1>
                  <p 
                    className="text-lg"
                    style={{ color: colors.textSecondary }}
                  >
                    {language === 'es' 
                      ? 'Accede a tu cuenta de LynxTech' 
                      : 'Login to your LynxTech account'
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
                  className="mt-1 transition-all duration-300"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.textPrimary
                  }}
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
                    style={{ color: colors.primaryGreen }}
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
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="mt-1 transition-all duration-300"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.textPrimary
                  }}
                />
              </Field>

              {/* Botón Login */}
              <Field>
                <Button 
                  type="submit" 
                  className="w-full text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg" 
                  disabled={isLoading}
                  style={{
                    background: `linear-gradient(135deg, ${colors.primaryGreen} 0%, ${colors.accentGreen} 100%)`,
                    boxShadow: `0 10px 15px -3px ${colors.primaryGreen}40`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${colors.darkGreen} 0%, ${colors.primaryGreen} 100%)`
                    e.currentTarget.style.boxShadow = `0 15px 20px -3px ${colors.primaryGreen}60`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${colors.primaryGreen} 0%, ${colors.accentGreen} 100%)`
                    e.currentTarget.style.boxShadow = `0 10px 15px -3px ${colors.primaryGreen}40`
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
                  style={{ color: colors.primaryGreen }}
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
              background: `linear-gradient(135deg, ${colors.primaryGreen}15 0%, ${colors.accentGreen}10 100%)`
            }}
          >
            <div className="absolute inset-0 h-full w-full flex items-center justify-center">
              <div className="text-center">
                <div 
                  className="w-32 h-32 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primaryGreen} 0%, ${colors.accentGreen} 100%)`,
                    boxShadow: `0 25px 50px -12px ${colors.primaryGreen}50`
                  }}
                >
                  <LynxLogo size={64} />
                </div>
                <h3 
                  className="text-4xl font-bold mb-3"
                  style={{ color: colors.textPrimary }}
                >
                  LynxTech
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
        <a href="#" className="underline" style={{ color: colors.primaryGreen }}>
          {language === 'es' ? 'Términos de Servicio' : 'Terms of Service'}
        </a>{' '}
        {language === 'es' ? 'y' : 'and'}{' '}
        <a href="#" className="underline" style={{ color: colors.primaryGreen }}>
          {language === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}
        </a>.
      </FieldDescription>
    </div>
  )
}