# Frontend - Business Manager

Frontend de la aplicación Business Manager desarrollado con React, TypeScript y Vite.

## 🚀 Tecnologías

- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework CSS utility-first
- **React Router** - Enrutamiento SPA
- **Supabase** - Cliente para autenticación y base de datos
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas
- **Lucide React** - Iconos modernos

## 📁 Estructura

```
src/
├── components/          # Componentes reutilizables
│   ├── Layout.tsx      # Layout principal de la app
│   ├── Header.tsx      # Barra de navegación superior
│   ├── Sidebar.tsx     # Menú lateral
│   ├── ProtectedRoute.tsx  # HOC para rutas protegidas
│   └── ClienteModal.tsx    # Modal para gestión de clientes
├── pages/              # Páginas principales
│   ├── Login.tsx       # Página de autenticación
│   ├── Dashboard.tsx   # Dashboard principal
│   └── Clients.tsx     # Gestión de clientes
├── context/            # Context API
│   └── AuthContext.tsx # Contexto de autenticación
├── types/              # Definiciones TypeScript
│   ├── index.ts        # Tipos principales
│   └── database.types.ts # Tipos de base de datos
├── lib/                # Configuraciones
│   └── supabase.ts     # Cliente Supabase
├── App.tsx             # Componente principal
├── main.tsx            # Punto de entrada
└── index.css           # Estilos globales
```

## ⚡ Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de Supabase:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima
```

### 3. Ejecutar en desarrollo
```bash
npm run dev
```

La aplicación estará disponible en: http://localhost:3000

## 📦 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Preview del build
- `npm run lint` - Linter ESLint

## 🏗️ Arquitectura

### Autenticación
- **Context API**: Gestión global del estado de autenticación
- **Rutas protegidas**: HOC que verifica autenticación
- **Supabase Auth**: Sistema de autenticación backend

### Estado de la Aplicación
- **React Context**: Para autenticación y estado global
- **React useState/useEffect**: Para estado local de componentes
- **Supabase Realtime**: Para sincronización en tiempo real

### Navegación
- **React Router v6**: Enrutamiento declarativo
- **Navegación programática**: useNavigate hook
- **Rutas anidadas**: Layout con outlet

### Estilos
- **Tailwind CSS**: Utility-first CSS framework
- **Componentes personalizados**: Clases reutilizables en index.css
- **Responsive Design**: Mobile-first approach
- **Modo oscuro**: Preparado para implementar

## 🎨 Sistema de Diseño

### Colores Principales
- **Primary**: Azul (#3b82f6)
- **Secondary**: Gris (#6b7280)
- **Success**: Verde (#10b981)
- **Error**: Rojo (#ef4444)
- **Warning**: Amarillo (#f59e0b)

### Componentes Base
- **Botones**: `.btn`, `.btn-primary`, `.btn-secondary`
- **Formularios**: `.form-input`, `.form-label`
- **Cards**: `.card` (definir según necesidad)
- **Modals**: Componente ClienteModal como referencia

### Breakpoints
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## 🔐 Seguridad

### Autenticación
- **JWT Tokens**: Manejados automáticamente por Supabase
- **Refresh automático**: Renovación transparente de tokens
- **Logout seguro**: Limpieza completa de sesión

### Validaciones
- **Frontend**: Validación con Zod y React Hook Form
- **Sanitización**: Escape automático de JSX
- **CSRF Protection**: Manejado por Supabase

## 🚀 Despliegue

### Build de producción
```bash
npm run build
```

### Variables de entorno de producción
```env
VITE_SUPABASE_URL=https://tu-proyecto-prod.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima-prod
```

### Plataformas recomendadas
- **Vercel**: Deploy automático desde Git
- **Netlify**: Deploy con build automático
- **GitHub Pages**: Para demos estáticos
- **Firebase Hosting**: Alternativa de Google

### Configuración para Vercel
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

## 🧪 Testing

### Configuración futura
- **Vitest**: Test runner para Vite
- **React Testing Library**: Testing de componentes
- **Jest DOM**: Matchers adicionales
- **Cypress**: Tests end-to-end

## 🔧 Desarrollo

### Agregar nueva página
1. Crear componente en `src/pages/`
2. Agregar ruta en `App.tsx`
3. Actualizar navegación en `Sidebar.tsx`

### Agregar nuevo componente
1. Crear archivo en `src/components/`
2. Definir props con TypeScript
3. Implementar estilos con Tailwind
4. Documentar uso en comentarios

### Integrar nueva API
1. Definir tipos en `src/types/`
2. Crear funciones en `src/lib/`
3. Implementar en componentes
4. Manejar estados de loading/error

## 📈 Performance

### Optimizaciones implementadas
- **Code splitting**: Rutas lazy-loaded preparado
- **Tree shaking**: Build optimizado con Vite
- **Asset optimization**: Compresión automática
- **Bundle analysis**: npm run build --analyze

### Mejoras futuras
- **React.memo**: Componentes memorizados
- **useMemo/useCallback**: Optimización de hooks
- **Lazy loading**: Componentes y rutas
- **Service Workers**: Cache offline

## 🐛 Debugging

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