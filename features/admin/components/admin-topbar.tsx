import Link from "next/link";
import { logoutAction } from "@/features/admin/actions/admin-session-actions";
import { getRoleLabel } from "@/server/auth/roles";

export type AdminTopbarUser = { username: string; email: string; role: string };

export function AdminTopbar({ user }: { user: AdminTopbarUser }) {
  const initials = user.username.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "A";
  return (
    <header className="sticky top-0 z-20 border-b border-emerald-100 bg-[#f8fffb]/90 px-4 py-4 backdrop-blur md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">Stage 2 Admin MVP</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">Platform operations dashboard</h2>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-brand-600 hover:text-brand-700">View site</Link>
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-3 rounded-full border border-emerald-100 bg-white py-1.5 pl-1.5 pr-4 shadow-sm transition hover:border-brand-600">
              <span className="grid size-10 place-items-center rounded-full bg-brand-600 text-sm font-black text-white">{initials}</span>
              <span className="text-left"><span className="block text-sm font-bold text-slate-950">{user.username}</span><span className="block text-xs text-slate-500">{getRoleLabel(user.role)}</span></span>
            </summary>
            <div className="absolute right-0 mt-3 w-72 rounded-3xl border border-emerald-100 bg-white p-4 shadow-soft">
              <p className="text-sm font-bold text-slate-950">{user.username}</p>
              <p className="mt-1 truncate text-xs text-slate-500">{user.email}</p>
              <p className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-brand-700">{getRoleLabel(user.role)}</p>
              <form action={logoutAction} className="mt-4"><button className="w-full rounded-full bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800" type="submit">Log out</button></form>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
