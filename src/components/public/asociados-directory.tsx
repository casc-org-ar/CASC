"use client";

import Image from "next/image";
import Link from "next/link";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AsociadoCategory } from "@/lib/data/asociados";
import { cn } from "@/lib/utils";

export type RegionSlug =
  | "caba"
  | "gba"
  | "pampeana"
  | "cuyo"
  | "norte"
  | "patagonia";

type CategoryFilter =
  | "all"
  | "shopping-centers"
  | "retailers"
  | "proveedores-de-servicios";

type SortFilter = "az" | "za";

export interface AsociadoDirectoryItem {
  slug: string;
  name: string;
  category: AsociadoCategory;
  logo?: string;
  direccion?: string;
  region?: RegionSlug;
  regionLabel?: string;
}

export interface AsociadosDirectoryFilters {
  category: CategoryFilter;
  region: RegionSlug | "all";
  query: string;
  sort: SortFilter;
}

const categoryOptions: Array<{ value: CategoryFilter; label: string }> = [
  { value: "all", label: "Todos los asociados" },
  { value: "shopping-centers", label: "Shopping Centers" },
  { value: "retailers", label: "Retailers" },
  { value: "proveedores-de-servicios", label: "Proveedores de servicios" },
];

const regionOptions: Array<{ value: RegionSlug | "all"; label: string }> = [
  { value: "all", label: "Todas las regiones" },
  { value: "caba", label: "CABA" },
  { value: "gba", label: "GBA" },
  { value: "pampeana", label: "Pampeana" },
  { value: "cuyo", label: "Cuyo" },
  { value: "norte", label: "Norte" },
  { value: "patagonia", label: "Patagonia" },
];

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function categoryToFilter(category: AsociadoCategory): CategoryFilter {
  if (category === "Shopping Centers") return "shopping-centers";
  if (category === "Retailers") return "retailers";
  if (category === "Proveedores de servicios") return "proveedores-de-servicios";
  return "all";
}

function categoryLabel(value: CategoryFilter): string {
  return categoryOptions.find((option) => option.value === value)?.label ?? "";
}

function buildDirectoryHref(filters: AsociadosDirectoryFilters): string {
  const params = new URLSearchParams();

  if (filters.category !== "all") {
    params.set("categoria", filters.category);
  }

  if (filters.region !== "all") {
    params.set("region", filters.region);
  }

  if (filters.query.trim()) {
    params.set("q", filters.query.trim());
  }

  if (filters.sort !== "az") {
    params.set("orden", filters.sort);
  }

  const query = params.toString();
  return `/asociados${query ? `?${query}` : ""}#directorio`;
}

function AsociadoCard({ asociado }: { asociado: AsociadoDirectoryItem }) {
  const meta =
    asociado.category === "Shopping Centers" && asociado.regionLabel
      ? asociado.regionLabel
      : asociado.category;

  return (
    <Link
      href={`/asociados/${asociado.slug}`}
      className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <Card
        className={cn(
          "flex h-full flex-col overflow-hidden rounded-lg bg-white p-0 text-left shadow-none",
          "transition-all duration-200 ease-out group-hover:-translate-y-0.5 group-hover:border-accent/70",
        )}
      >
        <div className="relative aspect-square overflow-hidden border-b border-border bg-white">
          {asociado.logo ? (
            <Image
              src={asociado.logo}
              alt={asociado.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-contain p-4 transition-transform duration-200 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-accent">
              [{asociado.name.charAt(0)}]
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {meta}
          </p>
          <h3 className="mt-2 text-base font-bold leading-6 text-ink">
            {asociado.name}
          </h3>

          {asociado.direccion && (
            <p className="mt-2 text-sm leading-5 text-ink-muted">
              {asociado.direccion}
            </p>
          )}

          <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-primary">
            Ver ficha
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </Card>
    </Link>
  );
}

export function AsociadosDirectory({
  items,
  initialFilters,
}: {
  items: AsociadoDirectoryItem[];
  initialFilters: AsociadosDirectoryFilters;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState(initialFilters);
  const [applied, setApplied] = useState(initialFilters);

  const filteredItems = useMemo(() => {
    const normalizedQuery = normalizeText(applied.query.trim());

    return items
      .filter((item) => {
        if (
          applied.category !== "all" &&
          categoryToFilter(item.category) !== applied.category
        ) {
          return false;
        }

        if (applied.region !== "all" && item.region !== applied.region) {
          return false;
        }

        if (!normalizedQuery) {
          return true;
        }

        return normalizeText(`${item.name} ${item.direccion ?? ""}`).includes(
          normalizedQuery,
        );
      })
      .sort((a, b) =>
        applied.sort === "az"
          ? a.name.localeCompare(b.name, "es")
          : b.name.localeCompare(a.name, "es"),
      );
  }, [applied, items]);

  const activeTitle =
    applied.category === "all" ? "Asociados" : categoryLabel(applied.category);

  function applyFilters(nextFilters: AsociadosDirectoryFilters) {
    setApplied(nextFilters);
    setDraft(nextFilters);
    router.push(buildDirectoryHref(nextFilters), { scroll: false });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    applyFilters({
      ...draft,
      category:
        draft.region !== "all" && draft.category === "all"
          ? "shopping-centers"
          : draft.category,
    });
  }

  function onClearFilters() {
    applyFilters({
      category: applied.category,
      region: "all",
      query: "",
      sort: "az",
    });
  }

  return (
    <section id="directorio" className="scroll-mt-24">
      <div className="mb-8 border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Directorio de asociados
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {activeTitle}
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              {filteredItems.length} resultado
              {filteredItems.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="mb-8 rounded-xl border border-border bg-surface/60 p-5"
      >
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.6fr_auto] lg:items-end">
          <label className="block">
            <span className="text-sm font-semibold text-ink">Buscar</span>
            <input
              type="search"
              value={draft.query}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  query: event.target.value,
                }))
              }
              placeholder="Ingrese el nombre..."
              className="mt-2 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-accent/30"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-ink">Tipo</span>
            <select
              value={draft.category}
              onChange={(event) => {
                const category = event.target.value as CategoryFilter;
                setDraft((current) => ({
                  ...current,
                  category,
                  region:
                    category === "shopping-centers" ? current.region : "all",
                }));
              }}
              className="mt-2 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-accent/30"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-ink">Región</span>
            <select
              value={draft.region}
              disabled={draft.category !== "shopping-centers"}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  region: event.target.value as RegionSlug | "all",
                }))
              }
              className="mt-2 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-ink outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus:border-primary focus:ring-2 focus:ring-accent/30"
            >
              {regionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-ink">Orden</span>
            <select
              value={draft.sort}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  sort: event.target.value as SortFilter,
                }))
              }
              className="mt-2 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-accent/30"
            >
              <option value="az">A a Z</option>
              <option value="za">Z a A</option>
            </select>
          </label>

          <div className="flex gap-2">
            <Button type="submit" className="h-10">
              <Search className="h-4 w-4" aria-hidden="true" />
              Filtrar
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="h-10"
              onClick={onClearFilters}
            >
              Limpiar filtros
            </Button>
          </div>
        </div>
      </form>

      {filteredItems.length > 0 ? (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger-children">
          {filteredItems.map((item) => (
            <li key={item.slug}>
              <AsociadoCard asociado={item} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border border-border bg-bg p-8 text-center">
          <p className="font-semibold text-ink">No encontramos resultados.</p>
          <p className="mt-2 text-sm text-ink-muted">
            Probá ajustar la búsqueda o limpiar los filtros.
          </p>
        </div>
      )}
    </section>
  );
}
