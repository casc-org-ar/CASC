import type {
  BlogPost,
  Candidato,
  Hotel,
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

/**
 * Hotels with discounts for CASC members. Content transcribed from the CASC
 * "Hoteles con descuentos p/socios — Resumen 2026" material. CityCenter Rosario
 * is included because it is also an associate.
 */
const NOTA_ASOCIADO =
  "Informar que se trata de un asociado de la Cámara Argentina de Shopping Centers.";

export const hoteles: Hotel[] = [
  {
    id: "ht-scala",
    nombre: "Scala Hotel Buenos Aires",
    estrellas: 4,
    ciudad: "CABA",
    direccion: "Bernardo de Irigoyen 740 — CABA",
    telefono: "54 11 4343 0606",
    web: "www.scalabuenosaires.com",
    logoUrl: "/assets/hoteles/scala.png",
    descuento: "Tarifas corporativas (varían según la fecha de estadía)",
    reservas: "Gala Pérez Mansilla — corporate@scalabuenosaires.com",
    nota: NOTA_ASOCIADO,
    status: "publicado",
    createdAt: iso(2026, 7, 1),
    updatedAt: iso(2026, 7, 1),
  },
  {
    id: "ht-madero",
    nombre: "Hotel Madero",
    estrellas: 5,
    ciudad: "CABA",
    direccion: "Rosario Vera Peñaloza 360 — Puerto Madero — CABA",
    telefono: "54 11 5776 7777",
    web: "www.hotelmadero.com/es",
    logoUrl: "/assets/hoteles/hotel-madero.png",
    descuento: "Tarifas corporativas (expresadas en U$S)",
    reservas: "Carolina Vidal Domínguez — cvidal@hotelmadero.com",
    nota: NOTA_ASOCIADO,
    status: "publicado",
    createdAt: iso(2026, 7, 1),
    updatedAt: iso(2026, 7, 1),
  },
  {
    id: "ht-minor",
    nombre: "Minor Hotels — NH y NH Collection",
    estrellas: 4,
    ciudad: "CABA e Interior",
    direccion:
      "NH Collection Centro Histórico (Bolívar 120), City Hotel NH (Bolívar 160), NH Collection Lancaster (Av. Córdoba 405), NH Collection Jousten (Av. Corrientes 280), NH Collection Crillón (Av. Santa Fe 796), NH 9 de Julio (Cerrito 156), NH Tango (Cerrito 550), NH Latino (Suipacha 309) y NH Florida (San Martín 639) en CABA; NH Panorama y NH Urbano en Córdoba; NH Cordillera en Mendoza. El grupo incluye además las marcas Avani, Tivoli, Nhow y Anantara en distintas ciudades de América y Europa.",
    logoUrl: "/assets/hoteles/minor-hotels.png",
    descuento: "12% a 20% de descuento",
    beneficios: [
      "10% de descuento en Restaurantes del Hotel",
      "Cancelaciones flexibles",
      "Wifi premium",
      "Prioridad en check in / check out sujeto a disponibilidad",
      "5% de descuento en reuniones y eventos",
    ],
    reservas:
      "Llamando al 11 6841 9937, informando N° de cliente CASC: 2201331423. También escribiendo a María Yasmín Mancuso — my.mancuso@nh-hotels.com",
    nota: NOTA_ASOCIADO,
    status: "publicado",
    createdAt: iso(2026, 7, 1),
    updatedAt: iso(2026, 7, 1),
  },
  {
    id: "ht-intertower",
    nombre: "InterTower Hotel",
    estrellas: 4,
    ciudad: "Santa Fe",
    direccion: "San Jerónimo 2779 — Santa Fe Capital",
    telefono: "54 342 450 3430",
    web: "www.intertowerhotel.com",
    logoUrl: "/assets/hoteles/intertower.jpg",
    descuento: "10% sobre tarifa pública",
    reservas: "info@intertowerhotel.com",
    nota: NOTA_ASOCIADO,
    status: "publicado",
    createdAt: iso(2026, 7, 1),
    updatedAt: iso(2026, 7, 1),
  },
  {
    id: "ht-los-silos",
    nombre: "Los Silos Hotel",
    estrellas: 4,
    ciudad: "Santa Fe",
    direccion: "Dique I, Puerto de Santa Fe — Santa Fe",
    telefono: "54 342 450 2800",
    web: "www.hotellossilos.com.ar",
    logoUrl: "/assets/hoteles/los-silos.jpg",
    descuento: "25% sobre tarifa pública",
    reservas:
      "recepcion.LS@hotellossilos.com.ar — WhatsApp: +54 9 3424 50 2801",
    nota: NOTA_ASOCIADO,
    status: "publicado",
    createdAt: iso(2026, 7, 1),
    updatedAt: iso(2026, 7, 1),
  },
  {
    id: "ht-diplomatic",
    nombre: "Diplomatic Hotel",
    estrellas: 5,
    ciudad: "Mendoza",
    direccion: "Av. Belgrano 1041 — Ciudad de Mendoza",
    telefono: "54 261 405 1900",
    web: "www.diplomatichotel.com.ar",
    logoUrl: "/assets/hoteles/diplomatic.jpg",
    descuento: "Tarifas corporativas (expresadas en U$S)",
    beneficios: [
      "Early y late check, sujeto a disponibilidad",
      "Upgrade a categoría superior, sujeto a disponibilidad",
      "20% de descuento en el restaurante",
      "Una copa de vino en cortesía durante la estadía, en el Wine tasting de 19 a 20:30 hs.",
      "Dos botellas de agua mineral de 500 ml en cortesía, por habitación",
      "Estacionamiento cubierto del hotel y convenio en aledaño, según disponibilidad",
      "Servicio de Concierge Member of Les Clefs d'Or",
    ],
    reservas:
      "reservas@diplomatichotel.com.ar — Mencionar: convenio especial CASC",
    status: "publicado",
    createdAt: iso(2026, 7, 1),
    updatedAt: iso(2026, 7, 1),
  },
  {
    id: "ht-howard-johnson-jujuy",
    nombre: "Howard Johnson Plaza Jujuy",
    estrellas: 4,
    ciudad: "Jujuy",
    direccion: "Gral. Güemes 864 — San Salvador de Jujuy",
    telefono: "54 388 340 7627",
    web: "www.hjjujuy.com.ar",
    logoUrl: "/assets/hoteles/howard-johnson-jujuy.jpg",
    descuento: "Tarifas corporativas",
    reservas: "reservas@hjjujuy.com.ar",
    nota: NOTA_ASOCIADO,
    status: "publicado",
    createdAt: iso(2026, 7, 1),
    updatedAt: iso(2026, 7, 1),
  },
  {
    id: "ht-citycenter-rosario",
    nombre: "CityCenter Rosario — Hotel Pullman",
    estrellas: 5,
    ciudad: "Rosario",
    direccion: "CityCenter Rosario — Rosario, Santa Fe",
    telefono: "0800-222-2489",
    logoUrl: "/assets/sponsors/citycenter.webp",
    descuento:
      "15% en alojamiento (lunes a domingo, sobre la tarifa disponible del día, no acumulable). 10% en el restaurante ALL DAY (almuerzo y cena, domingos a jueves). 10% en DAY SPA.",
    beneficios: [
      "15% de descuento en alojamiento sobre la tarifa disponible del día",
      "10% de descuento en el restaurante ALL DAY, de domingos a jueves",
      "10% de descuento sobre las tarifas de DAY SPA vigentes",
    ],
    reservas:
      "reservas@citycenter-rosario.com.ar — Tel.: 0800-222-2489 (lunes a domingo, 24 hs.). Mencionar el beneficio al reservar.",
    nota: "CityCenter Rosario es asociado de la CASC.",
    status: "publicado",
    createdAt: iso(2026, 7, 1),
    updatedAt: iso(2026, 7, 1),
  },
];

/**
 * Sample candidates for the Bolsa de Trabajo. Fictional profiles across a few
 * areas so recruiters can see the filter working. One is left as "borrador" to
 * show the moderation flow (pending admin review before recruiters see it).
 * CV URLs are mock placeholders — no real file is uploaded in the prototype.
 */
export const candidatos: Candidato[] = [
  {
    id: "cd-1",
    nombre: "Lucía Fernández",
    email: "lucia.fernandez@example.com",
    telefono: "11 5555 1234",
    puestoBuscado: "Encargada de local",
    areaInteres: "Retail y ventas",
    skills: ["Atención al público", "Ventas", "Gestión de equipos", "Control de stock"],
    aniosExperiencia: 6,
    nivelEducativo: "Terciario",
    disponibilidad: "full-time",
    ciudad: "CABA",
    provincia: "Buenos Aires",
    cvUrl: "/mock/cv/lucia-fernandez.pdf",
    cvNombre: "cv-lucia-fernandez.pdf",
    consentimiento: true,
    status: "publicado",
    createdAt: iso(2026, 7, 5),
    updatedAt: iso(2026, 7, 5),
  },
  {
    id: "cd-2",
    nombre: "Martín Gómez",
    email: "martin.gomez@example.com",
    telefono: "341 555 6789",
    puestoBuscado: "Community manager",
    areaInteres: "Marketing y comunicación",
    skills: ["Marketing digital", "Redes sociales", "Community management", "Diseño gráfico"],
    aniosExperiencia: 3,
    nivelEducativo: "Universitario",
    disponibilidad: "ambas",
    ciudad: "Rosario",
    provincia: "Santa Fe",
    cvUrl: "/mock/cv/martin-gomez.pdf",
    cvNombre: "cv-martin-gomez.pdf",
    consentimiento: true,
    status: "publicado",
    createdAt: iso(2026, 7, 8),
    updatedAt: iso(2026, 7, 8),
  },
  {
    id: "cd-3",
    nombre: "Carla Ruiz",
    email: "carla.ruiz@example.com",
    puestoBuscado: "Administrativa contable",
    areaInteres: "Administración y finanzas",
    skills: ["Administración", "Contabilidad", "Facturación", "Ofimática"],
    aniosExperiencia: 8,
    nivelEducativo: "Universitario",
    disponibilidad: "full-time",
    ciudad: "Córdoba",
    provincia: "Córdoba",
    cvUrl: "/mock/cv/carla-ruiz.pdf",
    cvNombre: "cv-carla-ruiz.pdf",
    consentimiento: true,
    status: "publicado",
    createdAt: iso(2026, 7, 10),
    updatedAt: iso(2026, 7, 10),
  },
  {
    id: "cd-4",
    nombre: "Diego Sosa",
    email: "diego.sosa@example.com",
    telefono: "261 555 4321",
    puestoBuscado: "Personal de seguridad",
    areaInteres: "Seguridad",
    skills: ["Vigilancia", "Seguridad e higiene"],
    aniosExperiencia: 4,
    nivelEducativo: "Secundario",
    disponibilidad: "part-time",
    ciudad: "Mendoza",
    provincia: "Mendoza",
    cvUrl: "/mock/cv/diego-sosa.pdf",
    cvNombre: "cv-diego-sosa.pdf",
    consentimiento: true,
    status: "publicado",
    createdAt: iso(2026, 7, 12),
    updatedAt: iso(2026, 7, 12),
  },
  {
    id: "cd-5",
    nombre: "Sofía Herrera",
    email: "sofia.herrera@example.com",
    puestoBuscado: "Cajera / atención al cliente",
    areaInteres: "Atención al cliente",
    skills: ["Atención al público", "Manejo de caja", "Ventas"],
    aniosExperiencia: 2,
    nivelEducativo: "Secundario",
    disponibilidad: "ambas",
    ciudad: "La Plata",
    provincia: "Buenos Aires",
    cvUrl: "/mock/cv/sofia-herrera.pdf",
    cvNombre: "cv-sofia-herrera.pdf",
    consentimiento: true,
    // Pending moderation — not yet visible to recruiters.
    status: "borrador",
    createdAt: iso(2026, 7, 14),
    updatedAt: iso(2026, 7, 14),
  },
];
