import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { AnimatedThemeToggler } from './ui/AnimatedThemeToggler'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import { LynxLogo } from './ui/LynxLogo'
import { AnimatedText } from './AnimatedText'
import { getActiveSection } from '../utils/scrollUtils'
import { useThemeColors } from '../hooks/useThemeColors'

interface HeaderProps {
  onMenuClick?: () => void
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { isDark } = useTheme()
  const { language, setLanguage } = useLanguage()
  const { user, isAuthenticated, logout } = useAuth()
  const colors = useThemeColors()
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  const [activeSection, setActiveSection] = useState('inicio')

  // Funciones para manejar el hover con delay
  const handleLanguageMenuEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    setShowLanguageMenu(true)
  }

  const handleLanguageMenuLeave = () => {
    const timeout = setTimeout(() => {
      setShowLanguageMenu(false)
    }, 300) // Delay de 300ms antes de cerrar
    setHoverTimeout(timeout)
  }

  useEffect(() => {
    // Activar animación de entrada después de un pequeño delay
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 200)
    
    return () => {
      clearTimeout(timer)
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
      }
    }
  }, [])



  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY
        
        // Mostrar header si está en el top o scrolleando hacia arriba
        if (currentScrollY < lastScrollY || currentScrollY < 100) {
          setIsVisible(true)
        } else {
          // Ocultar header al scrollear hacia abajo
          setIsVisible(false)
        }
        
        setLastScrollY(currentScrollY)
        
        // Detectar sección activa con throttling - solo las secciones que tienen botones de navegación
        const sections = ['inicio', 'servicios', 'nosotros', 'faq', 'contacto']
        const active = getActiveSection(sections)
        
        // Sin mapeo - usar directamente la sección detectada
        const navigationActive = active
        
        if (navigationActive !== activeSection) {
          console.log('🚀 Header: Section changed from', activeSection, 'to', navigationActive, 'at scroll position', Math.round(currentScrollY))
          setActiveSection(navigationActive)
        }
      }
    }

    // Throttle scroll events para mejor performance
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          controlNavbar()
          ticking = false
        })
        ticking = true
      }
    }

    // Ejecutar una vez al cargar
    controlNavbar()

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true })
      
      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [lastScrollY, activeSection])

  // Establecer sección inicial cuando el componente se monta
  useEffect(() => {
    setActiveSection('inicio')
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 px-6 py-8 transition-all duration-500 ease-out ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    } ${
      isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-16'
    }`}>
      {/* Contenedor flotante con glassmorphism y animaciones mejoradas */}
      <div className="max-w-[1400px] mx-auto">
        <div 
          className={`bg-white/40 dark:bg-black/40 backdrop-blur-3xl border-2 rounded-3xl shadow-2xl px-16 py-8 transition-all duration-1000 ease-out transform hover:scale-105 ${
            isLoaded ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-12'
          }`}
          style={{
            borderColor: colors.cardBorder,
            boxShadow: colors.cardShadow,
            transition: 'all 1000ms ease-out, border-color 500ms ease, box-shadow 300ms ease'
          }}>
          <div className="flex justify-between items-center w-full">
            {/* Sección izquierda: Logo + Navegación */}
            <div className="flex items-center space-x-16">
              {/* Logo con animación mejorada */}
              <div className={`flex items-center space-x-6 transition-all duration-1000 ease-out transform ${
                isLoaded ? 'translate-x-0 opacity-100 scale-100' : '-translate-x-16 opacity-0 scale-75'
              }`} style={{transitionDelay: '200ms'}}>
                <div className={`transition-all duration-500 transform ${
                  isLoaded ? 'rotate-0' : '-rotate-45'
                }`} style={{transitionDelay: '300ms'}}>
                  <LynxLogo size={36} className="flex-shrink-0 hover:scale-110 transition-transform duration-300" />
                </div>
                <div 
                  className={`text-2xl font-bold transition-all duration-800 transform ${
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`} 
                  style={{
                    transitionDelay: '400ms',
                    color: isDark ? '#ffffff' : '#181E19',
                    fontWeight: 'bold'
                  }}
                >
                  WorkEz
                </div>

              </div>

              {/* Navigation sin glassmorphism excesivo */}
              <nav className={`hidden lg:flex items-center space-x-8 transition-all duration-1000 ease-out transform ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{transitionDelay: '700ms'}}>
                <a 
                  href="#inicio" 
                  onClick={(e) => {
                    e.preventDefault()
                    console.log('HOME BUTTON CLICKED')
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className={`relative transition-all duration-300 font-semibold px-3 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 group text-center min-w-[70px] ${
                    activeSection === 'inicio' 
                      ? 'bg-white/20 dark:bg-white/10' 
                      : 'hover:bg-white/30 dark:hover:bg-white/15'
                  } ${
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`} 
                  style={{
                    transitionDelay: '800ms',
                    color: isDark ? '#ffffff' : colors.textPrimary
                  }}
                >
                  <AnimatedText translationKey="home" />
                  <div 
                    className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 transition-all duration-300 rounded-full ${
                      activeSection === 'inicio' ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                    style={{backgroundColor: 'currentColor'}}
                  ></div>
                </a>
                <a 
                  href="#servicios" 
                  onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('SERVICES BUTTON CLICKED - DEBUGGING')
                  
                  setTimeout(() => {
                    const serviciosElement = document.getElementById('servicios')
                    console.log('Servicios element found:', serviciosElement)
                    
                    if (serviciosElement) {
                    serviciosElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    window.scrollBy({ top: -120, left: 0, behavior: 'smooth' })
                    } else {
                    console.error('Servicios element not found! Available elements:', 
                      ['inicio', 'servicios', 'nosotros', 'faq', 'contacto'].map(id => ({
                      id, exists: !!document.getElementById(id)
                      }))
                    )
                    }
                  }, 100)
                  }}
                  className={`relative transition-all duration-300 font-semibold px-3 py-2 rounded-lg hover:bg-white/20 group text-center min-w-[80px] ${
                  activeSection === 'servicios' 
                    ? 'bg-white/20' 
                    : 'hover:bg-white/30'
                  } ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`} 
                  style={{
                    transitionDelay: '900ms',
                    color: isDark ? '#ffffff' : colors.textPrimary
                  }}
                >
                  <AnimatedText translationKey="services" />
                  <div 
                    className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 transition-all duration-300 rounded-full ${
                      activeSection === 'servicios' ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                    style={{backgroundColor: 'currentColor'}}
                  ></div>
                </a>
                <a 
                  href="#nosotros" 
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('NOSOTROS BUTTON CLICKED - DEBUGGING')
                    
                    setTimeout(() => {
                      const element = document.getElementById('nosotros')
                      console.log('Nosotros element found:', element)
                      
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        window.scrollBy({ top: -120, left: 0, behavior: 'smooth' })
                      }
                    }, 100)
                  }}
                  className={`relative transition-all duration-300 font-semibold px-3 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 group text-center min-w-[80px] ${
                    activeSection === 'nosotros' 
                      ? 'bg-white/20 dark:bg-white/10' 
                      : 'hover:bg-white/30 dark:hover:bg-white/15'
                  } ${
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`} 
                  style={{
                    transitionDelay: '1000ms',
                    color: isDark ? '#ffffff' : colors.textPrimary
                  }}
                >
                  <AnimatedText translationKey="about" />
                  <div 
                    className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 transition-all duration-300 rounded-full ${
                      activeSection === 'nosotros' ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                    style={{backgroundColor: 'currentColor'}}
                  ></div>
                </a>
                <a 
                  href="#faq" 
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('FAQ BUTTON CLICKED - DEBUGGING')
                    
                    setTimeout(() => {
                      const element = document.getElementById('faq')
                      console.log('FAQ element found:', element)
                      
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        window.scrollBy({ top: -120, left: 0, behavior: 'smooth' })
                      }
                    }, 100)
                  }}
                  className={`relative transition-all duration-300 font-semibold px-3 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 group text-center min-w-[80px] ${
                    activeSection === 'faq' 
                      ? 'bg-white/20 dark:bg-white/10' 
                      : 'hover:bg-white/30 dark:hover:bg-white/15'
                  } ${
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`} 
                  style={{
                    transitionDelay: '1100ms',
                    color: isDark ? '#ffffff' : colors.textPrimary
                  }}
                >
                  FAQ
                  <div 
                    className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 transition-all duration-300 rounded-full ${
                      activeSection === 'faq' ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                    style={{backgroundColor: 'currentColor'}}
                  ></div>
                </a>
                <a 
                  href="#contacto" 
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('CONTACTO BUTTON CLICKED - DEBUGGING')
                    
                    setTimeout(() => {
                      const element = document.getElementById('contacto')
                      console.log('Contacto element found:', element)
                      
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        window.scrollBy({ top: -120, left: 0, behavior: 'smooth' })
                      }
                    }, 100)
                  }}
                  className={`relative transition-all duration-300 font-semibold px-3 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 group text-center min-w-[80px] ${
                    activeSection === 'contacto' 
                      ? 'bg-white/20 dark:bg-white/10' 
                      : 'hover:bg-white/30 dark:hover:bg-white/15'
                  } ${
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`} 
                  style={{
                    transitionDelay: '1200ms',
                    color: isDark ? '#ffffff' : colors.textPrimary
                  }}
                >
                  <AnimatedText translationKey="contact" />
                  <div 
                    className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 transition-all duration-300 rounded-full ${
                      activeSection === 'contacto' ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                    style={{backgroundColor: 'currentColor'}}
                  ></div>
                </a>
              </nav>
            </div>

            {/* Sección derecha: Controles y Botones separados */}
            <div className="flex items-center space-x-8">
              {/* Controles de idioma y tema */}
              <div className={`flex items-center space-x-6 transition-all duration-800 ease-out transform ${
                isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
              }`} style={{transitionDelay: '1300ms'}}>
                {/* Selector de idioma con hover mejorado */}
                <div 
                  className="relative language-selector group"
                  onMouseEnter={handleLanguageMenuEnter}
                  onMouseLeave={handleLanguageMenuLeave}
                >
                  <button 
                    className="flex items-center justify-center space-x-2 bg-white/40 dark:bg-white/10 backdrop-blur-xl rounded-lg px-4 py-2.5 border-2 group-hover:bg-white/60 dark:group-hover:bg-white/20 transition-all duration-300 w-[85px]"
                    style={{borderColor: isDark ? '#ffffff60' : colors.cardBorder}}
                  >
                    <span className="text-sm font-semibold" style={{color: isDark ? '#ffffff' : colors.textPrimary}}>
                      {language === 'en' ? 'EN' : 'ES'}
                    </span>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-300 ${
                        showLanguageMenu ? 'rotate-180' : 'rotate-0'
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      style={{color: isDark ? '#ffffff' : colors.textPrimary}}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Menú desplegable con animación */}
                  <div 
                    className={`absolute top-full mt-2 right-0 bg-white dark:bg-black backdrop-blur-xl rounded-lg border shadow-xl min-w-[120px] z-50 transition-all duration-300 origin-top ${
                      showLanguageMenu 
                        ? 'opacity-100 scale-y-100 translate-y-0' 
                        : 'opacity-0 scale-y-0 -translate-y-2 pointer-events-none'
                    }`}
                    style={{borderColor: colors.cardBorder, boxShadow: colors.cardShadow}}
                  >
                    <button
                      onClick={() => {
                        setLanguage('en')
                        setShowLanguageMenu(false)
                      }}
                      className={`w-full text-left px-4 py-3 text-sm font-medium transition-all duration-200 first:rounded-t-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 ${
                        language === 'en' ? 'font-semibold' : ''
                      }`}
                      style={{color: language === 'en' ? colors.textPrimary : colors.textPrimary}}
                    >
                      English
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('es')
                        setShowLanguageMenu(false)
                      }}
                      className={`w-full text-left px-4 py-3 text-sm font-medium transition-all duration-200 last:rounded-b-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 ${
                        language === 'es' ? 'font-semibold' : ''
                      }`}
                      style={{color: language === 'es' ? colors.textPrimary : colors.textPrimary}}
                    >
                      Español
                    </button>
                  </div>
                </div>

                {/* Theme Toggle with animated view transition */}
                <AnimatedThemeToggler
                  className="p-2.5 rounded-lg bg-white/40 dark:bg-white/10 backdrop-blur-xl border-2 hover:bg-white/60 dark:hover:bg-white/20 transition-all duration-300 w-[44px] h-[44px] flex items-center justify-center"
                  aria-label="Toggle theme"
                  style={{borderColor: isDark ? '#ffffff60' : colors.cardBorder, color: isDark ? '#ffffff' : colors.textPrimary}}
                />
              </div>

              {/* Separador con más espacio */}
              <div className={`w-px h-8 bg-gray-300 dark:bg-gray-600 transition-all duration-700 ease-out transform mx-2 ${
                isLoaded ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
              }`} style={{transitionDelay: '1400ms'}}></div>

              {/* Botón de acción único - Login/Perfil */}
              <div className={`transition-all duration-800 ease-out transform ${
                isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-16 opacity-0'
              }`} style={{transitionDelay: '1500ms'}}>
                {isAuthenticated ? (
                  // Usuario autenticado - mostrar menú de perfil
                  <div className="relative group">
                    <button 
                      className="flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-white transition-all duration-300 shadow-lg whitespace-nowrap"
                      style={{
                        background: 'linear-gradient(135deg, #1b1f1d 0%, #0f1412 100%)',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.35)'
                      }}
                      onMouseEnter={(e) => {
                         e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.5)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                         e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.35)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-sm font-bold">
                          {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="hidden md:inline">
                        {user?.name || user?.email?.split('@')[0]}
                      </span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Menú desplegable */}
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-900 dark:text-white font-medium">
                          {user?.name || 'Usuario'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user?.email}
                        </p>
                      </div>
                      <div className="py-2">
                        <button
                          onClick={() => navigate('/dashboard')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          {language === 'es' ? 'Dashboard' : 'Dashboard'}
                        </button>
                        <button
                          onClick={() => {
                            logout()
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          {language === 'es' ? 'Cerrar Sesión' : 'Sign Out'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Usuario no autenticado - mostrar botón de login
                  <button 
                    onClick={() => navigate('/login')}
                    className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 shadow-lg whitespace-nowrap min-w-[100px] text-center"
                    style={{
                      background: 'linear-gradient(135deg, #1b1f1d 0%, #0f1412 100%)',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.35)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.5)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.35)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <AnimatedText translationKey="signIn" />
                  </button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={onMenuClick}
                className={`lg:hidden p-2.5 rounded-lg bg-white/30 dark:bg-black/30 backdrop-blur-xl border hover:bg-white/40 transition-all duration-300 w-[44px] h-[44px] flex items-center justify-center ${ 
                  isLoaded ? 'opacity-100' : 'opacity-0'
                }`} 
                style={{
                  transitionDelay: '1600ms',
                  borderColor: colors.cardBorder,
                  color: isDark ? '#ffffff' : colors.textPrimary
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
