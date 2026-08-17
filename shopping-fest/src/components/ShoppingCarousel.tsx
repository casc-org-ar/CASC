"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Region } from "@/data/shoppings";

/**
 * One region's carousel of shopping-center logos.
 *
 * The original used Elementor Pro's "nested carousel" widget (Swiper 8): four
 * slides per view on desktop, two on tablet and mobile, 10px gap, prev/next
 * arrows and bullet pagination.
 *
 * Rebuilt on native CSS scroll-snap, which gives the same paging behaviour plus
 * touch/trackpad scrolling and keyboard support for free — and drops Swiper
 * (~140KB) along with jQuery. JS here only tracks which page is active so the
 * bullets and arrow disabled-states can follow along.
 */
export function ShoppingCarousel({ region }: { region: Region }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const perView = Math.round(track.clientWidth / (track.firstElementChild as HTMLElement)?.clientWidth) || 1;
    setPageCount(Math.max(1, Math.ceil(region.shoppings.length / perView)));
    setPage(Math.round(track.scrollLeft / track.clientWidth));
  }, [region.shoppings.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [measure]);

  const goTo = (target: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: target * track.clientWidth, behavior: "smooth" });
  };

  return (
    /*
     * `mt-5` is Elementor's `--widgets-spacing` (20px): its widgets carry
     * `margin-block-end: 20px`, which separated the region heading from the
     * carousel and the carousel from the next heading.
     */
    <div className="scroll-bottom mt-5 w-full">
      <div className="relative">
        <div
          ref={trackRef}
          onScroll={() => {
            const track = trackRef.current;
            if (track) setPage(Math.round(track.scrollLeft / track.clientWidth));
          }}
          role="region"
          aria-roledescription="carrusel"
          aria-label={region.title}
          tabIndex={0}
          className="flex snap-x snap-mandatory gap-[10px] overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {region.shoppings.map((shopping) => (
            <a
              key={shopping.logo}
              href={shopping.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[calc((100%-30px)/4)] shrink-0 snap-start max-tablet:w-[calc((100%-10px)/2)]"
            >
              <Image
                src={shopping.logo}
                alt={shopping.name}
                width={500}
                height={500}
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="h-auto w-full"
              />
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(page - 1)}
          disabled={page === 0}
          aria-label="Anterior"
          className="absolute top-1/2 left-0 -translate-y-1/2 text-[50px] leading-none text-grey transition-opacity disabled:opacity-0 max-mobile:text-[25px]"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => goTo(page + 1)}
          disabled={page >= pageCount - 1}
          aria-label="Siguiente"
          className="absolute top-1/2 right-0 -translate-y-1/2 text-[50px] leading-none text-grey transition-opacity disabled:opacity-0 max-mobile:text-[25px]"
        >
          ›
        </button>
      </div>

      {/*
        The original reserved the pagination strip as padding-bottom on the
        carousel itself — `pagination-size` + `pagination-spacing`, i.e.
        20+30=50px on desktop, 16+10=26px on tablet, 12+0=12px on mobile.
        Matching that keeps each region block the same height as the original.
      */}
      <div className="mt-[30px] mb-5 flex h-[20px] justify-center gap-2 max-tablet:mt-[10px] max-tablet:h-[16px] max-mobile:mt-0 max-mobile:h-[12px]">
        {Array.from({ length: pageCount }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ir a la página ${i + 1} de ${region.title}`}
            aria-current={i === page}
            className={`size-[20px] rounded-full bg-grey transition-opacity max-tablet:size-[16px] max-mobile:size-[12px] ${
              i === page ? "opacity-100" : "opacity-30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
