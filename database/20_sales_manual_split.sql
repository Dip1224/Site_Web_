-- 20_sales_manual_split.sql
-- Permite marcar ventas con reparto manual para evitar que el trigger automático
-- inserte ganancias completas cuando se maneja la división en el frontend.

alter table public.sales
  add column if not exists manual_split boolean not null default false;

create or replace function public.distribute_sale_earnings(p_sale_id uuid)
returns void
language plpgsql
as $distribute$
declare
  v_product uuid;
  v_amount int;
  v_sum numeric;
  v_first_member uuid;
  v_manual boolean;
begin
  select product_id, amount_cents, manual_split
  into v_product, v_amount, v_manual
  from public.sales
  where id = p_sale_id;

  if v_product is null then
    return;
  end if;

  if v_manual then
    -- La venta se manejará manualmente desde la aplicación (insertará earnings personalizados)
    return;
  end if;

  select coalesce(sum(pct),0) into v_sum from public.team_shares where product_id = v_product;
  if v_sum = 0 then
    return;
  end if;

  delete from public.earnings where sale_id = p_sale_id;

  select member_id into v_first_member
  from public.team_shares
  where product_id = v_product
  order by member_id
  limit 1;

  with parts as (
    select member_id,
           floor(v_amount * (pct / v_sum))::int as share
    from public.team_shares
    where product_id = v_product
  ), totals as (
    select sum(share) as sum_shares from parts
  )
  insert into public.earnings(member_id, sale_id, amount_cents)
  select p.member_id,
         p_sale_id,
         case when p.member_id = v_first_member then p.share + (v_amount - (select sum_shares from totals))
              else p.share end
  from parts p;
end;
$distribute$;

drop trigger if exists trg_sales_distribute on public.sales;
create trigger trg_sales_distribute
  after insert on public.sales
  for each row
  execute function public.trgfn_distribute_sale();

do $$ begin
  perform pg_notify('pgrst', 'reload schema');
exception when others then null; end $$;
