import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PageHero } from "@/components/public/page-hero";

/**
 * Políticas de privacidad — migrated verbatim from politicas-de-privacidad.html.
 * Legal body preserved exactly as extracted (content.html) and injected rather
 * than re-typed. Content is CASC-owned and static — no injection risk.
 */

export const metadata: Metadata = {
  title: "Políticas de privacidad — CASC",
  description:
    "Políticas de privacidad de la Cámara Argentina de Shopping Centers.",
};

const contentHtml = readFileSync(
  join(process.cwd(), "src/app/(public)/politicas-de-privacidad/content.html"),
  "utf8",
);

export default function PoliticasDePrivacidadPage() {
  return (
    <>
      <PageHero title="Políticas de privacidad" />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div
          className="legal-body w-full space-y-4 text-ink-muted [&_h1]:mt-8 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-ink [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-ink [&_strong]:text-ink"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </section>
    </>
  );
}
