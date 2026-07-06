import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PageHero } from "@/components/public/page-hero";
import { JoinCta } from "@/components/public/join-cta";

/**
 * Estatuto — migrated verbatim from estatuto.html.
 *
 * The statute is a long, static legal document. Its body is preserved exactly
 * as extracted (see estatuto-content.html) and injected here rather than
 * re-typed, to guarantee fidelity of the legal text. Content is CASC-owned and
 * static, so dangerouslySetInnerHTML carries no injection risk.
 */

export const metadata: Metadata = {
  title: "Estatuto — CASC",
  description:
    "Estatuto de la Cámara Argentina de Shopping Centers.",
};

const estatutoHtml = readFileSync(
  join(process.cwd(), "src/app/(public)/estatuto/estatuto-content.html"),
  "utf8",
);

export default function EstatutoPage() {
  return (
    <>
      <PageHero title="Estatuto" />

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div
          className="estatuto-body space-y-4 text-ink-muted [&_b]:text-ink [&_br]:block"
          dangerouslySetInnerHTML={{ __html: estatutoHtml }}
        />
      </section>

      <JoinCta />
    </>
  );
}
