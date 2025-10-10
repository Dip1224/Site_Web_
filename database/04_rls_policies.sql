-- Habilitar RLS (Row Level Security) en todas las tablas
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venta_items ENABLE ROW LEVEL SECURITY;

-- Políticas para tabla usuarios
-- Los usuarios pueden ver y editar solo su propio perfil
CREATE POLICY "Los usuarios pueden ver su propio perfil" ON public.usuarios
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil" ON public.usuarios
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden insertar su propio perfil" ON public.usuarios
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para tabla clientes
-- Los usuarios pueden gestionar solo sus propios clientes
CREATE POLICY "Los usuarios pueden ver sus propios clientes" ON public.clientes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden insertar sus propios clientes" ON public.clientes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propios clientes" ON public.clientes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propios clientes" ON public.clientes
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para tabla productos
-- Los usuarios pueden gestionar solo sus propios productos
CREATE POLICY "Los usuarios pueden ver sus propios productos" ON public.productos
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden insertar sus propios productos" ON public.productos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propios productos" ON public.productos
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propios productos" ON public.productos
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para tabla ventas
-- Los usuarios pueden gestionar solo sus propias ventas
CREATE POLICY "Los usuarios pueden ver sus propias ventas" ON public.ventas
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden insertar sus propias ventas" ON public.ventas
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propias ventas" ON public.ventas
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propias ventas" ON public.ventas
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para tabla venta_items
-- Los usuarios pueden gestionar items solo de sus propias ventas
CREATE POLICY "Los usuarios pueden ver items de sus propias ventas" ON public.venta_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.ventas
            WHERE ventas.id = venta_items.venta_id
            AND ventas.user_id = auth.uid()
        )
    );

CREATE POLICY "Los usuarios pueden insertar items en sus propias ventas" ON public.venta_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.ventas
            WHERE ventas.id = venta_items.venta_id
            AND ventas.user_id = auth.uid()
        )
    );

CREATE POLICY "Los usuarios pueden actualizar items de sus propias ventas" ON public.venta_items
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.ventas
            WHERE ventas.id = venta_items.venta_id
            AND ventas.user_id = auth.uid()
        )
    );

CREATE POLICY "Los usuarios pueden eliminar items de sus propias ventas" ON public.venta_items
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.ventas
            WHERE ventas.id = venta_items.venta_id
            AND ventas.user_id = auth.uid()
        )
    );
