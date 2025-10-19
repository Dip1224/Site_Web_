-- 12_profiles_roles.sql
-- Ensure profiles exist for selected auth emails and assign roles

-- Add role column to profiles if missing
do $$ begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='profiles' and column_name='role'
  ) then
    alter table public.profiles add column role text check (role in ('admin','sales','viewer')) default 'viewer';
  end if;
end $$;

-- Create profiles for provided users if not present
insert into public.profiles(id, name)
select u.id, split_part(u.email,'@',1)
from auth.users u
where u.email in (
  'luiscarlos.ribera@gmail.com',
  'jorge.orellana@gmail.com',
  'diegoarcani190@gmail.com',
  'darwin.menacho@gmail.com'
)
on conflict (id) do nothing;

-- Assign roles
update public.profiles p set role = 'admin'
from auth.users u
where p.id = u.id and u.email = 'luiscarlos.ribera@gmail.com';

update public.profiles p set role = 'sales'
from auth.users u
where p.id = u.id and u.email in ('jorge.orellana@gmail.com','diegoarcani190@gmail.com');

update public.profiles p set role = 'viewer'
from auth.users u
where p.id = u.id and u.email = 'darwin.menacho@gmail.com';

