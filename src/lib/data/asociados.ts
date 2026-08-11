/**
 * Asociados directory dataset — migrated from the original CASC site
 * (asociados/*.html). Content-parity phase: data extracted verbatim from each
 * ficha. This is static public-site data, kept separate from the platform
 * DataLayer. When the panel manages associates (Etapa 3), swap this module.
 */

export type AsociadoCategory =
  | "Shopping Centers"
  | "Retailers"
  | "Proveedores de servicios"
  | "Otros";

/**
 * Rubro (line of business) for "Proveedores de servicios". These are the
 * DEFINITIVE rubros provided by CASC (replacing the earlier provisional set),
 * matching the categories shown on their current site. "Insumos industriales"
 * is intentionally excluded for now. The mapping of each provider to its rubro
 * is confirmed by CASC.
 */
export type AsociadoRubro =
  | "Limpieza y mantenimiento de edificios"
  | "Soluciones administrativas"
  | "Soluciones tecnológicas"
  | "Consultoría y management"
  | "Arquitectura, diseño e ingeniería"
  | "Movilidad eléctrica"
  | "Hotelería, eventos"
  | "Decoración navideña"
  | "Marketing y publicidad"
  | "Medios publicitarios";

/** Selectable rubros, in the order shown by the directory filter. */
export const asociadoRubros: AsociadoRubro[] = [
  "Limpieza y mantenimiento de edificios",
  "Soluciones administrativas",
  "Soluciones tecnológicas",
  "Consultoría y management",
  "Arquitectura, diseño e ingeniería",
  "Movilidad eléctrica",
  "Hotelería, eventos",
  "Decoración navideña",
  "Marketing y publicidad",
  "Medios publicitarios",
];

export interface Asociado {
  slug: string;
  name: string;
  category: AsociadoCategory;
  logo?: string;
  direccion?: string;
  telefono?: string;
  web?: string;
  inauguracion?: string;
  contacto?: string;
  actividad?: string;
  visitas?: string;
  locales?: string;
  /** Only meaningful for "Proveedores de servicios". */
  rubro?: AsociadoRubro;
}

