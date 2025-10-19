# 🚀 Business Manager Backend API# Backend - Business Manager API



## ✅ Backend Completamente RestauradoAPI REST del sistema Business Manager desarrollado con Node.js, Express y TypeScript.



¡El backend ha sido completamente reconstruido desde cero con una arquitectura moderna y profesional!## 🚀 Tecnologías



## 🏗️ Arquitectura del Backend- **Node.js 18+** - Runtime JavaScript

- **Express.js** - Framework web minimalista

### 📁 Estructura de Directorios- **TypeScript** - Tipado estático para JavaScript

- **Supabase** - Backend as a Service para autenticación y BD

```- **Zod** - Validación de esquemas y parsing

backend/- **Helmet** - Security headers middleware

├── src/- **Morgan** - HTTP request logger

│   ├── config/- **CORS** - Cross-Origin Resource Sharing

│   │   └── supabase.ts          # Configuración de Supabase- **Express Rate Limit** - Rate limiting middleware

│   ├── controllers/- **JWT** - JSON Web Tokens para autenticación

│   │   ├── authController.ts     # Controlador de autenticación

│   │   └── clientesController.ts # Controlador de clientes## 📁 Estructura

│   ├── middleware/

│   │   └── auth.ts              # Middleware de autenticación JWT```

│   ├── models/src/

│   │   └── types.ts             # Tipos TypeScript├── routes/              # Rutas de la API

│   ├── routes/│   ├── auth.ts         # Autenticación (login, register, logout)

│   │   ├── auth.ts              # Rutas de autenticación│   └── clientes.ts     # CRUD de clientes

│   │   └── clientes.ts          # Rutas de clientes├── middleware/         # Middleware personalizado

│   ├── utils/                   # Utilidades (futuro)│   ├── auth.ts         # Middleware de autenticación JWT

│   └── index.ts                 # Servidor principal│   └── errorHandler.ts # Manejo global de errores

├── .env                         # Variables de entorno├── lib/               # Configuración y utilidades

├── package.json                 # Dependencias y scripts│   └── supabase.ts    # Cliente Supabase con service role

└── tsconfig.json               # Configuración TypeScript├── types/             # Tipos TypeScript (futuro)

```└── server.ts          # Servidor principal Express

```

## 🛠️ Tecnologías Utilizadas

## ⚡ Configuración

### Core

- **Node.js + TypeScript** - Backend typesafe### 1. Instalar dependencias

- **Express.js** - Framework web```bash

- **Supabase** - Base de datos y autenticaciónnpm install

```

### Middleware y Seguridad

- **Helmet** - Headers de seguridad### 2. Configurar variables de entorno

- **CORS** - Cross-Origin Resource Sharing```bash

- **Morgan** - Logging de requestscp .env.example .env

- **Compression** - Compresión de respuestas```

- **Express Validator** - Validación de datos

Edita `.env` con tus credenciales:

### Desarrollo```env

- **Nodemon** - Auto-reload en desarrolloNODE_ENV=development

- **ts-node** - Ejecución directa de TypeScriptPORT=3001

FRONTEND_URL=http://localhost:3000

## 🔌 Endpoints Disponibles

SUPABASE_URL=https://tu-proyecto.supabase.co

### 🏥 Health CheckSUPABASE_ANON_KEY=tu-clave-anonima

```httpSUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

GET /api/health

```JWT_SECRET=tu-jwt-secret-super-seguro

Respuesta:```

```json

{### 3. Ejecutar en desarrollo

  "status": "OK",```bash

  "message": "Business Manager API funcionando correctamente",npm run dev

  "timestamp": "2025-01-01T12:00:00.000Z",```

  "environment": "development",

  "database": "Conectada"El servidor estará disponible en: http://localhost:3001

}

```## 📦 Scripts Disponibles



### 🔐 Autenticación (`/api/auth`)- `npm run dev` - Servidor de desarrollo con hot reload

- `npm run build` - Compilar TypeScript a JavaScript

#### Registro- `npm start` - Ejecutar servidor de producción

```http- `npm run test` - Ejecutar tests (próximamente)

POST /api/auth/register

Content-Type: application/json## 🛣️ Endpoints de la API



{### Autenticación

  "email": "usuario@email.com",| Método | Endpoint | Descripción | Auth |

  "password": "password123"|--------|----------|-------------|------|

}| POST | `/api/auth/login` | Iniciar sesión | ❌ |

```| POST | `/api/auth/register` | Registrar usuario | ❌ |

| POST | `/api/auth/logout` | Cerrar sesión | ❌ |

#### Inicio de Sesión

```http### Clientes

POST /api/auth/login| Método | Endpoint | Descripción | Auth |

Content-Type: application/json|--------|----------|-------------|------|

| GET | `/api/clientes` | Listar clientes del usuario | ✅ |

{| GET | `/api/clientes/:id` | Obtener cliente específico | ✅ |

  "email": "usuario@email.com", | POST | `/api/clientes` | Crear nuevo cliente | ✅ |

  "password": "password123"| PUT | `/api/clientes/:id` | Actualizar cliente | ✅ |

}| DELETE | `/api/clientes/:id` | Eliminar cliente | ✅ |

