import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PageHero } from "@/components/public/page-hero";
import { JoinCta } from "@/components/public/join-cta";
import { PrintButton } from "@/components/public/print-button";
import { EstatutoToc } from "@/components/public/estatuto-toc";
import { parseEstatuto } from "./parse-estatuto";

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

const rawHtml = readFileSync(
  join(process.cwd(), "src/app/(public)/estatuto/estatuto-content.html"),
  "utf8",
);

const { html: estatutoHtml, chapters } = parseEstatuto(rawHtml);

export default function EstatutoPage() {
  return (
    <>
      <div className="print:hidden">
        <PageHero title="Estatuto" />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[16rem_1fr] lg:gap-12">
          <EstatutoToc chapters={chapters} />

          <div className="min-w-0">
            {/*
              Scroll offset keeps an anchored chapter clear of the fixed header —
              and, on mobile, of the sticky index bar sitting under it.
            */}
            <article
              className="estatuto-body text-ink-muted [&_.estatuto-chapter]:scroll-mt-32 lg:[&_.estatuto-chapter]:scroll-mt-24"
              dangerouslySetInnerHTML={{ __html: estatutoHtml }}
            />

            {/* Print / save as PDF — offered once the document has been read. */}
            <div className="mt-12 border-t border-border pt-8 print:hidden">
              <PrintButton label="Imprimir / Guardar PDF" />
            </div>
          </div>
        </div>
      </section>

      <div className="print:hidden">
        <JoinCta />
      </div>
    </>
  );
}
