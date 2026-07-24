"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RegionSlug } from "@/components/public/asociados-directory";
import { MAP_VIEWBOX, provincePaths } from "@/lib/data/argentina-map";

export interface MapDelegation {
  region: string;
  regionSlug: RegionSlug;
  role: string;
  name: string;
  org: string;
  /** Provinces or areas covered, for the detail panel. */
  coverage: string[];
}

/**
 * Interactive map of the CASC regional delegations.
 *
 * Provinces are drawn from real geographic outlines and coloured by the
 * delegation that represents them. Hovering highlights a region; clicking it
 * (on the map or the list) selects it and opens a popup card with the delegate
 * and a link to that region's associates.
 *
 * The map is decorative-but-navigable: every region is also reachable through
 * the list beside it, so keyboard and screen-reader users get the same paths
 * without depending on the SVG.
 */
export function DelegacionesMap({
  delegations,
}: {
  delegations: MapDelegation[];
}) {
  const [hoverRegion, setHoverRegion] = useState<RegionSlug | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<RegionSlug | null>(null);
  const titleId = useId();

  // The highlighted region is whatever is hovered, falling back to the selection.
  const highlight = hoverRegion ?? selectedRegion;
  const selected =
    delegations.find((d) => d.regionSlug === selectedRegion) ?? null;
  const announced =
    delegations.find((d) => d.regionSlug === highlight) ?? null;

  // Close the modal on Escape for standard dialog behaviour.
  useEffect(() => {
    if (!selectedRegion) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedRegion(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedRegion]);

  function hrefFor(slug: RegionSlug) {
    return `/asociados?categoria=shopping-centers&region=${slug}#directorio`;
  }

  /**
   * Whether a province should light up for the highlighted region. CABA is a
   * dot inside Buenos Aires, so highlighting either metropolitan delegation
   * (CABA or GBA) paints both provinces — otherwise CABA would highlight
   * nothing visible. Each still links to its own delegate.
   */
  function isProvinceLit(provinceRegion: RegionSlug): boolean {
    if (highlight === null) return false;
    const metro: RegionSlug[] = ["caba", "gba"];
    if (metro.includes(highlight)) {
      return metro.includes(provinceRegion);
    }
    return provinceRegion === highlight;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:items-start lg:gap-10">
      {/* Map */}
      <div className="relative w-full rounded-2xl border border-border bg-linear-to-b from-casc-blue-300/20 via-surface to-white p-4 lg:sticky lg:top-24">
        <svg
          viewBox={MAP_VIEWBOX}
          role="img"
          aria-labelledby={titleId}
          className="h-auto w-full"
        >
          <title id={titleId}>
            Mapa de las delegaciones regionales de la CASC
          </title>
          {provincePaths.map((province) => {
            const isActive = isProvinceLit(province.region);
            const dimmed = highlight !== null && !isActive;

            return (
              <path
                key={province.iso}
                d={province.d}
                className={cn(
                  "cursor-pointer transition-all duration-200",
                  isActive
                    ? "fill-casc-navy-500 stroke-white"
                    : "fill-casc-blue-300 stroke-white hover:fill-casc-navy-700",
                  dimmed && "opacity-40",
                )}
                strokeWidth={1.5}
                onMouseEnter={() => setHoverRegion(province.region)}
                onMouseLeave={() => setHoverRegion(null)}
                onClick={() => setSelectedRegion(province.region)}
              />
            );
          })}
        </svg>

        <p className="mt-2 text-center text-xs text-ink-muted">
          Tocá una provincia para ver su delegación
        </p>
      </div>

      {/* Delegation list — the accessible, always-available path. */}
      <ul className="grid gap-4 sm:grid-cols-2 stagger-children">
        {delegations.map((delegation) => {
          const isActive = highlight === delegation.regionSlug;

          return (
            <li key={delegation.regionSlug}>
              <div
                onMouseEnter={() => setHoverRegion(delegation.regionSlug)}
                onMouseLeave={() => setHoverRegion(null)}
                className={cn(
                  "group flex h-full flex-col rounded-xl border bg-white p-5 shadow-none transition-all duration-200 ease-out",
                  "hover:-translate-y-0.5 hover:border-accent/70",
                  isActive ? "border-primary shadow-sm" : "border-border",
                )}
              >
                <p className="text-base font-bold tracking-tight text-ink">
                  {delegation.region}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  {delegation.role}
                </p>
                <p className="mt-1 text-sm font-medium text-ink">
                  {delegation.name}
                </p>
                <p className="text-sm text-ink-muted">{delegation.org}</p>

                {/* Provinces covered by this delegation. */}
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {delegation.coverage.map((area) => (
                    <li
                      key={area}
                      className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium leading-tight text-ink-muted"
                    >
                      {area}
                    </li>
                  ))}
                </ul>

                <Link
                  href={hrefFor(delegation.regionSlug)}
                  onFocus={() => setHoverRegion(delegation.regionSlug)}
                  onBlur={() => setHoverRegion(null)}
                  aria-label={`Ver asociados de la delegación ${delegation.region}`}
                  className="mt-4 inline-flex w-full items-center justify-between gap-1 border-t border-border pt-4 text-sm font-semibold text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Ver asociados de la región
                  <ArrowRight
                    className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Live region so the highlighted delegation is announced, not only shown. */}
      <p aria-live="polite" className="sr-only">
        {announced
          ? `Delegación ${announced.region}: ${announced.role} ${announced.name}, ${announced.org}.`
          : ""}
      </p>

      {/* Full-screen modal for the selected region. */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Delegación ${selected.region}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Scrim — clicking outside closes. */}
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => setSelectedRegion(null)}
            className="absolute inset-0 h-full w-full cursor-default bg-casc-navy-900/60 backdrop-blur-sm"
          />

          <div className="card-depth relative z-10 w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedRegion(null)}
              aria-label="Cerrar"
              className="absolute right-4 top-4 rounded-md p-1.5 text-ink-muted transition-colors hover:bg-surface hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <p className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-ink">
              <MapPin className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
              {selected.region}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {selected.role}
            </p>
            <p className="mt-1 text-lg font-bold text-ink">{selected.name}</p>
            <p className="text-sm text-ink-muted">{selected.org}</p>

            <ul className="mt-4 flex flex-wrap gap-1.5">
              {selected.coverage.map((area) => (
                <li
                  key={area}
                  className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium leading-tight text-ink-muted"
                >
                  {area}
                </li>
              ))}
            </ul>

            <Link
              href={hrefFor(selected.regionSlug)}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Ver asociados de la región
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
