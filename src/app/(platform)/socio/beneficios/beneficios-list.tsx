"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  BadgePercent,
  Globe,
  MapPin,
  Phone,
  Sparkles,
  Star,
} from "lucide-react";
import {
  CategoryFilter,
  deriveCategories,
} from "@/components/shared/category-filter";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Hotel } from "@/lib/types/domain";

/** Full URL for a hotel website, tolerating values stored without a scheme. */
function webHref(web: string): string {
  return web.startsWith("http") ? web : `https://${web}`;
}

function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="flex items-start gap-4 border-b border-border pb-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-white">
          {hotel.logoUrl ? (
            <Image
              src={hotel.logoUrl}
              alt={hotel.nombre}
              fill
              sizes="64px"
              className="object-contain p-1.5"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-accent">
              {hotel.nombre.charAt(0)}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold leading-tight text-ink">
            {hotel.nombre}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
            {hotel.estrellas && (
              <span className="inline-flex items-center gap-1">
                <Star
                  className="h-3.5 w-3.5 fill-accent text-accent"
                  aria-hidden="true"
                />
                {hotel.estrellas} estrellas
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              {hotel.ciudad}
            </span>
          </div>
        </div>
      </div>

      {/* Discount headline. */}
      <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          <BadgePercent className="h-3.5 w-3.5" aria-hidden="true" />
          Descuento
        </p>
        <p className="mt-1 text-sm leading-6 text-ink">{hotel.descuento}</p>
      </div>

      {hotel.beneficios && hotel.beneficios.length > 0 && (
        <div className="mt-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
            <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            Beneficios adicionales
          </p>
          <ul className="mt-2 space-y-1.5">
            {hotel.beneficios.map((beneficio) => (
              <li
                key={beneficio}
                className="flex gap-2 text-sm leading-5 text-ink-muted"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  aria-hidden="true"
                />
                {beneficio}
              </li>
            ))}
          </ul>
        </div>
      )}

      <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
        {hotel.direccion && (
          <div className="flex gap-2 text-ink-muted">
            <MapPin
              className="mt-0.5 h-4 w-4 shrink-0 text-accent"
              aria-hidden="true"
            />
            <span>{hotel.direccion}</span>
          </div>
        )}
        {hotel.telefono && (
          <div className="flex gap-2 text-ink-muted">
            <Phone
              className="mt-0.5 h-4 w-4 shrink-0 text-accent"
              aria-hidden="true"
            />
            <span>{hotel.telefono}</span>
          </div>
        )}
        {hotel.web && (
          <div className="flex gap-2 text-ink-muted">
            <Globe
              className="mt-0.5 h-4 w-4 shrink-0 text-accent"
              aria-hidden="true"
            />
            <a
              href={webHref(hotel.web)}
              target="_blank"
              rel="noreferrer"
              className="truncate text-primary hover:underline"
            >
              {hotel.web}
            </a>
          </div>
        )}
      </dl>

      {hotel.reservas && (
        <div className="mt-4 rounded-lg border border-border bg-surface p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
            Reservas
          </p>
          <p className="mt-1 text-sm leading-6 text-ink">{hotel.reservas}</p>
        </div>
      )}

      {hotel.nota && (
        <p className="mt-auto pt-4 text-xs italic leading-5 text-ink-muted">
          {hotel.nota}
        </p>
      )}
    </Card>
  );
}

/** Read-only hotels grid with text search + city filter. */
export function BeneficiosList({ hoteles }: { hoteles: Hotel[] }) {
  const [city, setCity] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  // City powers the filter chips; reuse the shared category helper by mapping
  // each hotel's city onto the `categoria` field it expects.
  const cities = useMemo(
    () => deriveCategories(hoteles.map((h) => ({ categoria: h.ciudad }))),
    [hoteles],
  );

  const q = query.trim().toLowerCase();
  const visible = hoteles.filter((h) => {
    const matchesCity =
      !city || h.ciudad.toLowerCase() === city.toLowerCase();
    const matchesQuery =
      !q ||
      h.nombre.toLowerCase().includes(q) ||
      h.ciudad.toLowerCase().includes(q) ||
      (h.direccion?.toLowerCase().includes(q) ?? false);
    return matchesCity && matchesQuery;
  });

  const clearFilters = () => {
    setCity(null);
    setQuery("");
  };

  if (hoteles.length === 0) {
    return (
      <EmptyState message="No hay beneficios publicados por el momento." />
    );
  }

  return (
    <>
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Buscar hoteles…"
        className="mb-4"
      />
      <CategoryFilter categories={cities} selected={city} onSelect={setCity} />
      {visible.length === 0 ? (
        <EmptyState message="No encontramos hoteles con esos criterios.">
          <Button variant="secondary" onClick={clearFilters}>
            Ver todos
          </Button>
        </EmptyState>
      ) : (
        <div className="stagger-children grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}
    </>
  );
}
