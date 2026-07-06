import Link from "next/link";
import { HeroCarousel } from "@/components/public/hero-carousel";

/**
 * Public home page — migrated from the original CASC index.html.
 *
 * Content parity phase (Etapa 1): sections, texts and structure mirror the
 * original. Blog-driven sections (news, trainings) are placeholders wired in
 * Etapa 3 from the internal panel — no fabricated content added here.
 */

const heroSlides = [
  { src: "/assets/banners/banner-1.webp", alt: "Cámara Argentina de Shopping Centers" },
  { src: "/assets/banners/banner-2.webp", alt: "Cámara Argentina de Shopping Centers" },
  { src: "/assets/banners/banner-3.webp", alt: "Cámara Argentina de Shopping Centers" },
];

const funciones = [
  "Representación institucional ante organismos públicos",
  "Estudios y estadísticas del sector",
  "Capacitaciones y comisiones de trabajo",
  "Networking y articulación entre centros comerciales",
  "Difusión de novedades, regulaciones y tendencias",
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <HeroCarousel slides={heroSlides} />

      {/* ¿Qué es la CASC? */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 xl:gap-16">
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <iframe
              src="https://player.vimeo.com/video/1150099121"
              title="Cámara Argentina de Shopping Centers"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
          <div>
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-ink">
              ¿Qué es la CASC?
            </h2>
            <p className="text-lg font-light text-ink-muted">
              La Cámara Argentina de Shopping Centers es una entidad sin fines
              de lucro que desde hace más de 35 años representa, conecta y
              acompaña a los centros comerciales del país. Trabajamos para
              promover buenas prácticas, impulsar la profesionalización del
              sector y consolidar un espacio de diálogo entre operadores,
              desarrolladores, retailers, proveedores y organismos públicos.
            </p>

            <div className="mt-8 border-t border-border pt-6">
              <h3 className="mb-3 text-2xl font-bold text-ink">
                Nuestras principales funciones
              </h3>
              <ul className="list-outside list-disc space-y-1 pl-5 text-ink-muted">
                {funciones.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestros Shopping Centers Asociados */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mb-8 text-4xl font-extrabold tracking-tight text-ink">
            Nuestros Shopping Centers Asociados
          </h2>
          <Link
            href="/asociados"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            Ver todos los asociados
          </Link>
        </div>
      </section>

      {/* Noticias y tendencias del sector — Etapa 3 (blog desde el panel) */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-4xl font-extrabold tracking-tight text-ink">
          Noticias y tendencias del sector
        </h2>
        {/* TODO Etapa 3: grilla de noticias alimentada desde el panel interno. */}
      </section>

      {/* Capacitaciones y eventos — Etapa 3 (blog desde el panel) */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-4xl font-extrabold tracking-tight text-ink">
            Capacitaciones y eventos
          </h2>
          {/* TODO Etapa 3: grilla de actividades alimentada desde el panel interno. */}
        </div>
      </section>

      {/* CTA plataforma */}
      <section className="bg-casc-navy-900">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto mb-6 max-w-2xl text-4xl font-extrabold tracking-tight text-white">
            Accedé a la plataforma exclusiva para asociados
          </h2>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            Ingresar
          </Link>
        </div>
      </section>
    </>
  );
}
