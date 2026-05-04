import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Unauthorized",
  description: "You do not have permission to access this page."
};

export default function UnauthorizedPage() {
  return (
    <main className="bg-[#f8fffb]">
      <section className="container-page py-20">
        <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-soft">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <ShieldAlert aria-hidden="true" className="h-7 w-7" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Access restricted</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">You do not have permission to access this page.</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            AFIYAPAL admin routes are only available to active users with approved admin roles.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href={routes.home} className="rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-600">
              Back home
            </Link>
            <Link href={routes.login} className="rounded-full border border-emerald-200 px-5 py-3 text-sm font-semibold text-brand-700 hover:bg-emerald-50">
              Login with another account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
