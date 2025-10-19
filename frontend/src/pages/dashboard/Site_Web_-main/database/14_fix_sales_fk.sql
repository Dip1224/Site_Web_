-- 14_fix_sales_fk.sql
-- Permitir borrar customers aunque existan sales relacionados
-- En 09_adaptable_business_schema.sql se definió:
--   sales.customer_id uuid not null references public.customers(id) on delete set null
-- Eso impide el borrado porque el FK intenta poner NULL pero la columna es NOT NULL.
-- Solución: volver nullable customer_id.

do $$ begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='sales' and column_name='customer_id'
  ) then
    alter table public.sales alter column customer_id drop not null;
  end if;
end $$;

