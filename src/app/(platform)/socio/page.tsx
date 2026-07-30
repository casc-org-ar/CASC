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
import { onlyPublished } from "@/lib/data/published";

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
};

const byDateDesc = (a: FeedItem, b: FeedItem) => b.fecha.localeCompare(a.fecha);

/** Socio home: personalized greeting, a featured highlight, then latest-by-section. */
export default async function SocioHomePage() {
  const data = getDataLayer();
  const [user, webinars, informes, noticias] = await Promise.all([
    getAuth().getCurrentUser(),
    data.webinars.list(),
    data.informes.list(),
    data.noticias.list(),
  ]);

  const noticiasFeed: FeedItem[] = onlyPublished(noticias).map((n) => ({
    tipo: "Noticia",
    icon: Newspaper,
    titulo: n.titulo,
    descripcion: n.bajada,
    fecha: n.fecha,
    imagen: n.imagenUrl,
    href: `/socio/noticias/${n.id}`,
  }));
  const webinarsFeed: FeedItem[] = onlyPublished(webinars).map((w) => ({
    tipo: "Webinar",
    icon: Video,
    titulo: w.titulo,
    descripcion: w.descripcion,
    fecha: w.fecha,
    imagen: w.portadaUrl,
    href: `/socio/webinars/${w.id}`,
  }));
  const informesFeed: FeedItem[] = onlyPublished(informes).map((i) => ({
    tipo: "Informe",
    icon: FileText,
    titulo: i.titulo,
    descripcion: i.descripcion,
    fecha: i.fecha,
    imagen: i.portadaUrl,
    href: `/socio/informes/${i.id}`,
  }));

  const all = [...noticiasFeed, ...webinarsFeed, ...informesFeed].sort(
    byDateDesc,
  );

  // The most recent item is the featured highlight. Exclude it from its section
  // below so it never shows up twice.
  const featured = all[0];

  const secciones = [
    {
      titulo: "Últimas noticias",
      verTodos: "Ver todas las noticias",
      href: "/socio/noticias",
      items: noticiasFeed.filter((i) => i.href !== featured?.href).slice(0, 3),
    },
    {
      titulo: "Últimos webinars",
      verTodos: "Ver todos los webinars",
      href: "/socio/webinars",
      items: webinarsFeed.filter((i) => i.href !== featured?.href).slice(0, 3),
    },
    {
      titulo: "Últimos informes",
      verTodos: "Ver todos los informes",
      href: "/socio/informes",
      items: informesFeed.filter((i) => i.href !== featured?.href).slice(0, 3),
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

      {/* Featured highlight */}
      {featured && (
        <div className="animate-fade-in-up">
          <FeaturedCard item={featured} />
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
 * Featured card: the single most recent novelty (across noticias/webinars/
 * informes, by date). Contained layout — a capped-height cover on top and the
 * text below — instead of a full-width banner with the image on the side, which
 * read as too heavy. The "Destacado" tag makes the highlight explicit.
 */
function FeaturedCard({ item }: { item: FeedItem }) {
  const Icon = item.icon;
  const showCover = item.tipo !== "Informe";
  return (
    <Link href={item.href} className="group block">
      <Card
        interactive
        className="mx-auto flex max-w-2xl flex-col overflow-hidden p-0"
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
              {item.tipo} destacada
            </span>
          </div>
        ) : (
          <div className="relative flex h-48 items-center justify-center bg-casc-navy-900 sm:h-56">
            <Icon className="h-12 w-12 text-accent" />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-casc-navy-900">
              {item.tipo} destacado
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
function FeedCard({ item }: { item: FeedItem }) {
  const Icon = item.icon;
  const showCover = item.tipo !== "Informe";
  return (
    <Link href={item.href} className="group block">
      <Card
        interactive
        className="flex h-full flex-col overflow-hidden"
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
