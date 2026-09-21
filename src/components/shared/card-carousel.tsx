"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Horizontal card rail with paged arrow controls.
 *
 * This is the MECHANISM only — the scrolling track, the snap points and the
 * arrows. Callers render their own cards as children, so the platform keeps
 * its own card design instead of inheriting the public site's.
 *
 * It is the platform counterpart of `components/public/content-carousel.tsx`,
 * which does the same scrolling but bundles the public site's heading and card
 * styling with it. The scroll behaviour here is deliberately identical (page
 * steps, hidden scrollbar, reduced-motion support) so both surfaces feel the
 * same; what differs is only what goes inside.
 *
 * Native overflow scrolling, not a JS-driven slider: the track stays swipeable
 * on touch, keyboard-reachable, and readable with the arrows hidden — no
 * transform bookkeeping to get out of sync with the DOM.
 */

/** Honour the OS "reduce motion" setting for the smooth-scroll animation. */
function isReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function CardCarousel({
  children,
  label,
  className,
}: {
  /** One element per card. Each becomes a snap point on the rail. */
  children: React.ReactNode;
  /** What the rail holds, for the arrows' accessible names ("Destacados"). */
  label: string;
  className?: string;
}) {
  const trackRef = useRef<HTMLUListElement>(null);

  const controlClassName =
    "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-primary shadow-sm transition-colors hover:border-accent hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

  function scroll(direction: "prev" | "next") {
    const track = trackRef.current;
    if (!track) return;
    // Advance by a full viewport of the rail, so the cards move in blocks of
    // however many are visible rather than drifting one at a time.
    const step = track.clientWidth;
    track.scrollBy({
      left: direction === "next" ? step : -step,
      behavior: isReducedMotion() ? "auto" : "smooth",
    });
  }

  const items = Array.isArray(children) ? children : [children];

  return (
    <div className={className}>
      <div className="relative">
        <button
          type="button"
          onClick={() => scroll("prev")}
          className={cn(
            controlClassName,
            // Hidden on phones, where the rail is swiped instead; the buttons
            // below take over there.
            "absolute top-1/2 z-10 hidden -translate-y-1/2 sm:inline-flex",
            "-left-3 lg:-left-5",
          )}
          aria-label={`Ver ${label} anteriores`}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </button>

        <ul
          ref={trackRef}
          className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((child, index) => (
            <li
              // Children here are a fixed list rendered from stable data, never
              // reordered, so the index is a safe key — the caller's own cards
              // carry their real keys.
              key={index}
              className={cn(
                "w-full shrink-0 grow-0 basis-[85%] snap-start sm:basis-[calc(50%-0.5rem)] lg:basis-[calc(33.333%-0.667rem)]",
                // Cards on a rail must match heights the way they do in a grid.
                // A grid stretches its items for free; a flex row does not, so
                // a card whose title wraps to two lines would stand taller than
                // the rest. `flex` on the item plus a stretching child passes
                // the full height down to whatever the caller rendered — cards
                // built with `h-full` (as the platform's are) then fill it.
                "flex *:w-full",
              )}
            >
              {child}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => scroll("next")}
          className={cn(
            controlClassName,
            "absolute top-1/2 z-10 hidden -translate-y-1/2 sm:inline-flex",
            "-right-3 lg:-right-5",
          )}
          aria-label={`Ver ${label} siguientes`}
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Phone controls. The rail is swipeable, but arrows make it discoverable
          — a row of cards that happens to scroll sideways is easy to miss. */}
      <div className="mt-4 flex items-center justify-center gap-3 sm:hidden">
        <button
          type="button"
          onClick={() => scroll("prev")}
          className={controlClassName}
          aria-label={`Ver ${label} anteriores`}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => scroll("next")}
          className={controlClassName}
          aria-label={`Ver ${label} siguientes`}
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
