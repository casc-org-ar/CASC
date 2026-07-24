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
 * Rubro (line of business) for "Proveedores de servicios". Derived from each
 * provider's `actividad` text so the directory can filter by activity —
 * pending validation by CASC.
 */
export type AsociadoRubro =
  | "Arquitectura y desarrollo"
  | "Tecnología y software"
  | "Marketing y fidelización"
  | "Ambientación y equipamiento"
  | "Servicios generales";

/** Selectable rubros, in the order shown by the directory filter. */
export const asociadoRubros: AsociadoRubro[] = [
  "Arquitectura y desarrollo",
  "Tecnología y software",
  "Marketing y fidelización",
  "Ambientación y equipamiento",
  "Servicios generales",
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
    "rubro": "Marketing y fidelización",
    "logo": "/assets/asociados/logos/unoporunomarketingintegrado.webp",
    "web": "www.1por1.com.ar",
    "actividad": "Servicios para el desarrollo de negocios. Estrategias competitivas y de marketing para Centros Comerciales y Retailers. Estudios para implantación de nuevos centros y expansión de los existentes."
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
    "rubro": "Tecnología y software",
    "logo": "/assets/asociados/logos/airbits.webp",
    "web": "www.airbits.com.ar",
    "contacto": "Pablo Honnorat – Socio Gerente",
    "actividad": "La más avanzada tecnología para centros comerciales. Conteo de personas y análisis de tráfico. Sensores IoT de presencia y cámaras inteligentes. Mapas de calor. Análisis RFM. Guest WiFi."
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
    "rubro": "Arquitectura y desarrollo",
    "logo": "/assets/asociados/logos/aldo-volpe-arquitectos.webp",
    "web": "www.aldovolpe.com.ar",
    "contacto": "Arq. Aldo Volpe",
    "actividad": "Planificación física y diseño arquitectónico de centros comerciales y complejos de usos mixtos. Arquitectura para servicios en general. Consultoría."
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
    "telefono": "(299)434 0200 Página Web: www.altocomahue.com.ar",
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
    "telefono": "(54 0388) 423-6178 Instagram: @annuarshopping",
    "inauguracion": "14 de octubre de 2009",
    "visitas": "242.000",
    "locales": "67"
  },
  {
    "slug": "appa",
    "name": "Appa",
    "category": "Proveedores de servicios",
    "rubro": "Marketing y fidelización",
    "logo": "/assets/asociados/logos/appa.webp",
    "actividad": "&iexcl;appa! es la plataforma lider en fidelizaci&oacute;n y gesti&oacute;n digital para centros comerciales, dise&ntilde;ada para optimizar la operaci&oacute;n y reducir costos. Elimina las filas en stands de promociones y minimiza la necesidad de personal operativo a trav&eacute;s de inteligencia artificial para la validaci&oacute;n autom&aacute;tica de facturas, integra de forma nativa el control de parking y barreras, permitiendo al usuario obtener beneficios mientras que el shopping accede a un ecosistema de insights y data en tiempo real, permitiendo impactar a los clientes mediante canales de comunicaci&oacute;n segmentados basados en su comportamiento real de compra."
  },
  {
    "slug": "artisdeco",
    "name": "Artisdeco",
    "category": "Proveedores de servicios",
    "rubro": "Ambientación y equipamiento",
    "logo": "/assets/asociados/logos/artisdeco.webp",
    "web": "www.artisdeco.com.ar",
    "contacto": "Noelia Nasir",
    "actividad": "Ambientación navideña y seasonal para centros comerciales, grandes espacios, vidrieras, puntos de venta y eventos exclusivos de alto impacto, con más de 18 años en el mercado. Organización integral de eventos llave en mano. Brand Experience, activaciones de marca, acciones promocionales, producción técnica y artística, artistas itinerantes, talleres temáticos y mucho más."
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
    "rubro": "Arquitectura y desarrollo",
    "logo": "/assets/asociados/logos/centros-comerciales-latinoamerica-ccla.webp",
    "web": "www.cclatinoamerica.com.ar",
    "actividad": "Estudios de Factibilidad para el desarrollo de Galerías, Centros Comerciales y Shoppings Centers. Comercialización de locales, espacios para stands y grandes superficies. Auditorías. Control de Calidad en procesos administrativos y comerciales. Reconversión de Espacios Comerciales. Diseño e Implementación de campañas de Marketing. Desarrollo de Programas de Fidelización de clientes."
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
    "rubro": "Servicios generales",
    "logo": "/assets/asociados/logos/city-center-rosario.webp",
    "web": "www.citycenter-rosario.com.ar",
    "actividad": "Servicios relacionados con juegos de azar y apuestas N.C.P. // Servicios de expendio de comidas y bebidas en establecimientos con servicio de mesa y/o en mostrador N.C.P. // Servicios de alojamiento en hoteles, hosterías y residenciales similares, excepto por hora, que incluyen servicio de restaurante al público // Servicios inmobiliarios realizados por cuenta propia, con bienes urbanos propios o arrendados N.C.P. // Servicios de alquiler y explotación de inmuebles para fiestas, convenciones y otros eventos similares // Servicios de playas de estacionamiento y garajes // Servicios empresariales N.C.P."
  },
  {
    "slug": "clash",
    "name": "Clash",
    "category": "Proveedores de servicios",
    "rubro": "Marketing y fidelización",
    "logo": "/assets/asociados/logos/clash.webp",
    "contacto": "Juan Marcos Aviano &ndash; Director Comercial &amp; MKT Redes sociales: X: https://x.com/ClashBeneficios Facebook: https://www.facebook.com/clash.beneficios Youtube: https://www.youtube.com/@clashbeneficios Instagram: https://www.instagram.com/clash.beneficios",
    "actividad": "Clash conecta a centros comerciales con sus visitantes a trav&eacute;s de promociones claras, organizadas y visibles. Es una soluci&oacute;n integral que profesionaliza la comunicaci&oacute;n de los beneficios de los locatarios, centraliz&aacute;ndolos en un solo lugar y acompa&ntilde;ando al shopping con tecnolog&iacute;a, soporte operativo y acciones comerciales. Adem&aacute;s, forma parte de un ecosistema donde miles de personas consultan cada mes todas las promociones bancarias y extrabancarias en supermercados, estaciones de servicio y otros rubros clave. Clash permite al centro comercial ganar visibilidad real y conectar con el consumidor justo cuando est&aacute; buscando d&oacute;nde aprovechar sus beneficios."
  },
  {
    "slug": "comision-directiva",
    "name": "comision-directiva",
    "category": "Otros"
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
    "slug": "datos-del-sector",
    "name": "datos-del-sector",
    "category": "Otros"
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
    "slug": "delegaciones-regionales",
    "name": "delegaciones-regionales",
    "category": "Otros"
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
    "name": "Di Desing",
    "category": "Proveedores de servicios",
    "rubro": "Arquitectura y desarrollo",
    "logo": "/assets/asociados/logos/di-desing.webp",
    "web": "www.di-design.net",
    "contacto": "Luis Di Virgilio – Arquitecto",
    "actividad": "Estudio de arquitectura y urbanismo. Posee experiencia internacional en el desarrollo de grandes proyectos, tales como masterplanning, revalorizaciones urbanas, proyectos de usos mixtos, shopping centers, retail, viviendas y oficinas."
  },
  {
    "slug": "distrito-arcos-premium-outlet",
    "name": "Distrito Arcos Premium Outlet",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/distrito-arcos-premium-outlet.webp",
    "direccion": "Paraguay 4979, Capital Federal",
    "telefono": "(5411) 5789-2700 Página Web: www.distritoarcos.com.ar",
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
    "telefono": "2644238611 Página Web: www.espaciosanjuan.com",
    "inauguracion": "01 de Noviembre de 2014",
    "visitas": "85.000",
    "locales": "54"
  },
  {
    "slug": "estatuto",
    "name": "estatuto",
    "category": "Otros"
  },
  {
    "slug": "etia-charge",
    "name": "Etia charge",
    "category": "Proveedores de servicios",
    "rubro": "Ambientación y equipamiento",
    "logo": "/assets/asociados/logos/etia-charge.webp",
    "web": "www.etiacharge.com",
    "contacto": "Carlos F. Pratts – Director Comercial",
    "actividad": "Especialistas en el desarrollo de soluciones de carga para vehículos eléctricos y software de gestión de carga inteligente. Su propósito es ofrecer equipos de carga de máxima calidad y construir una red de carga moderna, eficiente y con cobertura nacional, que acompañe el avance de la movilidad eléctrica en la Argentina."
  },
  {
    "slug": "euler",
    "name": "Euler",
    "category": "Proveedores de servicios",
    "rubro": "Tecnología y software",
    "logo": "/assets/asociados/logos/euler.webp",
    "contacto": "Herman Moldovan - Director Redes : linkedin -&gt; www.linkedin.com/company/eulerlabs",
    "actividad": "Eulerlabs es una empresa de tecnolog&iacute;a dedicada a la medici&oacute;n, an&aacute;lisis y optimizaci&oacute;n del desempe&ntilde;o de centros comerciales . Brindamos soluciones que permiten entender el comportamiento de los visitantes , evaluar la performance de los locales y mejorar la gesti&oacute;n comercial y operativa del shopping, a partir de datos objetivos y confiables. Nuestra plataforma integra informaci&oacute;n de flujo peatonal, ocupaci&oacute;n, permanencia , junto con datos de ventas y contexto, para acompa&ntilde;ar la toma de decisiones estrat&eacute;gicas. Sectores o especialidades en los que opera Eulerlabs opera principalmente en el sector retail y centros comerciales , especializ&aacute;ndose en: Shopping centers Gesti&oacute;n y auditor&iacute;a de locales Medici&oacute;n de flujo peatonal y ocupaci&oacute;n An&aacute;lisis de performance comercial y operativa Integraci&oacute;n de datos f&iacute;sicos y comerciales en una &uacute;nica plataforma Valor diferencial / Propuesta de valor El principal diferencial de Eulerlabs es la combinaci&oacute;n de experiencia, cobertura y foco en resultados de negocio . Contamos con m&aacute;s de 15 a&ntilde;os de experiencia trabajando con shopping centers y tenemos presencia en casi la totalidad de los shoppings del pa&iacute;s , lo que nos permite conocer en profundidad su operaci&oacute;n, desaf&iacute;os y necesidades. Ofrecemos a nuestros clientes: Datos confiables y comparables entre locales y centros comerciales Una mirada objetiva para gestionar, auditar y optimizar la performance Una soluci&oacute;n desarrollada espec&iacute;ficamente para el negocio de shoppings"
  },
  {
    "slug": "factory-parque-brown",
    "name": "Factory Parque Brown",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/factory-parque-brown.webp",
    "direccion": "Av. Cruz y Escalada (1407) Capital Federal, Buenos Aires",
    "telefono": "(54 11) 4630-4373 Página Web: www.parquebrown.factoryshopping.com.ar",
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
    "telefono": "(5411) 4229-4000 Página Web: www.quilmes.factoryshopping.com.ar",
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
    "telefono": "(5411) 5789-1600 Página Web: www.sanmartin.factoryshopping.com.ar",
    "inauguracion": "16 de diciembre de 1994",
    "visitas": "285.000",
    "locales": "37"
  },
  {
    "slug": "fondamenta",
    "name": "Fondamenta",
    "category": "Proveedores de servicios",
    "logo": "/assets/asociados/logos/fondamenta.webp"
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
    "slug": "havanna",
    "name": "Havanna",
    "category": "Retailers",
    "logo": "/assets/asociados/logos/havanna.webp",
    "web": "www.havanna.com.ar",
    "actividad": "Producción de alfajores. Cafetería especializada."
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
    "slug": "la-barraca-mall",
    "name": "La Barraca Mall",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/la-barraca-mall.webp"
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
    "slug": "nosotros",
    "name": "nosotros",
    "category": "Otros"
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
    "rubro": "Tecnología y software",
    "logo": "/assets/asociados/logos/nuova-suite.webp",
    "web": "www.nuovasuite.com",
    "contacto": "Gustavo Menicillo gustavo@nuovasuite.com",
    "actividad": "Nuova Suite ofrece un portafolio de licencias SaaS modulares que integran en una sola plataforma la gestión de contenidos, campañas y programas de fidelización para clientes y marcas. A través del ecosistema conformado por los módulos Creator, Rewards, Wallet, Gift Card y Audit , permite crear experiencias digitales personalizadas, administrar billeteras y tarjetas regalo, realizar auditorías virtuales con inteligencia artificial e integrar sistemas de estacionamiento. Una solución integral, personalizable y eficiente para fortalecer la conexión entre el Shopping, sus marcas y sus visitantes."
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
    "telefono": "(54 11) 4115 – 1172 Página Web: www.parqueavellanedashopping.com.ar",
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
    "logo": "/assets/asociados/logos/paseo-del-jockey.webp"
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
    "telefono": "(0387) 4269700 Página Web: www.paseosalta.com.ar",
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
    "telefono": "(54 264) 429-2207 Página Web: www.paseosanjuan.com.ar",
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
    "telefono": "(54 11) 4778-8000 Página Web: www.portalpalermo.com.ar",
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
    "slug": "proveedores-de-servicios",
    "name": "proveedores-de-servicios",
    "category": "Proveedores de servicios",
    "logo": "/assets/asociados/logos/proveedores-de-servicios.webp"
  },
  {
    "slug": "puerto-plaza",
    "name": "Puerto Plaza",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/puerto-plaza.webp",
    "direccion": "Remolcador Meteoro N°250-Dique 2 Puerto de Santa Fe, Pcia. de Santa Fe",
    "telefono": "0342-4547966 Página Web: www.puertoplaza.com.ar",
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
    "slug": "retailers",
    "name": "retailers",
    "category": "Retailers",
    "logo": "/assets/asociados/logos/retailers.webp"
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
    "slug": "san-justo-shopping",
    "name": "San Justo Shopping",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/san-justo-shopping.webp",
    "direccion": "Juan Manuel de Rosas 3910 (1754) San Justo, Buenos Aires",
    "telefono": "(5411) 4480-2800 Página Web: www.sanjustoshopping.com.ar",
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
    "slug": "shopping-centers",
    "name": "shopping-centers",
    "category": "Shopping Centers",
    "logo": "/assets/asociados/logos/shopping-centers.webp"
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
    "rubro": "Tecnología y software",
    "logo": "/assets/asociados/logos/solutions-malls.webp",
    "web": "www.solutionsmalls.com.ar",
    "actividad": "Soluciones integrales de Software para centros comerciales."
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
    "rubro": "Marketing y fidelización",
    "logo": "/assets/asociados/logos/wiki-biz.webp",
    "web": "www.wikibiz.us",
    "contacto": "Gustavo Menicillo",
    "actividad": "Wiki Biz es una agencia de marketing integral que combina estrategia, creatividad, tecnología y ejecución para diseñar experiencias eficientes y memorables. Ofrece soluciones que van desde la planificación estratégica y la generación de contenidos hasta la gestión de campañas, desarrollo digital, activaciones, programas de fidelización e implementación de ecosistemas integrados con plataformas digitales y automatizaciones. Una agencia ágil, multidisciplinaria y orientada a resultados, que acompaña a las marcas en todas las etapas del negocio."
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
