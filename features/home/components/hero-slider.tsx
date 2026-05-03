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
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const slide = heroSlides[activeIndex];

  return (
    <section className="container-page grid min-h-[560px] items-center gap-10 py-12 md:grid-cols-2">
      <div className="space-y-6">
        <p className="w-fit rounded-full bg-brand-100 px-4 py-2 text-sm font-semibold text-brand-700">AI-powered health guidance</p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">{slide.title}</h1>
        <p className="max-w-xl text-lg leading-8 text-slate-600">{slide.description}</p>
        <Button asChild><Link href={slide.href}>{slide.cta}</Link></Button>
        <div className="flex gap-2 pt-2">
          {heroSlides.map((item, index) => (
            <button
              key={item.title}
              aria-label={`Show slide ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all ${index === activeIndex ? "w-10 bg-brand-600" : "w-2.5 bg-brand-200"}`}
            />
          ))}
        </div>
      </div>
      <div className="relative h-[360px] overflow-hidden rounded-[2rem] bg-brand-50 shadow-soft md:h-[460px]">
        <Image src={slide.image} alt={slide.alt} fill priority className="object-cover" />
      </div>
    </section>
  );
}
