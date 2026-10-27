-- Portfolio content, privacy-aware analytics, contact inbox and public media.
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null default 'Software',
  summary text not null default '',
  concept text not null default '',
  ai_experience text not null default '',
  status text not null default 'Complete' check (status in ('Complete','In progress','Archived')),
  image_url text not null default '',
  project_url text not null default '',
  technologies text[] not null default '{}',
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_events (
  id bigint generated always as identity primary key,
  event_type text not null check (event_type in ('page_view','cv_click','contact_sent')),
  path text not null default '/',
  session_id text not null,
  created_at timestamptz not null default now(),
  event_day date not null default ((now() at time zone 'UTC')::date)
);
create index if not exists portfolio_events_type_date_idx on public.portfolio_events(event_type, created_at desc);
create unique index if not exists portfolio_page_session_daily_idx on public.portfolio_events(session_id, event_day) where event_type = 'page_view';

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null default '',
  message text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create table if not exists public.portfolio_site_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);
insert into public.portfolio_site_settings(key,value) values ('cv_url','') on conflict (key) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-media', 'portfolio-media', true, 5242880, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = excluded.allowed_mime_types;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-documents', 'portfolio-documents', true, 10485760, array['application/pdf'])
on conflict (id) do update set public = true, file_size_limit = 10485760, allowed_mime_types = excluded.allowed_mime_types;

alter table public.portfolio_projects enable row level security;
alter table public.portfolio_events enable row level security;
alter table public.contact_messages enable row level security;
alter table public.portfolio_site_settings enable row level security;
grant select on public.portfolio_projects to anon, authenticated;
grant select on public.portfolio_site_settings to anon, authenticated;
grant all on public.portfolio_projects, public.portfolio_events, public.contact_messages, public.portfolio_site_settings to service_role;

drop policy if exists "Published projects are public" on public.portfolio_projects;
create policy "Published projects are public" on public.portfolio_projects for select using (true);
drop policy if exists "CV link is public" on public.portfolio_site_settings;
create policy "CV link is public" on public.portfolio_site_settings for select using (key = 'cv_url');
drop policy if exists "Visitors can record portfolio events" on public.portfolio_events;
create policy "Visitors can record portfolio events" on public.portfolio_events for insert to anon, authenticated with check (event_type in ('page_view','cv_click','contact_sent') and length(session_id) between 12 and 80 and length(path) <= 300);
drop policy if exists "Visitors can submit contact messages" on public.contact_messages;
drop policy if exists "Public can view portfolio media" on storage.objects;
create policy "Public can view portfolio media" on storage.objects for select using (bucket_id = 'portfolio-media');
drop policy if exists "Public can view portfolio documents" on storage.objects;
create policy "Public can view portfolio documents" on storage.objects for select using (bucket_id = 'portfolio-documents');

-- Admin mutations and private analytics/inbox reads use the server-only service role,
-- after the server verifies the signed-in user ID against ADMIN_USER_ID.

