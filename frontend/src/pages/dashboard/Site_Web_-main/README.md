# 🏢 Business Manager

Sistema moderno de gestión empresarial con autenticación segura y base de datos en tiempo real.

## ✨ Características Principales

- 🔐 **Autenticación segura** con Supabase Auth
- 👥 **Gestión completa de clientes** (crear, ver, eliminar)
- 🔒 **Seguridad avanzada** con Row Level Security
- 📱 **Interfaz responsiva** y moderna
- ⚡ **Tiempo real** con sincronización automática

## 🛠️ Tecnologías

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Base de Datos**: Supabase (PostgreSQL)
- **Despliegue**: Vercel + Railway

## 🚀 Inicio Rápido

### 1. Configurar Base de Datos
1. Crear proyecto en [Supabase](https://supabase.com)
2. Ejecutar scripts SQL de `database/`
3. Copiar credenciales del proyecto

### 2. Configurar Variables de Entorno

**Frontend** (`frontend/.env`):
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima
```

**Backend** (`backend/.env`):
```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-clave-anonima
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
PORT=3004
```

### 3. Ejecutar el Sistema

```bash
# Instalar dependencias
cd frontend && npm install
cd ../backend && npm install

# Ejecutar (2 terminales)
cd backend && npm run dev    # Puerto 3004
cd frontend && npm run dev   # Puerto 3001
```

### 4. ¡Listo!
- Frontend: http://localhost:3001
- Backend: http://localhost:3004

## 📁 Estructura

```
Pro_Web/
├── frontend/          # Aplicación React
│   ├── src/
│   │   ├── App.tsx   # ✅ Componente principal completo
│   │   └── main.tsx  # Punto de entrada
│   └── .env          # ✅ Configurado con Supabase
├── backend/           # API Node.js  
│   ├── src/
│   │   └── index.ts  # ✅ Servidor funcionando
│   └── .env          # ✅ Configurado con Supabase
└── database/          # ✅ Scripts SQL ejecutados
    ├── 01_schema.sql
    ├── 02_indexes.sql
    ├── 03_functions.sql
    └── 04_rls_policies.sql
```

## 🎯 Funcionalidades Disponibles

### ✅ Implementado
- Registro e inicio de sesión
- Dashboard principal
- Crear clientes nuevos
- Ver lista de clientes
- Eliminar clientes
- Datos privados por usuario
- Interfaz profesional

### 🚧 Próximamente
- Editar clientes
- Gestión de productos
- Sistema de ventas
- Reportes y estadísticas

## 🔒 Seguridad

- **RLS (Row Level Security)**: Cada usuario ve solo sus datos
- **Autenticación JWT**: Tokens seguros
- **CORS configurado**: Acceso controlado
- **Validación de datos**: Frontend y backend

## 🌐 URLs

- **Frontend**: http://localhost:3001
- **Backend**: http://localhost:3004
- **API Health**: http://localhost:3004/api/health

## 📚 Uso

1. **Crear cuenta**: Registrarse con email y contraseña
2. **Iniciar sesión**: Acceder al sistema
3. **Agregar clientes**: Nombre, email, teléfono
4. **Gestionar datos**: Ver y eliminar clientes
5. **Cerrar sesión**: Salir de forma segura

## 🆘 Solución de Problemas

| Problema | Solución |
|----------|----------|
| Página en blanco | Verificar consola del navegador |
| Error RLS | Ejecutar scripts SQL de `database/` |
| No se conecta API | Verificar que backend esté en puerto 3004 |
| Error Supabase | Revisar variables de entorno |

## 📄 Licencia

MIT - Uso libre para proyectos personales y comerciales.

---

**Estado**: ✅ Sistema funcional y listo para usar

**Último update**: Diciembre 2025