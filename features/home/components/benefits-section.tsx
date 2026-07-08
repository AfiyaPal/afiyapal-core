import Image from "next/image";
import { benefits } from "../data/home-content";

export function BenefitsSection() {
  return (
    <section className="relative overflow-hidden border-y border-brand-200/40 bg-gradient-to-b from-accent-blue-50/80 via-brand-50/70 to-accent-violet-50/60 py-20">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(100%,48rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-200 to-transparent" />
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700 ring-1 ring-brand-100">
            Why AfiyaPal?
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">Your trusted health companion</h2>
          <p className="mt-3 text-slate-600">Evidence-aware guidance, built for clarity — wherever you are.</p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item) => (
            <article
              key={item.title}
              className="group relative overflow-hidden rounded-3xl border border-brand-200/70 bg-white/75 p-6 shadow-sm backdrop-blur-sm outline-none motion-safe:transition motion-safe:duration-300 hover:-translate-y-2 hover:border-accent-blue-200/90 hover:shadow-xl hover:shadow-accent-violet-500/15 motion-reduce:hover:translate-y-0 focus-within:ring-2 focus-within:ring-brand-400 focus-within:ring-offset-2"
            >
              {/* Step number */}
              <span className="absolute right-5 top-4 text-4xl font-black text-brand-100/70 select-none group-hover:text-brand-200/80 motion-safe:transition">
                {item.step}
              </span>
              <div
                aria-hidden
                className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-200/25 blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-60"
              />
              <div className="relative flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-white shadow-inner ring-1 ring-brand-100 motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-110 group-hover:shadow-md motion-reduce:group-hover:scale-100">
                <Image src={item.icon} alt="" width={44} height={44} className="h-11 w-11 object-contain" />
              </div>
              <h3 className="relative mt-5 text-lg font-semibold text-slate-900 group-hover:text-brand-700 motion-safe:transition">{item.title}</h3>
              <p className="relative mt-3 text-sm leading-relaxed text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
