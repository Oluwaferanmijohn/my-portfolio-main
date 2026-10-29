-- Blog publishing, article cover media and admin web push subscriptions.
create table if not exists public.portfolio_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  category text not null default 'Notes',
  image_url text not null default '',
  image_urls text[] not null default '{}',
  status text not null default 'Draft' check (status in ('Draft', 'Published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists portfolio_articles_published_idx
  on public.portfolio_articles(published_at desc) where status = 'Published';
alter table public.portfolio_articles enable row level security;
grant select on public.portfolio_articles to anon, authenticated;
grant all on public.portfolio_articles to service_role;
drop policy if exists "Published articles are public" on public.portfolio_articles;
create policy "Published articles are public" on public.portfolio_articles
  for select using (status = 'Published');

create table if not exists public.portfolio_push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  subscription jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists portfolio_push_subscriptions_user_idx
  on public.portfolio_push_subscriptions(user_id);
alter table public.portfolio_push_subscriptions enable row level security;
grant all on public.portfolio_push_subscriptions to service_role;

-- Sample posts let the new public blog be previewed immediately after migration.
insert into public.portfolio_articles
  (slug, title, excerpt, content, category, image_url, status, published_at)
values
  ('building-products-for-real-people', 'Building products for real people',
   'A useful product starts with understanding the person who needs it.',
   E'A good interface is only one part of a useful product. Before choosing a framework or drawing screens, I try to understand who will use the product and what they need to get done.\n\nThat understanding shapes the details: the words on a button, the way a form recovers from an error, and how quickly someone can find what matters.\n\nI keep coming back to one question while building: does this make the next step clearer for the person using it?',
   'Product thinking', '', 'Published', now() - interval '2 days'),
  ('learning-across-the-stack', 'What I learn by working across the stack',
   'Moving between the interface, API, and database changes how I think about software.',
   E'Working across the stack has taught me to follow a feature all the way through. A form on a page depends on an API, the API depends on a data model, and each layer affects the experience someone gets.\n\nSeeing those connections helps me make better tradeoffs. I can keep the interface simple while checking that the data underneath it stays clear and maintainable.\n\nThere is always more to learn, but that end-to-end view is one of the most useful habits I have developed.',
   'Development', '', 'Published', now() - interval '5 days'),
  ('using-ai-with-intention', 'Using AI as a tool, with intention',
   'AI can speed up parts of software work, while the developer remains responsible for the result.',
   E'I use AI tools to explore ideas, get unstuck, and speed up repetitive parts of development. They can be useful for comparing approaches, drafting code, and improving documentation.\n\nThe output still needs context and review. I check how a suggestion fits the project, validate important behavior, and make the final decisions myself.\n\nFor me, AI works best as part of a thoughtful workflow: useful support, clear responsibility, and attention to the people who will use what I build.',
   'AI and software', '/images/article-ai-cover.jpg', 'Published', now() - interval '8 days')
on conflict (slug) do nothing;
