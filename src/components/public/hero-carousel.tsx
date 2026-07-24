"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A hero banner with three responsive artworks (desktop, tablet, mobile) and
 * an optional link. Each version has its own aspect ratio, so the picture is
 * served per breakpoint and the container ratio follows suit.
 */
export interface HeroSlide {
  /** Desktop artwork — 1920×700 (wide). */
  desktop: string;
  /** Tablet artwork — 1280×900. */
  tablet: string;
  /** Mobile artwork — 750×1100 (portrait). */
  mobile: string;
  alt: string;
  /** Optional destination when the banner is clicked. */
  href?: string;
}

/** Breakpoints matched to Tailwind's md/lg, so CSS and <source> agree. */
const TABLET_MIN = 768;
const DESKTOP_MIN = 1024;

function SlidePicture({ slide }: { slide: HeroSlide }) {
  return (
    <picture>
      <source media={`(min-width: ${DESKTOP_MIN}px)`} srcSet={slide.desktop} />
      <source media={`(min-width: ${TABLET_MIN}px)`} srcSet={slide.tablet} />
      {/* Mobile is the default */}
      <img
        src={slide.mobile}
        alt={slide.alt}
        className="h-full w-full object-cover"
      />
    </picture>
  );
}

/**
 * Home hero carousel. Auto-advances every 6s; dots allow manual navigation.
 * The container ratio changes per breakpoint to fit each artwork without
 * cropping: portrait on mobile, taller on tablet, wide on desktop.
 */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      6000,
    );
    return () => clearInterval(id);
  }, [slides.length]);

  const goTo = (i: number) =>
    setIndex(((i % slides.length) + slides.length) % slides.length);

  return (
    <section className="relative w-full overflow-hidden bg-surface">
      {/* Full-bleed. Ratios: mobile 750×1100 (~0.68) · tablet 1280×900 (~1.42) · desktop 1920×700 (~2.74) */}
      <div className="relative aspect-75/110 w-full md:aspect-128/90 lg:aspect-192/70">
        {slides.map((slide, i) => {
          const active = i === index;
          const inner = <SlidePicture slide={slide} />;
          return (
            <div
              key={slide.desktop}
              className={cn(
                "absolute inset-0 transition-opacity duration-700",
                active ? "opacity-100" : "pointer-events-none opacity-0",
              )}
              aria-hidden={!active}
            >
              {slide.href ? (
                <Link
                  href={slide.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block h-full w-full"
                  aria-label={slide.alt}
                  tabIndex={active ? 0 : -1}
                >
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </div>
          );
        })}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Banner anterior"
            className="group absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-casc-navy-900/80 text-white shadow-lg ring-1 ring-white/60 backdrop-blur-md transition hover:bg-casc-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-5 sm:h-12 sm:w-12"
          >
            <ChevronLeft
              className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Banner siguiente"
            className="group absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-casc-navy-900/80 text-white shadow-lg ring-1 ring-white/60 backdrop-blur-md transition hover:bg-casc-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-5 sm:h-12 sm:w-12"
          >
            <ChevronRight
              className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </button>

          <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir al banner ${i + 1}`}
                className={cn(
                  "h-2.5 w-2.5 rounded-full ring-1 ring-casc-navy-900/40 transition-colors",
                  i === index ? "bg-primary" : "bg-white/80 hover:bg-white",
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
