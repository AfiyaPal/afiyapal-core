import Link from "next/link";
import {
  Bell,
  Building2,
  ClipboardList,
  FileText,
  FlaskConical,
  History,
  Mail,
  MessageSquareWarning,
  Settings,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import { AdminDashboardCard } from "./admin-dashboard-card";
import { AdminDataTable, type AdminTableColumn } from "./admin-data-table";
import { AdminStatusBadge } from "./admin-status-badge";
import {
  ADMIN_USER_STORY,
  adminModules,
  adminRoles,
  systemUserRoles,
} from "@/features/admin/data/admin-scope";
import { adminActionRules } from "@/features/admin/data/admin-permission-rules";

const moduleIconMap = {
  overview: ClipboardList,
  content: FileText,
  users: Users,
  doctors: Stethoscope,
  facilities: Building2,
  "symptom-checks": ClipboardList,
  "ai-flags": MessageSquareWarning,
  consultations: Stethoscope,
  reports: ShieldCheck,
  "contact-submissions": Mail,
  notifications: Bell,
  "audit-logs": History,
  testing: FlaskConical,
  settings: Settings,
} as const;

type ModuleRow = { name: string; route: string; owner: string; status: string };

const moduleColumns: readonly AdminTableColumn<ModuleRow>[] = [
  {
    key: "name",
    header: "Module",
    render: (row) => (
      <span className="font-bold text-slate-950">{row.name}</span>
    ),
  },
  {
    key: "route",
    header: "Route",
    render: (row) => (
      <Link
        href={row.route}
        className="font-semibold text-brand-700 hover:text-brand-600"
      >
        {row.route}
      </Link>
    ),
  },
  { key: "owner", header: "Primary owner", render: (row) => row.owner },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <AdminStatusBadge tone="green">{row.status}</AdminStatusBadge>
    ),
  },
];

const dashboardCards = [
  {
    label: "Admin roles",
    value: String(adminRoles.length),
    helper: "Defined responsibility boundaries for Stage 2 operations.",
  },
  {
    label: "Protected modules",
    value: String(adminModules.length),
    helper: "Admin routes now live inside the shared admin shell.",
  },
  {
    label: "Reusable filters",
    value: "6",
    helper: "Search, status, date, role, language, and urgency are ready.",
  },
  {
    label: "Safety scope",
    value: "Core",
    helper:
      "AI flags, reports, doctors, consultations, and content are included.",
  },
];

function getModuleOwner(moduleKey: string) {
  if (moduleKey === "doctors") return "Doctor Manager";
  if (moduleKey === "ai-flags" || moduleKey === "symptom-checks")
    return "Medical Reviewer";
  if (moduleKey === "content") return "Content Manager";
  if (moduleKey === "consultations" || moduleKey === "reports")
    return "Support Admin";
  if (moduleKey === "settings") return "Super Admin";
  return "Super Admin";
}

export function AdminScopePage() {
  const moduleRows = adminModules.map((module) => ({
    name: module.name,
    route: module.route,
    owner: getModuleOwner(module.key),
    status: "Route ready",
  }));

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 shadow-sm md:p-8">
        <div className="max-w-4xl">
          <p className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold text-brand-700 shadow-sm">
            AFIYAPAL Stage 2 Admin
          </p>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
            Admin dashboard foundation for a safer health platform.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700">
            Phase 3 adds the shared admin shell, sidebar, top bar,
            profile/logout menu, dashboard cards, reusable table, reusable
            filters, and the settings route structure.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardCards.map((card) => (
          <AdminDashboardCard key={card.label} {...card} />
        ))}
      </section>

      <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-bold uppercase tracking-wide text-brand-700">
          Core admin user story
        </p>
        <blockquote className="mt-4 border-l-4 border-brand-600 pl-5 text-lg font-semibold leading-8 text-slate-800">
          {ADMIN_USER_STORY}
        </blockquote>
      </section>

      <AdminDataTable
        title="Stage 2 MVP admin routes"
        description="Every route sits under the protected admin layout and uses the shared shell. Later phases will connect each table to real records and admin actions."
        columns={moduleColumns}
        rows={moduleRows}
      />

      <section className="grid gap-4 xl:grid-cols-2">
        {adminModules.map((module) => {
          const Icon = moduleIconMap[module.key];
          return (
            <article
              key={module.key}
              className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm"
            >
              <div className="flex gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                  <Icon aria-hidden="true" className="size-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-black text-slate-950">
                      {module.name}
                    </h3>
                    <Link
                      href={module.route}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 hover:text-brand-700"
                    >
                      {module.route}
                    </Link>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {module.summary}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {module.mvpIncludes.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </section>

      <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-bold uppercase tracking-wide text-brand-700">
          First admin roles
        </p>
        <h2 className="mt-2 text-2xl font-black text-slate-950">
          Responsibility map
        </h2>
        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {adminRoles.map((role) => (
            <article
              key={role.key}
              className="rounded-3xl border border-emerald-100 bg-emerald-50/50 p-5"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-950">
                    {role.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {role.summary}
                  </p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-brand-700">
                  {role.key}
                </span>
              </div>
              <ul className="mt-5 space-y-2 text-sm leading-6 text-slate-700">
                {role.responsibilities.map((responsibility) => (
                  <li key={responsibility} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-600" />
                    <span>{responsibility}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-bold uppercase tracking-wide text-brand-700">
          Permission helper rules
        </p>
        <h2 className="mt-2 text-2xl font-black text-slate-950">
          Admin action boundaries
        </h2>
        <div className="mt-6 grid gap-3 xl:grid-cols-2">
          {adminActionRules.map((item) => (
            <article
              key={item.rule}
              className="rounded-2xl border border-emerald-100 bg-slate-50 p-4"
            >
              <p className="text-sm font-bold text-slate-950">{item.rule}</p>
              <p className="mt-2 text-xs font-medium text-slate-500">
                Permission: {item.permission}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.allowedRoles.map((role) => (
                  <span
                    key={role}
                    className="rounded-full bg-white px-3 py-1 text-xs font-bold text-brand-700"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-bold uppercase tracking-wide text-brand-700">
          System role keys
        </p>
        <h2 className="mt-2 text-2xl font-black text-slate-950">
          Role-based access foundation
        </h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {systemUserRoles.map((role) => (
            <article
              key={role.key}
              className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4"
            >
              <p className="text-sm font-black text-slate-950">{role.name}</p>
              <p className="mt-1 inline-flex rounded-full bg-white px-2 py-1 text-xs font-bold text-brand-700">
                {role.key}
              </p>
              <p className="mt-3 text-xs leading-5 text-slate-600">
                {role.summary}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
