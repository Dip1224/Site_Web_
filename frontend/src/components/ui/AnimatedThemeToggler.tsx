"use client"

import React, { useCallback, useRef } from "react"
import { Moon, Sun } from "lucide-react"
import { flushSync } from "react-dom"

import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/ThemeContext"

interface AnimatedThemeTogglerProps
  extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number
}

export const AnimatedThemeToggler = ({
  className,
  duration = 400,
  ...props
}: AnimatedThemeTogglerProps) => {
  const { isDark, toggleTheme } = useTheme()
  const buttonRef = useRef<HTMLButtonElement>(null)

  const onClick = useCallback(async () => {
    if (!buttonRef.current) return

    // Fallback if View Transitions are not supported
    const d = document as any
    const hasVT = typeof d.startViewTransition === 'function'

    if (!hasVT) {
      toggleTheme()
      return
    }

    // Call bound to document to avoid Illegal invocation
    await (d.startViewTransition as (cb: () => void) => { ready: Promise<void> }).call(d, () => {
      flushSync(() => {
        toggleTheme()
      })
    }).ready

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    )

    document.documentElement.animate(
      {
        // @ts-ignore - clipPath typed as any in keyframes
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: "ease-in-out",
        // @ts-ignore - pseudoElement is supported at runtime
        pseudoElement: "::view-transition-new(root)",
      }
    )
  }, [toggleTheme, duration])

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={cn(className)}
      {...props}
    >
      {isDark ? <Sun /> : <Moon />}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}

export default AnimatedThemeToggler
