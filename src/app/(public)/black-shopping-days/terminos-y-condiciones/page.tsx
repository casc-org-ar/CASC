import type { Metadata } from "next";
import Link from "next/link";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PageHero } from "@/components/public/page-hero";

/**
 * Black Shopping Days 2026 — terms, conditions and privacy policy for the
 * campaign. Same pattern as the institutional terms page: the legal text lives
 * in content.html (CASC-owned, static) and is injected verbatim.
 */

export const metadata: Metadata = {
  title: "Términos y condiciones — Black Shopping Days",
  description:
    "Términos y condiciones de uso y participación, y política de privacidad del evento Black Shopping Days 2026.",
};

const contentHtml = readFileSync(
  join(process.cwd(), "src/app/(public)/black-shopping-days/terminos-y-condiciones/content.html"),
  "utf8",
);

export default function BlackShoppingDaysTermsPage() {
  return (
    <>
      <PageHero
        title="Términos y condiciones"
        subtitle="Black Shopping Days 2026 · 27, 28 y 29 de noviembre"
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/black-shopping-days"
          className="text-sm font-bold text-casc-navy-500 hover:underline"
        >
          ← Volver a Black Shopping Days
        </Link>
        <div
          className="legal-body mt-8 w-full space-y-4 text-ink-muted [&_a]:underline [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-ink [&_li]:mt-2 [&_strong]:text-ink [&_ul]:list-disc [&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </section>
    </>
  );
}
