"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CardCover } from "@/components/shared/card-cover";
import {
  CategoryFilter,
  deriveCategories,
} from "@/components/shared/category-filter";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchInput } from "@/components/shared/search-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { Noticia } from "@/lib/types/domain";

/**
 * Client grid for published noticias with text search + category filter. The
 * category filter only renders when at least one noticia carries a category.
 */
export function NoticiasList({ noticias }: { noticias: Noticia[] }) {
  const [category, setCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const categories = useMemo(() => deriveCategories(noticias), [noticias]);

  const q = query.trim().toLowerCase();
  const visible = noticias.filter((n) => {
    const matchesCategory =
      !category || n.categoria?.toLowerCase() === category.toLowerCase();
    const matchesQuery =
      !q ||
      n.titulo.toLowerCase().includes(q) ||
      n.bajada.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  const clearFilters = () => {
    setCategory(null);
    setQuery("");
  };

  if (noticias.length === 0) {
    return <EmptyState message="No hay noticias publicadas por el momento." />;
  }

  return (
    <>
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Buscar noticias…"
        className="mb-4"
      />
      <CategoryFilter
        categories={categories}
        selected={category}
        onSelect={setCategory}
      />
      {visible.length === 0 ? (
        <EmptyState message="No encontramos noticias con esos criterios.">
          <Button variant="secondary" onClick={clearFilters}>
            Ver todas
          </Button>
        </EmptyState>
      ) : (
        <div className="stagger-children grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((n) => (
            <Link
              key={n.id}
              href={`/socio/noticias/${n.id}`}
              className="group block"
            >
              <Card
                interactive
                className="flex h-full flex-col overflow-hidden"
              >
                <CardCover src={n.imagenUrl} alt={n.titulo} />
                <div className="mb-2 flex items-center justify-between gap-2">
                  {n.categoria ? (
                    <Badge tone="accent">{n.categoria}</Badge>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs text-ink-muted">
                    {new Date(n.fecha).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <CardTitle className="text-lg">{n.titulo}</CardTitle>
                <CardDescription className="mt-1 flex-1 font-medium text-ink">
                  {n.bajada}
                </CardDescription>
                <span className="mt-3 inline-flex items-center gap-1 self-start text-sm font-medium text-primary">
                  Leer nota
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
