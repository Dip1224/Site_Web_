-- Adaptable business schema for WorkEz
-- Safe to run multiple times. Adds product-centric customers, sales,
-- inbound messages (for visitors), team revenue sharing, and helper views.

-- UUID helpers
-- Try to enable UUID helpers (best effort, not required)
do $$ begin
  begin
    create extension if not exists pgcrypto;
  exception when others then
    -- ignore if no permission
    null;
  end;
  begin
    create extension if not exists "uuid-ossp";
  exception when others then
    null;
  end;
end $$;

-- Helper: robust UUID generator that works even if only one extension exists
create or replace function public.gen_uuid()
returns uuid language plpgsql as $$
begin
  begin
    return gen_random_uuid();
  exception when undefined_function then
    begin
      return uuid_generate_v4();
    exception when undefined_function then
      -- last resort
      raise exception 'No UUID generator available (pgcrypto/uuid-ossp)';
    end;
  end;
end;$$;

-- Ensure base tables used by this script exist
-- Minimal customers table (compatible with 08_dashboard_schema.sql if already applied)
create table if not exists public.customers (
  id uuid primary key default public.gen_uuid(),
  user_id uuid,
  status text check (status in ('active','inactive')) default 'active',
  created_at timestamptz not null default now()
);

-- =========================
-- Products
-- =========================
create table if not exists public.products (
  id uuid primary key default public.gen_uuid(),
  name text not null,
  short_code text not null, -- e.g. '1', '2', '3'
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint products_short_code_unique unique (short_code)
);

-- Counter for per-product customer codes
create table if not exists public.product_counters (
  product_id uuid primary key references public.products(id) on delete cascade,
  next_customer_seq integer not null default 1
);

create or replace function public.ensure_product_counter(p_id uuid)
returns void language plpgsql as $$
begin
  insert into public.product_counters(product_id)
  values (p_id)
  on conflict (product_id) do nothing;
end;$$;

-- =========================
-- Customers (extend existing)
-- =========================
alter table if exists public.customers
  add column if not exists product_id uuid references public.products(id),
  add column if not exists code text;

create index if not exists customers_product_idx on public.customers(product_id);
create unique index if not exists customers_code_unique on public.customers(code) where code is not null;

-- Generate code like '<short_code>C001' per product
create or replace function public.next_customer_code(p_product_id uuid)
returns text language plpgsql as $$
declare
  pfx text;
  seq int;
begin
  if p_product_id is null then
    return null;
  end if;
  perform public.ensure_product_counter(p_product_id);
  select short_code into pfx from public.products where id = p_product_id;
  if pfx is null then
    raise exception 'Product not found for id=%', p_product_id;
  end if;
  update public.product_counters
    set next_customer_seq = next_customer_seq + 1
    where product_id = p_product_id
    returning next_customer_seq - 1 into seq;
  return pfx || 'C' || lpad(seq::text, 3, '0');
end;$$;

-- Auto-assign customer.code on insert when missing
drop trigger if exists trg_customers_autocode on public.customers;
create or replace function public.trgfn_customers_autocode()
returns trigger language plpgsql as $$
begin
  if new.code is null and new.product_id is not null then
    new.code := public.next_customer_code(new.product_id);
  end if;
  return new;
end;$$;
create trigger trg_customers_autocode
  before insert on public.customers
  for each row execute function public.trgfn_customers_autocode();

