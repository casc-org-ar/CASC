import type {
  BlogPost,
  Informe,
  Newsletter,
  Noticia,
  Socio,
  Webinar,
} from "@/lib/types/domain";

/**
 * Realistic seed data for the prototype demo. Names of real Argentine
 * shopping centers and plausible titles so the platform reads as credible
 * during a walkthrough. These arrays are the mutable stores the in-memory
 * repositories operate on.
 */

const iso = (y: number, m: number, d: number) =>
  new Date(Date.UTC(y, m - 1, d)).toISOString();

export const webinars: Webinar[] = [
  {
    id: "wb-1",
    titulo: "Tendencias de consumo retail 2026",
    descripcion:
      "Análisis del comportamiento del consumidor argentino y proyecciones para el sector shopping.",
    fecha: iso(2026, 5, 20),
    videoUrl: "https://www.youtube.com/embed/_O6MYU4vgQQ",
    portadaUrl: "/assets/banners/banner-1.webp",
    categoria: "Retail",
    materialAdjuntoUrl: "/mock/tendencias-2026.pdf",
    status: "publicado",
    createdAt: iso(2026, 5, 10),
    updatedAt: iso(2026, 5, 10),
  },
  {
    id: "wb-2",
    titulo: "Seguridad e higiene en centros comerciales",
    descripcion:
      "Protocolos actualizados y normativa vigente para espacios de alta circulación.",
    fecha: iso(2026, 6, 12),
    videoUrl: "https://www.youtube.com/embed/_O6MYU4vgQQ",
    categoria: "Operaciones",
    status: "publicado",
    createdAt: iso(2026, 6, 1),
    updatedAt: iso(2026, 6, 1),
  },
  {
    id: "wb-3",
    titulo: "Marketing digital para shoppings",
    descripcion:
      "Estrategias omnicanal y fidelización a través de apps y programas de puntos.",
    fecha: iso(2026, 7, 8),
    videoUrl: "https://www.youtube.com/embed/_O6MYU4vgQQ",
    categoria: "Marketing",
    status: "borrador",
    createdAt: iso(2026, 6, 25),
    updatedAt: iso(2026, 6, 25),
  },
];

export const informes: Informe[] = [
  {
    id: "inf-1",
    titulo: "Reporte anual de afluencia 2025",
    descripcion:
      "Datos consolidados de tráfico peatonal en centros comerciales asociados.",
    categoria: "Estadísticas",
    archivoUrl: "/mock/afluencia-2025.pdf",
    portadaUrl: "/assets/banners/banner-2.webp",
    fecha: iso(2026, 2, 15),
    status: "publicado",
    createdAt: iso(2026, 2, 15),
    updatedAt: iso(2026, 2, 15),
  },
  {
    id: "inf-2",
    titulo: "Índice de ventas por rubro — Q1 2026",
    descripcion:
      "Evolución de ventas segmentada por categoría de local comercial.",
    categoria: "Ventas",
    archivoUrl: "/mock/ventas-q1-2026.pdf",
    fecha: iso(2026, 4, 30),
    status: "publicado",
    createdAt: iso(2026, 4, 30),
    updatedAt: iso(2026, 4, 30),
  },
  {
    id: "inf-3",
    titulo: "Sustentabilidad y eficiencia energética",
    descripcion:
      "Buenas prácticas y benchmarks de consumo energético del sector.",
    categoria: "Sustentabilidad",
    archivoUrl: "/mock/sustentabilidad-2026.pdf",
    fecha: iso(2026, 6, 10),
    status: "borrador",
    createdAt: iso(2026, 6, 5),
    updatedAt: iso(2026, 6, 5),
  },
];

export const noticias: Noticia[] = [
  {
    id: "not-1",
    titulo: "CASC firma acuerdo con la Secretaría de Comercio",
    bajada:
      "El convenio busca simplificar trámites para los centros comerciales asociados.",
    cuerpo:
      "La Cámara Argentina de Shopping Centers anunció la firma de un acuerdo de colaboración con la Secretaría de Comercio de la Nación. El objetivo es agilizar procesos administrativos y establecer canales de diálogo directo entre el sector y el organismo.",
    imagenUrl: "/assets/banners/banner-3.webp",
    fecha: iso(2026, 6, 28),
    status: "publicado",
    createdAt: iso(2026, 6, 28),
    updatedAt: iso(2026, 6, 28),
  },
  {
    id: "not-2",
    titulo: "Nueva edición del Congreso Anual de Retail",
    bajada:
      "Se realizará en septiembre con la participación de referentes del sector.",
    cuerpo:
      "La edición 2026 del Congreso Anual reunirá a directivos, operadores y proveedores del ecosistema retail. Habrá paneles sobre innovación, experiencia del cliente y sostenibilidad.",
    fecha: iso(2026, 6, 20),
    status: "publicado",
    createdAt: iso(2026, 6, 20),
    updatedAt: iso(2026, 6, 20),
  },
];

