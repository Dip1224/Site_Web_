"use client"

import React, { useEffect, useState } from "react"
import { useThemeColors } from "../../hooks/useThemeColors"
import { cn } from "../../lib/utils"

interface MeteorsProps {
  number?: number
  minDelay?: number
  maxDelay?: number
  minDuration?: number
  maxDuration?: number
  angle?: number
  className?: string
}

export const Meteors = ({
  number = 40,
  minDelay = 0.1,
  maxDelay = 0.8,
  minDuration = 1.5,
  maxDuration = 10,
  angle = 215,
  className,
}: MeteorsProps) => {
  const colors = useThemeColors()
  const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>(
    []
  )

  useEffect(() => {
    const generateStyles = () => {
      return [...new Array(number)].map(() => ({
        "--angle": -angle + "deg" as any,
        top: `${Math.random() * 20}%`,
        left: `${Math.random() * 120}%`, // Permite que empiecen fuera de pantalla
        animationDelay: `${(Math.random() * (maxDelay - minDelay) + minDelay).toFixed(2)}s`,
        animationDuration: `${Math.floor(Math.random() * (maxDuration - minDuration) + minDuration)}s`,
      }))
    }
    
    setMeteorStyles(generateStyles())
  }, [number, minDelay, maxDelay, minDuration, maxDuration, angle])

  return (
    <>
      {[...meteorStyles].map((style, idx) => {
        // Alternar entre colores verdes para variación
        const isAccent = idx % 3 === 0
        const meteorColor = isAccent ? colors.accentGreen : colors.lightGreen
        const shadowColor = isAccent ? colors.primaryGreen : colors.lightGreen
        
        return (
          // Meteor Head
          <span
            key={idx}
            style={{ 
              ...style,
              backgroundColor: meteorColor,
              boxShadow: `0 0 8px 2px ${shadowColor}60`,
              width: '3px',
              height: '3px',
              zIndex: 1
            }}
            className={cn(
              "animate-meteor pointer-events-none absolute rotate-[var(--angle)] rounded-full",
              className
            )}
          >
            {/* Meteor Tail */}
            <div 
              className="pointer-events-none absolute top-1/2 -z-10 h-0.5 w-[80px] -translate-y-1/2"
              style={{
                background: `linear-gradient(to right, ${meteorColor}, ${meteorColor}60, transparent)`,
                borderRadius: '1px'
              }}
            />
          </span>
        )
      })}
    </>
  )
}