"use client";

import Image from "next/image";
import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Globe, Phone, Search, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import {
  asociadoRubros,
  type AsociadoCategory,
  type AsociadoRubro,
} from "@/lib/data/asociados";
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
  telefono?: string;
  web?: string;
  contacto?: string;
  region?: RegionSlug;
  regionLabel?: string;
  rubro?: AsociadoRubro;
}

export interface AsociadosDirectoryFilters {
  category: CategoryFilter;
  region: RegionSlug | "all";
  rubro: AsociadoRubro | "all";
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

const rubroOptions: Array<{ value: AsociadoRubro | "all"; label: string }> = [
  { value: "all", label: "Todos los rubros" },
  ...asociadoRubros.map((rubro) => ({ value: rubro, label: rubro })),
];

const sortOptions: Array<{ value: SortFilter; label: string }> = [
  { value: "az", label: "A a Z" },
  { value: "za", label: "Z a A" },
];

/** sessionStorage key for the last used directory filters. */
const FILTERS_STORAGE_KEY = "casc:asociados-filters";

const categoryValues = new Set(categoryOptions.map((o) => o.value));
const regionValues = new Set(regionOptions.map((o) => o.value));
const rubroValues = new Set<AsociadoRubro | "all">([
  "all",
  ...asociadoRubros,
]);

/** Whether the filters carry any non-default value (i.e. came from the URL). */
function hasExplicitFilters(filters: AsociadosDirectoryFilters): boolean {
  return (
    filters.category !== "all" ||
    filters.region !== "all" ||
    filters.rubro !== "all" ||
    filters.sort !== "az" ||
    filters.query.trim() !== ""
  );
}

/**
 * Resolve the starting filters: if the URL is unfiltered, fall back to the last
 * ones saved in sessionStorage. Returns the exact `initialFilters` object when
 * there is nothing to restore, so callers can compare by identity.
 */
function restoreFilters(
  initialFilters: AsociadosDirectoryFilters,
): AsociadosDirectoryFilters {
  if (typeof window === "undefined") return initialFilters;
  if (hasExplicitFilters(initialFilters)) return initialFilters;

  try {
    const raw = sessionStorage.getItem(FILTERS_STORAGE_KEY);
    if (!raw) return initialFilters;
    const saved = JSON.parse(raw) as Partial<AsociadosDirectoryFilters>;

    const category =
      saved.category && categoryValues.has(saved.category)
        ? saved.category
        : "all";
    const region =
      saved.region && regionValues.has(saved.region) ? saved.region : "all";
    const rubro =
      saved.rubro && rubroValues.has(saved.rubro) ? saved.rubro : "all";
    const sort = saved.sort === "za" ? "za" : "az";
    const query = typeof saved.query === "string" ? saved.query : "";

    const filters: AsociadosDirectoryFilters = {
      // Keep category/region/rubro coherent with each other.
      category:
        region !== "all"
          ? "shopping-centers"
          : rubro !== "all"
            ? "proveedores-de-servicios"
            : category,
      region,
      rubro,
      sort,
      query,
    };

    return hasExplicitFilters(filters) ? filters : initialFilters;
  } catch {
    return initialFilters;
  }
}

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

  if (filters.rubro !== "all") {
    params.set("rubro", filters.rubro);
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
              {asociado.name.charAt(0)}
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

          {/* Contact details, shown when the associate has them on file. */}
          {(asociado.contacto || asociado.telefono || asociado.web) && (
            <ul className="mt-3 space-y-1.5">
              {asociado.contacto && (
                <li className="flex items-start gap-2 text-sm leading-5 text-ink-muted">
                  <UserRound
                    className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  <span>{asociado.contacto}</span>
                </li>
              )}
              {asociado.telefono && (
                <li className="flex items-start gap-2 text-sm leading-5 text-ink-muted">
                  <Phone
                    className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  <span>{asociado.telefono}</span>
                </li>
              )}
              {asociado.web && (
                <li className="flex items-start gap-2 text-sm leading-5 text-ink-muted">
                  <Globe
                    className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  <span className="truncate">{asociado.web}</span>
                </li>
              )}
            </ul>
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

  // Restore the last used filters when the page is reopened without explicit
  // filters in the URL, so an accidental tab close doesn't lose the search.
  // Read in the state initializer (not an effect) to avoid a cascading render;
  // a URL that already carries filters wins (e.g. a shared link).
  const startingFilters = useState(() =>
    restoreFilters(initialFilters),
  )[0];
  const [draft, setDraft] = useState(startingFilters);
  const [applied, setApplied] = useState(startingFilters);

  // If filters were restored from storage, reflect them in the URL once.
  useEffect(() => {
    if (startingFilters !== initialFilters) {
      router.replace(buildDirectoryHref(startingFilters), { scroll: false });
    }
    // Run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist applied filters so they survive a reload or accidental close.
  useEffect(() => {
    try {
      sessionStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(applied));
    } catch {
      // Storage may be unavailable (private mode, quota) — non-fatal.
    }
  }, [applied]);

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

        if (applied.rubro !== "all" && item.rubro !== applied.rubro) {
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

  // Región is meaningful for Shopping Centers; Rubro for Proveedores. Retailers
  // get neither — they filter by name only.
  const showRegionFilter = draft.category === "shopping-centers";
  const showRubroFilter = draft.category === "proveedores-de-servicios";

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
      rubro: "all",
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
        <div className="grid gap-4 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end [&>label]:lg:min-w-44 [&>label]:lg:flex-1">
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

          <Select
            label="Tipo"
            value={draft.category}
            options={categoryOptions}
            onChange={(event) => {
              const category = event.target.value as CategoryFilter;
              setDraft((current) => ({
                ...current,
                category,
                // Drop filters that do not apply to the new category.
                region:
                  category === "shopping-centers" ? current.region : "all",
                rubro:
                  category === "proveedores-de-servicios"
                    ? current.rubro
                    : "all",
              }));
            }}
          />

          {/* Región applies to Shopping Centers only; Proveedores filter by Rubro instead. */}
          {showRegionFilter && (
            <Select
              label="Región"
              value={draft.region}
              options={regionOptions}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  region: event.target.value as RegionSlug | "all",
                }))
              }
            />
          )}

          {showRubroFilter && (
            <Select
              label="Rubro"
              value={draft.rubro}
              options={rubroOptions}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  rubro: event.target.value as AsociadoRubro | "all",
                }))
              }
            />
          )}

          <Select
            label="Orden"
            value={draft.sort}
            options={sortOptions}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                sort: event.target.value as SortFilter,
              }))
            }
          />

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
