/**
 * Turns the migrated Estatuto HTML into a navigable document.
 *
 * The legacy markup opens every chapter as
 *   <p><b><span>CAPÍTULO II. DE LOS ASOCIADOS. <br>Artículo 3º: </span></b><span>…
 * i.e. the chapter title and the first article share one bold run. We lift the
 * "CAPÍTULO …" line into an anchored heading, keep the article (and the rest of
 * the paragraph) exactly as-is, and collect a table of contents — the legal
 * text itself is never altered.
 */

export interface Chapter {
  id: string;
  /** e.g. "CAPÍTULO II" */
  numero: string;
  /** e.g. "De los asociados, sus categorías, derechos y deberes" */
  titulo: string;
}

export interface ParsedEstatuto {
  html: string;
  chapters: Chapter[];
}

/** Title-case a shouted legacy line: "DE LOS ASOCIADOS" -> "De los asociados". */
function titleCase(text: string): string {
  const clean = text
    .replace(/\s+/g, " ")
    .replace(/^[\s­.:-]+/, "") // drop leading dash/soft-hyphen/colon noise
    .replace(/[\s­.:-]+$/, "") // and the same trailing noise
    .trim();
  if (!clean) return "";
  return clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
}

/** Normalize the roman numeral: fix the OCR'd "l" and drop legacy quirks. */
function normalizeNumero(raw: string, index: number): string {
  const romans = [
    "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
    "XI", "XII", "XIII", "XIV", "XV",
  ];
  return `CAPÍTULO ${romans[index] ?? raw.replace(/^CAP[IÍ]TULO\s+/i, "")}`;
}

export function parseEstatuto(html: string): ParsedEstatuto {
  const chapters: Chapter[] = [];

  // Capture from "CAPÍTULO …" up to the first "Artículo" — the consistent
  // separator across all chapters (the legacy markup is irregular: some use
  // <br>, some a stray </span><span>, some just a newline before the article).
  // We lift the chapter label into a heading and preserve everything from
  // "Artículo" onward, re-opening the bold run so it stays inside <b><span>.
  const chapterOpen =
    /<p><b><span>\s*(CAP[IÍ]TULO\s+[IVXL]+l?)\b\.?[\s­]*([\s\S]*?)\s*((?:<br>|<\/span><span>|<\/span>|\s)*)Art[ií]culo/gi;

  const transformed = html.replace(
    chapterOpen,
    (_match, numeroRaw: string, tituloRaw: string) => {
      const id = `capitulo-${chapters.length + 1}`;
      const numero = normalizeNumero(numeroRaw, chapters.length);
      // Strip any tags the title span may carry, then normalize.
      const titulo = titleCase(tituloRaw.replace(/<[^>]+>/g, " "));
      chapters.push({ id, numero, titulo });

      const heading = titulo
        ? `${numero}<span class="estatuto-chapter-sub">${titulo}</span>`
        : numero;

      // Anchored heading, then re-open the paragraph/bold run and put "Artículo"
      // back (the regex consumed it) so the article text stays bold and intact.
      return `<h2 id="${id}" class="estatuto-chapter">${heading}</h2><p><b><span>Artículo`;
    },
  );

  return { html: transformed, chapters };
}
