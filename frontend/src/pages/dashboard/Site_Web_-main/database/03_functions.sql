-- Función para actualizar timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at automáticamente
CREATE TRIGGER update_usuarios_updated_at
    BEFORE UPDATE ON public.usuarios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at
    BEFORE UPDATE ON public.clientes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_productos_updated_at
    BEFORE UPDATE ON public.productos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ventas_updated_at
    BEFORE UPDATE ON public.ventas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Función para crear perfil de usuario automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.usuarios (id, email, nombre)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'nombre', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Función para calcular subtotal en venta_items
CREATE OR REPLACE FUNCTION calculate_subtotal()
RETURNS TRIGGER AS $$
BEGIN
    NEW.subtotal = NEW.cantidad * NEW.precio_unitario;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para calcular subtotal automáticamente
CREATE TRIGGER calculate_venta_item_subtotal
    BEFORE INSERT OR UPDATE ON public.venta_items
    FOR EACH ROW
    EXECUTE FUNCTION calculate_subtotal();

-- Función para actualizar total de venta
CREATE OR REPLACE FUNCTION update_venta_total()
RETURNS TRIGGER AS $$
DECLARE
    venta_id_val UUID;
    nuevo_total DECIMAL(10,2);
BEGIN
    -- Determinar el venta_id según la operación
    IF TG_OP = 'DELETE' THEN
        venta_id_val = OLD.venta_id;
    ELSE
        venta_id_val = NEW.venta_id;
    END IF;

    -- Calcular el nuevo total
    SELECT COALESCE(SUM(subtotal), 0)
    INTO nuevo_total
    FROM public.venta_items
    WHERE venta_id = venta_id_val;

    -- Actualizar el total en la tabla ventas
    UPDATE public.ventas
    SET total = nuevo_total
    WHERE id = venta_id_val;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar total de venta
CREATE TRIGGER update_venta_total_on_item_change
    AFTER INSERT OR UPDATE OR DELETE ON public.venta_items
    FOR EACH ROW
    EXECUTE FUNCTION update_venta_total();
