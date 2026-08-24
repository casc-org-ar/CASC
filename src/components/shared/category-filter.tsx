"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Horizontal category filter: a "Todas" pill plus one pill per category.
 * Categories are derived from the actual data (see `deriveCategories`), so the
 * filter only ever offers values that exist. Controlled by the parent, which
 * owns the selected value and applies the filtering.
 *
 * Long lists collapse. Noticias tags grow with the content — 18 distinct tags
 * across 21 articles today, 11 of them used by a single article — and rendering
 * every one wraps into several rows of pills that push the content off-screen,
 * worst of all on mobile. Past `visibleLimit`, the extra categories move into a
 * "Más" dropdown: the common ones stay one tap away and the row keeps a fixed
 * height no matter how much content is added.
 */
export function CategoryFilter({
  categories,
  selected,
  onSelect,
  visibleLimit = 6,
}: {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
  /** How many pills to show before collapsing the rest into "Más". */
  visibleLimit?: number;
}) {
  if (categories.length === 0) return null;

  // A selected category must stay visible even when it lives in the overflow —
  // otherwise the active filter disappears from the row and the user cannot
  // see (or clear) what is being applied.
  const selectedIsHidden =
    selected !== null && categories.indexOf(selected) >= visibleLimit;

  const visible = selectedIsHidden
    ? [
        ...categories.slice(0, Math.max(0, visibleLimit - 1)),
        selected,
      ]
    : categories.slice(0, visibleLimit);

  const overflow = categories.filter((c) => !visible.includes(c));

  return (
    <div
      className="mb-6 flex flex-wrap items-center gap-2"
      role="group"
      aria-label="Filtrar por categoría"
    >
      <Pill active={selected === null} onClick={() => onSelect(null)}>
        Todas
      </Pill>
      {visible.map((cat) => (
        <Pill key={cat} active={selected === cat} onClick={() => onSelect(cat)}>
          {cat}
        </Pill>
      ))}
      {overflow.length > 0 && (
        <OverflowMenu
          categories={overflow}
          selected={selected}
          onSelect={onSelect}
        />
      )}
    </div>
  );
}

/**
 * "Más" dropdown holding the categories that did not fit. Closes on outside
 * click and on Escape, and returns focus to the trigger so keyboard users are
 * not stranded at the end of the document.
 */
function OverflowMenu({
  categories,
  selected,
  onSelect,
}: {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-border bg-white px-3.5 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:border-accent hover:text-ink",
          open && "border-accent text-ink",
        )}
      >
        Más
        <span className="text-xs text-ink-muted">({categories.length})</span>
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Más categorías"
          // max-h + scroll: the list can grow without the panel running past
          // the bottom of a phone screen.
          className="animate-fade-in absolute left-0 top-full z-20 mt-2 max-h-72 w-56 overflow-y-auto rounded-md border border-border bg-white py-1 shadow-lg"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="menuitem"
              onClick={() => {
                onSelect(cat);
                setOpen(false);
              }}
              className={cn(
                "block w-full px-3.5 py-2 text-left text-sm transition-colors hover:bg-surface",
                selected === cat
                  ? "font-medium text-primary"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-white"
          : "border border-border bg-white text-ink-muted hover:border-accent hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

/**
 * Build the sorted, de-duplicated category list from items, treating category
 * as case-insensitive so "Retail" and "retail" collapse to one pill (keeping
 * the first-seen casing for display).
 */
export function deriveCategories(
  items: { categoria?: string }[],
): string[] {
  const seen = new Map<string, string>();
  for (const { categoria } of items) {
    const value = categoria?.trim();
    if (value) {
      const key = value.toLowerCase();
      if (!seen.has(key)) seen.set(key, value);
    }
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b, "es"));
}
