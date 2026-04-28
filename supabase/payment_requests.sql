create table if not exists public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  amount_npr numeric(10,2) not null,
  payment_method text not null,
  reference_code text not null,
  note text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  admin_note text,
  approved_by uuid references auth.users(id),
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_payment_requests_owner
  on public.payment_requests(owner_id);

create index if not exists idx_payment_requests_business
  on public.payment_requests(business_id);

create index if not exists idx_payment_requests_status
  on public.payment_requests(status);

alter table public.payment_requests enable row level security;

drop policy if exists "Owners can insert own payment requests" on public.payment_requests;
create policy "Owners can insert own payment requests"
on public.payment_requests
for insert
to authenticated
with check (auth.uid() = owner_id);

drop policy if exists "Owners can view own payment requests" on public.payment_requests;
create policy "Owners can view own payment requests"
on public.payment_requests
for select
to authenticated
using (auth.uid() = owner_id);

drop policy if exists "Admin can view all payment requests" on public.payment_requests;
create policy "Admin can view all payment requests"
on public.payment_requests
for select
to authenticated
using (auth.jwt()->>'email' = 'subedi9aseem@gmail.com');

drop policy if exists "Admin can update payment requests" on public.payment_requests;
create policy "Admin can update payment requests"
on public.payment_requests
for update
to authenticated
using (auth.jwt()->>'email' = 'subedi9aseem@gmail.com')
with check (auth.jwt()->>'email' = 'subedi9aseem@gmail.com');
