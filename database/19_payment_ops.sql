-- 19_payment_ops.sql
-- Secure RPCs for creating payments with a server-side email check
-- Avoids client-side RLS timing issues (401/429) by using SECURITY DEFINER

-- Fix Postgres error 42P13 by ensuring all parameters after a default also have defaults,
-- or by moving required params before optional ones. We move required args first.

drop function if exists public.create_payment_secure(uuid, uuid, integer, text);

create or replace function public.create_payment_secure(
  p_customer_id uuid,
  p_amount_cents integer,
  p_subscription_id uuid default null,
  p_note text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid;
begin
  v_uid := auth.uid();
  if v_uid <> 'beb7512c-8248-48f2-96a4-8005678ac4e1' then
    raise exception 'Not allowed';
  end if;

  insert into public.payments(customer_id, subscription_id, amount_cents, currency, status, paid_at)
  values (p_customer_id, p_subscription_id, p_amount_cents, 'BOB', 'succeeded', now());
end;
$$;

grant execute on function public.create_payment_secure(uuid, integer, uuid, text) to authenticated;
grant execute on function public.create_payment_secure(uuid, integer, uuid, text) to anon;

create or replace function public.prepay_months_secure(
  p_subscription_id uuid,
  p_months integer,
  p_month_price_cents integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid;
  v_customer uuid;
  v_total integer;
begin
  v_uid := auth.uid();
  if v_uid <> 'beb7512c-8248-48f2-96a4-8005678ac4e1' then
    raise exception 'Not allowed';
  end if;

  if p_months < 1 then
    raise exception 'Meses debe ser >= 1';
  end if;

  select customer_id into v_customer from public.subscriptions where id = p_subscription_id;
  if v_customer is null then
    raise exception 'Suscripcion no encontrada';
  end if;

  v_total := p_months * p_month_price_cents;
  if v_total <= 0 then
    raise exception 'Monto total invalido';
  end if;

  insert into public.payments(customer_id, subscription_id, amount_cents, currency, status, paid_at)
  values (v_customer, p_subscription_id, v_total, 'BOB', 'succeeded', now());
end;
$$;

grant execute on function public.prepay_months_secure(uuid, integer, integer) to authenticated;
grant execute on function public.prepay_months_secure(uuid, integer, integer) to anon;

do $$ begin
  perform pg_notify('pgrst', 'reload schema');
exception when others then null; end $$;
