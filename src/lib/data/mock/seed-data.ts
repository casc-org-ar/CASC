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
    categoria: "Institucional",
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
    categoria: "Eventos",
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
    // Archive model: the admin uploads the edition already sent (a PDF exported
    // from the email provider). Socios download it from the archive.
    adjuntoUrl: "/mock/newsletter-42.pdf",
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

/**
 * Blog posts migrated verbatim from the original CASC site (Noticias y
 * tendencias del sector). Bodies are placeholders until the real article text
 * is available; titles, summaries and cover images are the real ones.
 */
export const blogPosts: BlogPost[] = [
  {
    id: "blog-1",
    titulo: "Más servicios y una mirada federal: la misión institucional de la CASC",
    slug: "mas-servicios-mirada-federal-mision-institucional",
    bajada: "Una Cámara enfocada en generar valor para sus asociados y para la industria.",
    cuerpo:
      "Una Cámara enfocada en generar valor para sus asociados y para la industria.",
    portadaUrl: "/assets/blog/mas-servicios.webp",
    autor: "Equipo CASC",
    tags: ["institucional"],
    fecha: iso(2026, 6, 15),
    status: "publicado",
    createdAt: iso(2026, 6, 15),
    updatedAt: iso(2026, 6, 15),
  },
  {
    id: "blog-2",
    titulo: "Los principales desafíos de la industria de los Shopping Centers hacia el futuro",
    slug: "principales-desafios-industria-shopping-centers-futuro",
    bajada:
      "Gestión, servicios, federalización y trabajo conjunto como ejes de crecimiento.",
    cuerpo:
      "Gestión, servicios, federalización y trabajo conjunto como ejes de crecimiento.",
    portadaUrl: "/assets/blog/los-principales-desafios.webp",
    autor: "Equipo CASC",
    tags: ["industria", "tendencias"],
    fecha: iso(2026, 6, 10),
    status: "publicado",
    createdAt: iso(2026, 6, 10),
    updatedAt: iso(2026, 6, 10),
  },
  {
    id: "blog-3",
    titulo: "El rol de los Centros Comerciales en el desarrollo económico de Argentina",
    slug: "rol-centros-comerciales-desarrollo-economico-argentina",
    bajada:
      "Una mirada federal sobre la industria de los Centros Comerciales y su impacto en el país.",
    cuerpo:
      "Una mirada federal sobre la industria de los Centros Comerciales y su impacto en el país.",
    portadaUrl: "/assets/blog/rol-de-los-centros-comerciales.webp",
    autor: "Equipo CASC",
    tags: ["economía", "federal"],
    fecha: iso(2026, 6, 5),
    status: "publicado",
    createdAt: iso(2026, 6, 5),
    updatedAt: iso(2026, 6, 5),
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
    invitacionStatus: "aceptada",
    invitacionEnviadaAt: iso(2025, 11, 3),
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
    invitacionStatus: "aceptada",
    invitacionEnviadaAt: iso(2025, 9, 20),
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
    // Invited but not yet registered: shows the "enviada" state in the demo.
    invitacionStatus: "enviada",
    invitacionEnviadaAt: iso(2026, 3, 8),
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
    // Inactive membership AND pending invitation: two independent axes.
    invitacionStatus: "pendiente",
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
    invitacionStatus: "aceptada",
    invitacionEnviadaAt: iso(2025, 1, 1),
    createdAt: iso(2025, 1, 1),
    updatedAt: iso(2025, 1, 1),
  },
];
