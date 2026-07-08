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
