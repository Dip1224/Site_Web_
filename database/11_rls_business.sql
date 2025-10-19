-- 11_rls_business.sql
-- Políticas RLS básicas (modo desarrollo) para tablas nuevas del esquema adaptable.
-- Permisivo: permite SELECT/INSERT/UPDATE/DELETE a todos los usuarios.
-- Nota: endurecer para producción (p. ej., por producto/usuario).

-- Products
do $$ begin
  if to_regclass('public.products') is not null then
    alter table public.products enable row level security;
    drop policy if exists select_products on public.products;
    drop policy if exists insert_products on public.products;
    drop policy if exists update_products on public.products;
    drop policy if exists delete_products on public.products;
    create policy select_products on public.products for select using (true);
    create policy insert_products on public.products for insert with check (true);
    create policy update_products on public.products for update using (true) with check (true);
    create policy delete_products on public.products for delete using (true);
  end if;
end $$;

-- Product counters
do $$ begin
  if to_regclass('public.product_counters') is not null then
    alter table public.product_counters enable row level security;
    drop policy if exists select_product_counters on public.product_counters;
    drop policy if exists insert_product_counters on public.product_counters;
    drop policy if exists update_product_counters on public.product_counters;
    drop policy if exists delete_product_counters on public.product_counters;
    create policy select_product_counters on public.product_counters for select using (true);
    create policy insert_product_counters on public.product_counters for insert with check (true);
    create policy update_product_counters on public.product_counters for update using (true) with check (true);
    create policy delete_product_counters on public.product_counters for delete using (true);
  end if;
end $$;

-- Inbound messages
do $$ begin
  if to_regclass('public.inbound_messages') is not null then
    alter table public.inbound_messages enable row level security;
    drop policy if exists select_inbound_messages on public.inbound_messages;
    drop policy if exists insert_inbound_messages on public.inbound_messages;
    drop policy if exists update_inbound_messages on public.inbound_messages;
    drop policy if exists delete_inbound_messages on public.inbound_messages;
    create policy select_inbound_messages on public.inbound_messages for select using (true);
    create policy insert_inbound_messages on public.inbound_messages for insert with check (true);
    create policy update_inbound_messages on public.inbound_messages for update using (true) with check (true);
    create policy delete_inbound_messages on public.inbound_messages for delete using (true);
  end if;
end $$;

-- Team members
do $$ begin
  if to_regclass('public.team_members') is not null then
    alter table public.team_members enable row level security;
    drop policy if exists select_team_members on public.team_members;
    drop policy if exists insert_team_members on public.team_members;
    drop policy if exists update_team_members on public.team_members;
    drop policy if exists delete_team_members on public.team_members;
    create policy select_team_members on public.team_members for select using (true);
    create policy insert_team_members on public.team_members for insert with check (true);
    create policy update_team_members on public.team_members for update using (true) with check (true);
    create policy delete_team_members on public.team_members for delete using (true);
  end if;
end $$;

-- Team shares
do $$ begin
  if to_regclass('public.team_shares') is not null then
    alter table public.team_shares enable row level security;
    drop policy if exists select_team_shares on public.team_shares;
    drop policy if exists insert_team_shares on public.team_shares;
    drop policy if exists update_team_shares on public.team_shares;
    drop policy if exists delete_team_shares on public.team_shares;
    create policy select_team_shares on public.team_shares for select using (true);
    create policy insert_team_shares on public.team_shares for insert with check (true);
    create policy update_team_shares on public.team_shares for update using (true) with check (true);
    create policy delete_team_shares on public.team_shares for delete using (true);
  end if;
end $$;

-- Sales
do $$ begin
  if to_regclass('public.sales') is not null then
    alter table public.sales enable row level security;
    drop policy if exists select_sales on public.sales;
    drop policy if exists insert_sales on public.sales;
    drop policy if exists update_sales on public.sales;
    drop policy if exists delete_sales on public.sales;
    create policy select_sales on public.sales for select using (true);
    create policy insert_sales on public.sales for insert with check (true);
    create policy update_sales on public.sales for update using (true) with check (true);
    create policy delete_sales on public.sales for delete using (true);
  end if;
end $$;

-- Earnings
do $$ begin
  if to_regclass('public.earnings') is not null then
    alter table public.earnings enable row level security;
    drop policy if exists select_earnings on public.earnings;
    drop policy if exists insert_earnings on public.earnings;
    drop policy if exists update_earnings on public.earnings;
    drop policy if exists delete_earnings on public.earnings;
    create policy select_earnings on public.earnings for select using (true);
    create policy insert_earnings on public.earnings for insert with check (true);
    create policy update_earnings on public.earnings for update using (true) with check (true);
    create policy delete_earnings on public.earnings for delete using (true);
  end if;
end $$;

