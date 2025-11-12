-- 22_cleanup_manual_earnings.sql
-- Limpia los registros de earnings generados incorrectamente para ventas manuales,
-- permitiendo volver a asignar los montos desde la interfaz (editar venta).

create table if not exists public.manual_earnings_backup (
  cleaned_at timestamptz not null,
  earning_id uuid primary key,
  sale_id uuid not null,
  member_id uuid not null,
  amount_cents integer not null,
  customer_id uuid,
  sale_amount integer
);

insert into public.manual_earnings_backup(cleaned_at, earning_id, sale_id, member_id, amount_cents, customer_id, sale_amount)
select
  now(),
  e.id,
  e.sale_id,
  e.member_id,
  e.amount_cents,
  s.customer_id,
  s.amount_cents
from public.earnings e
join public.sales s on s.id = e.sale_id
where s.manual_split = true
  and not exists (
    select 1 from public.manual_earnings_backup b where b.earning_id = e.id
  );

delete from public.earnings e
using public.sales s
where e.sale_id = s.id
  and s.manual_split = true;

update public.sales
set note = coalesce(note, '') || ' (reparto pendiente)'
where manual_split = true
  and not exists (select 1 from public.earnings where sale_id = public.sales.id);

do $$ begin
  perform pg_notify('pgrst', 'reload schema');
exception when others then null; end $$;
