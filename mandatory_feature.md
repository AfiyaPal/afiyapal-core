# Mandatory Feature: Community Insights from Chat Queries

**Status:** Research complete — build plan approved.
**Branch/context:** login-n-streamline
**Owner decision:** Analysis engine = Gemini LLM structured output using `gemini-3.5-flash-lite` (separate env var, same API key). Processing = nightly Vercel Cron. Doc = research + full build plan.

---

## 1. Problem statement / why

Every chat message a visitor sends to AfiyaPal is a live, unprompted signal of what the community is worried about. Today that signal is captured but never analysed. This feature turns the chat corpus into actionable intelligence:

- **Professionals (doctors)** get topic suggestions for what to write about in their articles, grounded in real community questions.
- **Health facilities** get topic suggestions for what to address via medical camps, free checkups, health talks, and other community initiatives.

Both surfaces are driven by the same pipeline: **log → analyse → aggregate → surface**. Nothing is shipped to either dashboard that contains raw messages, user identities, or per-user health data — only aggregates.

---

## 2. What already exists (do not rebuild)

Logging is **already implemented and running**. Every chatbot turn is captured on-write in `server/services/chatbot-service.ts` (`generateChatbotReply`):

| Table | Model | What it stores |
|---|---|---|
| `SymptomCheckLog` | `server/db/schema.prisma:139` | `userId?`, `language` (en/sw), `symptomsSummary` (user msg, ≤700 chars), `aiResponseSummary` (AI reply, ≤700 chars), `symptomCategory` (keyword-based), `riskLevel` (LOW/MEDIUM/HIGH/EMERGENCY), `recommendedNextStep`, `escalationSuggested`, `status`, `createdAt` |
| `MentalHealthInteraction` | `server/db/schema.prisma:258` | `userId?`, `language`, `moodCategory`, `riskLevel`, `interactionSummary` (≤700), `aiResponseSummary` (≤700), `supportResourcesShown`, `escalationSuggested`, `status`, `createdAt` |

Logging helpers: `server/services/symptom-check-logging-service.ts`, `server/services/mental-health-logging-service.ts`. Both already compute keyword-based category, language, and risk — good cheap signal, but not real sentiment/topic analysis.

**The gap is the analysis layer + the surfacing layer**, not capture. Do not add a new "log everything" table; extend the existing corpus.

Admin already has a viewing surface: `/admin/symptom-checks` with per-log detail (`/admin/symptom-checks/[logId]`), and raw sensitive text is gated behind `SensitiveHealthAccessPanel` (15-min, audited, permission `VIEW_SENSITIVE_HEALTH_DETAILS`).

---

## 3. Tool research: how to do sentiment + topic analysis

### Candidate approaches compared

| Approach | Fit for short health text | Labeled data needed | Infra / deps | Verdict |
|---|---|---|---|---|
| Lexicon/rule-based (VADER, TextBlob) | Weak — misses context, sarcasm, domain nuance; poor on Swahili | No | Minimal | Not enough for health topics |
| Classical topic modeling (LDA, GSDMM, TF-IDF k-means) | **Poor on short, sparse text** (chat messages) | Tuning (k, iterations) | Heavy for value | Rejected for MVP |
| Embedding + clustering (BERTopic, kBERT) | Good (beats LDA on short text) | No (unsupervised) | Vector storage + tuning + clustering step | **Deferred to Phase 3** |
| **LLM structured output (Gemini)** | **Strong zero-shot sentiment + topic**; handles EN + SW | No | Existing Gemini REST client | **Chosen** |

### Evidence (2025–2026)

- **Frontiers in Public Health (Jun 2025), systematic review** — LLMs are the most-used category for public-health sentiment analysis, with strong zero-shot results; recommended when labeled data is scarce; LLM prompt output needs validation.
- **JMIR (2026), case study** — LLM (GPT-4) sentiment + topic/thematic analysis of public-health datasets matched human-coded themes closely, with large time savings; best used in collaboration with human review.
- **COMP+SAC (2025)** — kBERT (BERT embeddings + k-means) beats LDA/GSDMM/BERTopic on short, limited healthcare feedback; BERTopic weak on small datasets. Supports the "embeddings later, not MVP" decision.
- **PLOS Digital Health (2026)** — LLMs work as scalable annotators + structured-context extractors for health text, but label distributions must be audited; keep human oversight on high-impact outputs.

### Recommendation

Use **Gemini with JSON-schema structured output** per log entry: one call returns `{ sentiment, topicLabel, topicSlug, summary, urgencyKeywords }` as typed JSON. The project already calls Gemini via REST (`server/ai/gemini-client.ts`) and the model is multilingual, so Swahili messages are handled.

### Model choice: `gemini-3.5-flash-lite`

