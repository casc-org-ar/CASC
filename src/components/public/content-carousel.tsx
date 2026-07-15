"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CardCover } from "@/components/shared/card-cover";
import { cn } from "@/lib/utils";

export interface ContentCarouselItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  imageFit?: "cover" | "contain";
  href?: string;
  eyebrow?: string;
  dateLabel?: string;
}

function isReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function ContentCard({ item }: { item: ContentCarouselItem }) {
  const content = (
    <Card
      interactive={Boolean(item.href)}
      className={cn(
        "h-full rounded-lg p-5 shadow-none hover:shadow-none",
        item.href && "group-hover:border-accent/70",
      )}
    >
      <CardCover
        src={item.image}
        alt={item.title}
        className={cn(
          "h-52 rounded-t-lg",
          item.imageFit === "contain" && "bg-white",
        )}
        imageClassName={
          item.imageFit === "contain"
            ? "object-contain p-4 group-hover:scale-100"
            : undefined
        }
      />
      <div className="flex min-h-44 flex-col">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          {item.eyebrow && <span>{item.eyebrow}</span>}
          {item.dateLabel && (
            <>
              {item.eyebrow && <span className="text-border">/</span>}
              <span>{item.dateLabel}</span>
            </>
          )}
        </div>

        <h3 className="text-lg font-bold leading-6 text-ink">{item.title}</h3>
        <p className="mt-3 line-clamp-4 text-sm leading-6 text-ink-muted">
          {item.description}
        </p>

        {item.href && (
          <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-primary">
            Ver más
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        )}
      </div>
    </Card>
  );

  if (!item.href) {
    return content;
  }

  return (
    <Link
      href={item.href}
      className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      {content}
    </Link>
  );
}

export function ContentCarousel({
  title,
  description,
  items,
  align = "left",
}: {
  title: string;
  description?: string;
  items: ContentCarouselItem[];
  align?: "left" | "center";
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const isCentered = align === "center";
  const hasControls = items.length > 1;
  const controlsClassName =
    "inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-primary shadow-sm transition-colors hover:border-accent hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

  function scroll(direction: "prev" | "next") {
    const track = trackRef.current;
    if (!track) return;

    // Advance by a full page (the visible set of cards) so the carousel
    // moves in blocks of 3 on desktop instead of drifting card by card.
    const step = track.clientWidth;

    track.scrollBy({
      left: direction === "next" ? step : -step,
      behavior: isReducedMotion() ? "auto" : "smooth",
    });
  }

  return (
    <div>
      <div
        className={cn(
          "mb-8",
          isCentered ? "mx-auto max-w-3xl text-center" : "max-w-3xl",
        )}
      >
        <h2 className="text-3xl font-extrabold tracking-tight text-ink">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-base leading-7 text-ink-muted">
            {description}
          </p>
        )}
      </div>

      <div className="relative">
        {hasControls && (
          <button
            type="button"
            onClick={() => scroll("prev")}
            className={cn(
              controlsClassName,
              "absolute top-1/2 z-10 hidden -translate-y-1/2 sm:inline-flex",
              "-left-4 lg:-left-6 xl:-left-12",
            )}
            aria-label={`Ver contenidos anteriores de ${title}`}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
        )}

        <ul
          ref={trackRef}
          className="stagger-children flex w-full snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => (
            <li
              id={item.id}
              key={item.id}
              className="w-full shrink-0 grow-0 basis-full snap-start scroll-mt-28 sm:basis-[calc(50%-0.625rem)] lg:basis-[calc(33.333%-0.834rem)]"
            >
              <ContentCard item={item} />
            </li>
          ))}
        </ul>

        {hasControls && (
          <button
            type="button"
            onClick={() => scroll("next")}
            className={cn(
              controlsClassName,
              "absolute top-1/2 z-10 hidden -translate-y-1/2 sm:inline-flex",
              "-right-4 lg:-right-6 xl:-right-12",
            )}
            aria-label={`Ver contenidos siguientes de ${title}`}
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {hasControls && (
        <div className="mt-6 flex items-center justify-center gap-3 sm:hidden">
          <button
            type="button"
            onClick={() => scroll("prev")}
            className={controlsClassName}
            aria-label={`Ver contenidos anteriores de ${title}`}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scroll("next")}
            className={controlsClassName}
            aria-label={`Ver contenidos siguientes de ${title}`}
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
