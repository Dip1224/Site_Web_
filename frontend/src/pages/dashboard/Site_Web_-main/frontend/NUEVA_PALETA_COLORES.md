# 🎨 Nueva Paleta de Colores - LynxTech

## Colores Principales

### Primarios (Verde Profesional)
- **Primary**: `#181E19` - Verde muy oscuro y elegante (principal)
- **Primary Light**: `#8fa693` - Verde suave para acentos
- **Primary Dark**: `#010201` - Casi negro para contrastes fuertes
- **Primary Content**: `#2f3a31` - Verde medio para contenido

### Secundarios (Gris Azulado)
- **Secondary**: `#181a1e` - Azul oscuro sutil
- **Secondary Light**: `#8f97a6` - Gris azulado claro
- **Secondary Dark**: `#010102` - Casi negro azulado
- **Secondary Content**: `#2f333a` - Gris medio

## Neutrales por Modo

### Modo Claro
- **Foreground**: `#fbfcfb` - Blanco verdoso
- **Background**: `#eef1ef` - Gris verdoso muy claro
- **Border**: `#dce2dd` - Gris verdoso claro
- **Copy**: `#222a24` - Verde muy oscuro (texto principal)
- **Copy Light**: `#5c705f` - Verde grisáceo (texto secundario)
- **Copy Lighter**: `#819885` - Verde suave (texto terciario)

### Modo Oscuro
- **Foreground**: `#222a24` - Verde oscuro
- **Background**: `#171c18` - Verde muy oscuro
- **Border**: `#39463b` - Verde grisáceo
- **Copy**: `#fbfcfb` - Blanco suave (texto principal)
- **Copy Light**: `#d5ddd6` - Gris claro verdoso (texto secundario)
- **Copy Lighter**: `#9dafa0` - Gris medio verdoso (texto terciario)

## Colores de Utilidad

### Éxito (Verde)
- **Success**: `#181e18` - Verde muy oscuro
- **Success Content**: `#8fa68f` - Verde suave

### Advertencia (Amarillo)
- **Warning**: `#1e1e18` - Amarillo muy oscuro
- **Warning Content**: `#a6a68f` - Amarillo suave

### Error (Rojo)
- **Error**: `#1e1818` - Rojo muy oscuro
- **Error Content**: `#a68f8f` - Rojo suave

## Cómo Usar en Componentes

```tsx
import { useThemeColors } from '../hooks/useThemeColors'

const MyComponent = () => {
  const colors = useThemeColors()
  
  return (
    <div 
      style={{
        backgroundColor: colors.background,
        color: colors.textPrimary,
        borderColor: colors.border
      }}
    >
      <button 
        style={{
          backgroundColor: colors.primaryGreen,
          color: colors.foreground
        }}
      >
        Botón Principal
      </button>
    </div>
  )
}
```

## Características de la Paleta

### ✅ **Profesional y Sofisticada**
- Colores muy sutiles y elegantes
- Perfecto para aplicaciones empresariales
- Contraste excelente entre modos

### ✅ **Accesibilidad**
- Alto contraste para legibilidad
- Colores diferenciados para daltonismo
- Cumple estándares WCAG

### ✅ **Versatilidad**
- Funciona en modo claro y oscuro
- Colores de utilidad para diferentes estados
- Gradientes suaves para efectos visuales

### ✅ **Consistencia**
- Paleta cohesiva y armoniosa
- Transiciones suaves entre modos
- Colores complementarios bien balanceados

---

*Esta paleta reemplaza completamente la anterior con una estética más profesional y madura.*