- Runs on the **same `GEMINI_API_KEY`** as the chatbot; model id is just a per-request string.
- **Separate env var `GEMINI_ANALYSIS_MODEL`** (default `gemini-3.5-flash-lite`) so the chatbot's `GEMINI_MODEL` (`gemini-3-flash-preview`) is never affected, and the analysis model can be swapped in Vercel env without a code change.
- Cheapest Gemini text tier (Flash-Lite family). Text-out, ~250K context — far more than needed for ≤700-char messages.
- Structured outputs supported on the Flash / Flash-Lite family.

### Implementation caveats (verify at build time)

- Current `gemini-client.ts` sends **no `generationConfig`**. The analysis client must send `generationConfig.responseMimeType: "application/json"` **plus** a JSON schema. Exact schema field name (`responseSchema` vs `responseJsonSchema`) should be confirmed against the live API once when wiring the client.
- Use **non-streaming** requests for structured output.
- Set `temperature ≈ 0.6`, `maxOutputTokens ≈ 400` — tiny outputs keep cost negligible.
- **Validate** the model's JSON with zod before persisting; treat parse/validation failures as `FAILED` (see pipeline) and never crash the whole run.
- Batch API (JSONL, ~50% cheaper) is the later, higher-volume path — Phase 3.

### Cost model (Phase 1)

Flash-Lite is priced around a few cents per 1M tokens. Worst-case planning assumption: ~1,000 chat messages/day, ~300 input tokens + ~100 output tokens each → ~0.4M tokens/day → ~**$1–3/month** (and typically far less). Free-tier rate limits (30 req/min) are fine with a concurrency cap of ~5 and exponential backoff.

---

## 4. Architecture

### 4.1 Data model (Prisma — both `schema.prisma` and `schema.sqlite.prisma`)

```prisma
model ChatLogAnalysis {
  id                      Int      @id @default(autoincrement())
  symptomCheckLogId       Int?     @unique
  mentalHealthInteractionId Int?   @unique
  sentiment               String   // POSITIVE | NEUTRAL | NEGATIVE | MIXED
  sentimentConfidence     Float?
  topicSlug               String   // stable machine label, e.g. "malaria-fever"
  topicLabel              String   // human label for dashboards, e.g. "Malaria & fever"
  summary                 String?  // one-line why (LLM-derived, non-identifying)
  urgencyKeywords         String?  // JSON array of flags, e.g. ["emergency", "severe pain"]
  model                   String   // model id used
  status                  String   @default("PENDING") // PENDING | ANALYZED | FAILED
  error                   String?
  analyzedAt              DateTime?
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt

  @@index([status])
  @@index([sentiment])
  @@index([topicSlug])
  @@index([analyzedAt])
  @@index([symptomCheckLogId])
  @@index([mentalHealthInteractionId])
}

model CommunityInsight {
  id               Int      @id @default(autoincrement())
  periodStart      DateTime // start of aggregation window (day)
  periodEnd        DateTime // end of aggregation window
  source           String   // SYMPTOM_CHECK | MENTAL_HEALTH
  topicSlug        String
  topicLabel       String
  messageCount     Int
  sentimentBreakdown String  // JSON: { POSITIVE: n, NEUTRAL: n, NEGATIVE: n, MIXED: n }
  sentimentScore   Float    // -1..1 aggregated
  summary          String?  // short synthesis for dashboards
  createdAt        DateTime @default(now())

  @@unique([periodStart, source, topicSlug])
  @@index([periodStart, periodEnd])
  @@index([topicSlug])
  @@index([messageCount])
  @@index([source])
}
```

Notes:
- `ChatLogAnalysis` links to **either** log table; two `@unique` nullable FK columns give one-analysis-per-log without a polymorphic join.
- `CommunityInsight` is **idempotent per (periodStart, source, topicSlug)** — upsert on re-run, so a cron re-run never duplicates.
- No user, email, or IP stored in either new model.

### 4.2 Analysis client — `server/ai/gemini-structured.ts` (new)

Mirror `gemini-client.ts` but:

