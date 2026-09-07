# CertVault

A certificate/license expiry tracker built on the Next.js App Router with
MongoDB — add certificates with a photo, name and expiry date, choose how
many days beforehand you want a warning, and get an email automatically
when that window opens (and again if it lapses).

Since the whole app is Next.js (frontend, API routes, and server logic all
in one project), there's no separate Express server: Next's API routes take
the place of the "E" in MERN.

## Stack

- **Next.js 14** (App Router) — pages and API routes
- **MongoDB + Mongoose** — data storage
- **JWT in an httpOnly cookie** — authentication (bcrypt-hashed passwords)
- **Nodemailer** — expiry alert emails
- **node-cron** (local) / **Vercel Cron** (production) — the daily expiry check
- **Tailwind CSS** — styling

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your own values:

```bash
cp .env.example .env.local
```

| Variable | What it's for |
| --- | --- |
| `MONGODB_URI` | Your MongoDB connection string (Atlas free tier works fine) |
| `JWT_SECRET` | Random string used to sign login sessions |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` / `SMTP_USER` / `SMTP_PASSWORD` / `SMTP_FROM` | SMTP credentials used to send alert emails |
| `CRON_SECRET` | Random string required to trigger the expiry check endpoint |
| `APP_URL` | Public URL of your deployment (used in email links) |

Gmail works as an SMTP provider if you generate an [app password](https://myaccount.google.com/apppasswords);
any transactional email provider's SMTP settings (SendGrid, Mailgun, Resend, Postmark…) will also work.

## 3. Run the app

```bash
npm run dev
```

Visit `http://localhost:3000`, create an account, and start adding certificates.

## 4. Run the expiry-check worker

The app itself never sends emails on a schedule by itself — something needs
to call `/api/cron/check-expiry` once a day. Two options:

**Local / self-hosted:** run the included worker alongside the app:

```bash
npm run cron
```

This schedules a daily check (08:00 by default — override with the
`CRON_SCHEDULE` env var, a standard cron expression) and also runs one check
immediately on startup. Run `npm run cron -- --now` to trigger a single check
without starting the scheduler.

**Vercel:** the included `vercel.json` already defines a daily cron job that
hits the same endpoint — no extra setup needed once you set `CRON_SECRET` as
an environment variable in your Vercel project (Vercel sends it automatically
as a bearer token).

## How alerts work

Each certificate stores `alertDaysBefore` (how many days ahead of expiry to
warn) and `alertsSent` (which alerts have already gone out, so you don't get
the same email twice). The daily check:

1. Loads every certificate across every user.
2. Computes days remaining until expiry.
3. If days remaining ≤ `alertDaysBefore` and that alert hasn't been sent yet, emails the owner.
4. If the certificate has already lapsed and the "expired" alert hasn't been sent yet, emails the owner separately.
5. Editing a certificate's expiry date resets its alert history, so a renewed certificate can trigger fresh alerts later.

## Project structure

```
app/
  page.js                 marketing landing page
  login/, register/       auth pages
  dashboard/               main app (protected client page)
  api/
    auth/                  register, login, logout, session
    certificates/          CRUD for certificates
    cron/check-expiry/     the daily alert job, called by a scheduler
components/                UI building blocks (cards, modal, navbar…)
lib/                       mongodb connection, auth helpers, email, status logic
models/                    Mongoose schemas (User, Certificate)
scripts/                   local cron worker + optional CLI user creation
```

## Notes

- Certificate images are stored as base64 in MongoDB to keep the app
  self-contained (no separate object storage to configure). For very large
  libraries of high-resolution scans, swapping in S3/Cloudinary and storing
  just the URL is a straightforward follow-up.
- Each user only ever sees their own certificates — everything is scoped by
  the signed-in session on both the API and the database query.
