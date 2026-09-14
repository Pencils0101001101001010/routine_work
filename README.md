# RoutineWork

A free, lightweight PWA that helps South African jobseekers build a daily job-search routine. Users save the job titles and locations they're looking for, and get notified automatically when a matching listing appears — no need to manually refresh job sites every day.

Built in response to South Africa's high youth unemployment rate, with a focus on being genuinely free to use, low on data cost, and eventually fully open source.

## Core idea

1. A user saves a **job preference** (title + location) on their profile.
2. A scheduled job checks external job listings daily for new matches.
3. When a new match is found, the user gets an **email notification** with a link to apply on the original job site.
4. An activity tracker (GitHub-style contribution grid) shows the user's engagement over time, to help build a routine habit — not just passive alerts.

Applications always happen on the original job board (e.g. via Adzuna's listing link) — this app never stores or forwards CVs, and never charges users anything.

## Why email (for now) instead of WhatsApp

WhatsApp was the original plan, since it's cheaper on data for South African users on prepaid plans and has far higher open rates than email. However, WhatsApp Business API requires business verification, template approval, and a per-message fee — too much cost and setup overhead for a pre-funding solo MVP.

The notification layer is built as an isolated service (`emailService.ts`) so it can be swapped for or run alongside a `whatsappService.ts` later without touching the matching or cron logic.

## Tech stack

- **Frontend:** React (PWA) + TypeScript
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL
- **Job data source:** [Adzuna API](https://developer.adzuna.com/) (South Africa index)
- **Email:** Nodemailer, via SMTP
- **Scheduling:** `node-cron`
- **Auth:** JWT + bcrypt

## Architecture

```
User (PWA)
   │  saves job preference
   ▼
Backend API (Express)
   │  validates & stores
   ▼
PostgreSQL
   ▲
   │  read active preferences
Cron worker (daily)
   │  fetch listings
   ▼
Adzuna API
   │  new listings found
   ▼
PostgreSQL (dedup + store match)
   │
   ▼
Email service (Nodemailer)
   │
   ▼
User's inbox → applies on source site
```

The cron worker runs independently of any user session — it queries the database directly for all active preferences across all users, rather than requiring anyone to be logged in. To avoid wasting API calls, identical preferences (same title + location, from different users) are grouped and queried against Adzuna only once per unique combination.

## Database schema (overview)

| Table               | Purpose                                                                       |
| ------------------- | ----------------------------------------------------------------------------- |
| `users`             | Account info, email, hashed password                                          |
| `job_preferences`   | A user's saved title + location searches                                      |
| `job_matches`       | New listings found per preference, deduped against Adzuna's `external_job_id` |
| `notifications_log` | Record of each notification sent, for retry/debugging                         |
| `activity_log`      | Logged user actions, powers the activity tracker UI                           |

`job_matches` has a unique index on `(preference_id, external_job_id)` to guarantee no duplicate match is ever stored or notified on twice.

## Project structure

```
backend/
 src/
  ├── config/        # DB connection, env loading, mail transporter
  ├── routes/
  ├── db/
  ├── controllers/
  ├── services/       # adzunaService, emailService, matchingService
  ├── jobs/            # matchJobsCron.ts
  ├── models/
  ├── middleware/
  ├── types/
  ├── app.js
  └── server.js


frontend in progress


```

## Roadmap

- [x] User auth (register/login/me)
- [x] Job preference CRUD
- [x] Adzuna integration + daily matching cron
- [x] Email notifications
- [ ] Activity tracker UI (streaks/heatmap)
- [ ] WhatsApp notifications (once funding/verification allows)
- [ ] Rewards system for consistent activity
- [ ] Direct partnerships with local job boards (Pnet, Careers24, CareerJunction) once there's usage traction to show
- [ ] Zero-rated data access via PBO/NPO registration

## License

Intended to be fully open source once the MVP is stable — license TBD.
