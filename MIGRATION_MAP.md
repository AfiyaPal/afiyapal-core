# Django to Next.js Migration Map

| Django file/folder | Next.js destination |
| --- | --- |
| `templates/base.html` | `app/layout.tsx`, `components/layout/app-shell.tsx` |
| `templates/partials/_header.html` | `components/layout/header.tsx` |
| `templates/partials/_footer.html` | `components/layout/footer.tsx` |
| `templates/partials/_messages.html` | `components/ui/form-message.tsx` / toast system |
| `frontend/templates/frontend/index.html` | `features/home/components/home-page.tsx` |
| `frontend/views.py -> home` | `app/page.tsx` composing `HomePage` |
| `frontend/views.py -> chatbot/chatbot_frame` | `app/(marketing)/chatbot/page.tsx`, `app/chatbot-frame/page.tsx`, `app/api/chatbot/route.ts` |
| `frontend/views.py -> generate_ai_response` | `server/services/chatbot-service.ts`, `server/ai/gemini-client.ts` |
| `users/templates/accounts/*` | `app/(auth)/*/page.tsx`, `features/auth/components/*` |
| `users/forms.py` | `features/auth/schemas/auth-schemas.ts` |
| `users/views/authentication.py` | `features/auth/actions/auth-actions.ts`, `server/services/auth-service.ts` |
| `users/models.py` | `server/db/schema.prisma`, `server/repositories/*` |
| `static/css/custom.css` | `app/globals.css` / Tailwind classes |
| `static/img/*` | `public/images/*` |
| `src/settings/*.py` | `.env.local`, `lib/env.ts`, `next.config.ts` |

## Recommended next work

1. Confirm the visual UI against the Django pages.
2. Replace placeholder auth session logic with Auth.js or secure custom sessions.
3. Seed Prisma with migrated blog/category/media data.
4. Add email provider for password reset.
5. Add tests around server services and forms.
