alter table public.contact_messages add column if not exists sender_ip_hash text;
create index if not exists contact_messages_ip_created_idx on public.contact_messages(sender_ip_hash, created_at desc);

drop function if exists public.submit_portfolio_message(text,text,text,text);
create function public.submit_portfolio_message(p_name text,p_email text,p_subject text,p_message text,p_ip_hash text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  new_id uuid;
begin
  if length(trim(p_name)) not between 2 and 120
     or length(trim(p_email)) not between 3 and 254
     or p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
     or length(coalesce(p_subject,'')) > 200
     or length(trim(p_message)) not between 5 and 10000
     or p_ip_hash is null or p_ip_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid contact message' using errcode = '22023';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_ip_hash, 1));
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(lower(trim(p_email)), 0));
  if (select count(*) from public.contact_messages
      where lower(email) = lower(trim(p_email)) and created_at > now() - interval '1 hour') >= 5
     or (select count(*) from public.contact_messages
      where sender_ip_hash = p_ip_hash and created_at > now() - interval '1 hour') >= 10
     or (select count(*) from public.contact_messages
      where sender_ip_hash = p_ip_hash and created_at > now() - interval '1 day') >= 30 then
    raise exception 'Too many messages. Please try again later.' using errcode = 'P0001';
  end if;
  insert into public.contact_messages(name,email,subject,message,sender_ip_hash)
  values (trim(p_name),trim(p_email),trim(coalesce(p_subject,'')),trim(p_message),p_ip_hash)
  returning id into new_id;
  return new_id;
end;
$$;
revoke all on function public.submit_portfolio_message(text,text,text,text,text) from public, anon, authenticated;
grant execute on function public.submit_portfolio_message(text,text,text,text,text) to service_role;