export const asociados: Asociado[] = [
  {
    "slug": "unoporunomarketingintegrado",
    "name": "1POR1 Marketing Integrado",
    "category": "Proveedores de servicios",
    "logo": "/assets/asociados/logos/unoporunomarketingintegrado.webp",
    "web": "www.1por1.com.ar",
    "actividad": "Servicios para el desarrollo de negocios. Estrategias competitivas y de marketing para Centros Comerciales y Retailers. Estudios para implantación de nuevos centros y expansión de existentes.",
    "rubro": "Marketing y publicidad",
    "direccion": "27 de abril 424 - 5to A - Córdoba - Pcia. de Córdoba",
    "telefono": "54 9 351 555 8533",
    "contacto": "Oscar Piccardo – opiccardo@1por1.com.ar"
  },
  {
    "slug": "abasto-shopping",
    "name": "Abasto shopping",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/abasto-shopping.webp",
    "direccion": "Av. Corrientes 3247 (1193) Capital Federal | Buenos Aires",
    "telefono": "(54 11) 4959-3400",
    "web": "www.abasto-shopping.com.ar",
    "inauguracion": "9 de noviembre de 1998",
    "visitas": "1.359.791",
    "locales": "201"
  },
  {
    "slug": "airbits",
    "name": "Airbits",
    "category": "Proveedores de servicios",
    "logo": "/assets/asociados/logos/airbits.webp",
    "web": "www.airbits.com.ar",
    "contacto": "Pablo Honnorat – pablo.honnorat@airbits.com.ar",
    "actividad": "La más avanzada tecnología para centros comerciales. Conteo de personas y análisis de tráfico. Sensores IoT de presencia y cámaras inteligentes. Mapas de calor. Análisis RFM. Guest WiFi.",
    "rubro": "Soluciones tecnológicas",
    "direccion": "Entre Ríos 142 - 4° C - Resistencia - Pcia. de Chaco",
    "telefono": "54 9 362 473 3535"
  },
  {
    "slug": "alcorta-shopping",
    "name": "Alcorta Shopping",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/alcorta-shopping.webp",
    "direccion": "Salguero 3172 (1425) Capital Federal, Buenos Aires",
    "telefono": "(54 11) 5777-6500",
    "web": "www.alcortashopping.com.ar",
    "inauguracion": "11 de junio de 1992",
    "visitas": "458.358",
    "locales": "121"
  },
  {
    "slug": "aldo-volpe-arquitectos",
    "name": "Aldo Volpe Arquitectos",
    "category": "Proveedores de servicios",
    "logo": "/assets/asociados/logos/aldo-volpe-arquitectos.webp",
    "web": "www.aldovolpe.com.ar",
    "contacto": "Mercedes Volpe – mvolpe@aldovolpe.com.ar",
    "actividad": "Arquitectura y Asesoramiento para el desarrollo y planificación física de emprendimientos comerciales, de servicios y de usos mixtos. Su experiencia se ha nutrido del contacto con developers e inversores, participando desde el nacimiento mismo de la industria del Shopping Center en Argentina y países limítrofes, con un rol destacado en la concreción de sus hitos más importantes.",
    "rubro": "Arquitectura, diseño e ingeniería",
    "direccion": "O'Higgins 3715 - CABA",
    "telefono": "11 5697 5708"
  },
  {
    "slug": "alto-avellaneda-shopping",
    "name": "Alto Avellaneda Shopping",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/alto-avellaneda-shopping.webp",
    "direccion": "Av. Güemes 897 (1870) Avellaneda, Buenos Aires",
    "telefono": "(54 11) 4229-0200",
    "web": "www.altoavellaneda.com.ar",
    "inauguracion": "11 de octubre de 1995",
    "visitas": "948.390",
    "locales": "154"
  },
  {
    "slug": "alto-comahue-shopping",
    "name": "Alto Comahue Shopping",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/alto-comahue-shopping.webp",
    "direccion": "Dr. Ramon y Ruta Provincial N°7 Ciudad de Neuquén, Neuquén",
    "telefono": "(299) 434 0200",
    "web": "www.altocomahue.com.ar",
    "inauguracion": "17 de Marzo de 2015",
    "visitas": "340.643",
    "locales": "111"
  },
  {
    "slug": "alto-noa",
    "name": "Alto NOA",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/alto-noa.webp",
    "direccion": "Av. Virrey Toledo 702 (4400) Salta, Salta",
    "telefono": "(0384) 431-1000",
    "web": "www.altonoa.com.ar",
    "inauguracion": "30 de septiembre de 1994",
    "visitas": "443.000",
    "locales": "83"
  },
  {
    "slug": "alto-palermo",
    "name": "Alto Palermo",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/alto-palermo.webp",
    "direccion": "Santa Fe 3253 (1425) Capital Federal | Buenos Aires",
    "telefono": "(54 11) 5777-8000",
    "web": "www.altopalermo.com.ar",
    "inauguracion": "17 de octubre de 1990",
    "visitas": "1.183.333",
    "locales": "160"
  },
  {
    "slug": "alto-rosario",
    "name": "Alto Rosario",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/alto-rosario.webp",
    "direccion": "Junín 501 (2000) Rosario, Santa Fe",
    "telefono": "(0341) 410-6400",
    "web": "www.alto-rosario.com.ar",
    "inauguracion": "10 de noviembre de 2004",
    "visitas": "710.612",
    "locales": "167"
  },
  {
    "slug": "annuar-shopping",
    "name": "Annuar Shopping",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/annuar-shopping.webp",
    "direccion": "Belgrano 563 San Salvador de Jujuy, Jujuy",
    "telefono": "(54 0388) 423-6178",
    "contacto": "Instagram: @annuarshopping",
    "inauguracion": "14 de octubre de 2009",
    "visitas": "242.000",
    "locales": "67"
  },
  {
    "slug": "appa",
    "name": "Appa",
    "category": "Proveedores de servicios",
    "logo": "/assets/asociados/logos/appa.webp",
    "web": "www.weareappa.com",
    "actividad": "¡appa! es la plataforma lider en fidelización y gestión digital para centros comerciales, diseñada para optimizar la operación y reducir costos. Elimina las filas en stands de promociones y minimiza la necesidad de personal operativo a través de inteligencia artificial para la validación automática de facturas, integra de forma nativa el control de parking y barreras, permitiendo al usuario obtener beneficios mientras que el shopping accede a un ecosistema de insights y data en tiempo real, permitiendo impactar a los clientes mediante canales de comunicación segmentados basados en su comportamiento real de compra.",
    "rubro": "Soluciones tecnológicas",
    "direccion": "Vedia 3892 - CABA",
    "telefono": "54 9 11 6176 1546",
    "contacto": "Sabrina Seguí – ssegui@weareappa.com"
  },
  {
    "slug": "artisdeco",
    "name": "Artisdeco",
    "category": "Proveedores de servicios",
    "logo": "/assets/asociados/logos/artisdeco.webp",
    "web": "artisdeco.com.ar",
    "contacto": "Noelia Nasir – noelia@artisdeco.com.ar",
    "actividad": "Ambientación navideña y seasonal para centros comerciales, grandes espacios, vidrieras, puntos de venta y eventos exclusivos de alto impacto, con más de 18 años en el mercado. Organización integral de eventos llave en mano. Brand Experience, activaciones de marca, acciones promocionales, producción técnica y artística, artistas itinerantes, talleres temáticos.",
    "rubro": "Decoración navideña",
    "telefono": "54 9 11 6440-3288"
  },
  {
    "slug": "atlas-caballito",
    "name": "Atlas Caballito",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/atlas-caballito.webp",
    "direccion": "Av. Rivadavia 5071, CABA",
    "web": "www.atlascines.com",
    "inauguracion": "Febrero 2022"
  },
  {
    "slug": "bahia-blanca-plaza-shopping",
    "name": "Bahía Blanca Plaza Shopping",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/bahia-blanca-plaza-shopping.webp",
    "direccion": "Sarmiento 2153 (8000) Bahía Blanca, Buenos Aires",
    "telefono": "(54 291) 459-4100 / 200",
    "web": "www.bahiablancaplazashopping.com",
    "inauguracion": "18 de noviembre de 1998",
    "locales": "88"
  },
  {
    "slug": "boulevard-shopping",
    "name": "Boulevard Shopping",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/boulevard-shopping.webp",
    "direccion": "Avenida Hipólito Yrigoyen 13298 Adrogué, Buenos Aires",
    "telefono": "(54 11) 4239-1300",
    "web": "www.boulevardshopping.com.ar",
    "inauguracion": "9 de mayo de 1996",
    "locales": "105"
  },
  {
    "slug": "caballito-shopping-center",
    "name": "Caballito Shopping Center",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/caballito-shopping-center.webp",
    "direccion": "Av Rivadavia 5108 (1424) Capital Federal | Buenos Aires",
    "telefono": "(54 11) 5861-8600",
    "web": "www.caballitoshoppingcenter.com",
    "inauguracion": "12 de octubre de 1994",
    "visitas": "190.000",
    "locales": "47"
  },
  {
    "slug": "catan-shopping",
    "name": "Catán Shopping",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/catan-shopping.webp",
    "direccion": "Juan Manuel de Rosas 14.457, Ruta 3 Km. 29, González Catán, Pcia. de Buenos Aires",
    "telefono": "11 6971 4503",
    "web": "www.catanshoppingcenter.com",
    "inauguracion": "11 de Noviembre de 2011",
    "locales": "75"
  },
  {
    "slug": "centros-comerciales-latinoamerica-ccla",
    "name": "Centros comerciales Latinoamérica | CCLA",
    "category": "Proveedores de servicios",
    "logo": "/assets/asociados/logos/centros-comerciales-latinoamerica-ccla.webp",
    "web": "www.cclatinoamerica.com.ar",
    "actividad": "Estudios de factibilidad para el desarrollo de Galerías, Centros Comerciales y Shoppings Centers. Comercialización de locales, espacios para stands y grandes superficies. Auditorías. Control de Calidad en procesos administrativos y comerciales. Reconversión de Espacios Comerciales. Diseño e Implementación de campañas de Marketing. Desarrollo de Programas de Fidelización de clientes.",
    "rubro": "Consultoría y management",
    "direccion": "Roque Ferreyra 1948 - Córdoba - Pcia. de Córdoba",
    "telefono": "54 9 351 522 7657",
    "contacto": "Daniel Coli – ccldaniel.coli@gmail.com"
  },
  {
    "slug": "cinemacenter",
    "name": "Cinemacenter",
    "category": "Retailers",
    "logo": "/assets/asociados/logos/cinemacenter.webp",
    "web": "www.cinemacenter.com.ar",
    "actividad": "Exhibición Cinematográfica"
  },
  {
    "slug": "city-center-rosario",
    "name": "City Center Rosario",
    "category": "Proveedores de servicios",
    "logo": "/assets/asociados/logos/city-center-rosario.webp",
    "web": "www.citycenter-rosario.com.ar",
    "actividad": "Complejo de Entretenimientos conformado por Hotel 5 estrellas de la cadena Accor, Spa, Casino, Centro de Convenciones y diferentes espacios gastronómicos. Emplazado en la ciudad de Rosario, Pcia. de Santa Fe, su acceso se ubica sobre el ingreso sur de la ciudad, llegando por la Autopista desde Buenos Aires.",
    "rubro": "Hotelería, eventos",
    "direccion": "Bv. Oroño y Av. Circunvalación - Rosario - Pcia. de Santa Fe"
  },
  {
    "slug": "clash",
    "name": "Clash",
    "category": "Proveedores de servicios",
    "logo": "/assets/asociados/logos/clash.webp",
    "web": "www.clash.com.ar",
    "contacto": "Juan Marcos Aviano – juan.marcos.aviano@clash.com.ar",
    "actividad": "Clash conecta a centros comerciales con sus visitantes a través de promociones claras, organizadas y visibles. Es una solución integral que profesionaliza la comunicación de los beneficios de los locatarios, centralizándolos en un solo lugar y acompañando al shopping con tecnología, soporte operativo y acciones comerciales. Además, forma parte de un ecosistema donde miles de personas consultan cada mes todas las promociones bancarias y extrabancarias en supermercados, estaciones de servicio y otros rubros clave. Clash permite al centro comercial ganar visibilidad real y conectar con el consumidor justo cuando está buscando dónde aprovechar sus beneficios.",
    "rubro": "Soluciones tecnológicas",
    "direccion": "Rioja 1521 - Rosario - Pcia. de Santa Fe",
    "telefono": "54 9 341 696 7321"
  },
  {
    "slug": "cordoba-shopping",
    "name": "Córdoba Shopping",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/cordoba-shopping.webp",
    "direccion": "José de Goyechea 2851 (5000) Córdoba Córdoba",
    "telefono": "(0351) 420-5001",
    "web": "www.cordobashopping.com.ar",
    "inauguracion": "29 de marzo de 1990",
    "visitas": "382.708",
    "locales": "130"
  },
  {
    "slug": "del-parque-outlet",
    "name": "Del Parque Outlet",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/del-parque-outlet.webp",
    "direccion": "Cuenca 3035, Capital Federal Página Web: www.instagram.com/delparqueoutlet",
    "inauguracion": "15 de Diciembre de 2022",
    "locales": "41"
  },
  {
    "slug": "devoto-shopping",
    "name": "Devoto Shopping",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/devoto-shopping.webp",
    "direccion": "Jose Pedro Varela 4866 (1417) Capital Federal, Buenos Aires",
    "telefono": "(54 11) 4019-6000",
    "web": "www.devotoshopping.com.ar",
    "inauguracion": "29 de noviembre de 2001",
    "visitas": "425.000",
    "locales": "105"
  },
  {
    "slug": "di-desing",
    "name": "Di Design",
    "category": "Proveedores de servicios",
    "logo": "/assets/asociados/logos/di-desing.webp",
    "web": "www.di-design.net",
    "contacto": "Luis Di Virgilio – ldivirgilio@di-design.net",
    "actividad": "Estudio de arquitectura y urbanismo. Posee experiencia internacional en el desarrollo de grandes proyectos, tales como masterplanning, revalorizaciones urbanas, proyectos de usos mixtos, shopping centers, retail, viviendas y oficinas.",
    "rubro": "Arquitectura, diseño e ingeniería",
    "direccion": "Av. Coronel Diaz 2551 piso 8° A - CABA",
    "telefono": "54 9 11 5975 7700"
  },
  {
    "slug": "dino-mall-alto-verde",
    "name": "Dino Mall Alto Verde",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/dinomall_altoverde.webp",
    "direccion": "Rodrigo del Busto 4086 – Córdoba – Pcia. de Córdoba",
    "telefono": "54 351 526 1500",
    "web": "https://dinomall.com.ar/",
    "inauguracion": "Noviembre de 2003",
    "locales": "116"
  },
  {
    "slug": "dino-mall-ruta-20",
    "name": "Dino Mall Ruta 20",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/dinomall-ruta20.webp",
    "direccion": "Av. Fuerza Aérea Argentina 1700 – Córdoba – Pcia. de Córdoba",
    "telefono": "54 351 526 1500",
    "web": "https://dinomall.com.ar/",
    "inauguracion": "Año 2006",
    "locales": "47"
  },
  {
    "slug": "distrito-arcos-premium-outlet",
    "name": "Distrito Arcos Premium Outlet",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/distrito-arcos-premium-outlet.webp",
    "direccion": "Paraguay 4979, Capital Federal",
    "telefono": "(5411) 5789-2700",
    "web": "www.distritoarcos.com.ar",
    "inauguracion": "18 de Diciembre de 2014",
    "visitas": "151.952",
    "locales": "67"
  },
  {
    "slug": "dot-baires-shopping",
    "name": "Dot Baires Shopping",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/dot-baires-shopping.webp",
    "direccion": "Vedia 3626 Capital Federal, Buenos Aires",
    "telefono": "(54 11) 5777-9500",
    "web": "www.dotbairesshopping.com",
    "inauguracion": "13 de Mayo de 2009",
    "visitas": "697.332",
    "locales": "178"
  },
  {
    "slug": "el-solar-shopping",
    "name": "El Solar Shopping",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/el-solar-shopping.webp",
    "direccion": "Arce 940 (1426) Capital Federal, Buenos Aires",
    "telefono": "(54 11) 4778-5000",
    "web": "www.elsolarshopping.com.ar",
    "inauguracion": "21 de septiembre de 1995",
    "visitas": "282.000",
    "locales": "75"
  },
  {
    "slug": "espacio-san-juan-shopping",
    "name": "Espacio San Juan Shopping",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/espacio-san-juan-shopping.webp",
    "direccion": "Av. José Ignacio de la Roza Nro.806 Rivadavia, San Juan",
    "telefono": "2644238611",
    "web": "www.espaciosanjuan.com",
    "inauguracion": "01 de Noviembre de 2014",
    "visitas": "85.000",
    "locales": "54"
  },
  {
    "slug": "etia-charge",
    "name": "Etia charge",
    "category": "Proveedores de servicios",
    "logo": "/assets/asociados/logos/etia-charge.webp",
    "web": "www.etiacharge.com",
    "contacto": "Carlos F. Pratts – cfprats@ETIACHARGE.com",
    "actividad": "Especialistas en el desarrollo de soluciones de carga para vehículos eléctricos y software de gestión de carga inteligente. Su propósito es ofrecer equipos de carga de máxima calidad y construir una red de carga moderna, eficiente y con cobertura nacional, que acompañe el avance de la movilidad eléctrica en la Argentina.",
    "rubro": "Movilidad eléctrica",
    "direccion": "Lafayette 1695 - CABA",
    "telefono": "54 9 11 5664 8836"
  },
  {
    "slug": "euler",
    "name": "Euler",
    "category": "Proveedores de servicios",
    "logo": "/assets/asociados/logos/euler.webp",
    "web": "www.eulerlabs.tech",
    "contacto": "Herman Moldovan – herman@eulerlabs.tech",
    "actividad": "Eulerlabs es una empresa de tecnología dedicada a la medición, análisis y optimización del desempeño de centros comerciales. Brinda soluciones que permiten entender el comportamiento de los visitantes, evaluar la performance de los locales y mejorar la gestión comercial y operativa del shopping, a partir de datos objetivos y confiables. Su plataforma integra información de flujo peatonal, ocupación, permanencia, junto con datos de ventas y contexto, para acompañar la toma de decisiones estratégicas. Cuenta con más de 15 años de experiencia trabajando con shopping centers. Una mirada objetiva para gestionar, auditar y optimizar la performance. Una solución desarrollada específicamente para el negocio de shoppings.",
    "rubro": "Soluciones tecnológicas",
    "direccion": "Conesa 2036 - Piso 2 - CABA",
    "telefono": "54 9 11 6707 8804"
  },
  {
    "slug": "factory-parque-brown",
    "name": "Factory Parque Brown",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/factory-parque-brown.webp",
    "direccion": "Av. Cruz y Escalada (1407) Capital Federal, Buenos Aires",
    "telefono": "(54 11) 4630-4373",
    "web": "www.parquebrown.factoryshopping.com.ar",
    "inauguracion": "8 de diciembre de 1992",
    "visitas": "500.000",
    "locales": "96"
  },
  {
    "slug": "factory-quilmes",
    "name": "Factory Quilmes",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/factory-quilmes.webp",
    "direccion": "Av. Calchaquí 3950 (1878) Quilmes, Buenos Aires",
    "telefono": "(5411) 4229-4000",
    "web": "www.quilmes.factoryshopping.com.ar",
    "inauguracion": "11 de diciembre de 1997",
    "visitas": "900.000",
    "locales": "76"
  },
  {
    "slug": "factory-san-martin",
    "name": "Factory San Martin",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/factory-san-martin.webp",
    "direccion": "San Lorenzo e Industria (1650) San Martín, Buenos Aires",
    "telefono": "(5411) 5789-1600",
    "web": "www.sanmartin.factoryshopping.com.ar",
    "inauguracion": "16 de diciembre de 1994",
    "visitas": "285.000",
    "locales": "37"
  },
  {
    "slug": "fondamenta",
    "name": "Fondamenta",
    "category": "Proveedores de servicios",
    "logo": "/assets/asociados/logos/fondamenta.webp",
    "telefono": "11 5451 9624",
    "web": "www.fondamentaestudio.com",
    "contacto": "Karin Falck – fondamentaestudio@gmail.com",
    "rubro": "Arquitectura, diseño e ingeniería",
    "direccion": "Correa 4775 - 4C - Bo. de Saavedra - CABA",
    "actividad": "Arquitectura comercial estratégica. Diseño y ejecución de locales comerciales."
  },
  {
    "slug": "galerias-pacifico",
    "name": "Galerías Pacifico",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/galerias-pacifico.webp",
    "direccion": "San Martín 768 (1004) Capital Federal, Buenos Aires",
    "telefono": "(54 11) 5555-5410",
    "web": "www.galeriaspacifico.com.ar",
    "inauguracion": "18 de mayo de 1992",
    "visitas": "420.000",
    "locales": "120"
  },
  {
    "slug": "hiper-chango-mas",
    "name": "Hiper Chango Más",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/hiper-chango-mas.webp",
    "direccion": "Av. de los Constituyentes 6020 – CABA",
    "telefono": "0810-444-9256",
    "web": "www.masonline.com.ar",
    "inauguracion": "16 de mayo de 1996",
    "visitas": "100.000",
    "locales": "26"
  },
  {
    "slug": "ie-inteligencia-energetica",
    "name": "IE - Inteligencia Energética",
    "category": "Proveedores de servicios",
    "rubro": "Arquitectura, diseño e ingeniería",
    "logo": "/assets/asociados/logos/ie-inteligencia-energetica.webp",
    "direccion": "Espinosa 506 - Piso 5, Of. 11 - CABA / Calle Los Talas N° 475, Bo. La Arbolada, Sinsacate - Pcia. Córdoba",
    "telefono": "54 9 11 5306 6155",
    "contacto": "Adrián Tommasi – adrian@inteligenciaenergetica.com.ar",
    "web": "www.inteligenciaenergetica.com.ar",
    "actividad": "Ingenieros de distintas ramas especializados en eficiencia energética y sustentabilidad aplicada a industrias, empresas y grandes consumidores. Brinda soluciones de Gestión Energética, Medioambiental y Estratégica, acordes a la necesidad de cada cliente, implementando herramientas de gestión basadas en la mejora continua con estándares world class."
  },
  {
    "slug": "interurban",
    "name": "Interurban",
    "category": "Proveedores de servicios",
    "rubro": "Consultoría y management",
    "logo": "/assets/asociados/logos/interurban.webp",
    "direccion": "Dardo Rocha 986 - San Isidro - Pcia. de Buenos Aires",
    "telefono": "4812 1011 / 0148",
    "contacto": "Ignacio Nieves Piazza – INP@interurban.com.ar",
    "web": "www.interurban.com.ar",
    "actividad": "Asesoramiento, planificación, desarrollo y comercialización de ecosistemas comerciales en Argentina y otros países. Desarrolla y potencia espacios estratégicos de alto impacto, adaptándose a las dinámicas del mercado y a las necesidades de cada proyecto. Su visión va más allá de la comercialización: diseña destinos y potencia negocios, asegurando que cada proyecto alcance su máximo potencial."
  },
  {
    "slug": "la-barraca-mall",
    "name": "La Barraca Mall",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/la-barraca-mall.webp",
    "direccion": "Las Cañas 1833 - (5519) Guaymallén - Pcia. de Mendoza",
    "telefono": "0261 804 2400",
    "web": "https://www.cioffigrupo.com/labarracamall",
    "inauguracion": "Mayo 2013",
    "visitas": "30.000",
    "locales": "104"
  },
  {
    "slug": "lubeca-tech",
    "name": "Lubeca Tech",
    "category": "Proveedores de servicios",
    "rubro": "Soluciones tecnológicas",
    "logo": "/assets/asociados/logos/lubeca.webp",
    "direccion": "José Henry 5292 - Córdoba Capital",
    "telefono": "351 514 8330",
    "contacto": "Renato Schmitt – rschmitt@lubeca.tech",
    "web": "www.lubeca.tech",
    "actividad": "Inteligencia de ventas para tu Shopping Mall. Centraliza y analiza la información de ventas de todos los locales de un Centro Comercial en tiempo real, sin intervenir en sus sistemas de facturación."
  },
  {
    "slug": "maschwitz-mall",
    "name": "Maschwitz Mall",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/maschwitz-mall.webp",
    "direccion": "Santiago del Estero 690 Panamericana Km 42,5 Maschwitz, Escobar, Bs. As.",
    "telefono": "(54 03488) 447900",
    "web": "www.maschwitzmall.com.ar",
    "inauguracion": "Septiembre de 2008",
    "visitas": "34.500",
    "locales": "54"
  },
  {
    "slug": "mcdonalds",
    "name": "McDonald's",
    "category": "Retailers",
    "logo": "/assets/asociados/logos/mcdonalds.webp",
    "web": "www.mcdonalds.com.ar",
    "actividad": "Empresa de comidas rápidas (Fast Food)."
  },
  {
    "slug": "mdv-lights",
    "name": "MDV Lights",
    "category": "Proveedores de servicios",
    "rubro": "Arquitectura, diseño e ingeniería",
    "logo": "/assets/asociados/logos/mdv-lights.webp",
    "telefono": "54 9 11 6264 2232",
    "contacto": "Paolo Dippo – pdippo@mdvlights.com",
    "web": "www.mdvlights.com",
    "actividad": "Más de 13 años liderando el mercado de la iluminación, aprovechando los avances tecnológicos para introducir y promover la tecnología LED. Soluciones integrales de mayor eficiencia, que van desde la asesoría y planeación, incluyendo la fabricación, importación, entrega e implementación de proyectos y servicios con tecnología de vanguardia, creando un modelo integral de servicio en cuanto a garantía, soporte y acompañamiento permanente."
  },
  {
    "slug": "mendoza-shopping",
    "name": "Mendoza Shopping",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/mendoza-shopping.webp",
    "direccion": "Av. Acceso Este 3280 (5521) Guaymallén, Mendoza",
    "telefono": "(0261) 449-0100",
    "web": "www.mendozaplazashopping.com",
    "inauguracion": "3 de diciembre de 1992",
    "visitas": "695.387",
    "locales": "162"
  },
  {
    "slug": "negozona",
    "name": "Negozona",
    "category": "Proveedores de servicios",
    "rubro": "Consultoría y management",
    "logo": "/assets/asociados/logos/negozona.webp",
    "direccion": "Carlos Pelegrini 781 - Piso 7 - CABA",
    "telefono": "54 911 3641 7771",
    "contacto": "Francisco Bastard – fbastard@negozona.com",
    "web": "www.negozona.com",
    "actividad": "NEGOZONA genera un ámbito adecuado y exclusivamente pensado para el encuentro de vendedores, compradores, potenciales inversores, brokers, comercializadores de fondos de comercios, franquiciantes, franquiciados y todos aquellos que tengan interés en identificar y analizar oportunidades de negocios. Procura brindarles las mejores condiciones para encontrar en NegoZona las alternativas, información y soporte que los ayuden y les hagan posible la concreción de transacciones de compraventa de negocios y franquicias."
  },
  {
    "slug": "neverland",
    "name": "Neverland",
    "category": "Retailers",
    "logo": "/assets/asociados/logos/neverland.webp",
    "web": "www.neverland.com.ar",
    "actividad": "Neverland es la cadena de parques de diversiones indoor líder de Argentina, con más de 40 años de trayectoria desarrollando experiencias de entretenimiento. Un modelo de gestión de clase mundial y una visión estratégica de expansión, innovación y calidad proyectaron el crecimiento y el desarrollo de la compañía; hoy con más de 30 parques ubicados en las ciudades más importantes del país y 3 millones de personas que la visitan cada año."
  },
  {
    "slug": "nine-shopping",
    "name": "Nine Shopping",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/nine-shopping.webp",
    "direccion": "Av. Victorica 1128 (1744) Moreno, Buenos Aires",
    "telefono": "(54 237) 463-7100",
    "web": "www.nineshopping.com",
    "inauguracion": "19 de diciembre de 2001",
    "visitas": "600.000",
    "locales": "104"
  },
  {
    "slug": "norcenter-lifestyle-mall",
    "name": "Norcenter Lifestyle Mall",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/norcenter-lifestyle-mall.webp",
    "direccion": "Esteban Echeverría 3750 Vicente López, Buenos Aires",
    "telefono": "(54 11) 4721-3000",
    "web": "www.norcenter.com",
    "inauguracion": "Noviembre 2007",
    "visitas": "300.000",
    "locales": "120"
  },
  {
    "slug": "nordelta-centro-comercial",
    "name": "Nordelta Centro Comercial",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/nordelta-centro-comercial.webp",
    "direccion": "Av. de los Lagos 7008 (1670) Tigre, Buenos Aires",
    "telefono": "(54 11) 4871-5555",
    "web": "www.nordeltacc.com.ar",
    "inauguracion": "01 de diciembre de 2004",
    "locales": "90"
  },
  {
    "slug": "nuevo-quilmes-plaza",
    "name": "Nuevo Quilmes Plaza",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/nuevo-quilmes-plaza.webp",
    "direccion": "Avenida Caseros 1750 Don Bosco, Partido de Quilmes, Buenos Aires",
    "web": "www.nuevoquilmesplaza.com",
    "inauguracion": "28 de Septiembre de 2022",
    "visitas": "120.000",
    "locales": "99"
  },
  {
    "slug": "nuevocentro-shopping",
    "name": "Nuevocentro Shopping",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/nuevocentro-shopping.webp",
    "direccion": "Duarte Quirós 1400 (5000) Córdoba. Córdoba",
    "telefono": "(54 351) 482-8351/352",
    "web": "www.nuevocentro.com.ar",
    "inauguracion": "10 de septiembre de 1990",
    "visitas": "700.000",
    "locales": "133"
  },
  {
    "slug": "nuova-suite",
    "name": "Nuova Suite",
    "category": "Proveedores de servicios",
    "logo": "/assets/asociados/logos/nuova-suite.webp",
    "web": "www.nuovasuite.com",
    "contacto": "Gustavo Menicillo – Gustavo@nuovasuite.com",
    "actividad": "Nuova Suite ofrece un portafolio de licencias SaaS modulares que integran en una sola plataforma la gestión de contenidos, campañas y programas de fidelización para clientes y marcas. A través del ecosistema conformado por los módulos Creator, Rewards, Wallet, Gift Card y Audit, permite crear experiencias digitales personalizadas, administrar billeteras y tarjetas regalo, realizar auditorías virtuales con inteligencia artificial e integrar sistemas de estacionamiento. Una solución integral, personalizable y eficiente para fortalecer la conexión entre el Shopping, sus marcas y sus visitantes.",
    "rubro": "Soluciones tecnológicas",
    "telefono": "54 9 11 3385 4444"
  },
  {
    "slug": "operafun",
    "name": "OperaFun",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/operafun.webp",
    "direccion": "Av. San Martín 625 esq. Moreno Villa Carlos Paz – Córdoba",
    "telefono": "54 9 3512 53-6761",
    "web": "www.operafun.com.ar",
    "inauguracion": "19 de diciembre de 2019",
    "locales": "59"
  },
  {
    "slug": "osdawash",
    "name": "Osdawash",
    "category": "Proveedores de servicios",
    "rubro": "Limpieza y mantenimiento de edificios",
    "logo": "/assets/asociados/logos/osdawash.webp",
    "direccion": "Juramento 1694 - Piso 1, Depto. \"D\" - CABA",
    "telefono": "54 911 5415 9033",
    "contacto": "María Schmidt – marielas@osdawash.com",
    "web": "www.osdawash.com",
    "actividad": "Empresa joven dedicada a proveer soluciones integrales de limpieza y mantenimiento."
  },
  {
    "slug": "owismart",
    "name": "Owismart",
    "category": "Proveedores de servicios",
    "rubro": "Soluciones tecnológicas",
    "logo": "/assets/asociados/logos/owismart.webp",
    "direccion": "Av. Jujuy 2156, Piso 3, Distrito Tecnológico - CABA",
    "telefono": "54 11 2453 6336",
    "contacto": "Guillermo Loureiro – gloureiro@owibot.com",
    "web": "www.site.owismart.com",
    "actividad": "OWISMART es una plataforma de automatización conversacional impulsada por inteligencia artificial que ayuda a las empresas a optimizar la atención al cliente, las ventas y los procesos internos a través de WhatsApp y otros canales digitales. La solución integra agentes inteligentes con los sistemas de gestión de cada organización, permitiendo brindar respuestas automáticas, ejecutar procesos de negocio, reducir costos operativos y mejorar la experiencia del cliente. Su arquitectura escalable posibilita implementar soluciones tanto para empresas individuales como para grandes organizaciones y redes de franquicias o sucursales."
  },
  {
    "slug": "palmares-mall",
    "name": "Palmares Mall",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/palmares-mall.webp",
    "direccion": "Av San Martin Sur 2875 Godoy Cruz – Mendoza",
    "telefono": "261 3481200",
    "web": "www.palmares.com.ar",
    "inauguracion": "16 de noviembre de 1995",
    "visitas": "1.000.000",
    "locales": "133"
  },
  {
    "slug": "palmas-del-pilar",
    "name": "Palmas del Pilar",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/palmas-del-pilar.webp",
    "direccion": "Panamericana Km. 50, Ramal Pilar (1629) Pilar Buenos Aires",
    "telefono": "(54 2322) 47-4000",
    "web": "www.palmasdelpilar.com.ar",
    "inauguracion": "29 de noviembre de 1998",
    "visitas": "650.000",
    "locales": "154"
  },
  {
    "slug": "parque-avellaneda-shopping",
    "name": "Parque Avellaneda Shopping",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/parque-avellaneda-shopping.webp",
    "direccion": "Autopista Buenos Aires – La Plata Km. 9 (1872) Sarandí – Avellaneda, Buenos Aires",
    "telefono": "(54 11) 4115 – 1172",
    "web": "www.parqueavellanedashopping.com.ar",
    "inauguracion": "1 de noviembre de 1998",
    "visitas": "73.000",
    "locales": "78"
  },
  {
    "slug": "parque-comercial-quilmes",
    "name": "Parque Comercial Quilmes",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/parque-comercial-quilmes.webp",
    "direccion": "Av. Calchaquí y Rodolfo López (1878) Quilmes, Buenos Aires",
    "telefono": "(5411) 4309-5533",
    "inauguracion": "23 de octubre de 2001",
    "locales": "14"
  },
  {
    "slug": "paseo-champagnat",
    "name": "Paseo Champagnat",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/paseo-champagnat.webp",
    "direccion": "Panamericana Km 54,5 – Ramal Pilar (1629) Pilar, Buenos Aires",
    "telefono": "02322-374300",
    "web": "www.paseochampagnat.com.ar",
    "inauguracion": "08 de Diciembre de 2010",
    "visitas": "315.000",
    "locales": "73"
  },
  {
    "slug": "paseo-de-la-patagonia-shopping-center",
    "name": "Paseo de la Patagonia Shopping Center",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/paseo-de-la-patagonia-shopping-center.webp",
    "direccion": "Antártida Argentina 1111 Neuquén, Neuquén",
    "telefono": "(54 299) 4471542",
    "web": "www.paseodelapatagonia.com.ar",
    "inauguracion": "18 de diciembre de 2012",
    "locales": "47"
  },
  {
    "slug": "paseo-del-fuego-shopping",
    "name": "Paseo del Fuego Shopping",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/paseo-del-fuego-shopping.webp",
    "direccion": "Perito Francisco Moreno 1460 Ushuaia, Tierra del Fuego",
    "telefono": "54 2901 442600",
    "web": "www.paseodelfuego.com.ar",
    "inauguracion": "14 de diciembre de 2011",
    "visitas": "153.000",
    "locales": "82"
  },
  {
    "slug": "paseo-del-jockey",
    "name": "Paseo del Jockey",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/paseo-del-jockey.webp",
    "direccion": "Bv. Elías Yofre 1050 - (5000) Córdoba - Pcia. de Córdoba",
    "telefono": "0351 554 0315",
    "web": "www.paseodeljockey.com",
    "inauguracion": "18 de mayo de 2017",
    "visitas": "185.200",
    "locales": "303"
  },
  {
    "slug": "paseo-libertad-lugones",
    "name": "Paseo Libertad Lugones",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/paseo-libertad-lugones.webp",
    "direccion": "Fray Luis Beltrán y Cardeñosa (5008) Barrio Poeta Lugones, Córdoba",
    "telefono": "(54 351) 474-7290 / 91",
    "web": "www.paseolugones.com.ar",
    "inauguracion": "23 de Octubre de 1995",
    "visitas": "568.212",
    "locales": "176"
  },
  {
    "slug": "paseo-libertad-rivera",
    "name": "Paseo Libertad Rivera",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/paseo-libertad-rivera.webp",
    "direccion": "Ricardo Rojas y Boderau (5147) Villa Rivera Indarte, Córdoba",
    "telefono": "(54 3543) 40-2509",
    "web": "www.paseoriveraindarte.com.ar",
    "inauguracion": "29 de agosto de 2008",
    "visitas": "217.854",
    "locales": "78"
  },
  {
    "slug": "paseo-libertad-salta",
    "name": "Paseo Libertad Salta",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/paseo-libertad-salta.webp",
    "direccion": "Av. Tavella y Av. Ex Combatientes de Malvinas Rotonda Limache, Salta Capital",
    "telefono": "(0387) 4269700",
    "web": "www.paseosalta.com.ar",
    "inauguracion": "23 de junio de 2000",
    "visitas": "352.615",
    "locales": "92"
  },
  {
    "slug": "paseo-libertad-san-juan",
    "name": "Paseo Libertad San Juan",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/paseo-libertad-san-juan.webp",
    "direccion": "Scalabrini Ortiz y Av. Circunvalación San Juan",
    "telefono": "(54 264) 429-2207",
    "web": "www.paseosanjuan.com.ar",
    "inauguracion": "29 de septiembre de 1999",
    "visitas": "353.255",
    "locales": "108"
  },
  {
    "slug": "paseo-pilar",
    "name": "Paseo Pilar",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/paseo-pilar.webp",
    "direccion": "Panamericana Km 44 – Ramal Pilar (1629) Del Viso, Pilar, Buenos Aires",
    "telefono": "02320 – 657065",
    "web": "www.paseopilar.com",
    "inauguracion": "01 de Abril de 2006",
    "visitas": "250.000",
    "locales": "37"
  },
  {
    "slug": "paso-del-bosque",
    "name": "Paso del Bosque",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/paso-del-bosque.webp",
    "direccion": "Av. Sorrento 7000 y Av. de Circunvalación, (2000) Rosario, Pcia. de Santa Fe",
    "telefono": "0341-679-3035",
    "web": "www.pasodelbosque.com.ar",
    "inauguracion": "29 de agosto 2018",
    "locales": "77"
  },
  {
    "slug": "paso-del-parana",
    "name": "Paso del Paraná",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/paso-del-parana.webp",
    "direccion": "Corrientes 687 - Paraná - Pcia. de Entre Ríos",
    "telefono": "0343 534 3685",
    "contacto": "Instagram: @pasodelparana",
    "visitas": "180.000",
    "locales": "67"
  },
  {
    "slug": "patio-bullrich",
    "name": "Patio Bullrich",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/patio-bullrich.webp",
    "direccion": "Libertador 750 (1011) Capital Federal, Buenos Aires",
    "telefono": "(54 11) 4814-7400",
    "web": "www.shoppingbullrich.com.ar",
    "inauguracion": "15 de septiembre de 1988",
    "visitas": "243.273",
    "locales": "101"
  },
  {
    "slug": "patio-olmos",
    "name": "Patio Olmos",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/patio-olmos.webp",
    "direccion": "Boulevard San Juan y Vélez Sarsfield (5000) Córdoba Córdoba",
    "telefono": "(54 351) 570-4100 / 4200",
    "web": "www.patioolmos.com",
    "inauguracion": "5 de mayo de 1995",
    "visitas": "600.000",
    "locales": "152"
  },
  {
    "slug": "pfz-arqs",
    "name": "PFZ Arqs.",
    "category": "Proveedores de servicios",
    "rubro": "Arquitectura, diseño e ingeniería",
    "logo": "/assets/asociados/logos/pfz-arquitectos.webp",
    "direccion": "Franklin Roosevelt 2318 - Piso 1 - CABA",
    "telefono": "54 11 7396 7002",
    "contacto": "Juan Pfeifer – jpfeifer@pfzarquitectos.com.ar",
    "web": "www.pfzarquitectos.com.ar",
    "actividad": "Estudio de arquitectura especializado en proyectos de usos mixtos, transporte, centros comerciales, de entretenimiento, hoteles y oficinas."
  },
  {
    "slug": "plaza-liniers-shopping",
    "name": "Plaza Liniers Shopping",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/plaza-liniers-shopping.webp",
    "direccion": "Ramón L. Falcon 7115 (1408) Capital Federal, Buenos Aires",
    "telefono": "(54 11) 5611-1000",
    "web": "www.plazaliniers.com.ar",
    "inauguracion": "29 de noviembre de 1990",
    "visitas": "750.000",
    "locales": "69"
  },
  {
    "slug": "plaza-oeste",
    "name": "Plaza Oeste",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/plaza-oeste.webp",
    "direccion": "Av. Brig. Gral. Juan Manuel de Rosas 658 (1708) Morón, Buenos Aires",
    "telefono": "(011) 4733-2365",
    "web": "www.plaza-oeste.com.ar",
    "inauguracion": "10 de junio de 1997",
    "visitas": "500.000",
    "locales": "135"
  },
  {
    "slug": "pocito-mall",
    "name": "Pocito Mall",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/pocito-mall.webp",
    "direccion": "Av. Vélez Sarsfield 1100 – Córdoba",
    "web": "www.grupoproaco.com/emprendimientos/pocito",
    "inauguracion": "Proyecto en ejecución"
  },
  {
    "slug": "portal-escobar",
    "name": "Portal Escobar",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/portal-escobar.webp",
    "direccion": "Panamericana Km. 50 Ramal Escobar (1625) Escobar, Buenos Aires",
    "telefono": "(011) 5050-3712",
    "web": "www.portal-escobar.com.ar",
    "inauguracion": "24 de febrero de 2000",
    "visitas": "250.000",
    "locales": "25"
  },
  {
    "slug": "portal-lomas",
    "name": "Portal Lomas",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/portal-lomas.webp",
    "direccion": "Av. Antártida Argentina y Frías (1832) Lomas de Zamora, Buenos Aires",
    "telefono": "(54 11) 4239-8500",
    "web": "www.portallomas.com.ar",
    "inauguracion": "30 de Noviembre de 1993",
    "visitas": "320.000",
    "locales": "52"
  },
  {
    "slug": "portal-los-andes",
    "name": "Portal Los Andes",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/portal-los-andes.webp",
    "direccion": "General Balcarce 897 (5501) Godoy Cruz, Mendoza",
    "telefono": "(0261) 441-0380",
    "web": "www.portallosandes.com.ar",
    "inauguracion": "29 de noviembre de 2001",
    "visitas": "320.000",
    "locales": "44"
  },
  {
    "slug": "portal-palermo",
    "name": "Portal Palermo",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/portal-palermo.webp",
    "direccion": "Av. Int. Bullrich y Cerviño (1425) Capital Federal, Buenos Aires",
    "telefono": "(54 11) 4778-8000",
    "web": "www.portalpalermo.com.ar",
    "inauguracion": "04 de Octubre de 1996",
    "visitas": "28.000",
    "locales": "43"
  },
  {
    "slug": "portal-patagonia",
    "name": "Portal Patagonia",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/portal-patagonia.webp",
    "direccion": "J. J. Lastra 2400 (8300) Neuquén, Neuquén",
    "telefono": "(0299) 449-3182",
    "web": "www.portalpatagonia.com.ar",
    "inauguracion": "29 de noviembre de 2000",
    "visitas": "350.000",
    "locales": "89"
  },
  {
    "slug": "portal-rosario",
    "name": "Portal Rosario",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/portal-rosario.webp",
    "direccion": "Nansen 323 (2000) Rosario, Santa Fe",
    "telefono": "(54 341) 409-7200",
    "web": "www.portalrosario.com.ar",
    "inauguracion": "7 de octubre de 2004",
    "visitas": "250.000",
    "locales": "150"
  },
  {
    "slug": "portal-salta",
    "name": "Portal Salta",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/portal-salta.webp",
    "direccion": "20 de Febrero 1437 Salta Capital, Provincia de Salta",
    "telefono": "(0387) 416-2192",
    "web": "www.portalsalta.com.ar",
    "inauguracion": "01 de Octubre de 2012",
    "visitas": "235.000",
    "locales": "52"
  },
  {
    "slug": "portal-santiago",
    "name": "Portal Santiago",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/portal-santiago.webp",
    "direccion": "Av. Rivadavia 4200 Santiago del Estero Capital, Pcia. Santiago del Estero",
    "telefono": "(0385) 42-10478",
    "web": "www.portalsantiago.com.ar",
    "inauguracion": "01 de Septiembre de 2014",
    "visitas": "200.000",
    "locales": "43"
  },
  {
    "slug": "portal-trelew",
    "name": "Portal Trelew",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/portal-trelew.webp",
    "direccion": "Josiah Williams 209 Trelew, Pcia. Chubut",
    "telefono": "(0280) 463-3559",
    "web": "www.portaltrelew.com.ar",
    "inauguracion": "28 de Febrero de 2010",
    "visitas": "200.000",
    "locales": "57"
  },
  {
    "slug": "portal-tucuman",
    "name": "Portal Tucuman",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/portal-tucuman.webp",
    "direccion": "Fermín Cariola 42 (4107) Yerba Buena, Tucumán",
    "telefono": "(0381) 447-1892",
    "web": "www.tucumanshopping.com.ar",
    "inauguracion": "14 de junio de 2007",
    "visitas": "300.000",
    "locales": "90"
  },
  {
    "slug": "proyeco",
    "name": "Proyeco",
    "category": "Proveedores de servicios",
    "rubro": "Arquitectura, diseño e ingeniería",
    "logo": "/assets/asociados/logos/proyeco.webp",
    "direccion": "Arenales 1662, 6º B - CABA",
    "telefono": "54 911 2872 0244",
    "contacto": "María Ramos Rodríguez – mramos@proyeco.es",
    "web": "www.proyeco.es",
    "actividad": "Soluciones integradas en Consultoría, Project Management, Ingeniería, Urbanismo, Arquitectura, Concesiones, Construction Management, Energía y Medioambiente, tanto en proyectos de Obra Civil como en Edificación."
  },
  {
    "slug": "puerto-plaza",
    "name": "Puerto Plaza",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/puerto-plaza.webp",
    "direccion": "Remolcador Meteoro N°250-Dique 2 Puerto de Santa Fe, Pcia. de Santa Fe",
    "telefono": "0342-4547966",
    "web": "www.puertoplaza.com.ar",
    "inauguracion": "Octubre 2020",
    "visitas": "22.000",
    "locales": "36"
  },
  {
    "slug": "recoleta-urban-mall",
    "name": "Recoleta Urban Mall",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/recoleta-urban-mall.webp",
    "direccion": "Vicente López 2050 (1127) Capital Federal, Buenos Aires",
    "telefono": "(54 11) 4808-0605",
    "web": "www.recoletamall.com.ar",
    "inauguracion": "28 de Septiembre de 2011",
    "visitas": "365.000",
    "locales": "70"
  },
  {
    "slug": "remeros-plaza",
    "name": "Remeros Plaza",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/remeros-plaza.webp",
    "direccion": "Ruta 27 y Camino de los Remeros, Rincón de Milberg (1624) Tigre, Provincia de Buenos Aires",
    "telefono": "(54 11) 5197-9651",
    "web": "www.remerosplaza.com.ar",
    "inauguracion": "Año 2015"
  },
  {
    "slug": "rentaled",
    "name": "RentaLED",
    "category": "Proveedores de servicios",
    "rubro": "Medios publicitarios",
    "logo": "/assets/asociados/logos/rentaled.webp",
    "direccion": "Suipacha 745 - Piso 4 - CABA",
    "telefono": "54 911 4980 9941",
    "contacto": "Javier Salomón – javier.salomon@ibexamedia.com",
    "web": "www.ibexamedia.com",
    "actividad": "18 años en el mercado. Expertos en alquiler de pantallas LED y servicios de sonido e iluminación para eventos corporativos, conciertos y festivales. Equipo técnico altamente capacitado. Diseñadores y editores de video que genera contenido visual personalizado y atractivo. Última tecnología, sonido envolvente e iluminación dinámica. Instalación completa y monitoreo en tiempo real."
  },
  {
    "slug": "retailcheck",
    "name": "Retailcheck",
    "category": "Proveedores de servicios",
    "rubro": "Soluciones tecnológicas",
    "logo": "/assets/asociados/logos/retailcheck.webp",
    "direccion": "B. Viejo Tonel P. 14° - Maipú - Pcia. de Mendoza",
    "telefono": "54 9261 538 2685",
    "contacto": "Daniel Gargantini – daniel.gargantini@remaco.cl",
    "web": "https://retailcheck.net/",
    "actividad": "Solución en Mediciones de Flujo de Público, permitiendo mejorar la gestión y producción en distintos ámbitos, sean estos comerciales, eventos deportivos, culturales, públicos, privados etc., permitiendo desarrollar y hacer seguimientos de distintos indicadores tales como Ratio de Conversión, Permanencia de Tiempo, Circulación de Público en zonas específicas, Ticket Promedio, Ventas por mts2, entre otros."
  },
  {
    "slug": "retco",
    "name": "Retco",
    "category": "Proveedores de servicios",
    "rubro": "Consultoría y management",
    "logo": "/assets/asociados/logos/retco.webp",
    "direccion": "Larrea 390 - 2° Piso - San Isidro - Pcia. Buenos Aires",
    "telefono": "54 9 11 8059 0428",
    "contacto": "Martín Malara – mmalara@retco.com.ar",
    "web": "www.retco.com.ar",
    "actividad": "Grupo interdisciplinario de profesionales con sólida experiencia en el mercado de centros comerciales y retail, lo que le permite brindar el mejor asesoramiento en la conceptualización, desarrollo, construcción, comercialización, operación y administración de shoppings. Desde el estudio de prefactibilidad y viabilidad de un proyecto nuevo, hasta la puesta en marcha de un centro comercial, acompaña a los clientes en la concreción de sus objetivos. Su especialización también le permite intervenir shoppings en funcionamiento y actuar como consultora integral de las distintas áreas que componen dicho negocio, como así también asesorar cadenas de retail."
  },
  {
    "slug": "ribera-shopping",
    "name": "Ribera Shopping",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/ribera-shopping.webp",
    "direccion": "Dique I – Puerto Santa Fe Santa Fe",
    "telefono": "(0342) 471-1100",
    "web": "www.riberashopping.com.ar",
    "inauguracion": "15 de Octubre de 2008",
    "visitas": "200.000",
    "locales": "81"
  },
  {
    "slug": "rm-consultoria",
    "name": "RM Consultoría",
    "category": "Proveedores de servicios",
    "rubro": "Consultoría y management",
    "logo": "/assets/asociados/logos/rodolfo-mercado-consultor.webp",
    "direccion": "Virrey del Pino 3141 - Piso 2 - CABA",
    "telefono": "54 911 4086 6860",
    "contacto": "Rodolfo Mercado – Rmercadoconsultor@gmail.com",
    "web": "www.rmconsultores.com.ar",
    "actividad": "Especialista en planeamiento de Shopping Centers, Áreas Comerciales y urbanismo comercial, con trayectoria en servicios de creación de valor B2B para retail, franquicias y real estate. Evalúa y desarrolla herramientas de Inteligencia en Shopping Centers."
  },
  {
    "slug": "san-justo-shopping",
    "name": "San Justo Shopping",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/san-justo-shopping.webp",
    "direccion": "Juan Manuel de Rosas 3910 (1754) San Justo, Buenos Aires",
    "telefono": "(5411) 4480-2800",
    "web": "www.sanjustoshopping.com.ar",
    "inauguracion": "02 de Diciembre de 2009",
    "visitas": "600.000",
    "locales": "92"
  },
  {
    "slug": "shopping-del-siglo",
    "name": "Shopping del Siglo",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/shopping-del-siglo.webp",
    "direccion": "Presidente Roca N° 848, Rioja 1640 Cordoba !643, Rosario, Santa Fe",
    "telefono": "0341- 4218561",
    "web": "www.shoppingdelsiglo.com",
    "inauguracion": "9 de marzo de 1995",
    "visitas": "480.000",
    "locales": "86"
  },
  {
    "slug": "soleil-premium-outlet",
    "name": "Soleil Premium Outlet",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/soleil-premium-outlet.webp",
    "direccion": "Bernardo de Irigoyen 2647 (1609) Boulogne, Buenos Aires",
    "telefono": "(5411) 4007-2500",
    "web": "www.soleilpremiumoutlet.com.ar",
    "inauguracion": "16 de octubre de 1987",
    "visitas": "401.182",
    "locales": "89"
  },
  {
    "slug": "solutions-malls",
    "name": "Solutions malls",
    "category": "Proveedores de servicios",
    "logo": "/assets/asociados/logos/solutions-malls.webp",
    "web": "www.solutionsmalls.com",
    "actividad": "Centraliza la operación del centro comercial y plazas comerciales en una plataforma única: administración de contratos, registro y análisis de ventas, facturación y cobranza, documentación y comunicación digital con cada locatario. El resultado: menos planillas, más control, información confiable para decidir y procesos operativos más rápidos.",
    "rubro": "Soluciones administrativas",
    "direccion": "Rivadeo 1570 - Córdoba - Pcia. Córdoba",
    "telefono": "54 351 590 0844",
    "contacto": "Ariel Cogote – acogote@solutionsmalls.com.ar"
  },
  {
    "slug": "tablada-shopping",
    "name": "Tablada Shopping",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/tablada-shopping.webp",
    "direccion": "Av. Crovara 4500 (1766) Tablada, La Matanza, Buenos Aires",
    "telefono": "(5411) 4115-1172/1178",
    "inauguracion": "01 de noviembre de 2000",
    "visitas": "43.333",
    "locales": "34"
  },
  {
    "slug": "terrazas-de-mayo-shopping",
    "name": "Terrazas de Mayo Shopping",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/terrazas-de-mayo-shopping.webp",
    "direccion": "(RN08) Pres. Arturo Illia 3770 esq. (R202) Gral. Juan G. Lemos 3650, Malvinas Argentinas, Buenos Aires",
    "web": "www.terrazasdemayo.com.ar",
    "inauguracion": "04 de diciembre de 2014",
    "visitas": "5.106.000",
    "locales": "94"
  },
  {
    "slug": "tortugas-open-mall",
    "name": "Tortugas Open Mall",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/tortugas-open-mall.webp",
    "direccion": "Panamericana Km 37 Ramal Pilar Buenos Aires",
    "telefono": "2152-4200",
    "web": "www.tortugasopenmall.com",
    "inauguracion": "03 de noviembre de 2010",
    "visitas": "650.000",
    "locales": "173"
  },
  {
    "slug": "toscas-shopping",
    "name": "Toscas Shopping",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/toscas-shopping.webp",
    "direccion": "Formosa 653 Ezeiza, Buenos Aires",
    "web": "www.lastoscascanning.com.ar",
    "inauguracion": "18 de Diciembre de 2008",
    "visitas": "600.000",
    "locales": "70"
  },
  {
    "slug": "unicenter",
    "name": "Unicenter",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/unicenter.webp",
    "direccion": "Paraná 3745 (1640) Martínez, Buenos Aires",
    "telefono": "(5411) 4733-1111",
    "web": "www.unicenter.com.ar",
    "inauguracion": "12 de octubre de 1988",
    "visitas": "1.400.000",
    "locales": "329"
  },
  {
    "slug": "wiki-biz",
    "name": "Wiki Biz",
    "category": "Proveedores de servicios",
    "logo": "/assets/asociados/logos/wiki-biz.webp",
    "web": "www.wikibiz.us",
    "contacto": "Gustavo Menicillo – gustavo@wikibiz.us",
    "actividad": "Wiki Biz es una agencia de marketing integral que combina estrategia, creatividad, tecnología y ejecución para diseñar experiencias eficientes y memorables. Ofrece soluciones que van desde la planificación estratégica y la generación de contenidos hasta la gestión de campañas, desarrollo digital, activaciones, programas de fidelización e implementación de ecosistemas integrados con plataformas digitales y automatizaciones.",
    "rubro": "Soluciones tecnológicas",
    "telefono": "54 9 11 3385 4444"
  },
  {
    "slug": "xperts-consultores",
    "name": "Xperts Consultores",
    "category": "Proveedores de servicios",
    "rubro": "Soluciones tecnológicas",
    "logo": "/assets/asociados/logos/xperts-consultores.webp",
    "direccion": "Ugarte 2341 - CABA",
    "telefono": "54 911 6590 9100",
    "contacto": "Rodrigo Leivas – rodrigo@xperts.com.ar",
    "web": "www.xperts.com.ar",
    "actividad": "Equipo de ingenieros con más de 15 años de experiencia en el mercado de telecomunicaciones y IT, brindando soluciones tecnológicas a la problemática de operación de las empresas. Se especializa en servicios tales como: Plataforma Guess WiFi y WiFi Marketing, Consultoría IoT y ICT, Assessment Tecnológico, Sistemas de gestión para redes y Datacenters, Soluciones para gobiernos digitales (e-Goverment), Digitalización y gestión documental, Gestión integral de proyectos tecnológicos."
  }
];

export function getAsociadoBySlug(slug: string): Asociado | undefined {
  return asociados.find((a) => a.slug === slug);
}

export const asociadoCategories: AsociadoCategory[] = [
  "Shopping Centers",
  "Retailers",
  "Proveedores de servicios",
  "Otros",
];
