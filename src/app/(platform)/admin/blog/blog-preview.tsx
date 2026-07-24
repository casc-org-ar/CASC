"use client";

import {
  ArrowLeft,
  LayoutGrid,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

/** Minimal shape the preview needs from the blog form's live fields. */
export interface BlogDraft {
  titulo: string;
  bajada: string;
  cuerpo: string;
  autor: string;
  fecha: string;
}

/**
 * Preview of a blog post as it will appear, toggling between the listing CARD
 * and the full ARTICLE. Renders from the form's live draft — nothing is saved.
 */
export function BlogPreview({
  draft,
  portadaUrl,
  imagenes,
  onBack,
}: {
  draft: BlogDraft;
  portadaUrl?: string;
  imagenes: string[];
  onBack: () => void;
}) {
  const [mode, setMode] = useState<"card" | "articulo">("articulo");

  const fecha = draft.fecha
    ? new Date(`${draft.fecha}T00:00:00`).toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Button type="button" variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Volver a editar
        </Button>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={mode === "card" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setMode("card")}
          >
            <LayoutGrid className="h-4 w-4" />
            Card
          </Button>
          <Button
            type="button"
            variant={mode === "articulo" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setMode("articulo")}
          >
            <FileText className="h-4 w-4" />
            Artículo
          </Button>
        </div>
      </div>

      {mode === "card" ? (
        <div className="mx-auto max-w-sm">
          <Card className="flex h-full flex-col overflow-hidden">
            <div className="relative -mx-5 -mt-5 mb-4 h-40 overflow-hidden rounded-t-xl bg-surface">
              {portadaUrl ? (
                // Preview uses arbitrary user URLs (uploads/links), so a plain
                // img avoids next/image's remote-domain allowlist requirement.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={portadaUrl}
                  alt={draft.titulo || "Portada"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-casc-navy-900">
                  <ImageIcon className="h-10 w-10 text-accent" aria-hidden />
                </div>
              )}
            </div>
            <div className="mb-2 text-xs text-ink-muted">{fecha}</div>
            <CardTitle className="text-lg">
              {draft.titulo || "Título del artículo"}
            </CardTitle>
            <CardDescription className="mt-1 flex-1">
              {draft.bajada || "Bajada del artículo…"}
            </CardDescription>
          </Card>
        </div>
      ) : (
        <article className="mx-auto max-w-2xl">
          {portadaUrl && (
            <div className="mb-6 h-56 overflow-hidden rounded-xl bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={portadaUrl}
                alt={draft.titulo || "Portada"}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <p className="text-xs text-ink-muted">
            {[draft.autor, fecha].filter(Boolean).join(" · ")}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink">
            {draft.titulo || "Título del artículo"}
          </h1>
          {draft.bajada && (
            <p className="mt-2 text-lg font-medium text-ink-muted">
              {draft.bajada}
            </p>
          )}
          <div className="mt-6 whitespace-pre-line leading-relaxed text-ink">
            {draft.cuerpo || "El contenido del artículo aparecerá acá."}
          </div>

          {imagenes.length > 0 && (
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {imagenes.map((img, idx) => (
                <div
                  key={`${img}-${idx}`}
                  className="h-48 overflow-hidden rounded-lg bg-surface"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`Imagen ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </article>
      )}
    </div>
  );
}
