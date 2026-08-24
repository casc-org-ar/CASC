import { ArrowRight, FileText, Newspaper, Video } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { CardCover } from "@/components/shared/card-cover";
import { SafeImage } from "@/components/shared/safe-image";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getAuth } from "@/lib/auth";
import { getDataLayer } from "@/lib/data";
import { byVisibilidad, onlyPublished } from "@/lib/data/published";
import { cn } from "@/lib/utils";

export const metadata = { title: "Inicio" };

/** A normalized item from any content type, for the home feed. */
type FeedItem = {
  tipo: "Noticia" | "Webinar" | "Informe";
  icon: LucideIcon;
  titulo: string;
  descripcion: string;
  fecha: string;
  imagen?: string;
  href: string;
  /**
   * Marked as a highlight by an admin. Only articles carry the flag today;
   * webinars and informes have no such column, so they are never highlighted.
   */
  destacado: boolean;
};

/**
 * Newest-first, ties broken on `href` (unique per item, since it embeds the
 * slug or id). Without the tie-breaker items sharing a `fecha` kept whatever
 * order the database returned, which is not guaranteed for equal sort keys —
 * so the feed could reshuffle between requests, and `all[0]` would promote a
 * different "Destacado" each time. This mirrors `byFechaDesc` in
 * lib/data/published, which the single-type listings use; the feed needs its
 * own because it merges three entities into a shape with no `id`.
 */
const byDateDesc = (a: FeedItem, b: FeedItem) =>
  b.fecha.localeCompare(a.fecha) || b.href.localeCompare(a.href);

