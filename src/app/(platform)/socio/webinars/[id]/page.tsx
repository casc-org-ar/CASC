import { ArrowLeft, FileDown } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ButtonAnchor } from "@/components/ui/button";
import { getDataLayer } from "@/lib/data";
import { signedUrl } from "@/lib/data/supabase/storage";
import { clerkEnabled } from "@/lib/auth/flag";
import { toEmbedUrl } from "@/lib/utils/video-embed";
import { formatDate } from "@/lib/utils";
import type { ArchivoAdjunto } from "@/lib/types/domain";

/** How long a material link stays valid — enough to download it comfortably. */
const MATERIAL_TTL_SECONDS = 60 * 60; // 1 hour

/**
 * Turn a stored attachment into something the browser can open. Uploaded PDFs
 * live in the PRIVATE `informes` bucket as an object path, which is not a URL
 * and 404s if rendered straight into an href, so those get a short-lived
 * signed URL. A pasted external link (starts with http) is already usable.
 */
async function resolveAdjunto(
  adjunto: ArchivoAdjunto,
): Promise<{ titulo: string; url: string } | null> {
  const stored = adjunto.url?.trim();
  if (!stored) return null;
  if (stored.startsWith("http")) {
    return { titulo: adjunto.titulo, url: stored };
  }
  // A stored path — only resolvable when Supabase is active.
  if (!clerkEnabled()) return { titulo: adjunto.titulo, url: stored };
  const url = await signedUrl("informes", stored, {
    ttlSeconds: MATERIAL_TTL_SECONDS,
  });
  return url ? { titulo: adjunto.titulo, url } : null;
}

/** Individual webinar page: embedded player + attached material (published only). */
export default async function WebinarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const webinar = await getDataLayer().webinars.getById(id);

  if (!webinar || webinar.status !== "publicado") notFound();

  // Resolve every attachment up front: signing happens on the server, so the
  // private bucket is never exposed to the client.
  const materiales = (
    await Promise.all((webinar.adjuntos ?? []).map(resolveAdjunto))
  ).filter((m): m is { titulo: string; url: string } => m !== null);

  return (
    <div>
      <Link
        href="/socio/webinars"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a webinars
      </Link>

      <div className="mb-4 flex items-center gap-3">
        <Badge tone="accent">{webinar.categoria}</Badge>
        <span className="text-sm text-ink-muted">
          {formatDate(webinar.fecha)}
        </span>
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">
        {webinar.titulo}
      </h1>

      <div className="mt-6 aspect-video w-full max-w-4xl overflow-hidden rounded-xl bg-black">
        <iframe
          src={toEmbedUrl(webinar.videoUrl)}
          title={webinar.titulo}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <p className="mt-6 text-base leading-relaxed text-ink">
        {webinar.descripcion}
      </p>

      {materiales.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-muted">
            Material del webinar
          </h2>
          <div className="flex flex-wrap gap-2">
            {materiales.map((material, idx) => (
              <ButtonAnchor
                key={idx}
                href={material.url}
                download
                variant="secondary"
              >
                <FileDown className="h-4 w-4 text-primary" />
                {material.titulo || "Descargar material"}
              </ButtonAnchor>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
