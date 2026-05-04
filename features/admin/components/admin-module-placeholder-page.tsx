import Link from "next/link";
import { adminModules } from "@/features/admin/data/admin-scope";

type AdminModule = (typeof adminModules)[number];

export function getAdminModuleByKey(key: AdminModule["key"]) {
  return adminModules.find((module) => module.key === key);
}

export function AdminModulePlaceholderPage({ module }: { module: AdminModule }) {
  return (
    <main className="bg-[#f8fffb]">
      <section className="container-page py-14">
        <Link href="/admin" className="text-sm font-semibold text-brand-700 hover:text-brand-600">
          ← Back to admin scope
        </Link>
        <div className="mt-6 rounded-3xl border border-emerald-100 bg-white p-8 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Stage 2 admin module</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{module.name}</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">{module.summary}</p>
          <div className="mt-8">
            <h2 className="text-lg font-bold text-slate-950">MVP includes</h2>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-700 md:grid-cols-2">
              {module.mvpIncludes.map((item) => (
                <li key={item} className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-8 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            This page is intentionally a Phase 1 placeholder. The module-specific database models, permissions, tables, filters, and actions will be implemented in later phases.
          </p>
        </div>
      </section>
    </main>
  );
}
