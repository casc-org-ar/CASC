import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PageHero } from "@/components/public/page-hero";

/**
 * Términos y condiciones — migrated verbatim from terminos-y-condiciones.html.
 * The legal body is preserved exactly as extracted (content.html) and injected
 * rather than re-typed. Content is CASC-owned and static — no injection risk.
 */

export const metadata: Metadata = {
  title: "Términos y condiciones — CASC",
  description:
    "Términos y condiciones de uso del sitio de la Cámara Argentina de Shopping Centers.",
};

const contentHtml = readFileSync(
  join(process.cwd(), "src/app/(public)/terminos-y-condiciones/content.html"),
  "utf8",
);

export default function TerminosYCondicionesPage() {
  return (
    <>
      <PageHero title="Términos y condiciones" />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div
          className="legal-body space-y-4 text-ink-muted [&_h1]:mt-8 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-ink [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-ink [&_strong]:text-ink"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </section>
    </>
  );
}
