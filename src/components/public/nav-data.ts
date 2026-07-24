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
      { label: "Estatuto", href: "/estatuto" },
      { label: "Comisión Directiva", href: "/comision-directiva" },
      { label: "Datos del sector", href: "/datos-del-sector" },
      { label: "Delegaciones Regionales", href: "/delegaciones-regionales" },
    ],
  },
  {
    label: "Asociados",
    children: [
      {
        label: "Shopping Centers",
        href: "/asociados?categoria=shopping-centers#directorio",
      },
      {
        label: "Retailers",
        href: "/asociados?categoria=retailers#directorio",
      },
      {
        label: "Proveedores de servicios",
        href: "/asociados?categoria=proveedores-de-servicios#directorio",
      },
    ],
  },
  { label: "Actividades", href: "/actividades" },
  { label: "Beneficios", href: "/beneficios" },
  { label: "Bolsa de trabajo", href: "/bolsa-de-trabajo" },
  { label: "Contacto", href: "/contacto" },
];

/** Footer column groups for the public site footer. */
export const footerColumns: NavGroup[] = [
  {
    label: "Institucional",
    children: [
      { label: "Sobre la Cámara", href: "/nosotros" },
      { label: "Estatuto", href: "/estatuto" },
      { label: "Comisión Directiva", href: "/comision-directiva" },
      { label: "Datos del sector", href: "/datos-del-sector" },
      { label: "Delegaciones Regionales", href: "/delegaciones-regionales" },
    ],
  },
  {
    label: "Asociados",
    children: [
      {
        label: "Shopping Centers",
        href: "/asociados?categoria=shopping-centers#directorio",
      },
      {
        label: "Retailers",
        href: "/asociados?categoria=retailers#directorio",
      },
      {
        label: "Proveedores de servicios",
        href: "/asociados?categoria=proveedores-de-servicios#directorio",
      },
      { label: "Beneficios", href: "/beneficios" },
      { label: "Cómo asociarse", href: "/como-asociarse" },
      { label: "Acceso al panel", href: "/login" },
    ],
  },
  {
    label: "Secciones",
    children: [
      { label: "Actividades", href: "/actividades" },
      { label: "Noticias", href: "/noticias" },
      { label: "Bolsa de trabajo", href: "/bolsa-de-trabajo" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
];

/** Footer legal links. */
export const legalNav: NavLink[] = [
  { label: "Términos y condiciones", href: "/terminos-y-condiciones" },
  { label: "Políticas de privacidad", href: "/politicas-de-privacidad" },
  { label: "Política de cookies", href: "/politica-de-cookies" },
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
