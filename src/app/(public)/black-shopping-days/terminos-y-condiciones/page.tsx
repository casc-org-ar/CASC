import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { bsdBody, bsdDisplay } from "../fonts";
import { TermsNav, type TermsNavGroup } from "./terms-nav";
import styles from "./terms.module.css";

/**
 * Black Shopping Days 2026 — terms, conditions and privacy policy for the
 * campaign. The legal text lives in content.html (CASC-owned, static) and is
 * injected verbatim; the section index is built from its heading ids.
 */

export const metadata: Metadata = {
  title: "Términos y condiciones — Black Shopping Days",
  description:
    "Términos y condiciones de uso y participación, y política de privacidad del evento Black Shopping Days 2026.",
};

const contentHtml = readFileSync(
  join(
    process.cwd(),
    "src/app/(public)/black-shopping-days/terminos-y-condiciones/content.html",
  ),
  "utf8",
);

/** Short labels for the two documents; their full titles are too long for the index. */
const GROUP_LABELS: Record<string, string> = {
  terminos: "Términos y condiciones",
  "politica-de-privacidad": "Política de privacidad",
};

function buildIndex(html: string): TermsNavGroup[] {
  const groups: TermsNavGroup[] = [];
  const headings = html.matchAll(/<h([23]) id="([^"]+)">(.*?)<\/h\1>/g);
  for (const [, level, id, label] of headings) {
    if (level === "2") {
      groups.push({ id, label: GROUP_LABELS[id] ?? label, items: [] });
    } else {
      groups.at(-1)?.items.push({ id, label });
    }
  }
  return groups;
}

const navGroups = buildIndex(contentHtml);

export default function BlackShoppingDaysTermsPage() {
  return (
    <div
      className={`${styles.page} ${bsdDisplay.variable} ${bsdBody.variable}`}
    >
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <Image
            className={styles.heroLogo}
            src="/assets/black-shopping-days/bsd-logo.webp"
            alt="Black Shopping Days"
            width={148}
            height={148}
          />
          <div>
            <Link className={styles.back} href="/black-shopping-days">
              ← Volver a Black Shopping Days
            </Link>
            <h1 className={styles.title}>Términos y condiciones</h1>
            <p className={styles.subtitle}>
              Condiciones de uso, participación y política de privacidad del
              evento Black Shopping Days 2026.
            </p>
          </div>
          <Image
            className={styles.heroCasc}
            src="/brand/casc-logo-full-white.png"
            alt="Cámara Argentina de Shopping Centers"
            width={122}
            height={56}
          />
        </div>
      </header>
      <div className={styles.layout}>
        <TermsNav groups={navGroups} />
        <article
          className={styles.legal}
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </div>
  );
}
