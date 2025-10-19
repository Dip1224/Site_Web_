-- 15_add_customer_expires_at.sql
-- Agrega columna opcional de vencimiento a customers

do $$ begin
  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='customers') then
    begin
      alter table public.customers add column if not exists expires_at timestamptz;
    exception when others then null; end;
  end if;
end $$;

