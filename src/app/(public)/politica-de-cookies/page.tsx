import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PageHero } from "@/components/public/page-hero";

/**
 * Política de cookies — migrated verbatim from politica-de-cookies.html.
 * Legal body preserved exactly as extracted (content.html) and injected rather
 * than re-typed. Content is CASC-owned and static — no injection risk.
 */

export const metadata: Metadata = {
  title: "Política de cookies — CASC",
  description:
    "Política de cookies de la Cámara Argentina de Shopping Centers.",
};

const contentHtml = readFileSync(
  join(process.cwd(), "src/app/(public)/politica-de-cookies/content.html"),
  "utf8",
);

export default function PoliticaDeCookiesPage() {
  return (
    <>
      <PageHero title="Política de cookies" />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div
          className="legal-body w-full space-y-4 text-ink-muted [&_h1]:mt-8 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-ink [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-ink [&_strong]:text-ink"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </section>
    </>
  );
}
