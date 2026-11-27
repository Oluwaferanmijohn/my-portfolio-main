create table if not exists public.portfolio_inbound_emails (
  id uuid primary key default gen_random_uuid(),
  resend_email_id text not null unique,
  sender text not null,
  sender_email text not null,
  recipients text[] not null default '{}',
  subject text not null default '',
  body text not null default '',
  attachment_count integer not null default 0,
  received_at timestamptz not null default now(),
  read_at timestamptz
);
create index if not exists portfolio_inbound_emails_received_idx on public.portfolio_inbound_emails(received_at desc);
alter table public.portfolio_inbound_emails enable row level security;
revoke all on public.portfolio_inbound_emails from anon, authenticated;
grant all on public.portfolio_inbound_emails to service_role;
