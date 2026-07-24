import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

const DomeGallery = dynamic(
  () => import("@/components/public/dome-gallery"),
);
import {
  ContentCarousel,
  type ContentCarouselItem,
} from "@/components/public/content-carousel";
import { HeroCarousel } from "@/components/public/hero-carousel";
import { CardCover } from "@/components/shared/card-cover";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconFrame } from "@/components/ui/icon-frame";
import { EmptyState } from "@/components/shared/empty-state";
import { asociados } from "@/lib/data/asociados";
import {
  beneficios,
  capacitaciones,
  memberOf,
  sponsors,
} from "@/lib/data/home-content";
import { getDataLayer } from "@/lib/data";
import { onlyPublished } from "@/lib/data/published";
import { cn } from "@/lib/utils";

/**
 * Public home page — migrated from the original CASC index.html.
 *
 * Content parity: sections, texts and data mirror the original site verbatim
 * (see _legacy/casc-original). Noticias reads published BlogPosts from the
 * DataLayer (empty until the panel publishes). Capacitaciones use the real
 * activities migrated from the legacy site.
 */

const heroSlides = [
  {
    desktop: "/assets/banners/banner-2-1.webp",
    tablet: "/assets/banners/banner-2-2.webp",
    mobile: "/assets/banners/banner-2-3.webp",
    alt: "Propuesta de valor CASC",
    href: "/assets/banners/Propuesta_valor_CASC_23_12_25.pdf",
  },
  {
    desktop: "/assets/banners/banner-1-1.webp",
    tablet: "/assets/banners/banner-1-2.webp",
    mobile: "/assets/banners/banner-1-3.webp",
    alt: "Cámara Argentina de Shopping Centers",
  },
  {
    desktop: "/assets/banners/banner-3-1.webp",
    tablet: "/assets/banners/banner-3-2.webp",
    mobile: "/assets/banners/banner-3-3.webp",
    alt: "Cámara Argentina de Shopping Centers",
  },
];

const funciones = [
  "Representación institucional ante organismos públicos",
  "Estudios y estadísticas del sector",
  "Capacitaciones y comisiones de trabajo",
  "Networking y articulación entre centros comerciales",
  "Difusión de novedades, regulaciones y tendencias",
];

/** Sponsors shown alphabetically, independent of the source list order. */
const sortedSponsors = [...sponsors].sort((a, b) =>
  a.name.localeCompare(b.name, "es"),
);

/** Shopping Center logos for the sphere, linking to each associate's page. */
const shoppingLogos = asociados
  .filter((a) => a.category === "Shopping Centers" && a.logo)
  .map((a) => ({ name: a.name, logo: a.logo!, slug: a.slug }));

const homeActivityItems: ContentCarouselItem[] = capacitaciones.map(
  (item, index) => ({
    id: `home-actividad-${index + 1}`,
    title: item.titulo,
    description: item.descripcion,
    image: item.imagen,
    eyebrow: "Actividad",
    href: `/actividades#actividad-${index + 1}`,
  }),
);

function HomeSectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: ReactNode;
}) {
  const centered = align === "center";

  return (
    <div
      className={
        centered
          ? "mx-auto mb-10 max-w-3xl text-center"
          : "mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
      }
    >
      <div className={centered ? undefined : "max-w-3xl"}>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-base leading-7 text-ink-muted">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export default async function HomePage() {
  // Noticias section is fed by published blog posts from the panel.
  const noticias = onlyPublished(await getDataLayer().blog.list())
    .sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
    .slice(0, 3);

  return (
    <>
      {/* Hero */}
      <HeroCarousel slides={heroSlides} />

      {/* ¿Qué es la CASC? */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <HomeSectionHeader
          eyebrow="Institucional"
          title="Una red federal para fortalecer la industria"
          description="La CASC representa, conecta y acompaña a los centros comerciales del país, consolidando un espacio de diálogo entre operadores, desarrolladores, retailers, proveedores y organismos públicos."
          align="center"
        />

        <div className="space-y-10">
          {/* Video, con ancho contenido para no competir con el resto de la sección */}
          <div className="card-depth mx-auto aspect-video w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-white p-2">
            <iframe
              src="https://www.youtube-nocookie.com/embed/tVvNHVC9a44"
              title="Cámara Argentina de Shopping Centers"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full rounded-xl"
            />
          </div>

          {/* ¿Qué es la CASC? — texto suelto a la izquierda, funciones a la derecha */}
          <div className="grid items-start gap-8 pt-6 lg:grid-cols-2 lg:gap-12 lg:pt-10">
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                ¿Qué es la CASC?
              </h3>
              <p className="mt-4 text-lg leading-8 text-ink-muted">
                La Cámara Argentina de Shopping Centers es una entidad sin fines
                de lucro que desde hace más de 35 años representa, conecta y
                acompaña a los centros comerciales del país. Trabajamos para
                promover buenas prácticas, impulsar la profesionalización del
                sector y consolidar un espacio de diálogo entre operadores,
                desarrolladores, retailers, proveedores y organismos públicos.
              </p>
            </div>

            <ul className="space-y-3">
              {funciones.map((funcion) => (
                <li
                  key={funcion}
                  className="rounded-xl border border-border bg-surface/70 p-4"
                >
                  <span className="mb-3 block h-1 w-10 rounded-full bg-primary" />
                  <p className="text-sm font-semibold leading-6 text-ink">
                    {funcion}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Nuestros Shopping Centers Asociados */}
      <section className="border-y border-border bg-surface/70">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <HomeSectionHeader
            eyebrow="Representación"
            title="Nuestros Shopping Centers Asociados"
            description="La Cámara integra a los principales centros comerciales, shoppings y retailers, fortaleciendo la representación de una industria clave para el consumo y el empleo."
            action={
              <ButtonLink
                href="/asociados?categoria=shopping-centers#directorio"
                size="lg"
              >
                Ver listado por Regiones
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            }
          />

          {/* DomeGallery (React Bits) — logos de shopping centers en esfera 3D.
              Fondo suave detrás de la esfera para que se aprecie mejor su volumen. */}
          <div
            className="relative overflow-hidden rounded-2xl border border-border bg-linear-to-b from-casc-blue-300/25 via-surface to-white"
            style={{ height: 520 }}
          >
            <DomeGallery
              images={shoppingLogos.map((s) => ({
                src: s.logo,
                alt: s.name,
                href: `/asociados/${s.slug}`,
              }))}
              overlayBlurColor="#eef1f6"
              grayscale={false}
              fit={0.6}
              minRadius={400}
            />
          </div>
        </div>
      </section>

      {/* Beneficios para asociados */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <HomeSectionHeader
          eyebrow="Valor para asociados"
          title="Beneficios para asociados"
          description="Herramientas, espacios de intercambio e información para fortalecer la gestión y el desarrollo del sector."
          action={
            <ButtonLink href="/beneficios" size="lg">
              Conocer más
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          }
        />

        <div className="grid gap-5 sm:grid-cols-2 stagger-children">
          {beneficios.map(({ icon: Icon, titulo, descripcion }) => (
            <Card
              key={titulo}
              className="card-depth group h-full rounded-2xl p-6"
            >
              <IconFrame size="lg" className="mb-6">
                <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden />
              </IconFrame>
              <h3 className="text-lg font-bold tracking-tight text-ink">
                {titulo}
              </h3>
              <p className="mt-3 text-sm leading-6 text-ink-muted">
                {descripcion}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Noticias y tendencias del sector — fed by published blog posts */}
      <section className="border-y border-border bg-surface/70">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <HomeSectionHeader
            eyebrow="Actualidad"
            title="Noticias y tendencias del sector"
            description="Contenido actualizado sobre consumo, retail, centros comerciales, tecnologías aplicadas al sector, aperturas y eventos."
            action={
              <ButtonLink href="/noticias" size="lg">
                Ver todas las noticias
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            }
          />

          {noticias.length > 0 ? (
            <div className="stagger-children flex snap-x snap-mandatory gap-6 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
              {noticias.map((post) => (
                <Link
                  key={post.id}
                  href={`/noticias/${post.slug}`}
                  className="group block h-full min-w-full shrink-0 snap-start focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:min-w-0"
                >
                  <Card
                    interactive
                    className="card-depth flex h-full flex-col rounded-2xl"
                  >
                    <CardCover src={post.portadaUrl} alt={post.titulo} />
                    <h3 className="mb-2 text-base font-bold text-ink">
                      {post.titulo}
                    </h3>
                    <p className="line-clamp-2 text-sm leading-6 text-ink-muted">
                      {post.bajada}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-primary">
                      Ver noticia
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card-depth rounded-2xl border border-border bg-white p-4">
              <EmptyState message="Pronto vas a encontrar acá las últimas noticias del sector." />
            </div>
          )}
        </div>
      </section>

      {/* Capacitaciones y eventos — real activities migrated from the legacy site */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <ContentCarousel
          title="Capacitaciones y eventos"
          description="Actividades y capacitaciones que impulsan la actualización del sector y fomentan el intercambio entre quienes forman parte de los centros comerciales."
          items={homeActivityItems}
          align="center"
        />

        <div className="mt-8 text-center">
          <ButtonLink href="/actividades" size="lg">
            Ver todas las actividades
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </div>
      </section>

      {/* CTA plataforma — sobre fondo claro; el azul institucional pasó al pie. */}
      <section className="relative overflow-hidden border-y border-border bg-surface/70">
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Plataforma para asociados
            </p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-ink">
              Accedé a la plataforma exclusiva para asociados
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-muted">
              Los miembros de la CASC cuentan con un panel privado con acceso a
              documentación, estadísticas ampliadas, materiales de comisiones,
              informes técnicos y contenido profesional exclusivo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/login" size="lg">
                Ingresar
              </ButtonLink>
              <ButtonLink
                href="/como-asociarse"
                variant="secondary"
                size="lg"
              >
                Solicitar asociarse
              </ButtonLink>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md">
            {/* Soft glow behind the mockup for depth */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-8 rounded-full bg-accent/25 blur-3xl"
            />
            <div className="animate-float relative h-full w-full">
              <Image
                src="/assets/pages/inicio/mockups.png"
                alt="Plataforma exclusiva para asociados"
                fill
                sizes="(max-width: 1024px) 100vw, 448px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors + integrante de */}
      <section className="border-t border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <HomeSectionHeader
            eyebrow="Red institucional"
            title="Sponsors"
            align="center"
          />

          {/* Sponsors — logos sueltos en fila, sin card contenedora */}
          <div>
            <div className="mt-8 flex snap-x snap-mandatory items-center gap-1 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-nowrap sm:justify-center sm:gap-x-0 sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
              {sortedSponsors.map((sponsor) => {
                const logo = (
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    width={288}
                    height={144}
                    className="max-h-full w-auto object-contain"
                  />
                );

                return (
                  <div
                    key={sponsor.name}
                    className="flex h-32 w-64 shrink-0 snap-center items-center justify-center sm:h-36 sm:w-auto sm:flex-1"
                  >
                    {sponsor.url ? (
                      <a
                        href={sponsor.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Sitio web de ${sponsor.name}`}
                        className="flex h-full items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      >
                        {logo}
                      </a>
                    ) : (
                      logo
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Integrante de — cierre, logos grandes */}
          <div className="mt-16 border-t border-border pt-14">
            <h3 className="text-center text-sm font-semibold uppercase tracking-[0.16em] text-ink-muted">
              Integrante de
            </h3>
            {/* CACyS has heavy internal padding, so besides a larger box it gets
                an extra scale to actually read bigger than CLICC. */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-12 sm:gap-16">
              {memberOf.map((member) => {
                const larger = member.name.startsWith("Cámara Argentina de Comercio");
                return (
                  <div
                    key={member.name}
                    className={cn(
                      "flex items-center justify-center",
                      larger ? "h-56 w-56" : "h-40 w-40",
                    )}
                  >
                    <Image
                      src={member.logo}
                      alt={member.name}
                      width={224}
                      height={224}
                      className={cn(
                        "rounded-full object-contain",
                        larger ? "h-56 w-56 scale-110" : "h-40 w-40",
                      )}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
