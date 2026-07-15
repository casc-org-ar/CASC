/**
 * Home page content — extracted verbatim from the original CASC site
 * (_legacy/casc-original/index.html and actividades.html). Content-parity
 * phase: texts and data mirror the original site exactly.
 *
 * Noticias are intentionally NOT here: that section reads published BlogPosts
 * from the DataLayer (empty until the panel publishes). Capacitaciones use the
 * real activities migrated from the legacy site, with images in /assets/blog.
 */

import {
  BarChart3,
  GraduationCap,
  Megaphone,
  Users,
  type LucideIcon,
} from "lucide-react";

/** Institutional benefits for members, with a matching icon per point. */
export interface Beneficio {
  icon: LucideIcon;
  titulo: string;
  descripcion: string;
}

export const beneficios: Beneficio[] = [
  {
    icon: Users,
    titulo: "Networking",
    descripcion:
      "Participá de rondas, comisiones y espacios donde se comparten prácticas y se analizan temas claves del sector.",
  },
  {
    icon: BarChart3,
    titulo: "Información y estadísticas",
    descripcion:
      "Acceso a reportes exclusivos de afluencia, consumo, retail trends, empleo e indicadores del sector.",
  },
  {
    icon: GraduationCap,
    titulo: "Formación y capacitación",
    descripcion:
      "Programas, workshops y eventos diseñados para profesionales de centros comerciales.",
  },
  {
    icon: Megaphone,
    titulo: "Difusión y visibilidad",
    descripcion:
      "Posibilidad de difundir acciones, aperturas, novedades, programas de fidelización o remodelaciones del centro comercial.",
  },
];

/**
 * Trainings and events, migrated verbatim from actividades.html. Images live
 * in /assets/blog. These are public-facing highlights shown on the home; the
 * full list lives at /actividades.
 */
export interface Capacitacion {
  titulo: string;
  descripcion: string;
  imagen: string;
}

export const capacitaciones: Capacitacion[] = [
  {
    titulo: "4.º Congreso Latinoamericano de Centros Comerciales CLICC 2026",
    descripcion:
      "Unidos desde el centro del mundo: transformando la experiencia. El sector de los centros comerciales de América Latina volverá a reunirse en uno de los eventos más relevantes de la industria.",
    imagen: "/assets/blog/clicc-congreso.webp",
  },
  {
    titulo:
      "FASE 2026: más de 200 profesionales analizaron el presente y futuro de los shopping centers",
    descripcion:
      "La Cámara Argentina de Shopping Centers llevó adelante la segunda edición de FASE - Foro Argentino de Shoppings y Experiencias, el pasado 28 de mayo, en el Auditorio Plaza Galicia de la Ciudad de Buenos Aires.",
    imagen: "/assets/blog/fase-2026.webp",
  },
  {
    titulo: "Gestión de mall integral: la experiencia de La Vaguada",
    descripcion:
      "CASC organiza un nuevo webinar con foco en buenas prácticas internacionales.",
    imagen: "/assets/blog/gestion-de-mall-integral.webp",
  },
  {
    titulo: "Webinar: “Monitoreo Inteligente”",
    descripcion:
      "Descubrí cómo la inteligencia artificial y el monitoreo inteligente pueden mejorar la gestión y operación de los shopping centers.",
    imagen: "/assets/blog/monitoreo-inteligente.webp",
  },
  {
    titulo: "Webinar: Remodelar un shopping",
    descripcion: "Errores que cuestan millones y cómo evitarlos.",
    imagen: "/assets/blog/remodelar-un-shopping.webp",
  },
];

/** 2025 activities migrated from actividades.html, with images in /assets/pages/actividades. */
export const actividades2025: Capacitacion[] = [
  {
    titulo:
      "FASE 2025: un espacio clave para pensar el presente y futuro de los Centros Comerciales",
    descripcion:
      "El Foro Argentino de Shoppings y Experiencias reunirá a referentes del sector para analizar tendencias, datos y oportunidades.",
    imagen: "/assets/pages/actividades/articulo1.webp",
  },
  {
    titulo:
      "Eficiencia energética en Centros Comerciales: un eje clave para optimizar la gestión",
    descripcion:
      "Un webinar gratuito abordará buenas prácticas y estrategias para reducir el impacto energético en los Shopping Centers.",
    imagen: "/assets/pages/actividades/articulo2.webp",
  },
];

/** Sponsors, with logos in /assets/sponsors. */
export const sponsors = [
  { name: "City Center", logo: "/assets/sponsors/citycenter.webp" },
  { name: "Nuova Suite", logo: "/assets/sponsors/nuova-site.webp" },
  { name: "Solutions Malls", logo: "/assets/sponsors/solutions-malls.webp" },
  { name: "Wiki Biz", logo: "/assets/sponsors/wiki-biz.webp" },
  { name: "Pullman", logo: "/assets/sponsors/pullman.webp" },
] as const;

/** "Integrante de:" institutional memberships. */
export const memberOf = [
  { name: "CLICC", logo: "/assets/pages/inicio/clicc.jpg" },
  {
    name: "Cámara Argentina de Comercio y Servicios",
    logo: "/assets/pages/inicio/camara.jpg",
  },
] as const;
