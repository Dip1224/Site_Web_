-- =======================================
-- SCHEMA SIMPLIFICADO PARA BUSINESS MANAGER
-- Compatible con el frontend actual
-- =======================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de clientes (simplificada para compatibilidad)
DROP TABLE IF EXISTS public.clientes CASCADE;

CREATE TABLE public.clientes (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT,
    direccion TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT clientes_email_user_unique UNIQUE (email, user_id)
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para clientes
-- Los usuarios pueden gestionar solo sus propios clientes
DROP POLICY IF EXISTS "Los usuarios pueden ver sus propios clientes" ON public.clientes;
DROP POLICY IF EXISTS "Los usuarios pueden insertar sus propios clientes" ON public.clientes;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar sus propios clientes" ON public.clientes;
DROP POLICY IF EXISTS "Los usuarios pueden eliminar sus propios clientes" ON public.clientes;

CREATE POLICY "Los usuarios pueden ver sus propios clientes" ON public.clientes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden insertar sus propios clientes" ON public.clientes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propios clientes" ON public.clientes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propios clientes" ON public.clientes
    FOR DELETE USING (auth.uid() = user_id);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_clientes_user_id ON public.clientes(user_id);
CREATE INDEX IF NOT EXISTS idx_clientes_email ON public.clientes(email);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at en clientes
DROP TRIGGER IF EXISTS update_clientes_updated_at ON public.clientes;
CREATE TRIGGER update_clientes_updated_at
    BEFORE UPDATE ON public.clientes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Datos de ejemplo (opcional)
-- INSERT INTO public.clientes (user_id, nombre, email, telefono, direccion) 
-- VALUES 
--     ('00000000-0000-0000-0000-000000000000', 'Cliente Ejemplo', 'ejemplo@correo.com', '+34 123 456 789', 'Calle Ejemplo 123');

-- Verificar que todo funciona
SELECT 'Tabla clientes creada correctamente' as resultado;