import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names, resolving Tailwind conflicts. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Today's date as `YYYY-MM-DD` in Argentina's timezone (America/Argentina/
 * Buenos Aires), for prefilling <input type="date"> defaults. Using the raw
 * UTC date would roll over to "tomorrow" late at night in Argentina, so we
 * resolve the local calendar day explicitly via Intl.
 */
export function todayInBuenosAires(): string {
  // en-CA formats as YYYY-MM-DD, exactly what a date input expects.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Argentina's timezone — the only one the app ever displays dates in. */
const AR_TIMEZONE = "America/Argentina/Buenos_Aires";

/** A bare calendar day, as stored in a Postgres `date` column: "2026-09-15". */
const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})/;

/**
 * Format a stored date for display in Argentina.
 *
 * Content dates (`fecha` on webinars, blog, informes, newsletters) live in
 * Postgres `date` columns, so they arrive as a bare calendar day with no time
 * and no zone: "2026-09-15". `new Date("2026-09-15")` reads that as MIDNIGHT
 * UTC, which in Argentina (UTC−3) is 21:00 of the PREVIOUS day — so rendering
 * it with plain `toLocaleDateString` showed an admin's 15/09 as 14/09.
 *
 * A calendar day is not an instant: it must not be shifted by a timezone at
 * all. So a date-only value is pinned to UTC on both ends — built as UTC
 * midnight and formatted in UTC — which returns the very day that was typed.
 *
 * Full timestamps (`createdAt` and friends) ARE instants, and those we do
 * convert to Argentina's local time, which is what a reader expects to see.
 */
export function formatDate(
  value: string | Date,
  options: Intl.DateTimeFormatOptions = {},
): string {
  if (typeof value === "string") {
    const m = DATE_ONLY.exec(value.trim());
    // Date-only → keep the calendar day intact by staying in UTC throughout.
    if (m && !value.includes("T")) {
      const utc = new Date(
        Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])),
      );
      return new Intl.DateTimeFormat("es-AR", {
        ...options,
        timeZone: "UTC",
      }).format(utc);
    }
  }
  // A real instant → show it in Argentina's local time.
  return new Intl.DateTimeFormat("es-AR", {
    ...options,
    timeZone: AR_TIMEZONE,
  }).format(new Date(value));
}

/**
 * Format an instant as date + time in Argentina — for audit-style fields
 * (a submission's `createdAt`) where the hour carries meaning.
 */
export function formatDateTime(
  value: string | Date,
  options: Intl.DateTimeFormatOptions = {},
): string {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
    ...options,
    timeZone: AR_TIMEZONE,
  }).format(new Date(value));
}