insert into public.portfolio_projects (slug,title,category,summary,concept,ai_experience,status,image_url,project_url,technologies,featured,sort_order)
values
('myhostel','MyHostel.ng','Accommodation platform','A hostel discovery and rental platform designed to make student accommodation easier to find.','Brings accommodation listings and discovery into one accessible online experience.','AI-assisted planning, implementation, and interface refinement during product development.','Complete','/images/myhostel.PNG','https://myhostel.com.ng',array['Vue','Nuxt','Tailwind CSS','Supabase'],true,10),
('agrigrains','AgriGrains','Agriculture','A digital home for an agricultural business focused on cultivation, export, and crop sales.','Connects an agricultural brand with customers and partners through a clear business website.','AI-assisted development workflows for research, code iteration, and content refinement.','Complete','/images/agrigrains.PNG','https://agrigrains.com.ng',array['Vue','Nuxt','Tailwind CSS'],true,20),
('poketincome','Poketincome','Finance','A platform concept for helping non-traders explore copy-trading income opportunities.','Makes a complex financial product easier to understand through a focused digital experience.','AI-assisted planning and implementation; financial features should be independently reviewed before use.','Complete','/images/poketincome.PNG','https://poketincome.netlify.app',array['Vue','Nuxt','Tailwind CSS'],true,30),
('mooviz','Mooviz','Entertainment','A movie discovery and streaming platform centered on Nigerian cinema and international content.','Creates a viewing destination for discovering a broad mix of film and entertainment.','AI-assisted coding and design iteration as part of the software development process.','Complete','/images/moviz.PNG','https://mooviz.com.ng',array['Vue','Nuxt','Tailwind CSS'],true,40),
('phenry-technologies','Phenry Technologies','Technology','A technology company website presenting development, UI/UX, and graphic design services.','Communicates the company’s capabilities and helps prospective clients explore its services.','AI-assisted development workflows for faster prototyping and content iteration.','Complete','/images/phenrytech.PNG','https://www.phenrytech.com.ng',array['Vue','Nuxt','Tailwind CSS','Supabase','Capacitor','TypeScript','Zod'],true,50),
('phenry-os','Phenry OS','Operating system','An operating-system project exploring a custom desktop software experience.','A foundation for exploring system interfaces, desktop workflows, and software architecture.','AI supports coding research, implementation exploration, and documentation.','Complete','','',array['Nuxt','Vue','Tailwind CSS','Supabase','NestJS','PostgreSQL','Redis','Sentry'],false,60),
('yale-game','Yale Game','Game','A game project focused on interactive play and a distinct game experience.','An interactive software project built around gameplay and user engagement.','AI can support ideation, code exploration, and iteration during development.','Complete','','',array['Nuxt','Vue','Tailwind CSS','Supabase','Pinia','Vitest'],false,70),
('phenry-school-management','Phenry School Management','Education platform','A school management platform with work on secure roles, tenancy, migrations, and auditability.','Helps schools organize administration and workflows through a dedicated management system.','AI is used as a development aid for research, implementation, and documentation, with human review.','Complete','','',array['Nuxt','Vue','Supabase','Capacitor','PWA','Zod','Vitest','WhatsApp integration'],false,80),
('phenry-healthiko','Phenry Healthiko','Health platform','A health software project exploring digital tools for healthcare workflows.','A digital health product concept for organizing health-related services and information.','AI-assisted coding and research can speed development; clinical outputs require expert review.','Complete','','',array['Nuxt','Vue','Tailwind CSS','Supabase','WhatsApp integration'],false,90),
('e-commerce-management','E-commerce Management Software','Commerce platform','A multi-tenant commerce platform concept for different businesses to customize their storefronts.','One commerce system designed to serve multiple businesses with configurable experiences.','AI-assisted product planning, coding, and implementation review.','Complete','','',array['Nuxt','Vue','NestJS','Prisma','PostgreSQL','SQL','Supabase','AWS S3'],false,100),
('mimiq','Mimiq','Digital product','A digital product project under the Mimiq name.','An independent product concept represented in the desktop project collection.','Google Gemini API integration appears in the project backend dependencies, alongside AI-assisted planning and coding.','Complete','','',array['Nuxt','Vue','Fastify','Google Gemini','Supabase','WebSockets','Capacitor','WhatsApp integration'],false,110),
('my-portfolio','Oluwafernmi Portfolio','Personal portfolio','A personal portfolio for presenting software projects, skills, and contact details.','A home for a full-stack developer’s work, project concepts, technical range, and AI-assisted development experience.','AI supports research, prototypes, coding iteration, and documentation, with human review throughout.','Complete','','',array['Nuxt 4','Vue','TypeScript','Tailwind CSS','Supabase','Resend'],false,120)
on conflict (slug) do nothing;

-- A lightweight endpoint called by a daily GitHub Actions schedule. This creates
-- real database activity, but Supabase does not guarantee it prevents free-tier pausing.
create or replace function public.keep_alive()
returns jsonb language sql security definer set search_path = '' as $$
  select jsonb_build_object('alive', true, 'checked_at', now());
$$;
revoke all on function public.keep_alive() from public;
grant execute on function public.keep_alive() to anon, authenticated;

create or replace function public.record_portfolio_event(p_event_type text, p_path text, p_session_id text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if p_event_type not in ('page_view','cv_click','contact_sent')
     or length(p_session_id) not between 12 and 80
     or length(p_path) > 300 then
    raise exception 'Invalid portfolio event';
  end if;
  insert into public.portfolio_events(event_type,path,session_id)
  values (p_event_type,p_path,p_session_id)
  on conflict (session_id, event_day)
  where event_type = 'page_view' do nothing;
end;
$$;
revoke all on function public.record_portfolio_event(text,text,text) from public;
grant execute on function public.record_portfolio_event(text,text,text) to anon, authenticated;

create or replace function public.submit_portfolio_message(p_name text,p_email text,p_subject text,p_message text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  new_id uuid;
begin
  if length(trim(p_name)) not between 2 and 120
     or length(trim(p_email)) not between 3 and 254
     or p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
     or length(coalesce(p_subject,'')) > 200
     or length(trim(p_message)) not between 5 and 10000 then
    raise exception 'Invalid contact message' using errcode = '22023';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(lower(trim(p_email)), 0));
  if (select count(*) from public.contact_messages
      where lower(email) = lower(trim(p_email))
        and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'Too many messages. Please try again later.' using errcode = 'P0001';
  end if;
  insert into public.contact_messages(name,email,subject,message)
  values (trim(p_name),trim(p_email),trim(coalesce(p_subject,'')),trim(p_message))
  returning id into new_id;
  return new_id;
end;
$$;
revoke all on function public.submit_portfolio_message(text,text,text,text) from public;
grant execute on function public.submit_portfolio_message(text,text,text,text) to anon, authenticated;
