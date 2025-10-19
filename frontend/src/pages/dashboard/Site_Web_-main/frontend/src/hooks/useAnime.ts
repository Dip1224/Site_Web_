import { useEffect, useRef } from 'react'
import { animate } from 'animejs'

interface UseAnimeOptions {
  targets?: string | HTMLElement | HTMLElement[]
  duration?: number
  delay?: number
  easing?: string
  direction?: 'normal' | 'reverse' | 'alternate'
  loop?: boolean | number
  autoplay?: boolean
  [key: string]: any
}

export const useAnime = (options: UseAnimeOptions, dependencies: any[] = []) => {
  const animationRef = useRef<any>(null)

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.pause()
    }

    if (options.targets) {
      const { targets, ...animationOptions } = options
      animationRef.current = animate(targets as any, {
        duration: 1000,
        easing: 'out-expo',
        ...animationOptions
      } as any)
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.pause()
      }
    }
  }, dependencies)

  return animationRef.current
}

export const createScrollAnimation = (selector: string, animation: any) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target, {
          ...animation
        })
      }
    })
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -10% 0px'
  })

  document.querySelectorAll(selector).forEach((el) => {
    observer.observe(el)
  })

  return observer
}

export const fadeInUp = {
  translateY: [50, 0],
  opacity: [0, 1],
  duration: 800,
  easing: 'easeOutExpo'
}

export const fadeIn = {
  opacity: [0, 1],
  duration: 600,
  easing: 'easeOutQuad'
}

export const slideInLeft = {
  translateX: [-100, 0],
  opacity: [0, 1],
  duration: 700,
  easing: 'easeOutExpo'
}

export const slideInRight = {
  translateX: [100, 0],
  opacity: [0, 1],
  duration: 700,
  easing: 'easeOutExpo'
}

export const scaleIn = {
  scale: [0.8, 1],
  opacity: [0, 1],
  duration: 500,
  easing: 'easeOutBack'
}

export const bounceIn = {
  scale: [0, 1],
  opacity: [0, 1],
  duration: 600,
  easing: 'easeOutElastic(1, .6)'
}