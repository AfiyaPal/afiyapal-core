"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { heroSlides } from "../data/home-content";

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % heroSlides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  const slide = heroSlides[activeIndex];

  return (
    <section className="container-page grid min-h-[560px] items-center gap-10 py-12 md:grid-cols-2" aria-labelledby="home-hero-title">
      <div className="space-y-6">
        <p className="w-fit rounded-full bg-brand-100 px-4 py-2 text-sm font-bold text-brand-700">AI healthcare Africa • Swahili-aware • Educational</p>
        <h1 id="home-hero-title" className="text-4xl font-black tracking-tight text-slate-950 md:text-6xl">{slide.title}</h1>
        <p className="max-w-xl text-lg leading-8 text-slate-700">{slide.description}</p>
        <div className="flex flex-wrap gap-3">
          <Button asChild><Link href={slide.href}>{slide.cta}</Link></Button>
          <Link href="/blogs" className="inline-flex items-center rounded-full border border-emerald-200 px-5 py-2.5 text-sm font-bold text-brand-700 transition hover:bg-brand-50">
            Explore health education
          </Link>
        </div>
        <p className="max-w-xl rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          AfiyaPal is not a diagnostic tool. It provides informational guidance for adults and encourages professional care when symptoms are severe, unclear, or worsening.
        </p>
        <div className="flex gap-2 pt-2" role="tablist" aria-label="Homepage highlights">
          {heroSlides.map((item, index) => (
            <button
              key={item.title}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Show ${item.title}`}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all focus:outline-none focus:ring-4 focus:ring-brand-100 ${index === activeIndex ? "w-10 bg-brand-600" : "w-2.5 bg-brand-200"}`}
            />
          ))}
        </div>
      </div>
      <div className="relative h-[360px] overflow-hidden rounded-[2rem] bg-brand-50 shadow-soft md:h-[460px]">
        <Image src={slide.image} alt={slide.alt} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
      </div>
    </section>
  );
}
