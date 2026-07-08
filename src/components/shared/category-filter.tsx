"use client";

import { cn } from "@/lib/utils";

/**
 * Horizontal category filter: a "Todas" pill plus one pill per category.
 * Categories are derived from the actual data (see `deriveCategories`), so the
 * filter only ever offers values that exist. Controlled by the parent, which
 * owns the selected value and applies the filtering.
 */
export function CategoryFilter({
  categories,
  selected,
  onSelect,
}: {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
}) {
  if (categories.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
      <Pill active={selected === null} onClick={() => onSelect(null)}>
        Todas
      </Pill>
      {categories.map((cat) => (
        <Pill
          key={cat}
          active={selected === cat}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </Pill>
      ))}
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
