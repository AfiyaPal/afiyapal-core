export function AuthCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="w-full max-w-md rounded-3xl border border-emerald-100 bg-white p-8 shadow-soft">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}