export const newsletters: Newsletter[] = [
  {
    id: "nl-1",
    titulo: "Novedades del sector — Junio 2026",
    edicion: "N° 42",
    contenido:
      "Resumen mensual de actividades, informes publicados y próximos eventos de la cámara.",
    fecha: iso(2026, 6, 30),
    // Archive model: link to the edition already sent via the email provider
    // (e.g. Mailchimp campaign page). Opens in a new tab, seen as it was sent.
    adjuntoUrl: "https://mailchi.mp/casc/novedades-junio-2026",
    status: "publicado",
    createdAt: iso(2026, 6, 30),
    updatedAt: iso(2026, 6, 30),
  },
  {
    id: "nl-2",
    titulo: "Novedades del sector — Mayo 2026",
    edicion: "N° 41",
    contenido:
      "Cobertura del webinar de tendencias y balance del primer cuatrimestre.",
    fecha: iso(2026, 5, 31),
    adjuntoUrl: "/mock/newsletter-41.pdf",
    status: "publicado",
    createdAt: iso(2026, 5, 31),
    updatedAt: iso(2026, 5, 31),
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "blog-1",
    titulo: "El futuro del retail experiencial en Argentina",
    slug: "futuro-retail-experiencial-argentina",
    bajada:
      "Cómo los centros comerciales se transforman en espacios de experiencia más allá de la compra.",
    cuerpo:
      "Los shopping centers dejaron de ser meros puntos de venta. Hoy compiten por el tiempo y la atención de las personas ofreciendo gastronomía, entretenimiento y espacios de encuentro.\n\nEn este artículo repasamos las tendencias que están redefiniendo el rol del centro comercial en la vida urbana argentina.",
    portadaUrl: "/mock/blog-retail.jpg",
    autor: "Equipo CASC",
    tags: ["retail", "tendencias", "experiencia"],
    fecha: iso(2026, 6, 15),
    status: "publicado",
    createdAt: iso(2026, 6, 15),
    updatedAt: iso(2026, 6, 15),
  },
  {
    id: "blog-2",
    titulo: "Sustentabilidad: el nuevo estándar del sector",
    slug: "sustentabilidad-nuevo-estandar-sector",
    bajada:
      "La eficiencia energética dejó de ser opcional para los centros comerciales.",
    cuerpo:
      "Cada vez más shoppings incorporan paneles solares, gestión inteligente de residuos y certificaciones ambientales.\n\nAnalizamos casos concretos y el impacto de estas medidas en la operación y en la percepción de marca.",
    autor: "Equipo CASC",
    tags: ["sustentabilidad", "energía"],
    fecha: iso(2026, 5, 28),
    status: "borrador",
    createdAt: iso(2026, 5, 28),
    updatedAt: iso(2026, 5, 28),
  },
];

export const socios: Socio[] = [
  {
    id: "soc-1",
    nombre: "María González",
    shopping: "Alto Palermo",
    email: "mgonzalez@altopalermo.com.ar",
    cargo: "Gerente General",
    estado: "activo",
    role: "socio",
    createdAt: iso(2025, 11, 3),
    updatedAt: iso(2026, 1, 15),
  },
  {
    id: "soc-2",
    nombre: "Diego Fernández",
    shopping: "Abasto Shopping",
    email: "dfernandez@abasto.com.ar",
    cargo: "Director de Operaciones",
    estado: "activo",
    role: "socio",
    createdAt: iso(2025, 9, 20),
    updatedAt: iso(2025, 12, 1),
  },
  {
    id: "soc-3",
    nombre: "Laura Medina",
    shopping: "Unicenter",
    email: "lmedina@unicenter.com.ar",
    cargo: "Marketing Manager",
    estado: "activo",
    role: "socio",
    createdAt: iso(2025, 10, 12),
    updatedAt: iso(2026, 3, 8),
  },
  {
    id: "soc-4",
    nombre: "Roberto Sosa",
    shopping: "Córdoba Shopping",
    email: "rsosa@cordobashopping.com.ar",
    cargo: "Gerente Comercial",
    estado: "inactivo",
    role: "socio",
    createdAt: iso(2025, 6, 1),
    updatedAt: iso(2026, 2, 20),
  },
  {
    id: "adm-1",
    nombre: "Comisión CASC",
    shopping: "Cámara Argentina de Shopping Centers",
    email: "comision@casc.org.ar",
    cargo: "Administración",
    estado: "activo",
    role: "admin",
    createdAt: iso(2025, 1, 1),
    updatedAt: iso(2025, 1, 1),
  },
];