```

### Utilidad

#### Perfil (Requiere autenticación)| Método | Endpoint | Descripción | Auth |

```http|--------|----------|-------------|------|

GET /api/auth/profile| GET | `/health` | Estado del servidor | ❌ |

Authorization: Bearer <token>

```## 📝 Ejemplos de uso



#### Cerrar Sesión### Registrar usuario

```http```bash

POST /api/auth/logoutcurl -X POST http://localhost:3001/api/auth/register \\

```  -H "Content-Type: application/json" \\

  -d '{

### 👥 Clientes (`/api/clientes`)    "email": "usuario@ejemplo.com",

    "password": "mipassword123",

Todas las rutas requieren autenticación: `Authorization: Bearer <token>`    "nombre": "Juan Pérez"

  }'

#### Obtener Todos los Clientes```

```http

GET /api/clientes### Iniciar sesión

``````bash

curl -X POST http://localhost:3001/api/auth/login \\

#### Obtener Cliente por ID  -H "Content-Type: application/json" \\

```http  -d '{

GET /api/clientes/:id    "email": "usuario@ejemplo.com",

```    "password": "mipassword123"

  }'

#### Crear Cliente```

```http

POST /api/clientes### Crear cliente (requiere autenticación)

Content-Type: application/json```bash

curl -X POST http://localhost:3001/api/clientes \\

{  -H "Content-Type: application/json" \\

  "nombre": "Juan Pérez",  -H "Authorization: Bearer tu-jwt-token" \\

  "email": "juan@email.com",  -d '{

  "telefono": "+34123456789"    "nombre": "Cliente Ejemplo",

}    "email": "cliente@ejemplo.com",

```    "telefono": "+34 123 456 789",

    "direccion": "Calle Mayor 123"

#### Actualizar Cliente  }'

```http```

PUT /api/clientes/:id

Content-Type: application/json## 🔐 Seguridad



{### Autenticación

  "nombre": "Juan Pérez García",- **Supabase Auth**: JWT tokens manejados por Supabase

  "telefono": "+34987654321"- **Middleware de autenticación**: Verificación en rutas protegidas

}- **Expiración automática**: Tokens con tiempo de vida limitado

```

### Protecciones implementadas

#### Eliminar Cliente- **Rate Limiting**: 100 requests por IP cada 15 minutos

```http- **CORS**: Configurado solo para frontend autorizado

DELETE /api/clientes/:id- **Helmet**: Headers de seguridad HTTP

```- **Validación**: Esquemas Zod en todas las rutas

- **Sanitización**: Input validation y escaping

## 🔒 Seguridad Implementada

### Variables de entorno sensibles

### Autenticación JWT con Supabase```env

- Tokens seguros generados por Supabase# ⚠️ NUNCA compartir estas claves

- Middleware de autenticación para rutas protegidasSUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

- Verificación automática de tokensJWT_SECRET=tu-jwt-secret-super-seguro

```

### Validaciones

- Validación de datos con Express Validator## 🗄️ Integración con Base de Datos

- Sanitización de inputs

- Validación de emails y longitudes### Supabase Client

- **Service Role**: Permisos completos para operaciones backend

### Headers de Seguridad- **RLS Bypass**: El service role bypasea Row Level Security

- Helmet configurado para headers seguros- **Conexión segura**: SSL/TLS encryption

- CORS configurado para frontend específico

- Rate limiting preparado (futuro)### Consultas tipo

```typescript

## 🎯 Características del Backend// Obtener clientes del usuario autenticado

const { data, error } = await supabase

### ✅ Separación de Responsabilidades  .from('clientes')

- **Controladores**: Lógica de negocio  .select('*')

- **Rutas**: Definición de endpoints y validaciones  .eq('user_id', userId)

- **Middleware**: Autenticación y validaciones  .order('created_at', { ascending: false })

- **Modelos**: Tipos TypeScript bien definidos

// Crear nuevo cliente

### ✅ Manejo de Erroresconst { data, error } = await supabase

- Middleware centralizado de manejo de errores  .from('clientes')

- Logging detallado de errores  .insert([{ ...clienteData, user_id: userId }])

- Respuestas consistentes de error  .select()

  .single()

### ✅ Validaciones Robustas```

- Validación de tipos con TypeScript

- Validación de datos con Express Validator## 🔧 Middleware

- Validación de permisos (usuarios solo ven sus datos)

### Middleware de Autenticación (`middleware/auth.ts`)

### ✅ Base de Datos Segura```typescript

- RLS (Row Level Security) en Supabase// Verifica JWT token en header Authorization

- Queries preparadas contra inyección SQL// Extrae información del usuario

- Usuarios aislados por user_id// Agrega req.user para usar en rutas

```

## 🚦 Scripts Disponibles

### Manejador de Errores (`middleware/errorHandler.ts`)

```bash```typescript

# Desarrollo con auto-reload// Manejo centralizado de errores

npm run dev// Logging detallado para debugging

// Respuestas consistentes de error

# Compilar TypeScript// Ocultación de detalles en producción

npm run build```



