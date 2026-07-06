"use client";

import { FileText } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {visibles.map((i) => (
          <Link
            key={i.id}
            href={`/socio/informes/${i.id}`}
            className="block"
          >
            <Card className="flex h-full items-start gap-4 transition-colors hover:border-accent">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-casc-navy-700">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium uppercase tracking-wide text-primary">
                    {i.categoria}
                  </span>
                  <span className="text-xs text-ink-muted">
                    {new Date(i.fecha).toLocaleDateString("es-AR")}
                  </span>
                </div>
                <CardTitle>{i.titulo}</CardTitle>
                <CardDescription className="mt-1">
                  {i.descripcion}
                </CardDescription>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
