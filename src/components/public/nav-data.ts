/**
 * Public site navigation model — extracted verbatim from the original CASC
 * site (see /_legacy/casc-original). Single source of truth for Header and
 * Footer. Content parity phase: labels and destinations mirror the original.
 *
 * Routes use clean Next.js paths (no `.html`); 301 redirects from the legacy
 * `*.html` URLs are configured in next.config.ts.
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface NavGroup {
  label: string;
  children: NavLink[];
}

export type NavItem = NavLink | NavGroup;

export function isNavGroup(item: NavItem): item is NavGroup {
  return "children" in item;
}

/** Primary navigation, mirroring the original sidebar menu structure. */
export const mainNav: NavItem[] = [
  {
    label: "Nosotros",
    children: [
      { label: "Sobre la Cámara", href: "/nosotros" },
      { label: "Datos del sector", href: "/datos-del-sector" },
      { label: "Comisión Directiva", href: "/comision-directiva" },
      { label: "Estatuto", href: "/estatuto" },
      { label: "Delegaciones Regionales", href: "/delegaciones-regionales" },
      { label: "Staff", href: "/comision-directiva#staff" },
    ],
  },
  {
    label: "Asociados",
    children: [
      { label: "Shopping Center", href: "/delegaciones-regionales" },
      { label: "Retailers", href: "/asociados/retailers" },
      { label: "Proveedores de servicios", href: "/asociados/proveedores-de-servicios" },
    ],
  },
  { label: "Actividades", href: "/actividades" },
  { label: "Beneficios", href: "/beneficios" },
  { label: "Contacto", href: "/contacto" },
  { label: "Asociarse", href: "/como-asociarse" },
];

/** Footer legal links. */
export const legalNav: NavLink[] = [
  { label: "Términos y condiciones", href: "/terminos-y-condiciones" },
  { label: "Políticas de privacidad", href: "/politicas-de-privacidad" },
];

/** Institutional contact data (verbatim from the original site). */
export const contactInfo = {
  email: "casc@casc.org.ar",
  commercialAddress: "Vedia 3892, 2° piso – Ciudad Autónoma de Buenos Aires",
  commercialMap: "https://maps.app.goo.gl/PrPPHxL7Exu8BhWM8",
  legalAddress: "San Martín 910, 1° piso – Ciudad Autónoma de Buenos Aires",
  legalMap: "https://maps.app.goo.gl/cDqJVEP44HX6igYLA",
} as const;

/** Social links (verbatim from the original site). */
export const socialLinks = {
  linkedin:
    "https://www.linkedin.com/company/camaraargentinadeshoppingcenters",
  instagram: "https://www.instagram.com/camaraargentinadeshopping/",
} as const;
