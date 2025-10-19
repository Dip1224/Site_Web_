import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const getInitialTheme = (): Theme => {
    try {
      const saved = (typeof window !== 'undefined') ? (localStorage.getItem('theme') as Theme | null) : null
      if (saved === 'light' || saved === 'dark') return saved
      if (typeof document !== 'undefined') {
        // Alinear con la clase ya aplicada por index.html
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
      }
    } catch {}
    return 'light'
  }

  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    // Asegura que la clase en <html> coincide con el estado
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    if (newTheme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    applyTheme(newTheme)
    try { localStorage.setItem('theme', newTheme) } catch {}
  }

  return (
    <ThemeContext.Provider value={{
      theme,
      isDark: theme === 'dark',
      toggleTheme
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
