-- ⚠️ SOLUCIÓN TEMPORAL - Solo para desarrollo
-- =============================================

-- Deshabilitar RLS temporalmente (NO usar en producción)
ALTER TABLE clientes DISABLE ROW LEVEL SECURITY;

-- Para volver a habilitar más tarde:
-- ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;