# Ejecutar versión compilada### Middleware de Seguridad (server.ts)

npm start```typescript

helmet()        // Security headers

# Limpiar archivos compiladoscors()          // CORS policy

npm run cleanrateLimit()     // Rate limiting

morgan()        // Request logging

# Linting```

npm run lint

npm run lint:fix## 🧪 Testing



# Tests (futuro)### Estructura de tests futura

npm test```

npm run test:watchtests/

```├── unit/           # Tests unitarios

│   ├── auth.test.ts

## 🌍 Variables de Entorno│   └── clientes.test.ts

├── integration/    # Tests de integración

Configurar en `.env`:│   └── api.test.ts

```env└── setup.ts       # Configuración de tests

# Servidor```

PORT=5000

NODE_ENV=development### Herramientas recomendadas

- **Jest**: Test runner

# Supabase- **Supertest**: Testing de APIs HTTP

SUPABASE_URL=tu-supabase-url- **Supabase Test**: Base de datos de test

SUPABASE_ANON_KEY=tu-supabase-anon-key

## 🚀 Despliegue

# Frontend

FRONTEND_URL=http://localhost:3002### Variables de entorno de producción

``````env

NODE_ENV=production

## 📊 Estado del ServidorPORT=3001

FRONTEND_URL=https://tu-frontend.vercel.app

- ✅ **Servidor**: Corriendo en puerto 5000

- ✅ **TypeScript**: Configurado y funcionandoSUPABASE_URL=https://tu-proyecto.supabase.co

- ✅ **Supabase**: Conectado y probadoSUPABASE_ANON_KEY=tu-clave-prod

- ✅ **CORS**: Configurado para frontendSUPABASE_SERVICE_ROLE_KEY=tu-service-key-prod

- ✅ **Autenticación**: JWT con Supabase Auth

- ✅ **Validaciones**: Express Validator activoJWT_SECRET=jwt-secret-super-seguro-de-produccion

- ✅ **Logging**: Morgan configurado```

- ✅ **Seguridad**: Helmet configurado

### Plataformas recomendadas

## 🔄 Integración con Frontend- **Railway**: Deploy automático desde Git

- **Heroku**: Plataforma clásica (con addon BD)

El backend está preparado para trabajar perfectamente con el frontend React:- **Render**: Alternativa moderna a Heroku

- **DigitalOcean App Platform**: VPS manejado

1. **CORS configurado** para `http://localhost:3002`- **AWS/GCP/Azure**: Cloud providers enterprise

2. **Rutas compatibles** con los hooks existentes

3. **Respuestas consistentes** en formato JSON### Configuración Railway

4. **Autenticación Supabase** compartida```json

{

## 🚀 Próximos Pasos Sugeridos  "build": {

    "builder": "NIXPACKS"

1. **Rate Limiting**: Implementar límites de requests  },

2. **Swagger Documentation**: Documentación automática de API  "deploy": {

3. **Tests**: Unit tests y integration tests    "startCommand": "npm run build && npm start",

4. **Caching**: Redis para mejorar performance    "restartPolicyType": "ON_FAILURE"

5. **Monitoring**: Logging y métricas avanzadas  }

6. **Docker**: Containerización para deployment}

```

---

## 📈 Monitoring y Logs

**¡El backend está completamente funcional y listo para uso!** 🎉

### Logs implementados

## 🧪 Pruebas Rápidas```typescript

// Morgan HTTP logs

Puedes probar inmediatamente:app.use(morgan('combined'))

- Health check: http://localhost:5000/api/health

- Usar el frontend existente sin cambios// Error logs

- Todas las funcionalidades CRUD funcionandoconsole.error('Error:', {
  message: err.message,
  stack: err.stack,
  url: req.url,
  method: req.method,
  ip: req.ip
})
```

### Herramientas recomendadas
- **PM2**: Process manager para producción
- **Winston**: Logging avanzado
- **Sentry**: Error tracking
- **DataDog/New Relic**: APM monitoring

## 🔍 Debugging

### Logs de desarrollo
```bash
# Ejecutar con logs detallados
DEBUG=* npm run dev

# Solo logs de la aplicación
DEBUG=app:* npm run dev
```

### Herramientas útiles
- **Postman**: Testing manual de APIs
- **Insomnia**: Alternativa a Postman
- **VS Code REST Client**: Testing desde editor
- **curl**: Testing desde terminal

## 🛠️ Desarrollo

### Agregar nueva ruta
```typescript
// 1. Crear archivo en src/routes/
// 2. Definir esquemas Zod
// 3. Implementar handlers
// 4. Agregar middleware si necesario
// 5. Registrar en server.ts
```

### Agregar middleware
```typescript
// 1. Crear en src/middleware/
// 2. Definir tipos TypeScript
// 3. Implementar lógica
// 4. Agregar tests
// 5. Documentar uso
```

## 📚 Recursos

- [Express.js Docs](https://expressjs.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Supabase JS Docs](https://supabase.com/docs/reference/javascript)
- [Zod Documentation](https://zod.dev)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)