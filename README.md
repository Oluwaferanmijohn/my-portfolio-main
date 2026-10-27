# Oluwafernmi Portfolio

A Nuxt 4 portfolio with Tailwind CSS, Supabase-backed projects and media, an authenticated owner dashboard, privacy-light usage counts, and optional Resend email notifications.

## Local setup

1. Install Node.js 20 or newer.
2. Run `npm install` and copy `.env.example` to `.env`.
3. Create a Supabase project. Create an Auth user for the portfolio owner and set `ADMIN_USER_ID` to that user's UUID. Disable public sign-ups after creating the admin user.
4. Fill in `SUPABASE_URL`, `SUPABASE_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in `.env`. The service role key is server-only; never add it to a `NUXT_PUBLIC_*` variable.
5. In the Supabase SQL Editor, apply `supabase/migrations/202610270001_portfolio.sql`.
6. Run `npm run seed:images` to upload the five existing project images from `assets/image/` into the Supabase Storage bucket and update the seeded project records. New project and CV images can be uploaded through the dashboard.
7. Set `RESEND_API_KEY`, `CONTACT_EMAIL`, and a verified `FROM_EMAIL` to receive new message notifications. Without Resend, messages are still saved in the dashboard inbox and the public email link remains available.
8. Optionally set `NUXT_PUBLIC_CV_URL` to an externally hosted CV PDF and `NUXT_PUBLIC_SITE_URL` to the canonical site origin. Or upload the CV from the dashboard to store it in Supabase.
9. Run `npm run dev`, then visit `http://localhost:3001` and sign in at `http://localhost:3001/dashboard/login` with the admin account.

The migration seeds the portfolio with the known project list and the existing five project images. Where package metadata was available, technology tags were taken from those manifests; the dashboard lets you review or change any project detail, status, concept, AI description, and stack.

## Daily Supabase activity

The repository includes `.github/workflows/supabase-keepalive.yml`, which calls the migration's `keep_alive` database function once per day. To enable it, push this repository to GitHub and add repository Actions secrets named `SUPABASE_URL` and `SUPABASE_KEY`. The schedule is best-effort and does not guarantee that Supabase Free projects will avoid inactivity pausing; Supabase may still pause a low-activity project. Review the current [Supabase Free project pausing policy](https://supabase.com/docs/guides/platform/free-project-pausing).

## Dashboard and data

- `/dashboard/login` authenticates the owner with Supabase Auth.
- `/dashboard` manages projects, uploaded images, basic visit/CV/contact counts, and the message inbox.
- Public visitors can read the project list, upload images only after server-side owner authorization, and submit contact messages.
- Analytics stores a random session identifier, event type, route, and timestamp. It does not store IP addresses or advertising identifiers.
- Apply future SQL migrations in the Supabase SQL Editor in date/name order.

## Commands

```sh
npm run dev
npm run build
npm run preview
```

The development server uses port **3001** by default.
