import Link from "next/link";
import { ShieldCheck, Stethoscope, Users, FileText, MessageSquareWarning, ClipboardList } from "lucide-react";
import { ADMIN_USER_STORY, adminModules, adminRoles } from "@/features/admin/data/admin-scope";

const highlights = [
  { label: "Admin roles", value: adminRoles.length, icon: ShieldCheck, description: "Clear responsibility boundaries before permissions are implemented." },
  { label: "MVP modules", value: adminModules.length, icon: ClipboardList, description: "The dashboard areas included in Stage 2 admin scope." },
  { label: "Health safety", value: "Core", icon: Stethoscope, description: "AI reviews, symptom logs, reports, and doctor verification are first-class modules." }
];

const moduleIconMap = {
  overview: ClipboardList,
  users: Users,
  doctors: Stethoscope,
  "symptom-checks": ClipboardList,
  "ai-flags": MessageSquareWarning,
  content: FileText,
  consultations: Stethoscope,
  reports: ShieldCheck
} as const;

export function AdminScopePage() {
  return (
    <main className="bg-[#f8fffb]">
      <section className="border-b border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="container-page py-14 sm:py-16">
          <div className="max-w-4xl">
            <p className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-700 shadow-soft">AFIYAPAL Stage 2 Admin Scope</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">Admin dashboard scope for a safer, medically responsible platform.</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700 sm:text-lg">This phase defines the first admin roles, the Stage 2 MVP dashboard modules, and the core admin user story. It is intentionally focused on scope before deeper permissions, workflows, and database-heavy features are added.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.label} className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-soft">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><Icon aria-hidden="true" className="h-6 w-6" /></div>
                  <p className="text-3xl font-bold text-slate-950">{item.value}</p>
                  <h2 className="mt-1 text-sm font-semibold uppercase tracking-wide text-brand-700">{item.label}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-soft sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Core admin user story</p>
          <blockquote className="mt-4 border-l-4 border-brand-600 pl-5 text-lg font-medium leading-8 text-slate-800">{ADMIN_USER_STORY}</blockquote>
        </div>
      </section>

      <section className="container-page pb-12">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-sm font-semibold uppercase tracking-wide text-brand-700">First admin roles</p><h2 className="mt-2 text-2xl font-bold text-slate-950">Responsibility map</h2></div>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">These roles are the starting point for permissions in the next implementation phase.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {adminRoles.map((role) => (
            <article key={role.key} className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-soft">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div><h3 className="text-xl font-bold text-slate-950">{role.name}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{role.summary}</p></div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-brand-700">{role.key}</span>
              </div>
              <ul className="mt-5 space-y-2 text-sm leading-6 text-slate-700">
                {role.responsibilities.map((responsibility) => (<li key={responsibility} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" /><span>{responsibility}</span></li>))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Stage 2 MVP dashboard modules</p><h2 className="mt-2 text-2xl font-bold text-slate-950">Admin module scope</h2></div>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">The links below are placeholders for the route structure that will be built out phase by phase.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {adminModules.map((module) => {
            const Icon = moduleIconMap[module.key];
            return (
              <article key={module.key} className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-soft">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><Icon aria-hidden="true" className="h-6 w-6" /></div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2"><h3 className="text-lg font-bold text-slate-950">{module.name}</h3><Link href={module.route} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{module.route}</Link></div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{module.summary}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">{module.mvpIncludes.map((item) => (<span key={item} className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-slate-700">{item}</span>))}</div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
