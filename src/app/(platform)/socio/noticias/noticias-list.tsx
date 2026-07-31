"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CardCover } from "@/components/shared/card-cover";
import { CategoryFilter } from "@/components/shared/category-filter";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchInput } from "@/components/shared/search-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { BlogPost } from "@/lib/types/domain";

/**
 * Build the sorted, de-duplicated tag list from posts, case-insensitive so
 * "Retail" and "retail" collapse to one pill (keeping the first-seen casing).
 */
function deriveTags(posts: BlogPost[]): string[] {
  const seen = new Map<string, string>();
  for (const post of posts) {
    for (const raw of post.tags) {
      const value = raw.trim();
      if (!value) continue;
      const key = value.toLowerCase();
      if (!seen.has(key)) seen.set(key, value);
    }
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b, "es"));
}

/**
 * Client grid for published articles with text search + tag filter. The tag
 * filter only renders when at least one article carries a tag.
 */
export function NoticiasList({ noticias }: { noticias: BlogPost[] }) {
  const [tag, setTag] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const tags = useMemo(() => deriveTags(noticias), [noticias]);

  const q = query.trim().toLowerCase();
  const visible = noticias.filter((n) => {
    const matchesTag =
      !tag || n.tags.some((t) => t.toLowerCase() === tag.toLowerCase());
    const matchesQuery =
      !q ||
      n.titulo.toLowerCase().includes(q) ||
      n.bajada.toLowerCase().includes(q);
    return matchesTag && matchesQuery;
  });

  const clearFilters = () => {
    setTag(null);
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
        categories={tags}
        selected={tag}
        onSelect={setTag}
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
              href={`/socio/noticias/${n.slug}`}
              className="group block"
            >
              <Card
                interactive
                className="flex h-full flex-col overflow-hidden"
              >
                <CardCover src={n.portadaUrl} alt={n.titulo} />
                <div className="mb-2 flex items-center justify-between gap-2">
                  {n.tags[0] ? (
                    <Badge tone="accent">{n.tags[0]}</Badge>
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
