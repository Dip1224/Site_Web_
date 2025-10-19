-- 10_seed_business.sql
-- Datos de ejemplo para el esquema adaptable (seguro de correr múltiples veces)
-- Inserta miembros, shares por producto, algunos clientes, mensajes y ventas.
-- Idempotencia: usa upserts y condiciones NOT EXISTS por periodos recientes.

-- Asegurar productos base (por si 09 no se ejecutó por alguna razón)
insert into public.products(name, short_code)
values ('Producto 1','1')
on conflict (short_code) do update set name = excluded.name;

insert into public.products(name, short_code)
values ('Producto 2','2')
on conflict (short_code) do update set name = excluded.name;

-- Miembros del equipo (se identifica por name para evitar duplicados)
insert into public.team_members (name, role)
select v.name, v.role
from (values
  ('Alice','Sales'),
  ('Bob','Support'),
  ('Carol','Ops')
) as v(name, role)
where not exists (
  select 1 from public.team_members tm where tm.name = v.name
);

-- Shares por producto (upsert por PK: product_id + member_id)
insert into public.team_shares (product_id, member_id, pct)
select p.id, tm.id, x.pct
from public.products p
join (
  values
    ('1','Alice',0.50),('1','Bob',0.30),('1','Carol',0.20),
    ('2','Alice',0.60),('2','Bob',0.40)
) as x(pcode, mname, pct)
  on p.short_code = x.pcode
join public.team_members tm on tm.name = x.mname
on conflict (product_id, member_id) do update set pct = excluded.pct;

-- Crear algunos clientes por producto sólo si aún no existen clientes para ese producto
do $$
declare
  has_c1 boolean;
  has_c2 boolean;
begin
  select exists (
    select 1 from public.customers c
    join public.products p on p.id = c.product_id
    where p.short_code = '1'
  ) into has_c1;

  if not has_c1 then
    insert into public.customers(product_id)
    select p.id
    from public.products p
    cross join generate_series(1,3)
    where p.short_code = '1';
  end if;

  select exists (
    select 1 from public.customers c
    join public.products p on p.id = c.product_id
    where p.short_code = '2'
  ) into has_c2;

  if not has_c2 then
    insert into public.customers(product_id)
    select p.id
    from public.products p
    cross join generate_series(1,2)
    where p.short_code = '2';
  end if;
end $$;

-- Mensajes entrantes de ejemplo si no hay actividad reciente (últimos 7 días)
insert into public.inbound_messages(product_id, channel, source, content, created_at)
select p.id, x.channel, x.source, x.content, now() - (x.days||' days')::interval
from public.products p
join (
  values
    ('1','mobile','whatsapp','Hola 👋',0),
    ('1','desktop','web','Consulta desde formulario',1),
    ('2','mobile','ig','DM inicial',2)
) as x(pcode, channel, source, content, days)
  on p.short_code = x.pcode
where not exists (
  select 1 from public.inbound_messages m
  where m.created_at > now() - interval '7 days'
);

-- Ventas de ejemplo si no hay ventas recientes (últimos 7 días)
insert into public.sales(customer_id, product_id, amount_cents, status, note, sold_at)
select c.id, p.id, x.amount_cents, 'completed', x.note, now() - (x.days||' days')::interval
from public.products p
join (
  values
    ('1', 129900, 'Venta plan Producto 1', 0),
    ('2',  99900, 'Venta plan Producto 2', 1)
) as x(pcode, amount_cents, note, days)
  on p.short_code = x.pcode
join lateral (
  select id from public.customers c
  where c.product_id = p.id
  order by created_at desc
  limit 1
) c on true
where not exists (
  select 1 from public.sales s
  where s.sold_at > now() - interval '7 days'
);

-- Vistas rápidas para verificar
-- select * from public.traffic_daily order by date desc limit 5;
-- select * from public.v_daily_activity order by date desc limit 5;
-- select * from public.v_earnings_this_month;
-- select * from public.earnings order by created_at desc limit 10;
