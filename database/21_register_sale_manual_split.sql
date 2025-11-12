-- 21_register_sale_manual_split.sql
-- RPC que crea una venta con reparto manual 100% en el backend para evitar condiciones de carrera.

create or replace function public.register_sale_manual_split(
  p_customer_id uuid,
  p_amount_cents integer,
  p_note text default null,
  p_member_ids uuid[] default '{}'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_product uuid;
  v_sale_id uuid;
  v_members uuid[];
  v_count int;
  v_base int;
  v_remainder int;
begin
  if coalesce(array_length(p_member_ids, 1), 0) = 0 then
    raise exception 'member_ids no puede estar vacío';
  end if;

  select product_id into v_product
  from public.customers
  where id = p_customer_id;

  if v_product is null then
    raise exception 'El cliente no tiene producto asignado';
  end if;

  insert into public.sales(customer_id, product_id, amount_cents, status, note, sold_at, manual_split)
  values (p_customer_id, v_product, p_amount_cents, 'completed', p_note, now(), true)
  returning id into v_sale_id;

  delete from public.earnings where sale_id = v_sale_id;

  v_members := (select array(select distinct unnest(p_member_ids)));
  v_count := array_length(v_members, 1);
  if v_count is null or v_count = 0 then
    raise exception 'member_ids no puede estar vacío';
  end if;

  v_base := floor(p_amount_cents::numeric / v_count)::int;
  v_remainder := p_amount_cents - (v_base * v_count);

  insert into public.earnings(member_id, sale_id, amount_cents)
  select
    v_members[idx],
    v_sale_id,
    v_base + case when idx = 1 then v_remainder else 0 end
  from generate_subscripts(v_members, 1) as g(idx);

  return v_sale_id;
end;
$$;

grant execute on function public.register_sale_manual_split(uuid, integer, text, uuid[]) to authenticated;
grant execute on function public.register_sale_manual_split(uuid, integer, text, uuid[]) to anon;

do $$ begin
  perform pg_notify('pgrst', 'reload schema');
exception when others then null; end $$;
