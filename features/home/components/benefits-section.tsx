import Image from "next/image";
import { benefits } from "../data/home-content";

export function BenefitsSection() {
  return (
    <section className="bg-white py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-semibold text-brand-600">Why AfiyaPal?</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Your trusted health companion</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {benefits.map((item) => (
            <article key={item.title} className="rounded-3xl border border-emerald-100 bg-[#f8fffb] p-6 shadow-sm">
              <Image src={item.icon} alt="" width={52} height={52} className="h-13 w-13" />
              <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
