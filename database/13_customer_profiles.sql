-- 13_customer_profiles.sql
-- Perfil de clientes: nombre/telefono vinculado a customers

create table if not exists public.customer_profiles (
  customer_id uuid primary key references public.customers(id) on delete cascade,
  name text,
  phone text,
  email text,
  created_at timestamptz not null default now()
);

-- RLS de desarrollo (permisivo)
do $$ begin
  alter table public.customer_profiles enable row level security;
  drop policy if exists select_customer_profiles on public.customer_profiles;
  drop policy if exists insert_customer_profiles on public.customer_profiles;
  drop policy if exists update_customer_profiles on public.customer_profiles;
  drop policy if exists delete_customer_profiles on public.customer_profiles;
  create policy select_customer_profiles on public.customer_profiles for select using (true);
  create policy insert_customer_profiles on public.customer_profiles for insert with check (true);
  create policy update_customer_profiles on public.customer_profiles for update using (true) with check (true);
  create policy delete_customer_profiles on public.customer_profiles for delete using (true);
exception when others then null; end $$;

