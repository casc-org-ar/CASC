import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, UserRound } from "lucide-react";
import { JoinCta } from "@/components/public/join-cta";
import { ShareButtons } from "@/components/public/share-buttons";
import { getDataLayer } from "@/lib/data";
import { onlyPublished } from "@/lib/data/published";
import type { BlogPost } from "@/lib/types/domain";

/**
 * Public article page. Each published post gets its own URL so it can be
 * shared and indexed — the panel already stores a slug for exactly this.
 * Drafts are never reachable: only published posts are looked up.
 */

async function getPost(slug: string): Promise<BlogPost | null> {
  const posts = onlyPublished(await getDataLayer().blog.list());
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function generateStaticParams() {
  const posts = onlyPublished(await getDataLayer().blog.list());
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Noticia — CASC" };

  return {
    title: `${post.titulo} — CASC`,
    description: post.bajada,
    openGraph: {
      title: post.titulo,
      description: post.bajada,
      type: "article",
      publishedTime: post.fecha,
      images: post.portadaUrl ? [{ url: post.portadaUrl }] : undefined,
    },
  };
}

export default async function NoticiaPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { slug } = await params;
  const { from } = await searchParams;
  const post = await getPost(slug);
  if (!post) notFound();

  // Send the reader back where they came from: cards in /actividades pass
  // `?from=actividades`; everything else returns to the news listing.
  const volver =
    from === "actividades"
      ? { href: "/actividades", label: "Volver a actividades" }
      : { href: "/noticias", label: "Volver a noticias" };

  const fecha = new Date(post.fecha).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Link
          href={volver.href}
          className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {volver.label}
        </Link>

        <header>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
            {post.titulo}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-muted">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-accent" aria-hidden />
              {fecha}
            </span>
            {post.autor && (
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="h-4 w-4 text-accent" aria-hidden />
                {post.autor}
              </span>
            )}
          </div>

          {post.bajada && (
            <p className="mt-6 text-lg leading-8 text-ink-muted">
              {post.bajada}
            </p>
          )}
        </header>

        {post.portadaUrl && (
          <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl border border-border bg-surface">
            <Image
              src={post.portadaUrl}
              alt={post.titulo}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Body: plain text for now; paragraphs split on blank lines. */}
        <div className="mt-8 space-y-5">
          {post.cuerpo
            .split(/\n\s*\n/)
            .filter(Boolean)
            .map((parrafo, i) => (
              <p key={i} className="text-base leading-8 text-ink">
                {parrafo}
              </p>
            ))}
        </div>

        {/* Gallery images, when the article carries them. */}
        {post.imagenes && post.imagenes.length > 0 && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {post.imagenes.map((src) => (
              <div
                key={src}
                className="relative aspect-4/3 overflow-hidden rounded-xl border border-border bg-surface"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {post.tags.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-ink-muted"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 border-t border-border pt-6">
          <ShareButtons title={post.titulo} url={`/noticias/${post.slug}`} />
        </div>
      </article>

      <JoinCta />
    </>
  );
}
