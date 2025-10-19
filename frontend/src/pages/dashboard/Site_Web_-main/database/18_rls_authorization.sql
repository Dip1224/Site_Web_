-- 18_rls_authorization.sql
-- Restrict write operations so only a specific user can create customers and register sales/payments.
-- Others (authenticated) can view data but cannot create/modify these entities.

-- Helper: normalized email from JWT
create or replace function public.current_user_email()
returns text language sql stable as $$
  select lower(coalesce((auth.jwt() ->> 'email')::text, ''))
$$;

do $$ begin
  -- Customers
  if to_regclass('public.customers') is not null then
    alter table public.customers enable row level security;
    -- Drop permissive policies if any
    drop policy if exists select_customers_all on public.customers;
    drop policy if exists insert_customers_any on public.customers;
    drop policy if exists update_customers_any on public.customers;
    drop policy if exists delete_customers_any on public.customers;
    drop policy if exists insert_customers_diego on public.customers;
    drop policy if exists update_customers_diego on public.customers;
    drop policy if exists delete_customers_diego on public.customers;

    create policy select_customers_all on public.customers
      for select using (auth.role() in ('authenticated','anon'));

    create policy insert_customers_diego on public.customers
      for insert with check (auth.uid() = 'beb7512c-8248-48f2-96a4-8005678ac4e1');

    create policy update_customers_diego on public.customers
      for update using (auth.uid() = 'beb7512c-8248-48f2-96a4-8005678ac4e1')
                 with check (auth.uid() = 'beb7512c-8248-48f2-96a4-8005678ac4e1');

    create policy delete_customers_diego on public.customers
      for delete using (auth.uid() = 'beb7512c-8248-48f2-96a4-8005678ac4e1');
  end if;
end $$;

do $$ begin
  -- Customer profiles
  if to_regclass('public.customer_profiles') is not null then
    alter table public.customer_profiles enable row level security;
    drop policy if exists select_customer_profiles on public.customer_profiles;
    drop policy if exists insert_customer_profiles on public.customer_profiles;
    drop policy if exists update_customer_profiles on public.customer_profiles;
    drop policy if exists delete_customer_profiles on public.customer_profiles;

    create policy select_customer_profiles on public.customer_profiles
      for select using (auth.role() in ('authenticated','anon'));

    create policy insert_customer_profiles on public.customer_profiles
      for insert with check (auth.uid() = 'beb7512c-8248-48f2-96a4-8005678ac4e1');

    create policy update_customer_profiles on public.customer_profiles
      for update using (auth.uid() = 'beb7512c-8248-48f2-96a4-8005678ac4e1')
                 with check (auth.uid() = 'beb7512c-8248-48f2-96a4-8005678ac4e1');

    create policy delete_customer_profiles on public.customer_profiles
      for delete using (auth.uid() = 'beb7512c-8248-48f2-96a4-8005678ac4e1');
  end if;
end $$;

do $$ begin
  -- Subscriptions
  if to_regclass('public.subscriptions') is not null then
    alter table public.subscriptions enable row level security;
    drop policy if exists select_subscriptions_all on public.subscriptions;
    drop policy if exists insert_subscriptions_any on public.subscriptions;
    drop policy if exists update_subscriptions_any on public.subscriptions;
    drop policy if exists delete_subscriptions_any on public.subscriptions;
    drop policy if exists insert_subscriptions_diego on public.subscriptions;
    drop policy if exists update_subscriptions_diego on public.subscriptions;
    drop policy if exists delete_subscriptions_diego on public.subscriptions;

    create policy select_subscriptions_all on public.subscriptions
      for select using (auth.role() in ('authenticated','anon'));

    create policy insert_subscriptions_diego on public.subscriptions
      for insert with check (auth.uid() = 'beb7512c-8248-48f2-96a4-8005678ac4e1');

    create policy update_subscriptions_diego on public.subscriptions
      for update using (auth.uid() = 'beb7512c-8248-48f2-96a4-8005678ac4e1')
                 with check (auth.uid() = 'beb7512c-8248-48f2-96a4-8005678ac4e1');

    create policy delete_subscriptions_diego on public.subscriptions
      for delete using (auth.uid() = 'beb7512c-8248-48f2-96a4-8005678ac4e1');
  end if;
end $$;

do $$ begin
  -- Payments (ventas)
  if to_regclass('public.payments') is not null then
    alter table public.payments enable row level security;
    drop policy if exists select_payments_all on public.payments;
    drop policy if exists insert_payments_any on public.payments;
    drop policy if exists update_payments_any on public.payments;
    drop policy if exists delete_payments_any on public.payments;
    drop policy if exists insert_payments_diego on public.payments;
    drop policy if exists update_payments_diego on public.payments;
    drop policy if exists delete_payments_diego on public.payments;

    create policy select_payments_all on public.payments
      for select using (auth.role() in ('authenticated','anon'));

    create policy insert_payments_diego on public.payments
      for insert with check (auth.uid() = 'beb7512c-8248-48f2-96a4-8005678ac4e1');

    create policy update_payments_diego on public.payments
      for update using (auth.uid() = 'beb7512c-8248-48f2-96a4-8005678ac4e1')
                 with check (auth.uid() = 'beb7512c-8248-48f2-96a4-8005678ac4e1');

    create policy delete_payments_diego on public.payments
      for delete using (auth.uid() = 'beb7512c-8248-48f2-96a4-8005678ac4e1');
  end if;
end $$;

do $$ begin
  -- Sales (if used), override permissive policies from 11_rls_business.sql
  if to_regclass('public.sales') is not null then
    alter table public.sales enable row level security;
    drop policy if exists select_sales on public.sales;
    drop policy if exists insert_sales on public.sales;
    drop policy if exists update_sales on public.sales;
    drop policy if exists delete_sales on public.sales;
    drop policy if exists select_sales_all on public.sales;
    drop policy if exists insert_sales_diego on public.sales;
    drop policy if exists update_sales_diego on public.sales;
    drop policy if exists delete_sales_diego on public.sales;

    create policy select_sales_all on public.sales
      for select using (auth.role() in ('authenticated','anon'));

    create policy insert_sales_diego on public.sales
      for insert with check (auth.uid() = 'beb7512c-8248-48f2-96a4-8005678ac4e1');

    create policy update_sales_diego on public.sales
      for update using (auth.uid() = 'beb7512c-8248-48f2-96a4-8005678ac4e1')
                 with check (auth.uid() = 'beb7512c-8248-48f2-96a4-8005678ac4e1');

    create policy delete_sales_diego on public.sales
      for delete using (auth.uid() = 'beb7512c-8248-48f2-96a4-8005678ac4e1');
  end if;
end $$;

-- Notify PostgREST to reload
do $$ begin
  perform pg_notify('pgrst', 'reload schema');
exception when others then null; end $$;