/** Socio home: personalized greeting, a featured highlight, then latest-by-section. */
export default async function SocioHomePage() {
  const data = getDataLayer();
  const [user, webinars, informes, noticias] = await Promise.all([
    getAuth().getCurrentUser(),
    data.webinars.list(),
    data.informes.list(),
    data.blog.list(),
  ]);

  const noticiasFeed: FeedItem[] = byVisibilidad(
    onlyPublished(noticias),
    "socios",
  ).map((n) => ({
    tipo: "Noticia",
    icon: Newspaper,
    titulo: n.titulo,
    descripcion: n.bajada,
    fecha: n.fecha,
    imagen: n.portadaUrl,
    href: `/socio/noticias/${n.slug}`,
    destacado: n.destacado,
  }));
  const webinarsFeed: FeedItem[] = onlyPublished(webinars).map((w) => ({
    tipo: "Webinar",
    icon: Video,
    titulo: w.titulo,
    descripcion: w.descripcion,
    fecha: w.fecha,
    imagen: w.portadaUrl,
    href: `/socio/webinars/${w.id}`,
    destacado: false,
  }));
  const informesFeed: FeedItem[] = onlyPublished(informes).map((i) => ({
    tipo: "Informe",
    icon: FileText,
    titulo: i.titulo,
    descripcion: i.descripcion,
    fecha: i.fecha,
    imagen: i.portadaUrl,
    href: `/socio/informes/${i.id}`,
    destacado: false,
  }));

  const all = [...noticiasFeed, ...webinarsFeed, ...informesFeed].sort(
    byDateDesc,
  );

  // Highlights are chosen by an admin (the `destacado` flag), not inferred from
  // the date — the panel used to promote whatever was newest, so nobody could
  // pick, and only one ever fit. Several can be marked at once.
  //
  // With nothing marked, fall back to the newest item so the panel is never
  // left without a highlight (its long-standing behaviour).
  const marcados = all.filter((i) => i.destacado);
  const featured = marcados.length > 0 ? marcados : all.slice(0, 1);
  // Exclude highlighted items from the sections below so they never show twice.
  const featuredHrefs = new Set(featured.map((i) => i.href));

  const secciones = [
    {
      titulo: "Últimas noticias",
      verTodos: "Ver todas las noticias",
      href: "/socio/noticias",
      items: noticiasFeed.filter((i) => !featuredHrefs.has(i.href)).slice(0, 3),
    },
    {
      titulo: "Últimos webinars",
      verTodos: "Ver todos los webinars",
      href: "/socio/webinars",
      items: webinarsFeed.filter((i) => !featuredHrefs.has(i.href)).slice(0, 3),
    },
    {
      titulo: "Últimos informes",
      verTodos: "Ver todos los informes",
      href: "/socio/informes",
      items: informesFeed.filter((i) => !featuredHrefs.has(i.href)).slice(0, 3),
    },
  ].filter((s) => s.items.length > 0);

  const firstName = user?.nombre.split(" ")[0] ?? "";

  return (
    <div className="space-y-10">
      {/* Personalized greeting */}
      <header className="animate-fade-in-up">
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          Hola{firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {user?.shopping
            ? `${user.shopping} · Novedades de la Cámara`
            : "Novedades de la Cámara"}
        </p>
      </header>

      {/* Featured highlights. The layout follows the count instead of being
          fixed: the team can mark as many articles as they want, and stacking
          full-size cards would push the rest of the panel below several screens
          of scrolling — on a phone each card is already most of the viewport.

          One highlight keeps the large card it always had. Two or more switch
          to a compact grid, which fits any number without the page growing
          unbounded. A carousel was the other option, but it hides items behind
          arrows and its horizontal swipe fights the page scroll on mobile. */}
      {featured.length > 0 && (
        <div className="animate-fade-in-up">
          {featured.length === 1 ? (
            <FeaturedCard item={featured[0]} />
          ) : (
            <>
              <h2 className="mb-4 text-lg font-bold tracking-tight text-ink">
                Destacados
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((item) => (
                  <FeedCard key={item.href} item={item} highlighted />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Latest by section */}
      {secciones.map((seccion) => (
        <section
          key={seccion.href}
          className="border-t border-border pt-8"
        >
          <h2 className="mb-4 text-lg font-bold tracking-tight text-ink">
            {seccion.titulo}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {seccion.items.map((item) => (
              <FeedCard key={item.href} item={item} />
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <ButtonLink
              href={seccion.href}
              variant="secondary"
            >
              {seccion.verTodos}
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </section>
      ))}
    </div>
  );
}

/**
 * Featured card: one highlight the team marked from the admin panel (or the
 * newest novelty when nothing is marked). Contained layout — a capped-height
 * cover on top and the text below — instead of a full-width banner with the
 * image on the side, which read as too heavy. The "Destacado" tag makes the
 * highlight explicit.
 */
function FeaturedCard({ item }: { item: FeedItem }) {
  const Icon = item.icon;
  const showCover = item.tipo !== "Informe";
  // Gender agreement: "Noticia" is feminine → "destacada"; Webinar/Informe
  // are masculine → "destacado".
  const tag =
    item.tipo === "Noticia"
      ? "Noticia destacada"
      : `${item.tipo} destacado`;
  return (
    <Link href={item.href} className="group block">
      <Card
        interactive
        className="flex max-w-2xl flex-col overflow-hidden p-0"
      >
        {showCover && item.imagen ? (
          <div className="relative h-48 overflow-hidden bg-surface sm:h-56">
            <SafeImage
              src={item.imagen}
              alt={item.titulo}
              className="transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-casc-navy-900">
              <Icon className="h-3.5 w-3.5" />
              {tag}
            </span>
          </div>
        ) : (
          <div className="relative flex h-48 items-center justify-center bg-casc-navy-900 sm:h-56">
            <Icon className="h-12 w-12 text-accent" />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-casc-navy-900">
              {tag}
            </span>
          </div>
        )}
        <div className="flex flex-col p-6">
          <h2 className="text-xl font-bold tracking-tight text-ink">
            {item.titulo}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm text-ink-muted">
            {item.descripcion}
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
            Ver más
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Card>
    </Link>
  );
}

/** Standard feed card used inside each section. */
/**
 * Feed card. `highlighted` is used when the card stands in for a featured item
 * in the compact grid: an accent border marks it as promoted, since at that
 * size it would otherwise be indistinguishable from the regular listings below.
 */
function FeedCard({
  item,
  highlighted = false,
}: {
  item: FeedItem;
  highlighted?: boolean;
}) {
  const Icon = item.icon;
  const showCover = item.tipo !== "Informe";
  return (
    <Link href={item.href} className="group block">
      <Card
        interactive
        className={cn(
          "flex h-full flex-col overflow-hidden",
          highlighted && "border-accent",
        )}
      >
        {showCover && <CardCover src={item.imagen} alt={item.titulo} />}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Icon className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              {item.tipo}
            </span>
          </div>
          <Badge tone="muted">
            {new Date(item.fecha).toLocaleDateString("es-AR")}
          </Badge>
        </div>
        <CardTitle>{item.titulo}</CardTitle>
        <CardDescription className="mt-2 line-clamp-3">
          {item.descripcion}
        </CardDescription>
      </Card>
    </Link>
  );
}
