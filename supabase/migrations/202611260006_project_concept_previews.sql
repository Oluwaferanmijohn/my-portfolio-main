alter table public.portfolio_projects
  add column if not exists preview_is_concept boolean not null default false;

update public.portfolio_projects set preview_is_concept = true
where slug in ('phenry-healthiko', 'e-commerce-management', 'mimiq');
