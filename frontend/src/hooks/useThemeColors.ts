import { useTheme } from '../contexts/ThemeContext'

export const useThemeColors = () => {
  const { isDark } = useTheme()
  console.log('🎨 useThemeColors - isDark:', isDark)
  console.log('🎨 Document has dark class:', document.documentElement.classList.contains('dark'))
  
  if (isDark) {
    // Modo Oscuro - Nueva paleta profesional
    return {
      // Fondo principal - neutros oscuros
      mainBackground: 'linear-gradient(135deg, #222a24 0%, #171c18 50%, #222a24 100%)',
      
      // Overlay con gradiente suave
      overlayGradient: 'radial-gradient(ellipse at center, rgba(34, 42, 36, 0.1) 0%, rgba(23, 28, 24, 0.3) 100%)',
      
      // Colores primarios - nueva paleta sofisticada
      primaryGreen: '#181E19',     // Primary - verde muy oscuro y elegante
      lightGreen: '#8fa693',       // Primary Light - verde suave
      darkGreen: '#010201',        // Primary Dark - casi negro
      accentGreen: '#2f3a31',      // Primary Content - verde medio
      
      // Colores secundarios
      secondary: '#181a1e',        // Secondary - azul oscuro sutil
      secondaryLight: '#8f97a6',   // Secondary Light - gris azulado
      secondaryDark: '#010102',    // Secondary Dark - casi negro azulado
      secondaryContent: '#2f333a', // Secondary Content - gris medio
      
      // Texto y acentos - neutros oscuros
      textPrimary: '#fbfcfb',      // Copy - blanco suave
      textSecondary: '#d5ddd6',    // Copy Light - gris claro verdoso
      textTertiary: '#9dafa0',     // Copy Lighter - gris medio verdoso
      textAccent: '#fbfcfb',
      
      // Fondos y bordes - neutros oscuros
      background: '#171c18',       // Background - verde muy oscuro
      foreground: '#222a24',       // Foreground - verde oscuro
      border: '#39463b',           // Border - verde grisáceo
      
      // Tarjetas y elementos
      cardBorder: 'rgba(24, 30, 25, 0.4)',
      cardShadow: '0 25px 50px -12px rgba(24, 30, 25, 0.25)',
      cardShadowHover: '0 25px 50px -12px rgba(24, 30, 25, 0.4)',
      
      // Partículas y efectos
      particle1: 'radial-gradient(circle, rgba(24, 30, 25, 0.2) 0%, transparent 70%)',
      particle2: 'radial-gradient(circle, rgba(1, 2, 1, 0.15) 0%, transparent 70%)',
      particle3: 'radial-gradient(circle, rgba(47, 58, 49, 0.1) 0%, transparent 70%)',
      
      // Grid de fondo
      gridColor: 'rgba(24, 30, 25, 0.1)',
      
      // Colores de utilidad
      success: '#181e18',          // Verde muy oscuro para éxito
      successContent: '#8fa68f',   // Verde suave para contenido de éxito
      warning: '#1e1e18',          // Amarillo muy oscuro para advertencia
      warningContent: '#a6a68f',   // Amarillo suave para contenido
      error: '#1e1818',            // Rojo muy oscuro para error
      errorContent: '#a68f8f'      // Rojo suave para contenido de error
    }
  } else {
     // ☀️ Modo Claro - Colores exactos del usuario
    const lightColors = {
      mainBackground: 'linear-gradient(135deg, #fbfbfb 0%, #eff1ef 50%, #fbfbfb 100%)',
      overlayGradient: 'radial-gradient(ellipse at center, rgba(251,251,251,.10) 0%, rgba(239,241,239,.30) 100%)',

      primaryGreen: '#3BE285',
      lightGreen: '#A1F3C5',
      darkGreen: '#2BCC70',
      accentGreen: '#3BE285',

      // Colores exactos proporcionados por el usuario
      foreground: '#fbfbfb',    // Foreground exacto
      background:  '#eff1ef',   // Background exacto
      border:      '#dfe2dd',   // Border exacto

      textPrimary:   '#262923', // Copy exacto
      textSecondary: '#646e5e', // Copy Light exacto
      textTertiary:  '#8a9584', // Copy Lighter exacto
      textAccent:    '#262923',

      cardBorder: 'rgba(35,41,35,.10)',
      cardShadow: '0 10px 15px -3px rgba(35,41,35,.10), 0 4px 6px -2px rgba(35,41,35,.06)',
      cardShadowHover: '0 20px 25px -5px rgba(35,41,35,.15), 0 10px 10px -5px rgba(35,41,35,.10)',

      success: '#22c55e',
      successContent: '#ffffff',
      warning: '#f59e0b',
      warningContent: '#ffffff',
      error: '#ef4444',
      errorContent: '#ffffff',
      
      // Propiedades adicionales necesarias
      secondaryContent: '#eff1ef',
      particle1: '#3BE285',
      particle2: '#A1F3C5',
      particle3: '#2BCC70',
      gridColor: '#dfe2dd'
    }
    
    console.log('🎨 Light mode colors applied:', lightColors);
    return lightColors;
  }
}