"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TocChapter {
  id: string;
  numero: string;
  titulo: string;
}

/**
 * Table of contents for the Estatuto, with scroll-spy.
 *
 * Desktop: a sticky sidebar; the chapter currently in view is highlighted.
 * Mobile: a collapsible panel pinned under the header, so the long document
 * stays reachable without pushing the text down the page.
 */
export function EstatutoToc({ chapters }: { chapters: TocChapter[] }) {
  const [activeId, setActiveId] = useState<string>(chapters[0]?.id ?? "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const headings = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    // The heading closest to the top of the viewport (but still below the
    // header) wins. rootMargin pulls the trigger line down under the header
    // and up from the bottom, so a chapter activates as it reaches the top.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
          return;
        }
        // Nothing intersecting (between chapters): keep the last one above.
        const above = headings
          .filter((el) => el.getBoundingClientRect().top < 120)
          .pop();
        if (above) setActiveId(above.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [chapters]);

  const items = (
    <ol className="space-y-0.5 border-l border-border">
      {chapters.map((c) => {
        const active = c.id === activeId;
        return (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              onClick={() => setOpen(false)}
              aria-current={active ? "true" : undefined}
              className={cn(
                "block border-l-2 py-1.5 pl-4 text-sm transition-colors",
                active
                  ? "border-primary bg-primary/5 text-ink"
                  : "border-transparent text-ink-muted hover:border-border hover:text-ink",
              )}
            >
              <span
                className={cn(
                  "font-medium",
                  active ? "text-primary" : "text-ink",
                )}
              >
                {c.numero}
              </span>
              {c.titulo ? (
                <span className="block text-xs text-ink-muted">{c.titulo}</span>
              ) : null}
            </a>
          </li>
        );
      })}
    </ol>
  );

  const activeChapter = chapters.find((c) => c.id === activeId);

  return (
    <>
      {/* Mobile: collapsible panel pinned under the fixed header. */}
      <nav
        aria-label="Índice del estatuto"
        className="sticky top-20 z-30 -mx-4 mb-8 border-y border-border bg-bg/95 px-4 backdrop-blur print:hidden lg:hidden"
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-3 py-3 text-left"
        >
          <span className="flex min-w-0 items-center gap-2">
            <List className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden />
            <span className="truncate text-sm font-medium text-ink">
              {activeChapter?.numero ?? "Contenido"}
            </span>
          </span>
          <span className="shrink-0 text-xs text-ink-muted">
            {open ? "Cerrar" : "Índice"}
          </span>
        </button>
        {open && <div className="max-h-72 overflow-y-auto pb-4">{items}</div>}
      </nav>

      {/* Desktop: sticky sidebar. */}
      <nav
        aria-label="Índice del estatuto"
        className="hidden print:hidden lg:sticky lg:top-24 lg:block lg:self-start"
      >
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Contenido
        </h2>
        {items}
      </nav>
    </>
  );
}
