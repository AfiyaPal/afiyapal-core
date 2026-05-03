# AfiyaPal Next.js Migration Starter

This zip is a production-oriented Next.js App Router starter generated from the Django project structure.

## Architecture

```txt
app/        = thin routes, layouts, route handlers, loading/error/not-found states
features/   = feature-based UI, schemas, actions, feature queries/types
server/     = server-only sensitive logic: Prisma, repositories, services, AI clients
components/ = reusable layout, UI, and shared presentation components
lib/        = shared config, env validation, routes, utilities
public/     = migrated static images from Django static/img
styles/     = optional extra global styles
```

## Start

```bash
npm install
cp .env.example .env.local
npx prisma generate
npm run dev
```

For database-backed auth/blogs, set `DATABASE_URL` in `.env.local`, then run:

```bash
npx prisma migrate dev --name init
```

## Migration notes

- Django `templates/base.html` became `app/layout.tsx` + `components/layout/*`.
- Django `frontend/templates/frontend/index.html` became `features/home/components/home-page.tsx`.
- Django chatbot views became `features/chatbot/*`, `app/api/chatbot/route.ts`, and `server/ai/gemini-client.ts`.
- Django `users/models.py` was mapped to `server/db/schema.prisma`.
- Django static images were copied to `public/images/*`.

No secrets are included. Rotate any previously exposed API keys before deploying.
