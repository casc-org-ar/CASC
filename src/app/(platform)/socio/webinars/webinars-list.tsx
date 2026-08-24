"use client";

import { Play } from "lucide-react";
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
import type { Webinar } from "@/lib/types/domain";

/** Client grid for published webinars with text search + category filter. */
export function WebinarsList({ webinars }: { webinars: Webinar[] }) {
  const [category, setCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const categories = useMemo(() => deriveCategories(webinars), [webinars]);

  const q = query.trim().toLowerCase();
  const visible = webinars.filter((w) => {
    const matchesCategory =
      !category || w.categoria.toLowerCase() === category.toLowerCase();
    const matchesQuery =
      !q ||
      w.titulo.toLowerCase().includes(q) ||
      w.descripcion.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  // Page the filtered results so the section stays a fixed height as the
  // catalogue grows. Resets to page 1 whenever the search or filter changes.
  const { page, totalPages, pageItems, setPage } = usePagination(visible);

  const clearFilters = () => {
    setCategory(null);
    setQuery("");
  };

  if (webinars.length === 0) {
    return <EmptyState message="No hay webinars publicados por el momento." />;
  }

  return (
    <>
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Buscar webinars…"
        className="mb-4"
      />
      <CategoryFilter
        categories={categories}
        selected={category}
        onSelect={setCategory}
      />
      {visible.length === 0 ? (
        <EmptyState message="No encontramos webinars con esos criterios.">
          <Button variant="secondary" onClick={clearFilters}>
            Ver todos
          </Button>
        </EmptyState>
      ) : (
        <>
        <div className="stagger-children grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((w) => (
            <Link
              key={w.id}
              href={`/socio/webinars/${w.id}`}
              className="group block"
            >
              <Card
                interactive
                className="flex h-full flex-col overflow-hidden"
              >
                <CardCover src={w.portadaUrl} alt={w.titulo} />
                <div className="mb-3 flex items-center justify-between">
                  <Badge tone="accent">{w.categoria}</Badge>
                  <span className="text-xs text-ink-muted">
                    {new Date(w.fecha).toLocaleDateString("es-AR")}
                  </span>
                </div>
                <CardTitle>{w.titulo}</CardTitle>
                <CardDescription className="mt-2 line-clamp-3 flex-1">
                  {w.descripcion}
                </CardDescription>
                <span className="mt-4 inline-flex items-center gap-2 self-start text-sm font-medium text-primary">
                  <Play className="h-4 w-4" />
                  Ver webinar
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
