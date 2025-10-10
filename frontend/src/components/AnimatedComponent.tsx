import React, { useEffect, useRef } from 'react'
import { animate } from 'animejs'
import { useLanguage } from '../contexts/LanguageContext'

interface AnimatedComponentProps {
  children: React.ReactNode
  animation?: 'fadeInUp' | 'slideInLeft' | 'slideInRight' | 'scaleIn' | 'bounceIn' | 'fadeIn'
  delay?: number
  duration?: number
  className?: string
  trigger?: 'immediate' | 'scroll' | 'hover'
  once?: boolean
}

export const AnimatedComponent: React.FC<AnimatedComponentProps> = ({
  children,
  animation = 'fadeInUp',
  delay = 0,
  duration = 800,
  className = '',
  trigger = 'scroll',
  once = true
}) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const animatedRef = useRef(false)

  const animations = {
    fadeInUp: {
      translateY: [50, 0],
      opacity: [0, 1],
    },
    slideInLeft: {
      translateX: [-100, 0],
      opacity: [0, 1],
    },
    slideInRight: {
      translateX: [100, 0],
      opacity: [0, 1],
    },
    scaleIn: {
      scale: [0.8, 1],
      opacity: [0, 1],
    },
    bounceIn: {
      scale: [0, 1],
      opacity: [0, 1],
      easing: 'out-elastic(1, .6)'
    },
    fadeIn: {
      opacity: [0, 1],
    }
  }

  const runAnimation = () => {
    if (elementRef.current && (!animatedRef.current || !once)) {
      animate(elementRef.current, {
        ...animations[animation],
        duration,
        delay,
        easing: animation === 'bounceIn' ? 'out-elastic(1, .6)' : 'out-expo'
      })
      animatedRef.current = true
    }
  }

  useEffect(() => {
    if (trigger === 'immediate') {
      runAnimation()
    } else if (trigger === 'scroll') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              runAnimation()
            }
          })
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -10% 0px'
        }
      )

      if (elementRef.current) {
        observer.observe(elementRef.current)
      }

      return () => observer.disconnect()
    }
  }, [])

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      runAnimation()
    }
  }

  // Configurar el estado inicial del elemento
  useEffect(() => {
    if (elementRef.current && trigger !== 'immediate') {
      const initialState = animations[animation]
      const element = elementRef.current
      
      // Aplicar estado inicial
      if (initialState.opacity) element.style.opacity = '0'
      if ('translateY' in initialState) element.style.transform = `translateY(${initialState.translateY[0]}px)`
      if ('translateX' in initialState) element.style.transform = `translateX(${initialState.translateX[0]}px)`
      if ('scale' in initialState) element.style.transform = `scale(${initialState.scale[0]})`
    }
  }, [animation, trigger])

  return (
    <div 
      ref={elementRef}
      className={className}
      onMouseEnter={handleMouseEnter}
    >
      {children}
    </div>
  )
}

// Hook personalizado para animaciones de texto con cambio de idioma
export const useLanguageAnimation = () => {
  const { isTransitioning } = useLanguage()
  const textRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (textRef.current && isTransitioning) {
      animate(textRef.current, {
        opacity: [1, 0.7, 1],
        translateY: [0, -5, 0],
        duration: 400,
        easing: 'out-quad'
      })
    }
  }, [isTransitioning])

  return textRef
}