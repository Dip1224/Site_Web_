import React from 'react'
import { useThemeColors } from '../hooks/useThemeColors'
import { useTheme } from '../contexts/ThemeContext'

export const ColorPalette: React.FC = () => {
  const colors = useThemeColors()
  const { isDark, toggleTheme } = useTheme()

  const colorSections = [
    {
      title: 'Colores Principales',
      colors: [
        { name: 'Primary Green', value: colors.primaryGreen },
        { name: 'Light Green', value: colors.lightGreen },
        { name: 'Dark Green', value: colors.darkGreen },
        { name: 'Accent Green', value: colors.accentGreen }
      ]
    },
    {
      title: 'Colores Secundarios',
      colors: [
        { name: 'Secondary', value: colors.secondary },
        { name: 'Secondary Light', value: colors.secondaryLight },
        { name: 'Secondary Dark', value: colors.secondaryDark },
        { name: 'Secondary Content', value: colors.secondaryContent }
      ]
    },
    {
      title: 'Texto y Fondos',
      colors: [
        { name: 'Text Primary', value: colors.textPrimary },
        { name: 'Text Secondary', value: colors.textSecondary },
        { name: 'Text Tertiary', value: colors.textTertiary },
        { name: 'Background', value: colors.background },
        { name: 'Foreground', value: colors.foreground },
        { name: 'Border', value: colors.border }
      ]
    },
    {
      title: 'Utilidades',
      colors: [
        { name: 'Success', value: colors.success },
        { name: 'Success Content', value: colors.successContent },
        { name: 'Warning', value: colors.warning },
        { name: 'Warning Content', value: colors.warningContent },
        { name: 'Error', value: colors.error },
        { name: 'Error Content', value: colors.errorContent }
      ]
    }
  ]

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => {/* Cerrar al hacer clic fuera */}}
    >
      <div 
        className="max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border p-8"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.border,
          color: colors.textPrimary
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Nueva Paleta de Colores</h2>
          <div className="flex gap-4">
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-300"
              style={{
                backgroundColor: colors.primaryGreen,
                color: colors.foreground
              }}
            >
              {isDark ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
            </button>
            <button
              onClick={() => {/* Cerrar */}}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-300"
              style={{
                backgroundColor: colors.secondary,
                color: colors.foreground
              }}
            >
              ✕ Cerrar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {colorSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-xl font-semibold mb-4" style={{color: colors.textSecondary}}>
                {section.title}
              </h3>
              <div className="space-y-3">
                {section.colors.map((color, colorIndex) => (
                  <div 
                    key={colorIndex}
                    className="flex items-center gap-4 p-3 rounded-lg transition-all duration-300"
                    style={{
                      backgroundColor: colors.foreground,
                      border: `1px solid ${colors.border}`
                    }}
                  >
                    <div 
                      className="w-12 h-12 rounded-lg border-2 shadow-lg"
                      style={{
                        backgroundColor: color.value,
                        borderColor: colors.border
                      }}
                    ></div>
                    <div className="flex-1">
                      <div className="font-medium" style={{color: colors.textPrimary}}>
                        {color.name}
                      </div>
                      <div className="text-sm font-mono" style={{color: colors.textTertiary}}>
                        {color.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 rounded-lg" style={{backgroundColor: colors.foreground, border: `1px solid ${colors.border}`}}>
          <h3 className="text-lg font-semibold mb-3" style={{color: colors.textSecondary}}>
            Ejemplo de Uso
          </h3>
          <pre className="text-sm overflow-x-auto" style={{color: colors.textTertiary}}>
{`const colors = useThemeColors()

// Usar en estilos inline
style={{
  backgroundColor: colors.primaryGreen,
  color: colors.textPrimary,
  borderColor: colors.border
}}`}
          </pre>
        </div>
      </div>
    </div>
  )
}