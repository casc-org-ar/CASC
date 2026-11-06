/**
 * Black Shopping Days — participating shopping centers.
 *
 * Source of truth: "LOGOS SHOPPING + INSTAGRAMS" sheet shared by CASC. The
 * landing groups them by region and sorts each region alphabetically.
 *
 * Logos live in one folder and share a 612x368 white canvas: background
 * cleaned, margins trimmed and scaled to the same visual area, so every card
 * looks the same size. `instagram` is empty when the sheet has no link: the
 * logo renders without one.
 */

export type BsdRegion =
  | "CABA"
  | "Buenos Aires"
  | "Pampeana"
  | "Cuyo"
  | "NOA"
  | "Patagonia";

export interface BsdShopping {
  name: string;
  region: BsdRegion;
  instagram: string;
  logo: string;
}

const BSD = "/assets/black-shopping-days/logos";

export const bsdShoppings: BsdShopping[] = [
  { name: "Abasto Shopping", region: "CABA", instagram: "https://www.instagram.com/abasto_shopping", logo: `${BSD}/abasto-shopping.webp` },
  { name: "Alcorta Shopping", region: "CABA", instagram: "https://www.instagram.com/alcortashopping", logo: `${BSD}/alcorta-shopping.webp` },
  { name: "Alto Avellaneda", region: "Buenos Aires", instagram: "https://www.instagram.com/alto_avellaneda", logo: `${BSD}/alto-avellaneda.webp` },
  { name: "Alto Comahue", region: "Patagonia", instagram: "https://www.instagram.com/altocomahue", logo: `${BSD}/alto-comahue.webp` },
  { name: "Alto NOA", region: "NOA", instagram: "https://www.instagram.com/altonoashopping", logo: `${BSD}/alto-noa.webp` },
  { name: "Alto Palermo", region: "CABA", instagram: "https://www.instagram.com/alto_palermo", logo: `${BSD}/alto-palermo.webp` },
  { name: "Alto Rosario", region: "Pampeana", instagram: "https://www.instagram.com/altorosario", logo: `${BSD}/alto-rosario.webp` },
  { name: "Annuar Shopping", region: "NOA", instagram: "https://www.instagram.com/annuarshopping", logo: `${BSD}/annuar-shopping.webp` },
  { name: "Bahía Blanca Plaza Shopping", region: "Buenos Aires", instagram: "https://www.instagram.com/bahiablancaplazashopping", logo: `${BSD}/bahia-blanca-plaza-shopping.webp` },
  { name: "Boulevard Shopping", region: "Buenos Aires", instagram: "https://www.instagram.com/boulevardshopp", logo: `${BSD}/boulevard-shopping.webp` },
  { name: "Caballito Shopping", region: "CABA", instagram: "https://www.instagram.com/caballitoshoppingcenter", logo: `${BSD}/caballito-shopping.webp` },
  { name: "Catán Shopping", region: "Buenos Aires", instagram: "https://www.instagram.com/catanshopping", logo: `${BSD}/catan-shopping.webp` },
  { name: "Córdoba Shopping", region: "Pampeana", instagram: "https://www.instagram.com/cordobashopping", logo: `${BSD}/cordoba-shopping.webp` },
  { name: "Dalvian Mall", region: "Cuyo", instagram: "https://www.instagram.com/dalvian.mall", logo: `${BSD}/dalvian-mall.webp` },
  { name: "Devoto Shopping", region: "CABA", instagram: "https://www.instagram.com/devoto_shopping", logo: `${BSD}/devoto-shopping.webp` },
  { name: "Dino Mall Alto Verde", region: "Pampeana", instagram: "https://www.instagram.com/dino.mall", logo: `${BSD}/dino-mall-alto-verde.webp` },
  { name: "Dino Mall Ruta 20", region: "Pampeana", instagram: "https://www.instagram.com/dino.mall", logo: `${BSD}/dino-mall-ruta-20.webp` },
  { name: "Distrito Arcos Premium Outlet", region: "CABA", instagram: "https://www.instagram.com/distritoarcos", logo: `${BSD}/distrito-arcos-premium-outlet.webp` },
  { name: "DOT Baires Shopping", region: "CABA", instagram: "https://www.instagram.com/dotbaires", logo: `${BSD}/dot-baires-shopping.webp` },
  { name: "El Solar", region: "CABA", instagram: "https://www.instagram.com/elsolarshopping", logo: `${BSD}/el-solar.webp` },
  { name: "Espacio San Juan Shopping", region: "Cuyo", instagram: "https://www.instagram.com/espaciosanjuanshopping", logo: `${BSD}/espacio-san-juan-shopping.webp` },
  { name: "Factory Parque Brown", region: "CABA", instagram: "https://www.instagram.com/factoryparquebrown", logo: `${BSD}/factory-parque-brown.webp` },
  { name: "Factory Quilmes", region: "Buenos Aires", instagram: "https://www.instagram.com/factoryquilmesshopping", logo: `${BSD}/factory-quilmes.webp` },
  { name: "Factory San Martín", region: "Buenos Aires", instagram: "", logo: `${BSD}/factory-san-martin.webp` },
  { name: "Galerías Pacífico", region: "CABA", instagram: "https://www.instagram.com/galeriaspacificoshopping", logo: `${BSD}/galerias-pacifico.webp` },
  { name: "Los Gallegos Shopping", region: "Buenos Aires", instagram: "https://www.instagram.com/losgallegosoficial", logo: `${BSD}/los-gallegos-shopping.webp` },
  { name: "Mendoza Shopping", region: "Cuyo", instagram: "https://www.instagram.com/mendozashopping", logo: `${BSD}/mendoza-shopping.webp` },
  { name: "Nine Shopping", region: "Buenos Aires", instagram: "https://www.instagram.com/nineshoppingok", logo: `${BSD}/nine-shopping.webp` },
  { name: "Nordelta Centro Comercial", region: "Buenos Aires", instagram: "https://www.instagram.com/nordeltacc", logo: `${BSD}/nordelta-centro-comercial.webp` },
  { name: "Nuevo Quilmes Plaza", region: "Buenos Aires", instagram: "https://www.instagram.com/nuevoquilmesplaza", logo: `${BSD}/nuevo-quilmes-plaza.webp` },
  { name: "Nuevocentro", region: "Pampeana", instagram: "https://www.instagram.com/nuevocentro_shopping", logo: `${BSD}/nuevocentro.webp` },
  { name: "OperaFun", region: "Pampeana", instagram: "https://www.instagram.com/opera.fun", logo: `${BSD}/operafun.webp` },
  { name: "Palmares Mall", region: "Cuyo", instagram: "https://www.instagram.com/palmares.mall", logo: `${BSD}/palmares-mall.webp` },
  { name: "Palmas del Pilar", region: "Buenos Aires", instagram: "https://www.instagram.com/palmasdelpilar", logo: `${BSD}/palmas-del-pilar.webp` },
  { name: "Parque Avellaneda Shopping", region: "Buenos Aires", instagram: "https://www.instagram.com/pavellanedashopping", logo: `${BSD}/parque-avellaneda-shopping.webp` },
  { name: "Parque Comercial Quilmes BA3", region: "Buenos Aires", instagram: "", logo: `${BSD}/parque-comercial-quilmes-ba3.webp` },
  { name: "Paseo Champagnat", region: "Buenos Aires", instagram: "https://www.instagram.com/paseochampagnat", logo: `${BSD}/paseo-champagnat.webp` },
  { name: "Paseo del Fuego", region: "Patagonia", instagram: "https://www.instagram.com/paseodelfuego", logo: `${BSD}/paseo-del-fuego.webp` },
  { name: "Paseo del Jockey", region: "Pampeana", instagram: "https://www.instagram.com/paseodeljockey", logo: `${BSD}/paseo-del-jockey.webp` },
  { name: "Paseo Lugones", region: "Pampeana", instagram: "https://www.instagram.com/paseo.lugones", logo: `${BSD}/paseo-lugones.webp` },
  { name: "Paseo Pilar", region: "Buenos Aires", instagram: "https://www.instagram.com/paseopilarpp", logo: `${BSD}/paseo-pilar.webp` },
  { name: "Paseo Rivera", region: "Pampeana", instagram: "https://www.instagram.com/paseo.rivera", logo: `${BSD}/paseo-rivera.webp` },
  { name: "Paseo Salta", region: "NOA", instagram: "https://www.instagram.com/paseo.salta", logo: `${BSD}/paseo-salta.webp` },
  { name: "Paseo San Juan", region: "Cuyo", instagram: "https://www.instagram.com/paseo.san.juan/", logo: `${BSD}/paseo-san-juan.webp` },
  { name: "Paso del Bosque", region: "Pampeana", instagram: "https://www.instagram.com/pasodelbosque", logo: `${BSD}/paso-del-bosque.webp` },
  { name: "Paso del Paraná", region: "Pampeana", instagram: "https://www.instagram.com/pasodelparana", logo: `${BSD}/paso-del-parana.webp` },
  { name: "Patio Alvear", region: "Cuyo", instagram: "https://www.instagram.com/patioalvear", logo: `${BSD}/patio-alvear.webp` },
  { name: "Patio Bullrich", region: "CABA", instagram: "https://www.instagram.com/patiobullrich", logo: `${BSD}/patio-bullrich.webp` },
  { name: "Patio Olmos", region: "Pampeana", instagram: "https://www.instagram.com/patioolmosshopping", logo: `${BSD}/patio-olmos.webp` },
  { name: "Plaza Liniers Shopping", region: "CABA", instagram: "https://www.instagram.com/plazaliniers", logo: `${BSD}/plaza-liniers-shopping.webp` },
  { name: "Plaza Oeste", region: "Buenos Aires", instagram: "https://www.instagram.com/plazaoestearg", logo: `${BSD}/plaza-oeste.webp` },
  { name: "Portal Escobar", region: "Buenos Aires", instagram: "https://www.portal-escobar.com.ar/", logo: `${BSD}/portal-escobar.webp` },
  { name: "Portal Lomas", region: "Buenos Aires", instagram: "https://www.instagram.com/portallomas", logo: `${BSD}/portal-lomas.webp` },
  { name: "Portal Los Andes", region: "Cuyo", instagram: "https://www.instagram.com/portallosandes", logo: `${BSD}/portal-los-andes.webp` },
  { name: "Portal Palermo", region: "CABA", instagram: "https://www.instagram.com/portalpalermoshopping", logo: `${BSD}/portal-palermo.webp` },
  { name: "Portal Patagonia", region: "Patagonia", instagram: "https://www.instagram.com/portalpatagonia", logo: `${BSD}/portal-patagonia.webp` },
  { name: "Portal Río Cuarto", region: "Pampeana", instagram: "", logo: `${BSD}/portal-rio-cuarto.webp` },
  { name: "Portal Rosario", region: "Pampeana", instagram: "https://www.instagram.com/portalrosario", logo: `${BSD}/portal-rosario.webp` },
  { name: "Portal Salta", region: "NOA", instagram: "https://www.instagram.com/portalsaltashopping", logo: `${BSD}/portal-salta.webp` },
  { name: "Portal Santiago", region: "NOA", instagram: "https://www.instagram.com/portalsantiagoshopping", logo: `${BSD}/portal-santiago.webp` },
  { name: "Portal Trelew", region: "Patagonia", instagram: "https://www.instagram.com/portaltrelew", logo: `${BSD}/portal-trelew.webp` },
  { name: "Portal Tucumán", region: "NOA", instagram: "https://www.instagram.com/portaltucumanshopping", logo: `${BSD}/portal-tucuman.webp` },
  { name: "Puerto Plaza", region: "Pampeana", instagram: "https://www.instagram.com/puertoplazaok", logo: `${BSD}/puerto-plaza.webp` },
  { name: "Recoleta Urban Mall", region: "CABA", instagram: "https://www.instagram.com/recoletaurbanmall", logo: `${BSD}/recoleta-urban-mall.webp` },
  { name: "Remeros Plaza", region: "Buenos Aires", instagram: "https://www.instagram.com/remerosplaza", logo: `${BSD}/remeros-plaza.webp` },
  { name: "Ribera Shopping", region: "Pampeana", instagram: "https://www.instagram.com/riberashopping", logo: `${BSD}/ribera-shopping.webp` },
  { name: "San Justo Shopping", region: "Buenos Aires", instagram: "https://www.instagram.com/sanjustoshopping", logo: `${BSD}/san-justo-shopping.webp` },
  { name: "Shopping del Siglo", region: "Pampeana", instagram: "https://www.instagram.com/sh.delsiglo", logo: `${BSD}/shopping-del-siglo.webp` },
  { name: "Soleil Premium Outlet", region: "Buenos Aires", instagram: "https://www.instagram.com/soleilpremiumoutlet", logo: `${BSD}/soleil-premium-outlet.webp` },
  { name: "Tablada Shopping", region: "Buenos Aires", instagram: "https://www.instagram.com/tabladashopping", logo: `${BSD}/tablada-shopping.webp` },
  { name: "Terrazas de Mayo", region: "Buenos Aires", instagram: "https://www.instagram.com/terrazasdemayo", logo: `${BSD}/terrazas-de-mayo.webp` },
  { name: "TOM (Tortugas Open Mall)", region: "Buenos Aires", instagram: "https://www.instagram.com/tortugasmall", logo: `${BSD}/tom-tortugas-open-mall.webp` },
  { name: "Toscas Shopping", region: "Buenos Aires", instagram: "https://www.instagram.com/toscas_shopping", logo: `${BSD}/toscas-shopping.webp` },
  { name: "Unicenter", region: "Buenos Aires", instagram: "https://www.instagram.com/unicentershopping", logo: `${BSD}/unicenter.webp` },
  { name: "WO", region: "Pampeana", instagram: "https://www.instagram.com/wocarlospaz.oficial", logo: `${BSD}/wo.webp` },
];

/** Region rows, in display order. */
export const bsdRegions: BsdRegion[] = [
  "CABA",
  "Buenos Aires",
  "Pampeana",
  "Cuyo",
  "NOA",
  "Patagonia",
];

/** Shoppings of a region in alphabetical order (Spanish collation). */
export function shoppingsByRegion(region: BsdRegion): BsdShopping[] {
  return bsdShoppings
    .filter((s) => s.region === region)
    .sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));
}