-- =========================
-- Inbound messages (used as Visitors)
-- =========================
create table if not exists public.inbound_messages (
  id bigserial primary key,
  product_id uuid references public.products(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  channel text not null default 'mobile' check (channel in ('desktop','mobile','other')),
  source text,        -- e.g., whatsapp, web-form, ig
  content text,
  created_at timestamptz not null default now()
);
create index if not exists inbound_messages_date_idx on public.inbound_messages(created_at);

-- Replace traffic_daily with messages-based aggregation
-- Safely drop traffic_daily whether it's a view or a materialized view
do $$
begin
  if exists (
    select 1 from pg_matviews
    where schemaname = 'public' and matviewname = 'traffic_daily'
  ) then
    execute 'drop materialized view public.traffic_daily';
  elsif exists (
    select 1 from pg_views
    where schemaname = 'public' and viewname = 'traffic_daily'
  ) then
    execute 'drop view public.traffic_daily';
  end if;
end
$$;
create or replace view public.traffic_daily as
select
  date_trunc('day', created_at)::date as date,
  sum(case when channel = 'desktop' then 1 else 0 end) as desktop,
  sum(case when channel = 'mobile' then 1 else 0 end) as mobile
from public.inbound_messages
where created_at >= now() - interval '120 days'
group by 1
order by 1;

-- =========================
-- Sales and team revenue sharing
-- =========================
create table if not exists public.team_members (
  id uuid primary key default public.gen_uuid(),
  name text not null,
  role text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.team_shares (
  product_id uuid references public.products(id) on delete cascade,
  member_id uuid references public.team_members(id) on delete cascade,
  pct numeric(5,4) not null check (pct >= 0 and pct <= 1),
  primary key (product_id, member_id)
);

create table if not exists public.sales (
  id uuid primary key default public.gen_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  product_id uuid not null references public.products(id) on delete set null,
  amount_cents integer not null,
  status text not null default 'completed' check (status in ('completed','refunded','failed')),
  note text,
  sold_at timestamptz not null default now()
);
create index if not exists sales_date_idx on public.sales(sold_at);

create table if not exists public.earnings (
  id uuid primary key default public.gen_uuid(),
  member_id uuid not null references public.team_members(id) on delete cascade,
  sale_id uuid not null references public.sales(id) on delete cascade,
  amount_cents integer not null,
  created_at timestamptz not null default now()
);
create index if not exists earnings_member_idx on public.earnings(member_id);

-- Distribute sale among team members based on team_shares
create or replace function public.distribute_sale_earnings(p_sale_id uuid)
returns void
language plpgsql
as $distribute$
declare
  v_product uuid;
  v_amount int;
  v_sum numeric;
  v_first_member uuid;
begin
  select product_id, amount_cents into v_product, v_amount from public.sales where id = p_sale_id;
  if v_product is null then return; end if;

  select coalesce(sum(pct),0) into v_sum from public.team_shares where product_id = v_product;
  if v_sum = 0 then
    -- No shares configured: nothing to distribute
    return;
  end if;

  -- Remove previous distributions (idempotent)
  delete from public.earnings where sale_id = p_sale_id;

  -- Insert for each member; keep remainder for first
  select member_id into v_first_member from public.team_shares where product_id = v_product order by member_id limit 1;

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

-- Wrapper trigger function because CREATE TRIGGER cannot reference NEW in the statement
create or replace function public.trgfn_distribute_sale()
returns trigger
language plpgsql
as $trg_distribute$
begin
  perform public.distribute_sale_earnings(new.id);
  return new;
end;
$trg_distribute$;

drop trigger if exists trg_sales_distribute on public.sales;
create trigger trg_sales_distribute
  after insert on public.sales
  for each row
  execute function public.trgfn_distribute_sale();

-- =========================
-- Helper views for dashboard
-- =========================
-- Daily sales and messages (simple join-by-day)
create or replace view public.v_daily_activity as
with days as (
  select generate_series((now() - interval '120 days')::date, now()::date, interval '1 day')::date as d
)
select d.d as date,
       coalesce((select count(*) from public.sales s where s.sold_at::date = d.d),0)::int as sales,
       coalesce((select count(*) from public.inbound_messages m where m.created_at::date = d.d),0)::int as messages
from days d
order by d.d;

-- Earnings this month per member
create or replace view public.v_earnings_this_month as
select e.member_id,
       sum(e.amount_cents)::int as amount_cents
from public.earnings e
where e.created_at >= date_trunc('month', now())
group by e.member_id;

-- Ensure at least two example products exist (idempotent)
insert into public.products(name, short_code)
values ('Producto 1','1')
on conflict (short_code) do update set name = excluded.name;

insert into public.products(name, short_code)
values ('Producto 2','2')
on conflict (short_code) do update set name = excluded.name;
