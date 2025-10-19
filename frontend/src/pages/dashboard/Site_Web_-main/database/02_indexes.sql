-- Índices para optimizar consultas

-- Índices en tabla usuarios
CREATE INDEX idx_usuarios_email ON public.usuarios(email);
CREATE INDEX idx_usuarios_rol ON public.usuarios(rol);

-- Índices en tabla clientes
CREATE INDEX idx_clientes_user_id ON public.clientes(user_id);
CREATE INDEX idx_clientes_email ON public.clientes(email);
CREATE INDEX idx_clientes_nombre ON public.clientes(nombre);
CREATE INDEX idx_clientes_created_at ON public.clientes(created_at DESC);

-- Índices en tabla productos
CREATE INDEX idx_productos_user_id ON public.productos(user_id);
CREATE INDEX idx_productos_activo ON public.productos(activo);
CREATE INDEX idx_productos_nombre ON public.productos(nombre);

-- Índices en tabla ventas
CREATE INDEX idx_ventas_user_id ON public.ventas(user_id);
CREATE INDEX idx_ventas_cliente_id ON public.ventas(cliente_id);
CREATE INDEX idx_ventas_estado ON public.ventas(estado);
CREATE INDEX idx_ventas_created_at ON public.ventas(created_at DESC);

-- Índices en tabla venta_items
CREATE INDEX idx_venta_items_venta_id ON public.venta_items(venta_id);
CREATE INDEX idx_venta_items_producto_id ON public.venta_items(producto_id);
