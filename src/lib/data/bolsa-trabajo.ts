/**
 * Bolsa de Trabajo taxonomy — TENTATIVE, pending CASC validation.
 *
 * The meeting notes (2026-07-21) call for a candidate database "filtrable por
 * habilidades" but did not define the actual categories. These lists are a
 * reasonable starting set for the shopping-center industry, derived from the
 * kinds of roles those centers hire for. Swap the values once CASC confirms.
 *
 * Keeping this in one module means the public form, the recruiter filters and
 * the admin form all read the same source of truth.
 */

/** Areas of interest a candidate can pick — one per candidate. */
export const areasInteres = [
  "Retail y ventas",
  "Gastronomía",
  "Administración y finanzas",
  "Marketing y comunicación",
  "Seguridad",
  "Limpieza y mantenimiento",
  "Recursos humanos",
  "Atención al cliente",
  "Logística y depósito",
  "Tecnología y sistemas",
] as const;

export type AreaInteres = (typeof areasInteres)[number];

/**
 * Skill tags candidates can select (multiple). Broader than areas: these are
 * the concrete competencies recruiters filter by.
 */
export const skillsDisponibles = [
  "Atención al público",
  "Ventas",
  "Manejo de caja",
  "Gestión de equipos",
  "Visual merchandising",
  "Control de stock",
  "Marketing digital",
  "Redes sociales",
  "Community management",
  "Diseño gráfico",
  "Administración",
  "Contabilidad",
  "Facturación",
  "Recepción",
  "Cocina",
  "Barra",
  "Seguridad e higiene",
  "Vigilancia",
  "Limpieza",
  "Mantenimiento edilicio",
  "Selección de personal",
  "Liquidación de sueldos",
  "Logística",
  "Manejo de depósito",
  "Soporte técnico",
  "Ofimática",
  "Inglés",
] as const;

export type Skill = (typeof skillsDisponibles)[number];

/** Education levels offered in the form's select. */
export const nivelesEducativos = [
  "Secundario",
  "Terciario",
  "Universitario",
  "Posgrado",
] as const;

/**
 * The CASC LinkedIn page for external job postings (IRSA, Cencosud, etc.),
 * which the meeting decided to redirect to instead of hosting on the site.
 *
 * TODO: replace with the real CASC LinkedIn URL when available.
 */
export const LINKEDIN_CASC_URL =
  "https://www.linkedin.com/company/camaraargentinadeshoppingcenters";
