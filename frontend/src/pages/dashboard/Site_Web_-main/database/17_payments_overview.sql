-- 17_payments_overview.sql
-- RPC para listar ventas (pagos) enriquecidas con nombre, teléfono y producto

drop function if exists public.payments_overview_since(timestamptz);

create or replace function public.payments_overview_since(p_since timestamptz)
returns table (
  id uuid,
  paid_at timestamptz,
  amount_cents integer,
  status text,
  customer_id uuid,
  customer_name text,
  customer_phone text,
  product_id uuid,
  product_name text,
  product_short_code text,
  sale_id uuid
)
language sql
stable
security definer
as $$
  select
    pay.id,
    pay.paid_at,
    pay.amount_cents,
    pay.status,
    c.id as customer_id,
    cp.name as customer_name,
    cp.phone as customer_phone,
    c.product_id,
    pr.name as product_name,
    pr.short_code as product_short_code,
    sale.sale_id
  from public.payments pay
  left join public.customers c on c.id = pay.customer_id
  left join public.customer_profiles cp on cp.customer_id = c.id
  left join public.products pr on pr.id = c.product_id
  left join lateral (
    select s.id as sale_id
    from public.sales s
    where s.customer_id = pay.customer_id
      and s.amount_cents = pay.amount_cents
      and s.sold_at >= pay.paid_at - interval '10 minutes'
    order by s.sold_at desc
    limit 1
  ) sale on true
  where pay.paid_at >= coalesce(p_since, '1900-01-01'::timestamptz)
  order by pay.paid_at desc;
$$;

grant execute on function public.payments_overview_since(timestamptz) to authenticated;
grant execute on function public.payments_overview_since(timestamptz) to anon;

do $$ begin
  perform pg_notify('pgrst', 'reload schema');
exception when others then null; end $$;
