# Changelog — login-n-streamline

## 2026-08-15

All commits landed on `login-n-streamline` today (shorthand per feature):

- **feat(auth): professional-only signup + role-based login redirect + Suspense** (`2388928`)
  - Signup is now professional-only (doctor/facility); login redirects by role; Suspense wrappers on login/register.

- **feat(profile): unique display name, professional profile form, availability toggle** (`9854cb9`)
  - Display name is a unique username; professional profile form; binary availability toggle (flips the same status the public surfaces filter on).

- **feat(directory): public professionals directory with chatbot referrals** (`d0130f5`)
  - Public directory + profile pages for verified, available professionals (contact/license never public); chatbot refers to them via `/professionals/{id}`.

- **refactor: remove maternal emergency feature** (`f5400b6`)
  - Removed the maternal emergency SOS button + trigger route; dashboard and README cleaned.

- **fix(ui): responsive dashboards, blog cards, mobile nav, a11y, eslint flat config** (`847598e`)
  - Responsive doctor/facility dashboards and blog cards, mobile nav, accessibility pass, ESLint flat config.

- **feat(chatbot): dark full-page AI chat app** (`24b9dfc`)
  - Chrome-free dark full-height chat page with reference cards, modal-then-new-tab links, thread persistence (sessionStorage), and a chat-first PWA (manifest start_url `/chatbot`, install prompt, service worker).

- **feat(chatbot): markdown replies + ~10% briefer responses** (`748272c`)
  - AI bubbles now render markdown (bold, lists, headings) via ReactMarkdown; system prompt tightened for ~10% shorter replies.

- **feat(contact): harden submission logic + notify admins** (`9a9a2c8`)
  - Contact route hardened (env parsing, body-size cap, JSON 500s, identical honeypot response, timing-check bypass closed); admins notified on new submissions.

- **chore: stop tracking tsconfig build cache artifact** (`9ea4afa`)
  - `tsconfig.tsbuildinfo` gitignored and untracked (housekeeping).

- **docs: community-insights spec + changelog** (`e727efc`)
  - Added `mandatory_feature.md` (research + full build plan) and this changelog.

- **feat(insights): community insights from chat logs** (uncommitted — see below)
  - `ChatLogAnalysis` + `CommunityInsight` Prisma models (both schemas, db pushed). SQLite + Postgres in sync.
  - Structured-output Gemini client (`server/ai/gemini-structured.ts`) on new `GEMINI_ANALYSIS_MODEL` env (default `gemini-3.5-flash-lite`, same key as chatbot).
  - Nightly analyzer + aggregator (`server/services/community-insights/`): incremental per-log analysis (≤700-char messages only, no identity), per-day per-topic aggregation, resumable across cron timeouts.
  - Cron route `/api/cron/chat-insights` (GET, `CRON_SECRET` bearer + `x-vercel-cron`) + first `vercel.json` (3:00 UTC daily).
  - Doctor dashboard "Community topics to write about" card → `/dashboard/blogs/new` pre-fills title/tags/category.
  - Facility dashboard "Topics for events & camps" card (verified facilities) → `/facility/events/new` pre-fills title/type.
  - Empty states shown until the first nightly analysis runs.
