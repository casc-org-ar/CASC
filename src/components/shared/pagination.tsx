"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Client-side pagination for the socio listings.
 *
 * The listings render every match at once, so a section with dozens of articles
 * becomes a very long page the reader has to scroll past to reach anything
 * else. Paging keeps each screen a fixed size no matter how much content the
 * team publishes.
 *
 * Pagination rather than a carousel: the page count tells the reader how much
 * there is, every card keeps its place in the grid (a carousel hides most of
 * them off-screen), and there is no horizontal swipe competing with the page
 * scroll on mobile.
 */

/** How many cards fill one page. Three rows of the 3-column grid. */
export const PAGE_SIZE = 9;

/**
 * Slice `items` into pages and expose the current one.
 *
 * Resets to page 1 whenever the result set changes — after a search or filter
 * the reader expects the first results, and staying on page 4 of a list that
 * now has two pages would show an empty grid.
 */
export function usePagination<T>(items: T[], pageSize: number = PAGE_SIZE) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  // The reset is DERIVED, not synchronised through an effect: remember which
  // result-set size the page belongs to, and when the count changes (a search
  // or filter was applied) the page falls back to 1 during the same render.
  // Doing this in `useEffect` would call setState after painting and trigger a
  // second, cascading render — the pattern React explicitly warns against.
  const [countAtPage, setCountAtPage] = useState(items.length);
  if (countAtPage !== items.length) {
    setCountAtPage(items.length);
    setPage(1);
  }

  // Clamp: the list can still shrink under the current page between renders.
  const current = Math.min(
    countAtPage === items.length ? page : 1,
    totalPages,
  );

  const pageItems = useMemo(
    () => items.slice((current - 1) * pageSize, current * pageSize),
    [items, current, pageSize],
  );

  return { page: current, totalPages, pageItems, setPage };
}

/**
 * Build the page numbers to render, collapsing long ranges with ellipses so the
 * control keeps a fixed width: 1 … 4 5 6 … 20 rather than twenty buttons.
 */
function pageNumbers(page: number, totalPages: number): (number | "gap")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "gap")[] = [1];
  const from = Math.max(2, page - 1);
  const to = Math.min(totalPages - 1, page + 1);

  if (from > 2) pages.push("gap");
  for (let i = from; i <= to; i += 1) pages.push(i);
  if (to < totalPages - 1) pages.push("gap");

  pages.push(totalPages);
  return pages;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  // Nothing to navigate with a single page.
  if (totalPages <= 1) return null;

  const go = (next: number) => {
    onPageChange(Math.min(Math.max(1, next), totalPages));
    // Bring the reader back to the top of the list; otherwise clicking page 2
    // leaves them at the bottom of the previous page's cards.
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav
      className="mt-8 flex items-center justify-center gap-1"
      aria-label="Paginación"
    >
      <Arrow
        direction="prev"
        disabled={page === 1}
        onClick={() => go(page - 1)}
      />

      {pageNumbers(page, totalPages).map((entry, index) =>
        entry === "gap" ? (
          <span
            key={`gap-${index}`}
            aria-hidden="true"
            className="px-1 text-sm text-ink-muted"
          >
            …
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            onClick={() => go(entry)}
            aria-label={`Página ${entry}`}
            aria-current={entry === page ? "page" : undefined}
            className={cn(
              "h-9 min-w-9 rounded-md px-2.5 text-sm font-medium transition-colors",
              entry === page
                ? "bg-primary text-white"
                : "border border-border bg-white text-ink-muted hover:border-accent hover:text-ink",
            )}
          >
            {entry}
          </button>
        ),
      )}

      <Arrow
        direction="next"
        disabled={page === totalPages}
        onClick={() => go(page + 1)}
      />
    </nav>
  );
}

function Arrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Página anterior" : "Página siguiente"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md border border-border bg-white text-ink-muted transition-colors",
        disabled
          ? "cursor-not-allowed opacity-40"
          : "hover:border-accent hover:text-ink",
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
