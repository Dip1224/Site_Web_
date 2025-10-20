import { useMemo } from 'react'
import { useTheme } from '../contexts/ThemeContext'

// Tipado explícito de la paleta devuelta por el hook
export interface ThemeColors {
  // Base tokens
  background: string
  foreground: string
  border: string
  card: string
  cardForeground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground?: string
  muted?: string
  mutedForeground?: string

  // Aliases esperados por la app
  textPrimary: string
  textSecondary: string
  textTertiary: string
  cardBorder: string
  cardShadow: string

  // Compatibilidad con nombres existentes
  primaryGreen: string
  accentGreen: string
  darkGreen: string
  lightGreen: string

  // Otros
  gridColor: string
  secondaryLight: string
  secondaryDark: string
  success: string
  successContent: string
  warning: string
  warningContent: string
  error: string
  errorContent: string

  // Fondos decorativos
  mainBackground: string
  overlayGradient: string
  panelBg: string

  // Estado
  isDark: boolean
}

// Fuente de verdad: variables CSS definidas en src/index.css
// Sin efectos secundarios en :root para evitar parpadeos al cambiar de tema.
export function useThemeColors(): ThemeColors {
  const { isDark } = useTheme()

  const tokens = useMemo(() => ({
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    card: 'hsl(var(--card))',
    cardForeground: 'hsl(var(--card-foreground))',
    border: 'hsl(var(--border))',
    input: 'hsl(var(--input))',
    primary: 'hsl(var(--primary))',
    primaryForeground: 'hsl(var(--primary-foreground))',
    secondary: 'hsl(var(--secondary))',
    secondaryForeground: 'hsl(var(--secondary-foreground))',
    muted: 'hsl(var(--muted))',
    mutedForeground: 'hsl(var(--muted-foreground))',
  }), [])

  return {
    // Base
    background: tokens.background,
    foreground: tokens.foreground,
    border: tokens.border,
    card: tokens.card,
    cardForeground: tokens.cardForeground,
    primary: tokens.primary,
    primaryForeground: tokens.primaryForeground,
    // Aliases esperados por la app
    textPrimary: tokens.foreground,
    textSecondary: tokens.mutedForeground,
    textTertiary: tokens.mutedForeground,
    cardBorder: tokens.border,
    cardShadow: isDark ? '0 10px 30px rgba(0,0,0,0.35)' : '0 10px 30px rgba(0,0,0,0.10)',
    // Compatibilidad con nombres existentes (sin verdes)
    primaryGreen: tokens.primary,
    accentGreen: tokens.muted,
    darkGreen: 'hsl(0 0% 12%)',
    lightGreen: 'hsl(0 0% 40%)',
    // Otros
    gridColor: tokens.border,
    secondary: tokens.secondary,
    secondaryLight: 'hsl(0 0% 60%)',
    secondaryDark: 'hsl(0 0% 5%)',
    success: 'hsl(140 45% 35%)',
    successContent: 'hsl(0 0% 96%)',
    warning: 'hsl(40 90% 40%)',
    warningContent: 'hsl(0 0% 96%)',
    error: 'hsl(0 70% 40%)',
    errorContent: 'hsl(0 0% 96%)',
    // Fondos decorativos (neutros)
    mainBackground: isDark
      ? 'linear-gradient(135deg, #0a0a0a 0%, #111113 50%, #0a0a0a 100%)'
      : 'linear-gradient(135deg, #f6f6f6 0%, #efefef 45%, #e9e9e9 100%)',
    overlayGradient: isDark
      ? 'radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.35) 100%)'
      : 'radial-gradient(1200px circle at 50% -200px, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.12) 45%, rgba(0,0,0,0.18) 85%)',
    panelBg: isDark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.65)',
    isDark,
  }
}

// no default export
