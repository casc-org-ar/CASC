"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import type { RegionSlug } from "@/components/public/asociados-directory";
import { MAP_VIEWBOX, provincePaths } from "@/lib/data/argentina-map";
import { MALVINAS_PATH } from "@/lib/data/malvinas-path";

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
   * Whether a province should light up for the highlighted region.
   *
   * The two metropolitan delegations (CABA and GBA) share the CABA dot on the
   * map: the GBA "24 partidos" have no separate geometry (Buenos Aires province
   * belongs to Pampeana), so highlighting either metro delegation lights the
   * CABA path. Each still links to its own delegate via the list.
   */
  function isProvinceLit(provinceRegion: RegionSlug): boolean {
    if (highlight === null) return false;
    const metro: RegionSlug[] = ["caba", "gba"];
    // Both metro delegations light the CABA path (the only metro geometry).
    if (metro.includes(highlight)) return provinceRegion === "caba";
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

          {/* CABA/GBA metro marker. The real CABA geometry is a ~4px speck
              inside Buenos Aires — invisible when lit. So the two metro
              delegations get a visible dot at CABA's location instead, which
              highlights (and is clickable) like a province. Placed at the
              centroid of the CABA path (~303, 353). */}
          <circle
            cx={303}
            cy={353}
            r={6}
            className={cn(
              "cursor-pointer transition-all duration-200",
              isProvinceLit("caba")
                ? "fill-casc-navy-500 stroke-white"
                : "fill-casc-blue-300 stroke-white hover:fill-casc-navy-700",
              highlight !== null && !isProvinceLit("caba") && "opacity-40",
            )}
            strokeWidth={1.5}
            onMouseEnter={() => setHoverRegion("caba")}
            onMouseLeave={() => setHoverRegion(null)}
            onClick={() => setSelectedRegion("caba")}
          />

          {/* Islas Malvinas — real outline (client SVG), scaled and placed to
              the southeast. Coloured and selectable as part of Patagonia, so it
              highlights and reacts to selection like the mainland provinces. */}
          <g
            transform="translate(214 798) scale(0.017) translate(-538.2 -934.22)"
            className="cursor-pointer"
            onMouseEnter={() => setHoverRegion("patagonia")}
            onMouseLeave={() => setHoverRegion(null)}
            onClick={() => setSelectedRegion("patagonia")}
          >
            <path
              d={MALVINAS_PATH}
              className={cn(
                "transition-all duration-200",
                isProvinceLit("patagonia")
                  ? "fill-casc-navy-500 stroke-white"
                  : "fill-casc-blue-300 stroke-white hover:fill-casc-navy-700",
                highlight !== null &&
                  !isProvinceLit("patagonia") &&
                  "opacity-40",
              )}
              strokeWidth={60}
            />
          </g>
        </svg>

        <p className="mt-2 text-center text-xs text-ink-muted">
          Tocá una provincia para ver su Delegación
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

      {/* Detail modal for the selected region. */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Delegación ${selected.region}`}
          className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Scrim — clicking outside closes. Soft dim, no heavy blur. */}
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => setSelectedRegion(null)}
            className="absolute inset-0 h-full w-full cursor-default bg-casc-navy-900/50"
          />

          <div className="animate-fade-in-up relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
            {/* Header: region identity + close, on a tinted band. */}
            <div className="flex items-start justify-between gap-3 border-b border-border bg-surface/60 px-6 py-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    Delegación
                  </p>
                  <h2 className="text-xl font-extrabold tracking-tight text-ink">
                    {selected.region}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRegion(null)}
                aria-label="Cerrar"
                className="-mr-1.5 -mt-1 shrink-0 rounded-md p-1.5 text-ink-muted transition-colors hover:bg-white hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Body: delegate + coverage. */}
            <div className="px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
                {selected.role}
              </p>
              <p className="mt-1 text-lg font-bold text-ink">{selected.name}</p>
              <p className="text-sm text-ink-muted">{selected.org}</p>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
                Provincias que representa
              </p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {selected.coverage.map((area) => (
                  <li
                    key={area}
                    className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium leading-tight text-ink-muted"
                  >
                    {area}
                  </li>
                ))}
              </ul>

              <ButtonLink
                href={hrefFor(selected.regionSlug)}
                size="lg"
                className="mt-6 w-full"
              >
                Ver asociados de la región
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
