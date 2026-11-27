alter table public.contact_messages
  add column if not exists email_status text not null default 'pending',
  add column if not exists email_attempts integer not null default 0,
  add column if not exists email_error text,
  add column if not exists email_sent_at timestamptz;

update public.contact_messages set email_status = 'unknown'
where email_status = 'pending' and email_attempts = 0 and created_at < now() - interval '5 minutes';

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'contact_messages_email_status_check') then
    alter table public.contact_messages add constraint contact_messages_email_status_check
      check (email_status in ('pending', 'sent', 'failed', 'unconfigured', 'unknown'));
  end if;
end $$;
