# Configuración de Base de Datos - Business Manager

Este directorio contiene los scripts SQL necesarios para configurar la base de datos en Supabase.

## Orden de Ejecución

Ejecuta los scripts en el siguiente orden en la consola SQL de Supabase:

### 1. Esquema Principal (`01_schema.sql`)
Crea todas las tablas principales:
- `usuarios` - Perfiles de usuario
- `clientes` - Información de clientes
- `productos` - Productos/servicios (para futuras expansiones)
- `ventas` - Registro de ventas (para futuras expansiones)
- `venta_items` - Items individuales de ventas (para futuras expansiones)

### 2. Índices (`02_indexes.sql`)
Crea índices para optimizar el rendimiento de las consultas más comunes.

### 3. Funciones y Triggers (`03_functions.sql`)
Crea funciones y triggers para:
- Actualizar timestamps automáticamente
- Crear perfiles de usuario cuando se registran
- Calcular totales de ventas automáticamente

### 4. Políticas RLS (`04_rls_policies.sql`)
Configura Row Level Security (RLS) para asegurar que:
- Los usuarios solo puedan acceder a sus propios datos
- Se mantenga la privacidad y seguridad de los datos

### 5. Datos de Ejemplo (`05_seed_data.sql`) - OPCIONAL
Contiene datos de ejemplo para desarrollo y testing.
**¡NO ejecutar en producción!**

## Configuración en Supabase

### Paso 1: Crear Proyecto
1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva cuenta si no tienes una
3. Crea un nuevo proyecto
4. Guarda la URL y las claves API

### Paso 2: Ejecutar Scripts
1. Ve al Editor SQL en tu panel de Supabase
2. Ejecuta los scripts en orden (01, 02, 03, 04)
3. Verifica que todas las tablas se hayan creado correctamente

### Paso 3: Configurar Variables de Entorno

#### Frontend (`Pro_Web/.env`)
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima-aqui
```

#### Backend (`Pro_Web/backend/.env`)
```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-clave-anonima-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui
```

### Paso 4: Configurar Autenticación

En el panel de Supabase, ve a Authentication > Settings y configura:

1. **Confirmación de email**: Desactívala para desarrollo local
2. **URL de redirección**: Agrega `http://localhost:3000` para desarrollo
3. **Proveedores**: Configura los que necesites (por defecto solo email/password)

## Estructura de la Base de Datos

### Tabla `usuarios`
- Perfiles de usuario vinculados a Supabase Auth
- Información adicional como nombre y rol

### Tabla `clientes`
- Información de clientes de cada usuario
- Datos de contacto y dirección
- Vinculada al usuario propietario

### Tablas Futuras
- `productos`: Catálogo de productos/servicios
- `ventas`: Registro de transacciones
- `venta_items`: Detalles de cada venta

## Seguridad

- **RLS habilitado**: Cada usuario solo puede acceder a sus propios datos
- **Políticas estrictas**: Validación a nivel de base de datos
- **Triggers automáticos**: Timestamps y cálculos seguros

## Testing

Para probar la configuración:

1. Registra un usuario desde la aplicación
2. Verifica que se cree automáticamente en la tabla `usuarios`
3. Crea algunos clientes desde la aplicación
4. Verifica que solo aparezcan los clientes de ese usuario

## Troubleshooting

### Error: "relation does not exist"
- Asegúrate de haber ejecutado todos los scripts SQL
- Verifica que las tablas se crearon en el esquema `public`

### Error: "RLS policy violation"
- Verifica que el usuario esté autenticado
- Comprueba que las políticas RLS se aplicaron correctamente

### Error de conexión
- Verifica las variables de entorno
- Asegúrate de que las URLs y claves API sean correctas
