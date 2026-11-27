delete from public.portfolio_events newer using public.portfolio_events older
where newer.event_type = 'cv_click' and older.event_type = 'cv_click'
  and newer.session_id = older.session_id and newer.event_day = older.event_day
  and newer.id > older.id;

create unique index if not exists portfolio_cv_session_daily_idx
  on public.portfolio_events(session_id, event_day) where event_type = 'cv_click';

create or replace function public.record_portfolio_event(p_event_type text, p_path text, p_session_id text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if p_event_type not in ('page_view','cv_click')
     or length(p_session_id) not between 12 and 80
     or length(p_path) > 300 then
    raise exception 'Invalid portfolio event';
  end if;
  insert into public.portfolio_events(event_type,path,session_id)
  values (p_event_type,p_path,p_session_id)
  on conflict do nothing;
end;
$$;
revoke all on function public.record_portfolio_event(text,text,text) from public, anon, authenticated;
grant execute on function public.record_portfolio_event(text,text,text) to service_role;
