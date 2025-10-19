-- 13_customer_code_maintenance.sql
-- Mantención de códigos de clientes por producto
-- - Protege los códigos base '…C001' (no se pueden borrar)
-- - Recalcula el contador (product_counters.next_customer_seq) según el máximo existente
-- - Ajusta automáticamente el contador después de eliminaciones

-- Helper: asegura fila en product_counters
create or replace function public.ensure_product_counter(p_id uuid)
returns void language plpgsql as $$
begin
  insert into public.product_counters(product_id)
  values (p_id)
  on conflict (product_id) do nothing;
end;$$;

-- Extrae el número secuencial de un código tipo '<short>CNNN' (p.ej. '1C004' -> 4)
create or replace function public.customer_code_seq(p_code text)
returns int language sql immutable as $$
  select coalesce(nullif(regexp_replace(p_code, '.*C', ''), '')::int, 0);
$$;

-- Recalcula el siguiente número para un producto específico
create or replace function public.recompute_product_counter(p_product_id uuid)
returns void language plpgsql as $$
declare
  v_max_seq int;
begin
  if p_product_id is null then return; end if;
  perform public.ensure_product_counter(p_product_id);
  select coalesce(max(public.customer_code_seq(code)), 0) into v_max_seq
  from public.customers
  where product_id = p_product_id and code is not null;

  update public.product_counters pc
  set next_customer_seq = greatest(coalesce(v_max_seq, 0) + 1, 1)
  where pc.product_id = p_product_id;
end;$$;

-- Recalcula todos los productos (útil después de borrados masivos)
create or replace function public.reset_all_customer_counters()
returns void language plpgsql as $$
begin
  -- Asegura counters para todos los productos existentes
  insert into public.product_counters(product_id)
  select p.id from public.products p
  on conflict (product_id) do nothing;

  -- Ajusta cada producto según el máximo código actual
  update public.product_counters pc
  set next_customer_seq = sub.max_seq + 1
  from (
    select c.product_id,
           coalesce(max(public.customer_code_seq(c.code)), 0) as max_seq
    from public.customers c
    where c.code is not null
    group by c.product_id
  ) sub
  where pc.product_id = sub.product_id;
end;$$;

-- Trigger: Proteger eliminación de códigos base '…C001'
drop trigger if exists trg_customers_protect_first on public.customers;
create or replace function public.trgfn_customers_protect_first()
returns trigger language plpgsql as $$
begin
  if old.code is not null and old.code ~ '^[0-9]+C001$' then
    raise exception 'No se permite borrar el cliente con código %', old.code;
  end if;
  return old;
end;$$;
create trigger trg_customers_protect_first
  before delete on public.customers
  for each row execute function public.trgfn_customers_protect_first();

-- A partir de aqu se elimina la proteccin para permitir borrar '...C001'
do $$ begin
  begin
    drop trigger if exists trg_customers_protect_first on public.customers;
  exception when others then null; end;
  begin
    drop function if exists public.trgfn_customers_protect_first();
  exception when others then null; end;
end $$;

-- Trigger: tras borrar, recalcular el counter del producto afectado
drop trigger if exists trg_customers_after_delete on public.customers;
create or replace function public.trgfn_customers_after_delete()
returns trigger language plpgsql as $$
begin
  perform public.recompute_product_counter(old.product_id);
  return old;
end;$$;
create trigger trg_customers_after_delete
  after delete on public.customers
  for each row execute function public.trgfn_customers_after_delete();

-- Nota de uso:
-- 1) Para limpieza total dejando las bases (…C001), puedes hacer:
--    delete from public.customers where code is not null and code !~ '^[0-9]+C001$';
--    select public.reset_all_customer_counters();
-- 2) Después de eliminaciones normales, el trigger ajusta automáticamente el contador
--    para que el próximo cliente tome el siguiente número correcto por producto.
