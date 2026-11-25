-- Track article reads as an aggregate only. No visitor or session identifiers are stored.
alter table public.portfolio_articles
  add column if not exists read_count integer not null default 0 check (read_count >= 0);

create or replace function public.record_portfolio_article_read(p_slug text)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated_count integer;
begin
  if p_slug is null or length(p_slug) > 180 then
    raise exception 'Invalid article slug' using errcode = '22023';
  end if;

  update public.portfolio_articles
     set read_count = read_count + 1
   where slug = p_slug
     and status = 'Published'
   returning read_count into updated_count;

  if updated_count is null then
    raise exception 'Published article not found' using errcode = 'P0002';
  end if;

  return updated_count;
end;
$$;

revoke all on function public.record_portfolio_article_read(text) from public;
grant execute on function public.record_portfolio_article_read(text) to anon, authenticated;
