/**
 * CSV export helper for admin tables (candidatos, etc.).
 *
 * Produces a CSV that Excel and Google Sheets import cleanly: fields are quoted
 * and internal quotes doubled (RFC 4180), a UTF-8 BOM is prepended so accents
 * render correctly in Excel, and arrays are joined so a column isn't split.
 */

/** Escape one value for a CSV cell. */
function cell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = Array.isArray(value) ? value.join(" | ") : String(value);
  // Quote always; double any embedded quotes. Handles commas, newlines, ";".
  return `"${s.replace(/"/g, '""')}"`;
}

/**
 * Build a CSV string from rows and an ordered column spec.
 * Each column has a header (shown in the sheet) and an accessor.
 */
export function toCsv<T>(
  rows: T[],
  columns: { header: string; value: (row: T) => unknown }[],
): string {
  const headerLine = columns.map((c) => cell(c.header)).join(",");
  const dataLines = rows.map((row) =>
    columns.map((c) => cell(c.value(row))).join(","),
  );
  // BOM so Excel detects UTF-8 (otherwise accents break).
  return "﻿" + [headerLine, ...dataLines].join("\r\n");
}

/** Trigger a browser download of `content` as a file. Client-side only. */
export function downloadFile(
  content: string,
  filename: string,
  mime = "text/csv;charset=utf-8",
): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
