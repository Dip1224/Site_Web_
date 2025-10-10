import { useNavigate } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm'
import { Meteors } from '../components/ui/meteors'
import { useThemeColors } from '../hooks/useThemeColors'
import { useLanguage } from '../contexts/LanguageContext'

export default function LoginPage() {
  const colors = useThemeColors()
  const { language } = useLanguage()
  const navigate = useNavigate()
  
  return (
    <div 
      className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10 relative overflow-hidden"
      style={{
        background: colors.mainBackground
      }}
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Círculos decorativos */}
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10"
          style={{ backgroundColor: colors.primaryGreen }}
        ></div>
        <div 
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-5"
          style={{ backgroundColor: colors.accentGreen }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full opacity-10"
          style={{ backgroundColor: colors.lightGreen }}
        ></div>
        <div 
          className="absolute top-1/4 right-1/3 w-24 h-24 rounded-full opacity-5"
          style={{ backgroundColor: colors.primaryGreen }}
        ></div>
        
        {/* Meteoros animados */}
        <Meteors 
          number={25} 
          minDelay={1}
          maxDelay={4}
          minDuration={3}
          maxDuration={7}
          angle={210}
          className="opacity-40 dark:opacity-60"
        />
      </div>

      {/* Grid de fondo tech */}
      <div className="absolute inset-0 opacity-5 dark:opacity-3">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${colors.gridColor} 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}
        ></div>
      </div>

      {/* Botón de volver al home */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 transition-all duration-300 z-20 px-4 py-2 rounded-lg backdrop-blur-sm"
        style={{
          color: colors.textPrimary,
          backgroundColor: `${colors.foreground}80`,
          border: `1px solid ${colors.border}`
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = `${colors.primaryGreen}20`
          e.currentTarget.style.borderColor = colors.primaryGreen
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = `${colors.foreground}80`
          e.currentTarget.style.borderColor = colors.border
        }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-medium">
          {language === 'es' ? 'Volver al Inicio' : 'Back to Home'}
        </span>
      </button>
      
      <div className="relative z-10 w-full max-w-sm md:max-w-5xl">
        <LoginForm />
      </div>
    </div>
  )
}