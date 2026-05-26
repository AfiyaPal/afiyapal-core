import Image from "next/image";
import { benefits } from "../data/home-content";

export function BenefitsSection() {
  return (
    <section className="bg-white py-20" aria-labelledby="benefits-title">
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-bold text-brand-600">Why AfiyaPal?</span>
          <h2 id="benefits-title" className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Built for trusted health discovery</h2>
          <p className="mt-4 text-slate-600">AfiyaPal combines AI-assisted health guidance, community health information, and education-first safety language for African healthcare contexts.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {benefits.map((item) => (
            <article key={item.title} className="rounded-3xl border border-emerald-100 bg-[#f8fffb] p-6 shadow-sm">
              <Image src={item.icon} alt="" width={52} height={52} className="size-[52px]" loading="lazy" />
              <h3 className="mt-5 text-lg font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
