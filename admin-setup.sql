-- Run in Supabase SQL Editor. Assumes public.krathongs already exists.
create table if not exists public.krathong_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.krathong_admins enable row level security;
-- Admin users can only read their own membership record. Add membership rows manually as project owner.
drop policy if exists "admins read own membership" on public.krathong_admins;
create policy "admins read own membership" on public.krathong_admins
 for select to authenticated using (user_id = auth.uid());
grant select on public.krathong_admins to authenticated;
-- Allow authenticated admin accounts to delete krathongs only if membership is present.
drop policy if exists "admins delete krathongs" on public.krathongs;
create policy "admins delete krathongs" on public.krathongs
 for delete to authenticated using (exists (select 1 from public.krathong_admins a where a.user_id=auth.uid()));
grant delete on public.krathongs to authenticated;
