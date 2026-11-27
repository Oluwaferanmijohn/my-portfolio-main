do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'portfolio_articles' and column_name = 'open_count') then
    alter table public.portfolio_articles add column open_count integer not null default 0;
    update public.portfolio_articles set open_count = read_count, read_count = 0;
  end if;
end $$;

create table if not exists public.portfolio_article_read_events (
  article_id uuid not null references public.portfolio_articles(id) on delete cascade,
  session_id uuid not null,
  event_day date not null default ((now() at time zone 'utc')::date),
  primary key (article_id, session_id, event_day)
);
alter table public.portfolio_article_read_events enable row level security;
revoke all on public.portfolio_article_read_events from anon, authenticated;
grant all on public.portfolio_article_read_events to service_role;

drop function if exists public.record_portfolio_article_read(text);
create function public.record_portfolio_article_read(p_slug text, p_session uuid)
returns integer language plpgsql security definer set search_path = '' as $$
declare
  target_id uuid;
  result_count integer;
  inserted integer;
begin
  select id into target_id from public.portfolio_articles where slug = p_slug and status = 'Published';
  if target_id is null then
    raise exception 'Published article not found' using errcode = 'P0002';
  end if;
  insert into public.portfolio_article_read_events(article_id,session_id)
  values (target_id,p_session) on conflict do nothing;
  get diagnostics inserted = row_count;
  if inserted = 1 then
    update public.portfolio_articles set read_count = read_count + 1 where id = target_id returning read_count into result_count;
  else
    select read_count into result_count from public.portfolio_articles where id = target_id;
  end if;
  return result_count;
end;
$$;
revoke all on function public.record_portfolio_article_read(text,uuid) from public, anon, authenticated;
grant execute on function public.record_portfolio_article_read(text,uuid) to service_role;
