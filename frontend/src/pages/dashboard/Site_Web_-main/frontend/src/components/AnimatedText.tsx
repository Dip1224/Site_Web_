import React, { useEffect, useRef } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { animate } from 'animejs'

interface AnimatedTextProps {
  translationKey: string
  className?: string
  style?: React.CSSProperties
  as?: keyof JSX.IntrinsicElements
  animation?: 'fade' | 'slide' | 'bounce'
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  translationKey,
  className = '',
  style = {},
  as = 'span',
  animation = 'fade'
}) => {
  const { t, isTransitioning } = useLanguage()
  const textRef = useRef<any>(null)

  useEffect(() => {
    if (textRef.current && isTransitioning) {
      const animations = {
        fade: {
          opacity: [1, 0.6, 1],
          duration: 400,
          easing: 'out-quad'
        },
        slide: {
          opacity: [1, 0.7, 1],
          translateY: [0, -8, 0],
          duration: 500,
          easing: 'out-expo'
        },
        bounce: {
          scale: [1, 1.05, 1],
          opacity: [1, 0.8, 1],
          duration: 300,
          easing: 'out-elastic(1, .6)'
        }
      }

      animate(textRef.current, animations[animation])
    }
  }, [isTransitioning, animation])

  if (as) {
    const Element = as as any
    return (
      <Element 
        ref={textRef}
        className={`${className} transition-colors duration-300`}
        style={style}
      >
        {t(translationKey)}
      </Element>
    )
  }

  return (
    <span 
      ref={textRef}
      className={`${className} transition-colors duration-300`}
      style={style}
    >
      {t(translationKey)}
    </span>
  )
}