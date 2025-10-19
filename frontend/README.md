# Frontend — Pro_Web (WorkEz)

Este README explica de forma detallada cada parte del frontend, su responsabilidad y cómo probar/desarrollar la aplicación. Está escrito en español y orientado a desarrolladores que trabajan sobre la landing/SPA principal.

---

## Resumen del proyecto
- Stack: React + TypeScript, Vite, Tailwind CSS.
- Objetivo: Landing page animada con sistema de temas (claro/oscuro), partículas de fondo, componentes 3D (CometCard, CardFlip) y UI reutilizable.

---

## Cómo ejecutar localmente
1. Instalar dependencias

```bash
cd frontend
npm install
```

2. Ejecutar en modo desarrollo

```bash
npm run dev
```

3. Build de producción

```bash
npm run build
npm run preview
```

La app se sirve normalmente en http://localhost:3000 (Vite puede cambiar el puerto si 3000 está en uso).

---

## Estructura principal (`src/`)

Resumen de carpetas y archivos clave:

- `App.tsx` — Orquesta la landing: fondos, header, secciones (home, servicios, nosotros, FAQ), y efectos (StarsBackground, Particles, GlowingEffect). Consume la paleta con `useThemeColors()`.
- `main.tsx` — Punto de arranque que monta `<ThemeProvider>` y renderiza `<App />`.
- `contexts/` — Contextos globales (Theme, Auth, Language).
- `hooks/` — Hooks reutilizables, por ejemplo `useThemeColors` para obtener paletas dinámicas.
- `components/` — Componentes UI y visuales (Header, Partículas, CometCard, CardFlip, ShimmerText, etc.).
- `pages/` — Páginas o secciones como `LoginPage.tsx`.
- `index.css` — Variables CSS, utilidades Tailwind personalizadas y estilos globales.
- `tailwind.config.js` — Configuración de Tailwind (colores referenciando `var(--...)`).

---

## Descripción detallada por parte

### `src/App.tsx`
- Función: punto central de la UI. Renderiza el layout, aplica la paleta, y agrega los efectos de fondo.
- Importante: varias secciones utilizan `style={{ background: colors.mainBackground }}` o gradientes con `useThemeColors()`.
- Contiene utilidades JS para scroll suave y animaciones de inicio.

### `src/contexts/ThemeContext.tsx`
- Función: controla el tema (`light` | `dark`) y expone `isDark` y `toggleTheme()`.
- Responsabilidad adicional recomendable: sincronizar variables CSS (`--background`, `--foreground`, `--primary`, `--border`, ...) en `:root` para que las clases de Tailwind que referencian `hsl(var(--...))` reaccionen al cambio de tema.

### `src/contexts/AuthContext.tsx`
- Función: gestión de autenticación (login, logout, user), persistencia y helpers para rutas protegidas.

### `src/contexts/LanguageContext.tsx`
- Función: control de idioma (ES/EN), `t()` para textos y `language` state.

### `src/hooks/useThemeColors.ts`
- Función: devuelve la paleta actual en forma de objeto (colores para mainBackground, overlayGradient, primaryGreen, accentGreen, foreground, background, border, textPrimary, gridColor, etc.).
- Uso: los componentes que requieren colores dinámicos importan y usan este hook.

### `src/components/Header.tsx`
- Función: barra de navegación superior, control de idioma y toggle de tema.
- Usa `useTheme()` y `useThemeColors()` para pintar botones y fondo del header.

### Fondo y efectos
- `StarsBackground.tsx` / `ui/stars-background-clean.tsx`: estrellas/partículas fijas en el fondo; usan `colors` para adaptarse al tema.
- `Particles.tsx`: partículas interactivas (siguen el cursor o se mueven con parámetros configurable: quantity, size, speed).
- `ui/meteors.tsx`: meteoritos animados (efecto visual adicional).

### Componentes principales
- `CometCard.tsx`: tarjeta con efecto 3D y movimiento tipo cometa; usa `framer-motion`.
- `CardFlip.tsx`: tarjeta que gira (front/back) al hover.
- `ShimmerText.tsx`: texto con efecto shimmer para títulos.
- `GlowingEffect.tsx`: halo brillante reutilizable detrás de elementos.
- `ui/*`: componentes básicos (Button, Input, Accordion, LynxLogo, etc.).

### Páginas
- `pages/LoginPage.tsx`: page/modal de login que utiliza gradientes y círculos de fondo según `useThemeColors()`.

---

## Estilos y theming

- `index.css`: define variables CSS en `:root` y una sección `.dark` con valores alternos. También contiene utilidades y animaciones personalizadas.
- `tailwind.config.js`: configurado para usar variables CSS (ej: `background: 'hsl(var(--background))'`). Asegúrate que `darkMode` esté en `class` si usas la clase `dark` en `document.documentElement`.

Punto crítico: los componentes pueden usar tanto clases Tailwind (ej. `bg-white`) como estilos inline con `colors`. Si una parte del UI no cambia con el tema, comprueba:

1. Si usa clases fijas como `bg-white` → cambiar a `bg-[hsl(var(--background))]` o usar inline con `colors.background`.
2. Si `ThemeContext` no sincroniza variables CSS → sincronizar `--background`, `--foreground`, etc. en `document.documentElement.style`.

---

## Debugging rápido

- Console logs: `useThemeColors()` tiene logs que indican `isDark` y la paleta aplicada.
- DevTools: inspecciona `:root` y verifica variables CSS.
- Prueba: alterna el toggle de tema y observa que `--background`, `--foreground` y `--primary` cambien.

---

## Sugerencias de mejora

- Extraer paleta a `src/theme/palette.ts` y que `useThemeColors` y `ThemeContext` la consuman.
- Añadir tests visuales (Cypress) que verifiquen que el tema se aplica correctamente.
- Añadir un modo de desarrollo para togglear efectos de fondo (Particles, Stars) sin editar `App.tsx`.

---

Si quieres que adapte este README a `README.es.md` y `README.en.md` (español/inglés) o que lo reduzca a una versión corta para `README.md` raíz, lo hago ahora.


### Herramientas de desarrollo
- **React DevTools**: Inspector de componentes
- **Supabase Dashboard**: Logs y analytics
- **Browser DevTools**: Network, Console, Sources
- **Vite HMR**: Hot Module Replacement

### Logs comunes
```javascript
// Debugging de autenticación
console.log('User:', user)
console.log('Session:', session)

// Debugging de API calls
console.log('Supabase response:', data, error)

// Debugging de estado
console.log('Component state:', componentState)
```

## 🤝 Contribución

### Convenciones de código
- **TypeScript**: Tipado estricto
- **ESLint**: Linting automático
- **Prettier**: Formateo de código
- **Conventional Commits**: Mensajes estandarizados

### Pull Request checklist
- [ ] Tests pasando
- [ ] Tipos TypeScript correctos
- [ ] Estilos responsive
- [ ] Accesibilidad básica
- [ ] Documentación actualizada

## 📚 Recursos

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide)
- [Supabase Docs](https://supabase.com/docs)
