-- 16_ganancias_overview.sql
-- Single-call overview for Ganancias: totals (hoy/mes/cantidad) + por miembro

create or replace function public.ganancias_overview()
returns jsonb
language sql
stable
security definer
as $$
with bounds as (
  select date_trunc('day', now()) as start_day,
         date_trunc('month', now()) as start_month
), month_rows as (
  select amount_cents, paid_at
  from public.payments
  where status = 'succeeded'
    and paid_at >= (select start_month from bounds)
), totals as (
  select
    coalesce(sum(amount_cents),0)::int as month_total_cents,
    coalesce(sum(case when paid_at >= (select start_day from bounds) then amount_cents else 0 end),0)::int as today_total_cents,
    count(*)::int as month_count
  from month_rows
), members as (
  select e.member_id, coalesce(sum(e.amount_cents),0)::int as amount_cents
  from public.earnings e
  where e.created_at >= date_trunc('month', now())
  group by e.member_id
), members_with_name as (
  select m.member_id,
         coalesce(tm.name, left(m.member_id::text, 8)) as member_name,
         m.amount_cents
  from members m
  left join public.team_members tm on tm.id = m.member_id
)
select jsonb_build_object(
  'totals', (select to_jsonb(t) from totals t),
  'by_member', coalesce((select jsonb_agg(to_jsonb(mn) order by mn.member_name) from members_with_name mn), '[]'::jsonb)
);
$$;

-- Allow API roles to call it
grant execute on function public.ganancias_overview() to authenticated;
grant execute on function public.ganancias_overview() to anon;

-- Ask PostgREST to reload its schema cache so the RPC becomes available immediately
do $$ begin
  perform pg_notify('pgrst', 'reload schema');
exception when others then null; end $$;
