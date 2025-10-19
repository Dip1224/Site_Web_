-- Dashboard schema for metrics, analytics, and documents
-- Safe to run multiple times (IF NOT EXISTS where possible)

-- Profiles linked to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Customers and subscriptions
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  status text check (status in ('active','inactive')) default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  plan_id text,
  status text not null check (status in ('active','trialing','canceled','past_due')),
  started_at timestamptz not null default now(),
  canceled_at timestamptz
);

create index if not exists subscriptions_status_idx on public.subscriptions(status);

-- Payments (for revenue metrics)
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  amount_cents integer not null,
  currency text not null default 'USD',
  status text not null check (status in ('succeeded','refunded','failed')) default 'succeeded',
  paid_at timestamptz not null default now()
);

create index if not exists payments_paid_at_idx on public.payments(paid_at);
create index if not exists payments_customer_paid_idx on public.payments(customer_id, paid_at);

-- Analytics events (for visitors chart)
create table if not exists public.analytics_events (
  id bigserial primary key,
  occurred_at timestamptz not null default now(),
  user_id uuid references public.profiles(id),
  session_id text not null,
  device_type text not null check (device_type in ('desktop','mobile')),
  route text,
  country text
);

create index if not exists analytics_events_time_idx on public.analytics_events(occurred_at);
create index if not exists analytics_events_device_time_idx on public.analytics_events(device_type, occurred_at);

-- Daily aggregated traffic (materialized view + refresh function)
-- Ensure we drop traffic_daily regardless of object type (view or matview)
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
end$$;

create materialized view public.traffic_daily as
select
  date_trunc('day', occurred_at)::date as date,
  sum(case when device_type = 'desktop' then 1 else 0 end) as desktop,
  sum(case when device_type = 'mobile' then 1 else 0 end) as mobile
from public.analytics_events
where occurred_at >= now() - interval '120 days'
group by 1
order by 1;

create unique index if not exists traffic_daily_date_pk on public.traffic_daily(date);

-- Note: CONCURRENTLY cannot be executed inside a function/transaction.
-- Use non-concurrent refresh here to avoid runtime errors.
create or replace function public.refresh_traffic_daily()
returns void language sql security definer as $$
  refresh materialized view public.traffic_daily;
$$;

-- Documents (DataTable)
create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  owner_id uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.proposal_sections (
  id bigserial primary key,
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  header text not null,
  section_type text not null,
  status text not null check (status in ('Done','In Process')),
  target integer not null default 0,
  "limit" integer not null default 0,
  reviewer_user_id uuid references public.profiles(id),
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists proposal_sections_proposal_idx on public.proposal_sections(proposal_id);

-- View to match DataTable columns
create or replace view public.v_sections_with_reviewer as
select
  s.id::int as id,
  s.header,
  s.section_type as type,
  s.status,
  s.target::text as target,
  s."limit"::text as "limit",
  coalesce(p.name, 'Assign reviewer') as reviewer
from public.proposal_sections s
left join public.profiles p on p.id = s.reviewer_user_id
order by s.order_index, s.id;

-- Dashboard cards (aggregate metrics)
create or replace view public.v_dashboard_cards as
with revenue_cur as (
  select coalesce(sum(amount_cents),0) as cents
  from public.payments
  where status='succeeded' and paid_at >= now() - interval '30 days'
),
revenue_prev as (
  select coalesce(sum(amount_cents),0) as cents
  from public.payments
  where status='succeeded' and paid_at >= now() - interval '60 days'
    and paid_at <  now() - interval '30 days'
),
new_customers as (
  select count(*)::int as cnt
  from public.customers
  where created_at >= now() - interval '30 days'
),
active_accounts as (
  select count(*)::int as cnt from public.subscriptions where status='active'
)
select
  (select cents from revenue_cur)                 as total_revenue_cents,
  (select cnt from new_customers)                as new_customers,
  (select cnt from active_accounts)              as active_accounts,
  case when (select cents from revenue_prev) = 0 then 0
       else round(100.0 * ((select cents from revenue_cur) - (select cents from revenue_prev))
                  / nullif((select cents from revenue_prev),0), 1)
  end                                            as growth_rate_pct
;

-- Optional seed examples (comment out in production)
-- insert into profiles(id, name) values (gen_random_uuid(), 'Eddie Lake') on conflict do nothing;
