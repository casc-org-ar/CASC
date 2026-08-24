"use client";

import { ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CardCover } from "@/components/shared/card-cover";
import {
  CategoryFilter,
  deriveCategories,
} from "@/components/shared/category-filter";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination, usePagination } from "@/components/shared/pagination";
import { SearchInput } from "@/components/shared/search-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { Informe } from "@/lib/types/domain";

/** Read-only informes grid with text search + category filter (same pattern as noticias/webinars). */
export function InformesList({ informes }: { informes: Informe[] }) {
  const [category, setCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const categories = useMemo(() => deriveCategories(informes), [informes]);

  const q = query.trim().toLowerCase();
  const visible = informes.filter((i) => {
    const matchesCategory =
      !category || i.categoria.toLowerCase() === category.toLowerCase();
    const matchesQuery =
      !q ||
      i.titulo.toLowerCase().includes(q) ||
      i.descripcion.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  // Page the filtered results so the section stays a fixed height as the
  // catalogue grows. Resets to page 1 whenever the search or filter changes.
  const { page, totalPages, pageItems, setPage } = usePagination(visible);

  const clearFilters = () => {
    setCategory(null);
    setQuery("");
  };

  if (informes.length === 0) {
    return <EmptyState message="No hay informes publicados por el momento." />;
  }

  return (
    <>
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Buscar informes…"
        className="mb-4"
      />
      <CategoryFilter
        categories={categories}
        selected={category}
        onSelect={setCategory}
      />
      {visible.length === 0 ? (
        <EmptyState message="No encontramos informes con esos criterios.">
          <Button variant="secondary" onClick={clearFilters}>
            Ver todos
          </Button>
        </EmptyState>
      ) : (
        <>
        <div className="stagger-children grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((i) => (
            <Link
              key={i.id}
              href={`/socio/informes/${i.id}`}
              className="group block"
            >
              <Card
                interactive
                className="flex h-full flex-col overflow-hidden"
              >
                <CardCover src={i.portadaUrl} alt={i.titulo} />
                <div className="mb-2 flex items-center justify-between gap-2">
                  <Badge tone="accent">{i.categoria}</Badge>
                  <span className="text-xs text-ink-muted">
                    {new Date(i.fecha).toLocaleDateString("es-AR")}
                  </span>
                </div>
                <CardTitle className="flex items-start gap-2">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {i.titulo}
                </CardTitle>
                <CardDescription className="mt-1 flex-1">
                  {i.descripcion}
                </CardDescription>
                <span className="mt-4 inline-flex items-center gap-1 self-start text-sm font-medium text-primary">
                  Abrir informe
                  <ArrowRight className="h-4 w-4" />
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
