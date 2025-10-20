import React from 'react'
import { useTheme } from './contexts/ThemeContext'
import { useLanguage } from './contexts/LanguageContext'
import { useThemeColors } from './hooks/useThemeColors'
import { Header } from './components/Header'
import { AnimatedComponent } from './components/AnimatedComponent'
import { AnimatedText } from './components/AnimatedText'
import { GlowingEffect } from './components/GlowingEffect'
import { LynxLogo } from './components/ui/LynxLogo'
import { Particles } from '@/components/ui/particles'
import { SmoothCursor } from '@/components/ui/smooth-cursor'
import { useIsMobile } from './hooks/use-mobile'
import { CometCard } from './components/CometCard'
import CardFlip from './components/CardFlip'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/ui/accordion'

const minimalStyles = `
  @keyframes scale {
    0%, 100% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1);
      opacity: 0.5;
    }
  }
  
  .smooth-scroll-button {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .card-flip-container {
    perspective: 1000px;
  }
  
  .card-flip-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }
  
  .card-flip-container:hover .card-flip-inner {
    transform: rotateY(180deg);
  }
  
  .card-flip-front, .card-flip-back {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    border-radius: 1rem;
  }
  
  .card-flip-back {
    transform: rotateY(180deg);
  }
`

function App() {
  const { isDark } = useTheme()
  const { t, language } = useLanguage()
  const colors = useThemeColors()
  const isMobile = useIsMobile()
  
  // DEBUG deshabilitado para producciÃ³n

  // Opcional: Redirigir a dashboard si el usuario ya estÃ¡ autenticado
  // Comentado para permitir ver la landing page

  // FunciÃ³n de scroll suave personalizada con easing avanzado
  const smoothScrollTo = (elementId: string, offset: number = 120) => {
    const element = document.getElementById(elementId)
    if (!element) return

    const targetPosition = element.offsetTop - offset
    const startPosition = window.pageYOffset
    const distance = targetPosition - startPosition
    const duration = Math.min(Math.max(Math.abs(distance) / 2, 800), 2000) // DuraciÃ³n dinÃ¡mica entre 800ms y 2s
    
    let start: number | null = null

    // FunciÃ³n de easing personalizada (easeInOutCubic)
    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    }

    const animation = (currentTime: number) => {
      if (start === null) start = currentTime
      const timeElapsed = currentTime - start
      const progress = Math.min(timeElapsed / duration, 1)
      const ease = easeInOutCubic(progress)
      
      window.scrollTo(0, startPosition + distance * ease)
      
      if (progress < 1) {
        requestAnimationFrame(animation)
      }
    }

    requestAnimationFrame(animation)
  }

  // FunciÃ³n para agregar efecto de pulso al hacer click
  const addClickPulse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget
    button.style.transform = 'scale(0.95)'
    setTimeout(() => {
      button.style.transform = 'scale(1.05)'
      setTimeout(() => {
        button.style.transform = 'scale(1)'
      }, 150)
    }, 100)
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: minimalStyles }} />
      

      <div 
        className="min-h-screen relative overflow-hidden transition-all duration-700 ease-in-out"
        style={{
          background: colors.mainBackground,
          color: colors.textPrimary,
          transition: 'background 700ms ease-in-out, color 700ms ease-in-out'
        }}
      >
        {/* Efectos de fondo futurista con verde suave */}
        {/* overlay eliminado */}
        
        {/* Stars background removed as requested */}
        
        {/* Interactive Particles Background (disabled on mobile) */}
        {!isMobile && (
          <Particles
            className="absolute inset-0 z-[5]"
            quantity={120}
            staticity={50}
            ease={60}
            size={0.8}
            color={isDark ? '#FFFFFF' : '#111111'}
          />
        )}
        
        {/* Grid de fondo tech con verde suave */}
        {/* grid eliminado */}
        

        
        {/* PartÃ­culas pequeÃ±as con nueva paleta */}
        {/* pings eliminados */}
        
        <div className="relative z-10">
          <Header />

          {/* Espaciado para el header flotante mÃ¡s grande */}
          <div className="pt-28 sm:pt-40"></div>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
            {/* Main section with entrance animation */}
            <section id="home" className="min-h-screen flex items-center justify-center -mt-10 sm:-mt-20">
              <AnimatedComponent animation="fadeInUp" className="text-center mb-16 relative max-w-6xl mx-auto">
                <div className="absolute inset-0 backdrop-blur-3xl rounded-3xl border shadow-2xl" style={{
                  backgroundColor: colors.panelBg,
                  borderColor: colors.cardBorder, 
                  boxShadow: colors.cardShadow
                }}></div>
                
                {/* Glowing Effect */}
                <GlowingEffect
                  spread={60}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  variant="default"
                  borderWidth={4}
                  className="rounded-3xl"
                />
                
                <div className="relative z-10 p-6 md:p-12 rounded-3xl">
                  {/* Logo and brand, more prominent */}
                  <AnimatedComponent animation="fadeInUp" trigger="scroll" delay={100}>
                    <div className="mb-8">
                      <div className="flex justify-center items-center mb-6 relative">
                        <div className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg mr-6" style={{
                          background: 'linear-gradient(135deg, #1b1f1d 0%, #0f1412 100%)',
                          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.35)'
                        }}>
                          <LynxLogo size={48} />
                        </div>
                        <div className="text-left">
                          <h1 className="text-3xl md:text-4xl font-bold" style={{color: isDark ? '#fff' : '#181e19'}}>WorkEz</h1>
                        </div>
                      </div>
                    </div>
                  </AnimatedComponent>

                  {/* TÃ­tulo principal con efecto shimmer */}
                  <AnimatedComponent animation="fadeInUp" trigger="scroll" delay={300}>
                    <div className="mb-8">
                      <h1 
                        className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-center"
                        style={{ 
                          color: colors.textPrimary,
                          textShadow: isDark ? '0 2px 10px rgba(0,0,0,0.5)' : '0 2px 10px rgba(0,0,0,0.1)'
                        }}
                      >
                        {t('mainTitle')}
                      </h1>
                    </div>
                  </AnimatedComponent>
                  
                  <AnimatedComponent animation="fadeInUp" trigger="scroll" delay={500}>
                  <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed font-light text-center" style={{ color: colors.textSecondary }}>
                    {t('subtitle')}
                  </p>
                  </AnimatedComponent>
                  
                  {/* Botones principales actualizados */}
                  <AnimatedComponent animation="scaleIn" trigger="scroll" delay={900}>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    {/* BotÃ³n principal - Ver membresÃ­as */}
                    <button 
                      onClick={(e) => {
                        console.log('Button clicked, scrolling to servicios')
                        addClickPulse(e)
                        setTimeout(() => smoothScrollTo('servicios', 100), 200)
                      }}
                      className="group relative text-white px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:scale-105 border overflow-hidden transform smooth-scroll-button"
                      style={{
                        background: 'linear-gradient(to right, #1b1f1d, #0f1412)',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                        borderColor: '#1b1f1d'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(to right, #1b1f1d, #0f1412)'
                        e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0,0,0,0.6)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(to right, #1b1f1d, #0f1412)'
                        e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0,0,0,0.5)'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10 flex items-center gap-3">
                        {t('ctaButton')}
                        <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </button>

                    {/* BotÃ³n secundario - Hablar con asesor */}
                    <button 
                      onClick={(e) => {
                        addClickPulse(e)
                        setTimeout(() => smoothScrollTo('contacto', 80), 200)
                      }}
                      className="group relative px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 border-2 overflow-hidden transform text-white smooth-scroll-button"
                      style={{
                        borderColor: colors.cardBorder,
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0,0,0,0.08)'
                        e.currentTarget.style.borderColor = colors.cardBorder
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                        e.currentTarget.style.borderColor = colors.cardBorder
                      }}
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {t('contactUs')}
                      </span>
                    </button>
                  </div>
                  </AnimatedComponent>
                </div>
              </AnimatedComponent>
            </section>

            {/* SecciÃ³n de Servicios - Nuestras Soluciones Digitales */}
            <AnimatedComponent animation="slideInLeft" trigger="scroll" delay={200}>
            <section id="servicios" className="py-12 md:py-24" style={{background: `linear-gradient(to bottom, ${colors.background}20, transparent)`}}>
                <div className="max-w-7xl mx-auto px-6 relative">
                  <div className="absolute inset-0 backdrop-blur-3xl rounded-3xl border shadow-2xl" style={{
                    backgroundColor: colors.panelBg,
                    borderColor: colors.cardBorder, 
                    boxShadow: colors.cardShadow
                  }}></div>
                  
                  {/* Glowing Effect */}
                  <GlowingEffect
                    spread={60}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                    variant="default"
                    borderWidth={4}
                    className="rounded-3xl"
                  />

                  <div className="relative z-10 p-6 md:p-12 rounded-3xl">
                    <div className="text-center mb-20">
                      <h2 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: colors.textPrimary }}>
                        {t('servicesTitle')}
                      </h2>
                      <p className="text-xl md:text-2xl font-light max-w-4xl mx-auto" style={{ color: colors.textSecondary }}>
                        {t('servicesSubtitle')}
                      </p>
                    </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16">
                  {/* Web Development Service */}
                  <AnimatedComponent animation="fadeInUp" trigger="scroll" delay={200}>
                    <CardFlip
                      title={t('webDevTitle')}
                      subtitle={t('webDevSubtitle')}
                      description={t('webDevDesc')}
                      features={[t('webDevFeature1'), t('webDevFeature2'), t('webDevFeature3'), t('webDevFeature4')]}
                    />
                  </AnimatedComponent>

                  {/* UI/UX Design Service */}
                  <AnimatedComponent animation="fadeInUp" trigger="scroll" delay={400}>
                    <CardFlip
                      title={t('designTitle')}
                      subtitle={t('designSubtitle')}
                      description={t('designDesc')}
                      features={[t('designFeature1'), t('designFeature2'), t('designFeature3'), t('designFeature4')]}
                    />
                  </AnimatedComponent>

                  {/* E-commerce Service */}
                  <AnimatedComponent animation="fadeInUp" trigger="scroll" delay={600}>
                    <CardFlip
                      title={t('ecommerceTitle')}
                      subtitle={t('ecommerceSubtitle')}
                      description={t('ecommerceDesc')}
                      features={[t('ecommerceFeature1'), t('ecommerceFeature2'), t('ecommerceFeature3'), t('ecommerceFeature4')]}
                    />
                  </AnimatedComponent>

                  {/* Tech Consulting Service */}
                  <AnimatedComponent animation="fadeInUp" trigger="scroll" delay={800}>
                    <CardFlip
                      title={t('consultingTitle')}
                      subtitle={t('consultingSubtitle')}
                      description={t('consultingDesc')}
                      features={[t('consultingFeature1'), t('consultingFeature2'), t('consultingFeature3'), t('consultingFeature4')]}
                    />
                  </AnimatedComponent>
                </div>

                  {/* Call to Action */}
                  <div className="text-center">
                    <button 
                      onClick={(e) => {
                        addClickPulse(e)
                        setTimeout(() => smoothScrollTo('contacto', 80), 200)
                      }}
                      className="text-white px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:scale-105 group smooth-scroll-button" 
                      style={{
                        background: 'linear-gradient(135deg, #1b1f1d 0%, #0f1412 100%)', 
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)'
                      }} 
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #202624 0%, #0f1412 100%)';
                        e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0,0,0,0.55)';
                      }} 
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #1b1f1d 0%, #0f1412 100%)';
                        e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0,0,0,0.4)';
                      }}
                    >
                      <span className="flex items-center gap-3">
                        Conoce nuestros planes y precios
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </button>
                  </div>
                  </div>
                </div>
              </section>
            </AnimatedComponent>

            {/* SecciÃ³n Nosotros - QuiÃ©nes Somos */}
            <AnimatedComponent animation="fadeInUp" trigger="scroll" delay={300}>
              <section id="nosotros" className="py-20" style={{background: `linear-gradient(to bottom, ${colors.background}10, transparent)`}}>
                <div className="max-w-7xl mx-auto px-6 relative">
                  <div className="absolute inset-0 backdrop-blur-3xl rounded-3xl border shadow-2xl" style={{
                    backgroundColor: colors.panelBg,
                    borderColor: colors.cardBorder, 
                    boxShadow: colors.cardShadow
                  }}></div>
                  
                  {/* Glowing Effect */}
                  <GlowingEffect
                    spread={60}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                    variant="default"
                    borderWidth={4}
                    className="rounded-3xl"
                  />

                  <div className="relative z-10 p-6 md:p-12 rounded-3xl">
                    <div className="text-center mb-16">
                      <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.textPrimary }}>
                        {t('aboutTitle')}
                      </h2>
                      <p className="text-xl font-normal max-w-3xl mx-auto" style={{ color: colors.textSecondary }}>
                        {t('aboutSubtitle')}
                      </p>
                    </div>

                    {/* DescripciÃ³n principal */}
                <div 
                  className="backdrop-blur-xl rounded-3xl p-6 md:p-12 mb-8 md:mb-16 text-center" 
                  style={{
                    backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.6)',
                    border: `1px solid ${colors.cardBorder}`
                  }}
                >
                  <p className="text-xl md:text-2xl font-light leading-relaxed" style={{ color: colors.textPrimary }}>
                    {t('aboutDesc')}
                  </p>
                </div>

                {/* Valores y Pilares con Efecto CometCard */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Confianza */}
                  <AnimatedComponent animation="fadeInUp" trigger="scroll" delay={200}>
                    <CometCard>
                      <button
                        type="button"
                        className="my-4 flex w-full cursor-pointer flex-col items-stretch rounded-[16px] border-0 backdrop-blur-xl p-4 transition-all duration-300 hover:shadow-2xl"
                        aria-label="Confianza"
                        style={{
                          transformStyle: "preserve-3d",
                          transform: "none",
                          opacity: 1,
                          backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        <div className="flex flex-col items-center text-center p-2">
                          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg"
                               style={{background: 'linear-gradient(135deg, #1b1f1d 0%, #0f1412 100%)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.35)'}}>
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Confianza</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Construimos relaciones sÃ³lidas basadas en transparencia y resultados.
                          </p>
                        </div>
                      </button>
                    </CometCard>
                  </AnimatedComponent>

                  {/* InnovaciÃ³n */}
                  <AnimatedComponent animation="fadeInUp" trigger="scroll" delay={400}>
                    <CometCard>
                      <button
                        type="button"
                        className="my-4 flex w-full cursor-pointer flex-col items-stretch rounded-[16px] border-0 backdrop-blur-xl p-4 transition-all duration-300 hover:shadow-2xl"
                        aria-label="InnovaciÃ³n"
                        style={{
                          transformStyle: "preserve-3d",
                          transform: "none",
                          opacity: 1,
                          backgroundColor: isDark ? 'hsl(var(--card) / 0.4)' : 'hsl(var(--card) / 0.8)'
                        }}
                      >
                        <div className="flex flex-col items-center text-center p-2">
                          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg"
                               style={{background: 'linear-gradient(135deg, #1b1f1d 0%, #0f1412 100%)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.35)'}}>
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-2">InnovaciÃ³n</h3>
                          <p className="text-muted-foreground text-sm">
                            Adoptamos las Ãºltimas tecnologÃ­as para ofrecer soluciones de vanguardia.
                          </p>
                        </div>
                      </button>
                    </CometCard>
                  </AnimatedComponent>

                  {/* Accesibilidad */}
                  <AnimatedComponent animation="fadeInUp" trigger="scroll" delay={600}>
                    <CometCard>
                      <button
                        type="button"
                        className="my-4 flex w-full cursor-pointer flex-col items-stretch rounded-[16px] border-0 backdrop-blur-xl p-4 transition-all duration-300 hover:shadow-2xl"
                        aria-label="Accesibilidad"
                        style={{
                          transformStyle: "preserve-3d",
                          transform: "none",
                          opacity: 1,
                          backgroundColor: isDark ? 'hsl(var(--card) / 0.4)' : 'hsl(var(--card) / 0.8)'
                        }}
                      >
                        <div className="flex flex-col items-center text-center p-2">
                          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg"
                               style={{background: 'linear-gradient(135deg, #1b1f1d 0%, #0f1412 100%)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.35)'}}>
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              {/* SÃ­mbolo universal de accesibilidad moderno */}
                              <circle cx="12" cy="6" r="2"/>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16 10c0-1-1-2-2-2h-4c-1 0-2 1-2 2v2l2 8h4l2-8v-2z"/>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l-2 2m12-2l2 2"/>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 16l-1 4m8-4l1 4"/>
                              {/* Elementos de soporte/accesibilidad */}
                              <circle cx="6" cy="8" r="1" fill="currentColor"/>
                              <circle cx="18" cy="8" r="1" fill="currentColor"/>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h16M12 2v2"/>
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-2">Accesibilidad</h3>
                          <p className="text-muted-foreground text-sm">
                            Hacemos la tecnologÃ­a premium accesible para todos los usuarios.
                          </p>
                        </div>
                      </button>
                    </CometCard>
                  </AnimatedComponent>

                  {/* Soporte personalizado */}
                  <AnimatedComponent animation="fadeInUp" trigger="scroll" delay={800}>
                    <CometCard>
                      <button
                        type="button"
                        className="my-4 flex w-full cursor-pointer flex-col items-stretch rounded-[16px] border-0 backdrop-blur-xl p-4 transition-all duration-300 hover:shadow-2xl"
                        aria-label="Soporte Personalizado"
                        style={{
                          transformStyle: "preserve-3d",
                          transform: "none",
                          opacity: 1,
                          backgroundColor: isDark ? 'hsl(var(--card) / 0.4)' : 'hsl(var(--card) / 0.8)'
                        }}
                      >
                        <div className="flex flex-col items-center text-center p-2">
                          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg"
                               style={{background: `linear-gradient(135deg, ${colors.primaryGreen} 0%, ${colors.accentGreen} 100%)`, boxShadow: `0 10px 15px -3px ${colors.primaryGreen}50`}}>
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-2">Soporte Personalizado</h3>
                          <p className="text-muted-foreground text-sm">
                            Ofrecemos atenciÃ³n individualizada para cada necesidad especÃ­fica.
                          </p>
                        </div>
                      </button>
                    </CometCard>
                  </AnimatedComponent>
                </div>

                {/* SecciÃ³n del equipo con logo */}
                <div className="mt-16 text-center">
                  <div 
                    className="backdrop-blur-xl rounded-3xl p-6 md:p-12" 
                    style={{
                      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.4)',
                      border: `1px solid ${colors.cardBorder}`
                    }}
                  >
                    <div className="flex justify-center items-center mb-6">
                      <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg mr-6" style={{background: 'linear-gradient(135deg, #1b1f1d 0%, #0f1412 100%)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.35)'}}>
                        <LynxLogo size={40} />
                      </div>
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">WorkEz Team</h3>
                        <p className="text-lg text-gray-600 dark:text-gray-400">Construyendo el futuro digital</p>
                      </div>
                    </div>
                  </div>
                </div>
                  </div>
                  </div>
              </section>
            </AnimatedComponent>

            {/* SecciÃ³n FAQ - Preguntas Frecuentes */}
            <AnimatedComponent animation="fadeInUp" trigger="scroll" delay={200}>
              <section id="faq" className="py-20" style={{background: `linear-gradient(to bottom, ${colors.background}10, transparent)`}}>
                <div className="max-w-4xl mx-auto px-6">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                      {t('faqTitle')}
                    </h2>
                    <p className="text-xl text-gray-500 dark:text-gray-400 font-normal max-w-3xl mx-auto">
                      {t('faqSubtitle')}
                    </p>
                  </div>

                  <div className="max-w-3xl mx-auto">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>{t('faqQ1')}</AccordionTrigger>
                        <AccordionContent>
                          <p>{t('faqA1')}</p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-2">
                        <AccordionTrigger>{t('faqQ2')}</AccordionTrigger>
                        <AccordionContent>
                          <p>{t('faqA2')}</p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-3">
                        <AccordionTrigger>{t('faqQ3')}</AccordionTrigger>
                        <AccordionContent>
                          <p>{t('faqA3')}</p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-4">
                        <AccordionTrigger>{t('faqQ4')}</AccordionTrigger>
                        <AccordionContent>
                          <p>{t('faqA4')}</p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-5">
                        <AccordionTrigger>{t('faqQ5')}</AccordionTrigger>
                        <AccordionContent>
                          <p>{t('faqA5')}</p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-6">
                        <AccordionTrigger>{t('faqQ6')}</AccordionTrigger>
                        <AccordionContent>
                          <p>{t('faqA6')}</p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-7">
                        <AccordionTrigger>{t('faqQ7')}</AccordionTrigger>
                        <AccordionContent>
                          <p>{t('faqA7')}</p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-8">
                        <AccordionTrigger>{t('faqQ8')}</AccordionTrigger>
                        <AccordionContent>
                          <p>{t('faqA8')}</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  {/* Call to Action */}
                  <div className="text-center mt-16">
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                      Â¿Tienes mÃ¡s preguntas? Estamos aquÃ­ para ayudarte
                    </p>
                    <button 
                      className="px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all duration-300 hover:scale-105 shadow-lg smooth-scroll-button"
                      style={{
                        background: 'linear-gradient(135deg, #1b1f1d 0%, #0f1412 100%)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.35)'
                      }}
                      onClick={(e) => {
                        addClickPulse(e)
                        setTimeout(() => smoothScrollTo('contacto', 80), 200)
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.45)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.35)';
                      }}
                    >
                      ContÃ¡ctanos ahora
                    </button>
                  </div>
                </div>
              </section>
            </AnimatedComponent>

            {/* SecciÃ³n de Sugerencias */}
            <AnimatedComponent animation="fadeInUp" trigger="scroll" delay={300}>
              <section className="py-16" style={{background: `linear-gradient(to bottom, ${colors.background}20, transparent)`}}>
                <div className="container mx-auto px-6">
                  <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.textPrimary }}>
                      <span 
                        className="bg-clip-text text-transparent bg-gradient-to-r"
                        style={{
                          background: 'linear-gradient(135deg, #1b1f1d 0%, #0f1412 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}
                      >
                        {t('suggestionsTitle')}
                      </span>
                    </h2>
                    <p className="text-lg mb-8 leading-relaxed" style={{ color: colors.textSecondary }}>
                      {t('suggestionsDescription')}
                    </p>
                    
                    <div 
                      className="rounded-2xl p-8 shadow-lg border backdrop-blur-sm"
                      style={{
                        backgroundColor: colors.panelBg,
                        borderColor: colors.border,
                        boxShadow: colors.cardShadow
                      }}
                    >
                      <div className="flex flex-col gap-6">
                        {/* Label y descripciÃ³n */}
                        <div className="text-left">
                          <label 
                            className="block text-sm font-medium mb-2"
                            style={{ color: colors.textPrimary }}
                          >
                            {language === 'es' ? 'DescripciÃ³n de la sugerencia' : 'Suggestion description'}
                          </label>
                          <p className="text-sm mb-4" style={{ color: colors.textTertiary }}>
                            {language === 'es' 
                              ? 'Comparte tus ideas para ayudarnos a mejorar nuestros servicios.'
                              : 'Share your ideas to help us improve our services.'
                            }
                          </p>
                        </div>

                        {/* Textarea mejorada */}
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                          <div className="flex-1">
                            <textarea
                              placeholder={language === 'es' ? 'Escribe tu sugerencia aquÃ­...' : 'Write your suggestion here...'}
                              className="w-full px-4 py-3 rounded-xl border-none resize-none focus:outline-none focus:ring-2 transition-all duration-300"
                              style={{
                                backgroundColor: `${colors.background}80`,
                                color: colors.textPrimary,
                                borderColor: colors.border
                              } as React.CSSProperties}
                              rows={3}
                            />
                          </div>
                          
                          <button 
                            className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-white"
                            style={{
                              background: `linear-gradient(135deg, ${colors.primaryGreen} 0%, ${colors.accentGreen} 100%)`,
                              boxShadow: `0 8px 25px ${colors.primaryGreen}30`
                            }}
                            onClick={(e) => {
                              addClickPulse(e);
                              // AquÃ­ se puede agregar lÃ³gica para enviar la sugerencia
                              alert(language === 'es' ? 'Â¡Gracias por tu sugerencia! ðŸ’š' : 'Thank you for your suggestion! ðŸ’š');
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.05)';
                              e.currentTarget.style.boxShadow = `0 12px 30px ${colors.primaryGreen}40`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = `0 8px 25px ${colors.primaryGreen}30`;
                            }}
                          >
                            {t('suggestionsButton')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </AnimatedComponent>

            {/* SecciÃ³n de Contacto - MembresÃ­a Digital */}
            <AnimatedComponent animation="bounceIn" trigger="scroll" delay={500}>
              <section id="contacto" className="py-20 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #1b1f1d 0%, #0f1412 100%)'}}>
                {/* Elementos de fondo decorativos */}
                <div className="hidden md:block absolute inset-0 animate-pulse" style={{background: 'linear-gradient(to right, rgba(0,0,0,0.08), rgba(0,0,0,0.12))'}}></div>
                
                {/* Glowing Effect para toda la secciÃ³n */}
                <GlowingEffect
                  spread={80}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  variant="default"
                  borderWidth={3}
                  className="rounded-3xl"
                />
                
                <AnimatedComponent animation="bounceIn" delay={500}>
                  <div className="hidden md:block absolute top-10 left-10 w-20 h-20 bg-card/10 rounded-full"></div>
                </AnimatedComponent>
                <AnimatedComponent animation="bounceIn" delay={1000}>
                  <div className="hidden md:block absolute bottom-10 right-10 w-16 h-16 bg-card/10 rounded-full"></div>
                </AnimatedComponent>
                <AnimatedComponent animation="bounceIn" delay={2000}>
                  <div className="hidden md:block absolute top-1/2 left-1/4 w-12 h-12 bg-card/10 rounded-full"></div>
                </AnimatedComponent>
                
                <div className="relative z-10 max-w-7xl mx-auto px-6">
                  <div className="text-center text-white mb-16">
                    <AnimatedComponent animation="fadeInUp" trigger="scroll" delay={200}>
                      <h2 className="text-4xl md:text-6xl font-bold mb-6">
                        {t('contactTitle')}
                      </h2>
                    </AnimatedComponent>
                    
                    <AnimatedComponent animation="fadeInUp" trigger="scroll" delay={400}>
                      <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto font-light opacity-90">
                        {t('contactSubtitle')}
                      </p>
                    </AnimatedComponent>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-12">
                    {/* Formulario de contacto */}
                    <AnimatedComponent animation="slideInLeft" trigger="scroll" delay={600}>
                      <div className="bg-card/10 backdrop-blur-xl rounded-3xl p-8 border border-card">
                        <h3 className="text-2xl font-bold text-white mb-6">{t('contactTitle')}</h3>
                        <form className="space-y-6">
                          <div>
                            <label className="block text-white/90 text-sm font-medium mb-2">{t('contactName')}</label>
                            <input 
                              type="text" 
                              className="w-full px-4 py-3 bg-card/20 border border-card rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/50 focus:border-transparent transition-all duration-300"
                              placeholder={t('contactName')}
                            />
                          </div>
                          <div>
                            <label className="block text-white/90 text-sm font-medium mb-2">{t('contactEmail')}</label>
                            <input 
                              type="email" 
                              className="w-full px-4 py-3 bg-card/20 border border-card rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/50 focus:border-transparent transition-all duration-300"
                              placeholder="email@example.com"
                            />
                          </div>
                          <div>
                            <label className="block text-white/90 text-sm font-medium mb-2">{t('contactInterest')}</label>
                            <select className="w-full px-4 py-3 bg-card/20 border border-card rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/50 focus:border-transparent transition-all duration-300">
                              <option value="" className="bg-gray-800 text-white">{t('contactSelectOption')}</option>
                              <option value="ai" className="bg-gray-800 text-white">{t('contactAI')}</option>
                              <option value="design" className="bg-gray-800 text-white">{t('contactDesign')}</option>
                              <option value="productivity" className="bg-gray-800 text-white">{t('contactProductivity')}</option>
                              <option value="entertainment" className="bg-gray-800 text-white">{t('contactEntertainment')}</option>
                              <option value="multiple" className="bg-gray-800 text-white">{t('contactMultiple')}</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-white/90 text-sm font-medium mb-2">{t('contactMessage')}</label>
                            <textarea 
                              rows={4}
                              className="w-full px-4 py-3 bg-card/20 border border-card rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/50 focus:border-transparent transition-all duration-300 resize-none"
                              placeholder={t('contactMessagePlaceholder')}
                            ></textarea>
                          </div>
                          <button 
                            type="submit" 
                            className="w-full bg-white text-lg font-bold py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl" 
                            style={{color: '#1b1f1d', boxShadow: '0 25px 50px -12px rgba(255, 255, 255, 0.3)'}}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = colors.foreground;
                              e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(255, 255, 255, 0.5)';
                            }} 
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'white';
                              e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(255, 255, 255, 0.3)';
                            }}
                          >
                            {t('contactSubmit')}
                          </button>
                        </form>
                      </div>
                    </AnimatedComponent>

                    {/* Opciones de contacto directo */}
                    <AnimatedComponent animation="slideInRight" trigger="scroll" delay={800}>
                      <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-white mb-8">{t('contactDirectTitle')}</h3>
                        
                        {/* WhatsApp */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group">
                          <div className="flex items-center">
                            <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-semibold text-lg">WhatsApp</h4>
                              <p className="text-white/70 text-sm">{t('contactImmediateResponse')}</p>
                              <p className="text-white/90 font-medium">+591 77289371</p>
                            </div>
                            <div className="text-white/50 group-hover:text-white transition-colors duration-300">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Correo de soporte */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group">
                          <div className="flex items-center">
                            <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-semibold text-lg">{t('contactSupport')} Email</h4>
                              <p className="text-white/70 text-sm">{t('contactDetailedQuestions')}</p>
                              <p className="text-white/90 font-medium">soporte@lynxtech.com</p>
                            </div>
                            <div className="text-white/50 group-hover:text-white transition-colors duration-300">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* AtenciÃ³n LatinoamÃ©rica */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <h4 className="text-white font-semibold text-lg mb-2">Atendemos en toda LatinoamÃ©rica</h4>
                            <p className="text-white/80 text-sm mb-4">Soporte en espaÃ±ol, horarios locales</p>
                            <div className="flex flex-wrap justify-center gap-2 text-xs text-white/70">
                              <span>ðŸ‡²ðŸ‡½ MÃ©xico</span>
                              <span>ðŸ‡¨ðŸ‡´ Colombia</span>
                              <span>ðŸ‡¦ðŸ‡· Argentina</span>
                              <span>ðŸ‡µðŸ‡ª PerÃº</span>
                              <span>ðŸ‡ªðŸ‡¸ EspaÃ±a</span>
                              <span>ðŸ‡ºðŸ‡¾ Uruguay</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AnimatedComponent>
                  </div>
                </div>
              </section>
            </AnimatedComponent>
          </main>

          {/* Footer Renovado */}
          <footer className="bg-gray-900 dark:bg-black text-white py-16 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-6">
              {/* Logo y Links principales */}
              <div className="grid md:grid-cols-4 gap-8 mb-12">
                {/* Logo y descripciÃ³n */}
                <div className="md:col-span-2">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3" style={{background: 'linear-gradient(135deg, #1b1f1d 0%, #0f1412 100%)'}}>
                      <span className="text-white font-bold text-xl">L</span>
                    </div>
                    <span className="text-2xl font-bold" style={{color: colors.textPrimary}}>LynxTech</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Impulsamos tu futuro digital con herramientas acadÃ©micas y soluciones empresariales innovadoras.
                  </p>
                </div>

                {/* Links de navegaciÃ³n */}
                <div>
                    <h4 className="text-lg font-semibold text-foreground mb-4">NavegaciÃ³n</h4>
                  <ul className="space-y-2">
                    <li><a href="#home" onClick={(e) => {e.preventDefault(); const el = document.getElementById('home'); if(el) window.scrollTo({ top: el.offsetTop - 120, behavior: 'smooth' })}} className="text-muted-foreground hover:text-emerald-400 transition-colors duration-300"><AnimatedText translationKey="home" /></a></li>
                    <li><a href="#servicios" onClick={(e) => {e.preventDefault(); const el = document.getElementById('servicios'); if(el) window.scrollTo({ top: el.offsetTop - 120, behavior: 'smooth' })}} className="text-muted-foreground hover:text-emerald-400 transition-colors duration-300"><AnimatedText translationKey="services" /></a></li>
                    <li><a href="#nosotros" onClick={(e) => {e.preventDefault(); const el = document.getElementById('nosotros'); if(el) window.scrollTo({ top: el.offsetTop - 120, behavior: 'smooth' })}} className="text-muted-foreground hover:text-emerald-400 transition-colors duration-300"><AnimatedText translationKey="about" /></a></li>
                    <li><a href="#faq" onClick={(e) => {e.preventDefault(); const el = document.getElementById('faq'); if(el) window.scrollTo({ top: el.offsetTop - 120, behavior: 'smooth' })}} className="text-muted-foreground hover:text-emerald-400 transition-colors duration-300">FAQ</a></li>
                    <li><a href="#contacto" onClick={(e) => {e.preventDefault(); const el = document.getElementById('contacto'); if(el) window.scrollTo({ top: el.offsetTop - 120, behavior: 'smooth' })}} className="text-muted-foreground hover:text-emerald-400 transition-colors duration-300"><AnimatedText translationKey="contact" /></a></li>
                  </ul>
                </div>

                {/* Redes sociales y login */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Conecta</h4>
                  <div className="flex space-x-4 mb-6">
                    {/* Instagram */}
                    <a 
                      href="#" 
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                      style={{
                        backgroundColor: colors.textSecondary
                      }}
                      
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = colors.textSecondary;
                      }}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    
                    {/* WhatsApp */}
                    <a 
                      href="#" 
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                      style={{
                        backgroundColor: colors.textSecondary
                      }}
                      
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = colors.textSecondary;
                      }}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                    </a>

                    {/* Telegram */}
                    <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-all duration-300 hover:scale-110">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                    </a>
                  </div>
                  
                  {/* Admin Login discreto */}
                  <a href="#admin" className="text-xs text-gray-500 hover:text-gray-400 transition-colors duration-300">
                    <AnimatedText translationKey="adminLogin" />
                  </a>
                </div>
              </div>

              {/* Separador */}
              <div className="border-t border-gray-800 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="text-gray-400 mb-4 md:mb-0">
                    <AnimatedText translationKey="footerCopyright" />
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <a href="#privacy" className="hover:text-gray-400 transition-colors duration-300">Privacidad</a>
                    <span>â€¢</span>
                    <a href="#terms" className="hover:text-gray-400 transition-colors duration-300">TÃ©rminos</a>
                    <span>â€¢</span>
                    <a href="#cookies" className="hover:text-gray-400 transition-colors duration-300">Cookies</a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
          {!isMobile && <SmoothCursor />}
        </div>
      </div>

    </>
  )
}

export default App





