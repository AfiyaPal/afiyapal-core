"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { heroSlides } from "../data/home-content";

const INTERVAL_MS = 5500;

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [heroPausedByHover, setHeroPausedByHover] = useState(false);
  const [dotCooldown, setDotCooldown] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const dotCooldownTimerRef = useRef<number | null>(null);

  const clearDotCooldownTimer = useCallback(() => {
    if (dotCooldownTimerRef.current !== null) {
      clearTimeout(dotCooldownTimerRef.current);
      dotCooldownTimerRef.current = null;
    }
  }, []);

  const autoAdvanceFrozen = heroPausedByHover || dotCooldown;

  useEffect(() => {
    if (autoAdvanceFrozen) return;
    const timer = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % heroSlides.length);
      setProgressKey((k) => k + 1);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [autoAdvanceFrozen]);

  useEffect(() => () => clearDotCooldownTimer(), [clearDotCooldownTimer]);

  const slide = heroSlides[activeIndex];

  const navigate = (index: number) => {
    setActiveIndex((index + heroSlides.length) % heroSlides.length);
    setProgressKey((k) => k + 1);
    setDotCooldown(true);
    clearDotCooldownTimer();
    dotCooldownTimerRef.current = window.setTimeout(() => {
      setDotCooldown(false);
      dotCooldownTimerRef.current = null;
    }, INTERVAL_MS * 2) as unknown as number;
  };

  return (
    <section
      className="border-b border-brand-200/40 bg-gradient-to-br from-brand-100/70 via-accent-blue-50/50 to-accent-violet-50/40"
      onMouseEnter={() => setHeroPausedByHover(true)}
      onMouseLeave={() => setHeroPausedByHover(false)}
      onFocus={() => setHeroPausedByHover(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setHeroPausedByHover(false); }}
    >
      <div className="container-page grid min-h-[580px] items-center gap-10 py-14 md:grid-cols-2 md:gap-14 md:h-[580px]">
      {/* Text column */}
      <div className="flex flex-col justify-between self-stretch">
        {/* Top group — variable content */}
        <div>
          <div key={`badge-${activeIndex}`} className="animate-slide-in-left">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-100 bg-brand-50/90 px-4 py-2 text-sm font-semibold text-brand-800 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
              </span>
              {slide.badge}
            </p>
          </div>

          <div key={`hero-copy-${activeIndex}`} className="animate-fade-in mt-6 space-y-6 motion-reduce:animate-none">
            <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl lg:text-[3.4rem] lg:leading-[1.12]">
              {slide.title}
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-slate-600">{slide.description}</p>
            <div className="flex flex-wrap items-center gap-4">
              <Button asChild className="animate-pulse-glow hover:bg-brand-600 hover:shadow-none">
                <Link href={slide.href}>{slide.cta}</Link>
              </Button>
              <Link
                href="/blogs"
                className="text-sm font-semibold text-brand-700 underline-offset-4"
              >
                Explore blogs &amp; events →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom group — controls always fixed */}
        <div>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(activeIndex - 1)}
              aria-label="Previous slide"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-100 bg-white text-brand-600 shadow-sm active:scale-95"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex gap-2" role="tablist" aria-label="Hero slides">
              {heroSlides.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  role="tab"
                  aria-selected={index === activeIndex}
                  aria-label={`Slide ${index + 1}: ${item.badge}`}
                  onClick={() => navigate(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${
                    index === activeIndex
                      ? "w-10 bg-gradient-to-r from-brand-500 to-teal-500"
                      : "w-2.5 bg-brand-200"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => navigate(activeIndex + 1)}
              aria-label="Next slide"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-100 bg-white text-brand-600 shadow-sm active:scale-95"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <span className="ml-2 text-xs font-medium text-slate-400" aria-live="polite">
              {activeIndex + 1} / {heroSlides.length}
            </span>
          </div>

          {/* Auto-play progress bar */}
          <div className="mt-3 h-0.5 w-40 overflow-hidden rounded-full bg-brand-100">
            <div
              key={progressKey}
              className="hero-progress-bar h-full rounded-full bg-gradient-to-r from-brand-500 to-teal-500"
              style={{
                animationDuration: `${INTERVAL_MS}ms`,
                animationPlayState: autoAdvanceFrozen ? "paused" : "running",
              }}
            />
          </div>
        </div>
      </div>

      {/* Image column */}
      <div className="relative md:pl-4">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 top-8 hidden h-72 w-72 rounded-full bg-gradient-to-br from-brand-200/50 to-teal-200/40 blur-3xl md:block"
        />
        <div className="relative w-full overflow-hidden rounded-[2rem] ring-1 ring-black/5 shadow-[0_24px_80px_-12px_rgb(23_163_107_/_0.22)] aspect-[4/3]">
          <div key={`hero-img-${activeIndex}`} className="animate-fade-in absolute inset-0 motion-reduce:animate-none">
            <Image src={slide.image} alt={slide.alt} fill priority={activeIndex === 0} sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-brand-950/25 via-transparent to-transparent" />
          </div>
          {/* Slide counter badge on image */}
          <div className="absolute bottom-4 right-4 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {activeIndex + 1}/{heroSlides.length}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