- Uses `env.GEMINI_ANALYSIS_MODEL` (fallback `gemini-3.5-flash-lite`).
- Sends `generationConfig` with `responseMimeType: "application/json"`, the JSON schema, `temperature: 0.6`, `maxOutputTokens: 400`.
- Non-streaming.
- Input is **only the truncated message text + language hint** — never `userId`, email, IP, or AI response (the AI response isn't needed for sentiment of the user; keeping input minimal reduces cost and privacy surface).
- Returns typed `ChatLogAnalysisInput`; zod-validate the parsed JSON in the caller.

### 4.3 Incremental analyzer — `server/services/community-insights/analyze-chat-logs.ts` (new)

- Selects logs where no `ChatLogAnalysis` exists: `SymptomCheckLog` left-join + `MentalHealthInteraction` left-join on `ChatLogAnalysis`, filtered to e.g. `createdAt < now()` and batch-limit `LIMIT 100` per run.
- For each: call the structured client (concurrency cap ≈ 5, exponential backoff on 429/5xx), upsert `ChatLogAnalysis` (`status: ANALYZED` / `FAILED` with error).
- **Idempotent + resumable** — because status is tracked, the next cron run picks up exactly where the last one stopped (also survives the 60s function timeout).
- Never throws out of the loop; per-record failures are recorded, not fatal.

### 4.4 Aggregator — `server/services/community-insights/aggregate-insights.ts` (new)

- Groups `ChatLogAnalysis` (status ANALYZED) by `(date(analyzedAt), source, topicSlug)`.
- Computes `messageCount`, `sentimentBreakdown` JSON, `sentimentScore` (e.g. POSITIVE=+1, NEUTRAL=0, NEGATIVE=-1 weighted mean), and a short `summary`.
- Upserts into `CommunityInsight` keyed on `(periodStart, source, topicSlug)`.
- Called at the end of the cron run; also callable on demand (e.g. an admin "run now" or after the first manual run).

### 4.5 Cron route — `app/api/cron/chat-insights/route.ts` (new)

```ts
// GET only. Guarded twice:
//  1. Authorization: Bearer <CRON_SECRET> (Vercel injects this on cron invocations)
//  2. x-vercel-cron header (defense in depth)
// Runs analyzeCh... then aggregate..., returns { processed, failed, aggregated }
export const dynamic = "force-dynamic";
export const maxDuration = 60;
```

- Must be reachable without the auth middleware (no middleware protects `/api`, so no change needed there).
- Returns JSON with `{ processed, failed, aggregatedPeriods }` for Vercel cron logs.

### 4.6 Scheduling — `vercel.json` (new file at repo root)

```json
{
  "crons": [
    { "path": "/api/cron/chat-insights", "schedule": "0 3 * * *" }
  ]
}
```

3:00 UTC daily. Runs on production only. **Hobby plan = one run/day** (fine here); sub-daily cadence needs Pro.

---

## 5. Dashboard surfaces

Both dashboards already exist with role guards (inline `getCurrentUser()` + role check in `app/dashboard/layout.tsx` and `app/facility/layout.tsx`). We add one aggregate card each; **no raw text, no identities**.

### 5.1 Doctor — `app/dashboard/page.tsx`

- New query `features/doctor/queries/get-community-topics.ts` → top `CommunityInsight` rows for the last 30 days (or current/latest period), ordered by `messageCount desc`, limited to ~5.
- New card component "**Community topics to write about**" on `DoctorDashboardPage`:
  - Topic label, message count, sentiment pill (Positive/Neutral/Negative), one-line summary.
  - CTA → `/dashboard/blogs/new?topic=<topicSlug>&topicLabel=<label>` (form pre-fills a suggested title/tagline; doctor keeps full control).
- Data access: direct Prisma read in the query (matches `features/doctor/queries/*` pattern). Cache with `unstable_cache` + `revalidate = 3600` so it never slows the dashboard.

### 5.2 Facility — `app/facility/page.tsx`

- New query `features/facility/queries/get-community-topics.ts` (same shape).
- New card "**Topics for events & camps**" on `FacilityDashboardPage`:
  - Same aggregate data; CTA → `/facility/events/new?topic=<topicSlug>&topicLabel=<label>` so the event form is pre-filled (e.g. title "Medical camp: <topicLabel>", suggested type `MEDICAL_CAMP`/`HEALTH_TALK`).
- Only VERIFIED facilities see content-relevant suggestions (guard inherited from facility layout / queries).

### 5.3 Empty state

If no insights exist yet (pre-first-cron), both cards show a friendly "Insights will appear after the first nightly analysis" message with the current message count so the feature never looks broken.

---

## 6. Phased implementation plan

### Phase 1 — Pipeline + cron (do first)
1. Add `ChatLogAnalysis` + `CommunityInsight` to both Prisma schemas; `db push` (sqlite offline + postgres online).
2. `server/ai/gemini-structured.ts` — structured-output client using `GEMINI_ANALYSIS_MODEL`.
3. `server/services/community-insights/analyze-chat-logs.ts` + `aggregate-insights.ts`.
4. `app/api/cron/chat-insights/route.ts` + `vercel.json` + `CRON_SECRET`.
5. Manual trigger path for dev: same service callable from a small dev script or temporarily hit the cron route with the bearer header.
6. Verify: `npx tsc --noEmit`, `npx eslint .`, offline `next build`.

### Phase 2 — Dashboards
7. Doctor + facility queries + insight cards + empty states + pre-filled CTA params.
8. Verify + commit.

### Phase 3 — Optional / future
- **Gemini Batch API** (JSONL) for the nightly pass → ~50% cheaper at higher volume.
- **Embeddings + clustering** (e.g. BERTopic/kBERT via `gemini-embedding-001`) for topic correlations, seasonal trends, and cross-source discovery.
- **Specialty / facility matching** — filter topics by a doctor's `specialty` or a facility's `services` (map topicSlug → category via a small lookup).
- **Admin analytics page** — trends over time, export CSV, "insight health" (analyzed vs failed counts).
- **Digests** — notify admins/professionals when a topic spikes (reuse `notification-service.ts`).

---

## 7. Privacy & ethics

- **Aggregates only** on professional/facility dashboards: counts, sentiment distributions, labels, LLM-written summaries. No user ids, no raw messages, no contact details.
- **Raw messages stay admin-only** behind the existing `SensitiveHealthAccessPanel` (permission + reason + 15-min audited grant) — unchanged.
- **LLM input is minimal**: only the already-truncated (≤700 char) message text + a language hint. Never send `userId`, email, IP, or the AI response.
- **No per-user sentiment stored** — `ChatLogAnalysis` stores derived labels only, not identity.
- **Data protection note**: chat text is sent to the Gemini API for analysis. The existing chatbot flow already relies on the same provider; ensure the site's privacy policy/consent copy mentions that messages may be used for aggregated community-health insights (anonymised). Add a short line to the chatbot disclaimer if not already covered.
- **Human oversight**: LLM topic labels can drift. Phase 1 stores `model` + status per analysis so mislabels can be audited; an admin "insight health" view (Phase 3) surfaces failure/quality stats.

---

## 8. Ops / environment changes

| Item | Detail |
|---|---|
| `CRON_SECRET` env var | Random string (≥16 chars) set in Vercel → Settings → Environment Variables. Vercel sends it as `Authorization: Bearer <CRON_SECRET>` on every cron run; the route 401s otherwise. Also lets you trigger manually with the same header. |
| `vercel.json` (first one) | Registers the cron. Only affects cron registration; nothing else changes. |
| `GEMINI_ANALYSIS_MODEL` env | Default `gemini-3.5-flash-lite`; override in Vercel env to swap the analysis model without code change. |
| Vercel plan | Hobby supports **1 cron run/day** — sufficient for the nightly 3am pass. Hourly/six-hourly cadence would require Pro. |
| Model/structured-output caveat | If on the **free Gemini tier**, structured-output (schema) requests may fail ("Internal error") — plan for a paid tier or handle `FAILED` gracefully. |
| Function timeout | Cron route `maxDuration: 60`. Pipeline is resumable by design, so a timeout just means "next run continues". |

---

## 9. Open questions / future work

1. **Summary language** — should `summary` be written in English, Swahili, or both? (Recommend: English for dashboard consistency; label in both when easy.)
2. **Sentiment target** — sentiment of the *message* (how worried/satisfied the visitor sounds) is the MVP. Aspect-level sentiment (per topic inside one message) is Phase 3.
3. **Period length** — start with daily aggregation; a rolling 7-day window is a simple Phase 2 improvement.
4. **Privacy policy copy** — confirm the public-facing wording for "messages may be used for anonymised community insights."
5. **Seeding/backfill** — decide whether to analyse the historical log corpus (already in `SymptomCheckLog`/`MentalHealthInteraction`) on first run, or only new messages from go-live. (Recommend: backfill, since the pipeline is incremental anyway.)

---

## 10. References

- Frontiers in Public Health (2025) — *Sentiment analysis in public health: a systematic review*. https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2025.1609749/full
- JMIR (2026) — *Comparison of AI tools with human coding for sentiment, topic, thematic analysis of public health datasets*. https://ojphi.jmir.org/2026/1/e80824/PDF
- IEEE COMPSAC (2025) — *Contextual embedding-based clustering (kBERT) for healthcare topic discovery*. https://doi.org/10.1109/compsac65507.2025.00106
- PLOS Digital Health (2026) — *LLM-based annotation and token-augmented modeling for emotional tone classification in health peer-support*. https://journals.plos.org/digitalhealth/article?id=10.1371%2Fjournal.pdig.0001235
- Google AI — *Gemini structured outputs (generateContent / Interactions)*. https://ai.google.dev/gemini-api/docs/structured-output
- Google AI — *Gemini Batch API* (50% batch discount). https://ai.google.dev/gemini-api/docs/batch-api
- Google AI — *Gemini API pricing* (Flash-Lite tier). https://ai.google.dev/gemini-api/docs/pricing
- Vercel — *Cron jobs* (vercel.json `crons`, `CRON_SECRET`, plan limits). https://vercel.com/docs/cron-jobs
