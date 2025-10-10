# 🧹 Estructura Limpia - LynxTech Frontend

## 📁 Estructura Actual del Proyecto

```
frontend/
├── src/
│   ├── components/           # Componentes React
│   │   ├── AnimatedComponent.tsx    # Wrapper para animaciones anime.js
│   │   ├── AnimatedText.tsx         # Textos con animaciones y traducciones
│   │   ├── Header.tsx               # Navegación flotante principal
│   │   └── ui/
│   │       └── LynxLogo.tsx         # Logo de la empresa
│   │
│   ├── contexts/             # Contextos React
│   │   ├── LanguageContext.tsx      # Sistema de idiomas (ES/EN)
│   │   └── ThemeContext.tsx         # Modo claro/oscuro
│   │
│   ├── hooks/                # Custom hooks
│   │   └── useThemeColors.ts        # Colores dinámicos por tema
│   │
│   ├── utils/                # Utilidades
│   │   └── scrollUtils.ts           # Detección de secciones activas
│   │
│   ├── App.tsx               # Landing page principal
│   ├── main.tsx              # Punto de entrada React
│   ├── index.css             # Estilos globales
│   └── vite-env.d.ts         # Tipos TypeScript
│
├── package.json              # Dependencias limpias
├── tailwind.config.js        # Configuración Tailwind
├── vite.config.ts            # Configuración Vite
└── tsconfig.json            # Configuración TypeScript
```

## 🧩 Componentes Disponibles

### 1. **Header** (`/components/Header.tsx`)
- **Propósito:** Navegación flotante con glassmorphism
- **Características:**
  - Detección automática de sección activa
  - Scroll suave entre secciones
  - Switch de tema claro/oscuro
  - Switch de idioma ES/EN
  - Colores dinámicos según tema
- **Uso:** `<Header />`

### 2. **AnimatedComponent** (`/components/AnimatedComponent.tsx`)
- **Propósito:** Wrapper para animaciones con anime.js
- **Características:**
  - Múltiples tipos de animación (fadeIn, slideIn, bounceIn, etc.)
  - Trigger por scroll o automático
  - Delay personalizable
- **Uso:** `<AnimatedComponent animation="fadeInUp" delay={300}>contenido</AnimatedComponent>`

### 3. **AnimatedText** (`/components/AnimatedText.tsx`)
- **Propósito:** Textos con traducción automática y animaciones
- **Características:**
  - Traducciones dinámicas desde LanguageContext
  - Animaciones de texto
  - Elementos HTML personalizables (span, h1, h2, etc.)
- **Uso:** `<AnimatedText translationKey="mainTitle" as="h1" className="text-4xl" />`

### 4. **LynxLogo** (`/components/ui/LynxLogo.tsx`)
- **Propósito:** Logo vectorial de la empresa
- **Características:**
  - Tamaño personalizable
  - Colores adaptables
  - SVG escalable
- **Uso:** `<LynxLogo size={48} className="text-white" />`

## 🎨 Sistema de Temas y Colores

### useThemeColors Hook
- **Ubicación:** `/hooks/useThemeColors.ts`
- **Propósito:** Proporciona colores dinámicos según el tema activo
- **Colores disponibles:**
  ```typescript
  {
    mainBackground: string,      // Fondo principal
    overlayGradient: string,     // Gradiente de overlay
    primaryGreen: string,        // Verde principal
    darkGreen: string,          // Verde oscuro
    textAccent: string,         // Texto de acento
    cardBorder: string,         // Bordes de tarjetas
    cardShadow: string,         // Sombras normales
    cardShadowHover: string,    // Sombras hover
    particle1/2/3: string,      // Partículas de fondo
    gridColor: string           // Grid de fondo
  }
  ```

## 🌐 Sistema de Idiomas

### LanguageContext
- **Ubicación:** `/contexts/LanguageContext.tsx`
- **Idiomas:** Español (ES) y Inglés (EN)
- **Traducciones:** Todas las claves están definidas en el contexto
- **Uso:** Automático a través de `<AnimatedText translationKey="clave" />`

## 📦 Dependencias Esenciales

### Producción
```json
{
  "react": "^18.2.0",           // Framework principal
  "react-dom": "^18.2.0",      // DOM React
  "animejs": "^4.2.0",         // Animaciones
  "tailwindcss": "^3.3.0",     // Estilos CSS
  "typescript": "^5.0.0"       // TypeScript
}
```

### Desarrollo
```json
{
  "@vitejs/plugin-react": "^4.2.0",  // Plugin Vite
  "vite": "^5.0.0",                   // Build system
  "@types/react": "^18.2.0",         // Tipos React
  "@types/react-dom": "^18.2.0"      // Tipos React DOM
}
```

## ➕ Guía para Agregar Nuevos Componentes

### 1. **Estructura recomendada:**
```
/components/
  /categoria/           # (opcional) ej: /forms/, /cards/
    ComponentName.tsx   # PascalCase siempre
```

### 2. **Template básico de componente:**
```tsx
import React from 'react'
import { useThemeColors } from '../hooks/useThemeColors'
import { AnimatedComponent } from './AnimatedComponent'

interface ComponentNameProps {
  // Props aquí
}

export const ComponentName: React.FC<ComponentNameProps> = ({ ...props }) => {
  const colors = useThemeColors()
  
  return (
    <AnimatedComponent animation="fadeInUp">
      <div 
        className="p-4 rounded-lg"
        style={{ backgroundColor: colors.mainBackground }}
      >
        {/* Contenido del componente */}
      </div>
    </AnimatedComponent>
  )
}
```

### 3. **Exportación:**
- Usar named exports: `export const ComponentName`
- Evitar default exports para consistencia

### 4. **Estilos:**
- Usar Tailwind CSS como base
- Usar `useThemeColors()` para colores dinámicos
- Aplicar `style={{}}` para colores que cambien con tema
- Usar clases de Tailwind para todo lo demás

### 5. **Animaciones:**
- Usar `<AnimatedComponent>` para animaciones de entrada
- Tipos disponibles: `fadeIn`, `fadeInUp`, `slideInLeft`, `slideInRight`, `bounceIn`, `scaleIn`
- Configurar `delay` para secuencias

## 🚀 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

## ✅ Estado Actual

- ✅ **Estructura limpia y organizada**
- ✅ **Dependencias optimizadas**
- ✅ **Sistema de temas funcional**
- ✅ **Navegación suave entre secciones**
- ✅ **Animaciones fluidas con anime.js**
- ✅ **Soporte multiidioma**
- ✅ **Componentes reutilizables**
- ✅ **Colores dinámicos por tema**

## 🎯 Listo para Expansión

El proyecto está completamente limpio y preparado para:
- ✅ Agregar nuevos componentes fácilmente
- ✅ Mantener consistencia visual
- ✅ Escalar funcionalidades
- ✅ Integrar librerías externas
- ✅ Desarrollar nuevas secciones

---
*Última actualización: 5 de octubre de 2025*