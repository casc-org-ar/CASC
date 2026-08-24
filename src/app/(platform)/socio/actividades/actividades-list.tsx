"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CardCover } from "@/components/shared/card-cover";
import { CategoryFilter } from "@/components/shared/category-filter";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination, usePagination } from "@/components/shared/pagination";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { Actividad } from "@/lib/types/domain";

/**
 * Actividades grid with text search + modality filter, matching the pattern of
 * the informes/noticias/webinars listings.
 *
 * Those three filter by `categoria`, but Actividad has no such field — its only
 * classifier is `lugar`, which is free text the admin types ("Online",
 * "Webinar online", "Auditorio Plaza Galicia, Ciudad de Buenos Aires"). Filtering
 * on the raw value would put almost every activity in its own pill and split
 * "Online" from "Webinar online" even though they mean the same thing.
 *
 * So the filter derives a MODALITY from `lugar` instead: online vs presencial.
 * That is the distinction a member actually acts on — whether they have to
 * travel — and it stays useful as activities are added.
 */

const MODALIDADES = ["Online", "Presencial"] as const;
type Modalidad = (typeof MODALIDADES)[number];

/**
 * Classify an activity by its `lugar`. Anything naming a remote format counts
 * as online; a named venue or city is presencial. Without a `lugar` the
 * modality is unknown, and the activity is only hidden when a filter is active.
 */
function modalidadDe(actividad: Actividad): Modalidad | null {
  const lugar = actividad.lugar?.trim().toLowerCase();
  if (!lugar) return null;
  return /online|virtual|streaming|zoom|remoto/.test(lugar)
    ? "Online"
    : "Presencial";
}

export function ActividadesList({ actividades }: { actividades: Actividad[] }) {
  const [modalidad, setModalidad] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  // Only offer modalities that exist in the data, so the filter never shows a
  // pill that would return nothing.
  const modalidades = useMemo(() => {
    const presentes = new Set(
      actividades.map(modalidadDe).filter((m): m is Modalidad => m !== null),
    );
    return MODALIDADES.filter((m) => presentes.has(m));
  }, [actividades]);

  const q = query.trim().toLowerCase();
  const visible = actividades.filter((a) => {
    const matchesModalidad = !modalidad || modalidadDe(a) === modalidad;
    const matchesQuery =
      !q ||
      a.titulo.toLowerCase().includes(q) ||
      a.descripcion.toLowerCase().includes(q) ||
      (a.lugar?.toLowerCase().includes(q) ?? false);
    return matchesModalidad && matchesQuery;
  });

  // Page the filtered results so the section stays a fixed height as the
  // catalogue grows. Resets to page 1 whenever the search or filter changes.
  const { page, totalPages, pageItems, setPage } = usePagination(visible);

  const clearFilters = () => {
    setModalidad(null);
    setQuery("");
  };

  if (actividades.length === 0) {
    return <EmptyState message="Todavía no hay actividades publicadas." />;
  }

  return (
    <>
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Buscar actividades…"
        className="mb-4"
      />
      <CategoryFilter
        categories={modalidades}
        selected={modalidad}
        onSelect={setModalidad}
      />
      {visible.length === 0 ? (
        <EmptyState message="No encontramos actividades con esos criterios.">
          <Button variant="secondary" onClick={clearFilters}>
            Ver todas
          </Button>
        </EmptyState>
      ) : (
        <>
        <div className="stagger-children grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((actividad) => (
            <Link
              key={actividad.id}
              href={`/socio/actividades/${actividad.slug}`}
              className="group block"
            >
              <Card interactive className="flex h-full flex-col overflow-hidden">
                <CardCover src={actividad.imagen} alt={actividad.titulo} />
                <CardTitle>{actividad.titulo}</CardTitle>
                {(actividad.fecha || actividad.lugar) && (
                  <p className="mt-1 text-xs font-medium text-ink-muted">
                    {[actividad.fecha, actividad.lugar]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
                <CardDescription className="mt-2 line-clamp-3">
                  {actividad.descripcion}
                </CardDescription>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Ver actividad
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Card>
            </Link>
          ))}
        </div>
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </>
      )}
    </>
  );
}
