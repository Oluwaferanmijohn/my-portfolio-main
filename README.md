# Oluwafernmi Portfolio

A Nuxt 4 portfolio with Tailwind CSS, Supabase-backed projects, articles and media, an authenticated owner dashboard, privacy-light usage counts, Resend email notifications, and installable PWA push alerts.

## Local setup

1. Install Node.js `^22.22.3`, `^24.15.0`, or `26+` (required by the current Nuxt toolchain).
2. Run `npm install` and copy `.env.example` to `.env`.
3. Create a Supabase project. Create an Auth user for the portfolio owner and set `ADMIN_USER_ID` to that user's UUID. Disable public sign-ups after creating the admin user.
4. Fill in `SUPABASE_URL`, `SUPABASE_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in `.env`. The service role key is server-only; never add it to a `NUXT_PUBLIC_*` variable.
5. In the Supabase SQL Editor, apply `supabase/migrations/202610270001_portfolio.sql`.
6. Apply `supabase/migrations/202610280001_articles_and_push.sql`. This adds blog publishing and device subscriptions, and seeds three sample articles (including one with a cover image) for the first preview.
7. Apply `supabase/migrations/202610290001_article_read_counts.sql`. This adds aggregate article readership counts without storing visitor identities.
8. Apply `supabase/migrations/202611260001_contact_email_delivery.sql`, `202611260002_contact_ip_rate_limit.sql`, and `202611260003_inbound_email.sql` in that order. Apply these before deploying the matching code because the contact form RPC changes in the second migration.
9. Apply `supabase/migrations/202611260004_article_engaged_reads.sql`, `202611260005_analytics_server_sessions.sql`, and `202611260006_project_concept_previews.sql` in that order.
10. Run `npm run seed:images` to upload existing project images and the sample article cover into Supabase Storage and update their records. New project, article, and CV images can be uploaded through the dashboard.
11. Set `RESEND_API_KEY`, `CONTACT_EMAIL`, and a verified `FROM_EMAIL` to receive email notifications. Every contact form message is stored in Supabase and appears in the dashboard inbox; Resend sends an additional email notification. The dashboard shows delivery status and lets the owner retry failed notifications.
12. To receive direct email in the dashboard, configure Resend Receiving for a dedicated address or forward an existing mailbox to it. Add an `email.received` webhook pointing to `https://oluwaferanmijohn.name.ng/api/webhooks/resend` and set `RESEND_WEBHOOK_SECRET` to its signing secret. The API key needs access to received email. This does not automatically copy mail sent to an existing mailbox; that mailbox must forward messages to the Resend receiving address.
13. VAPID push keys are in the local `.env`. Copy the same `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`, Supabase server values, and `ADMIN_USER_ID` into your production host's environment variables. Do not generate a replacement key pair after devices subscribe.
14. Set `NUXT_PUBLIC_SITE_URL=https://oluwaferanmijohn.name.ng` on Vercel. Upload the CV from the dashboard to store it in Supabase.
15. Run `npm run dev`, then visit `http://localhost:3002` and sign in at `http://localhost:3002/dashboard/login` with the admin account.

The migration seeds the portfolio with the known project list; `npm run seed:images` uploads the available project artwork to Supabase Storage. Some source folders did not include a finished project screenshot; those cards are visibly marked as concept artwork. Where package metadata was available, technology tags were taken from those manifests; the dashboard lets you review or change project details, status, concept, preview image type, AI description, and stack.

## Daily Supabase activity

The repository includes `.github/workflows/supabase-keepalive.yml`, which calls the migration's `keep_alive` database function once per day. To enable it, push this repository to GitHub and add repository Actions secrets named `SUPABASE_URL` and `SUPABASE_KEY`. The schedule is best-effort and does not guarantee that Supabase Free projects will avoid inactivity pausing; Supabase may still pause a low-activity project. Review the current [Supabase Free project pausing policy](https://supabase.com/docs/guides/platform/free-project-pausing).

## Dashboard and data

- `/dashboard/login` authenticates the owner with Supabase Auth.
- `/dashboard` manages projects, uploaded images, basic visit/CV/contact counts, the paged contact inbox, and received email.
- The dashboard inbox keeps contact messages even if email delivery fails; unread messages can be marked read and replied to by email.
- `/blog` lists published articles in pages and fetches only card fields. Selecting one opens the full article with Markdown formatting and inline images. A read counts after visible reading time and progress through the article, at most once per browser session per day.
- `/manifest.webmanifest` and `/sw.js` make the site installable. After installing it on a phone, sign in on that device and enable push notifications in the dashboard. Contact form submissions trigger an alert on subscribed devices.
- Phone installation and push require the live website to use HTTPS. Android browsers offer an install prompt; on iPhone, use Safari's Share menu and choose Add to Home Screen.
- Public visitors can read the project list, upload images only after server-side owner authorization, and submit contact messages.
- Analytics stores a random server-issued session identifier, event type, route, and timestamp. Signed-in owner activity is excluded. Counts represent daily sessions, not identified people; the app does not store IP addresses or advertising identifiers.
- Apply future SQL migrations in the Supabase SQL Editor in date/name order.

## Commands

```sh
npm run dev
npm run typecheck
npm run build
npm run preview
```

The development server uses port **3002** by default.
