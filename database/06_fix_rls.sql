-- 🔧 SOLUCIÓN PARA RLS ERROR
-- ===============================

-- 1. Verificar si la columna user_id existe
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'clientes' AND column_name = 'user_id';

-- 2. Si NO existe, crear la columna user_id
-- (Ejecuta solo si la consulta anterior no devuelve resultados)
ALTER TABLE clientes 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. Actualizar la política RLS para INSERT
DROP POLICY IF EXISTS "Users can insert their own clientes" ON clientes;
CREATE POLICY "Users can insert their own clientes" 
ON clientes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 4. Actualizar la política RLS para SELECT
DROP POLICY IF EXISTS "Users can view their own clientes" ON clientes;
CREATE POLICY "Users can view their own clientes" 
ON clientes FOR SELECT 
USING (auth.uid() = user_id);

-- 5. Actualizar la política RLS para UPDATE
DROP POLICY IF EXISTS "Users can update their own clientes" ON clientes;
CREATE POLICY "Users can update their own clientes" 
ON clientes FOR UPDATE 
USING (auth.uid() = user_id);

-- 6. Actualizar la política RLS para DELETE
DROP POLICY IF EXISTS "Users can delete their own clientes" ON clientes;
CREATE POLICY "Users can delete their own clientes" 
ON clientes FOR DELETE 
USING (auth.uid() = user_id);

-- 7. Verificar que RLS esté habilitado
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- 8. Verificar las políticas creadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'clientes';