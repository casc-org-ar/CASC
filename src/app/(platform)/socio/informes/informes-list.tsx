"use client";

import { FileText } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CardCover } from "@/components/shared/card-cover";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Informe } from "@/lib/types/domain";

/** Read-only informes list with a category filter and view/download links. */
export function InformesList({ informes }: { informes: Informe[] }) {
  const categorias = useMemo(
    () => ["Todas", ...Array.from(new Set(informes.map((i) => i.categoria)))],
    [informes],
  );
  const [filtro, setFiltro] = useState("Todas");

  const visibles =
    filtro === "Todas"
      ? informes
      : informes.filter((i) => i.categoria === filtro);

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setFiltro(cat)}
            className={cn(
              "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
              filtro === cat
                ? "border-primary bg-primary text-white"
                : "border-border bg-white text-ink hover:bg-surface",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visibles.map((i) => (
          <Link
            key={i.id}
            href={`/socio/informes/${i.id}`}
            className="block"
          >
            <Card className="flex h-full flex-col overflow-hidden transition-colors hover:border-accent">
              <CardCover src={i.portadaUrl} alt={i.titulo} />
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-wide text-primary">
                  {i.categoria}
                </span>
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
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
