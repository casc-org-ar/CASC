"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface HeroSlide {
  src: string;
  alt: string;
}

/**
 * Home hero carousel. Content parity phase: reproduces the original rotating
 * banner. Auto-advances every 6s; dots allow manual navigation.
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

  return (
    <section className="relative w-full overflow-hidden bg-surface">
      <div className="relative mx-auto aspect-[16/6] w-full max-w-7xl">
        {slides.map((slide, i) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="(max-width: 1280px) 100vw, 1280px"
            className={cn(
              "object-cover transition-opacity duration-700",
              i === index ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
      </div>

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ir al banner ${i + 1}`}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                i === index ? "bg-primary" : "bg-white/70 hover:bg-white",
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
