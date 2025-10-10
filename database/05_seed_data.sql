-- Datos de ejemplo para desarrollo y testing
-- ¡NO EJECUTAR EN PRODUCCIÓN!

-- Nota: Los usuarios se crearán automáticamente cuando se registren a través de Supabase Auth
-- Este script solo incluye datos de ejemplo para clientes y productos

-- Insertar algunos productos de ejemplo (reemplaza el UUID con uno real después del registro)
/*
INSERT INTO public.productos (user_id, nombre, descripcion, precio, activo) VALUES
    ('tu-user-id-aqui', 'Consultoría Básica', 'Sesión de consultoría de 1 hora', 50.00, true),
    ('tu-user-id-aqui', 'Consultoría Premium', 'Sesión de consultoría de 2 horas con reporte', 90.00, true),
    ('tu-user-id-aqui', 'Desarrollo Web', 'Página web completa', 500.00, true),
    ('tu-user-id-aqui', 'Mantenimiento Mensual', 'Mantenimiento y soporte mensual', 80.00, true);

-- Insertar algunos clientes de ejemplo
INSERT INTO public.clientes (user_id, nombre, email, telefono, direccion) VALUES
    ('tu-user-id-aqui', 'Juan Pérez', 'juan@ejemplo.com', '+34 123 456 789', 'Calle Mayor 123, Madrid'),
    ('tu-user-id-aqui', 'María García', 'maria@ejemplo.com', '+34 987 654 321', 'Av. Libertad 456, Barcelona'),
    ('tu-user-id-aqui', 'Carlos Ruiz', 'carlos@ejemplo.com', '+34 555 123 456', 'Plaza Central 789, Valencia'),
    ('tu-user-id-aqui', 'Ana Martínez', 'ana@ejemplo.com', '+34 666 789 123', 'Calle Sol 321, Sevilla');
*/

-- Script para crear un usuario de prueba (ejecutar en la consola de Supabase)
-- O usar la interfaz de Supabase para registrar un usuario de prueba
