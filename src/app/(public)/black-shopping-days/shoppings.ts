/**
 * Black Shopping Days — participating shopping centers.
 *
 * Source of truth: "LOGOS SHOPPING + INSTAGRAMS" sheet shared by CASC
 * (Drive folder "LOGOS SHOPPINGS + IG"). The array keeps the sheet's order;
 * the landing groups it by region while preserving that order inside each one.
 *
 * `instagram` is empty when the sheet has no link: the logo renders without a
 * link. `logo` is empty when there's no file yet: the card shows the name.
 */

export type BsdRegion =
  | "CABA"
  | "Buenos Aires"
  | "Centro"
  | "Cuyo"
  | "NOA"
  | "Patagonia";

export interface BsdShopping {
  name: string;
  region: BsdRegion;
  instagram: string;
  logo: string;
}

const L = "/assets/asociados/logos";
const BSD = "/assets/black-shopping-days/logos";

export const bsdShoppings: BsdShopping[] = [
  { name: "Abasto Shopping", region: "CABA", instagram: "https://www.instagram.com/abasto_shopping", logo: `${BSD}/abasto-shopping.jpg` },
  { name: "Alcorta Shopping", region: "CABA", instagram: "https://www.instagram.com/alcortashopping", logo: `${L}/alcorta-shopping.webp` },
  { name: "Alto Avellaneda", region: "Buenos Aires", instagram: "https://www.instagram.com/alto_avellaneda", logo: `${L}/alto-avellaneda-shopping.webp` },
  { name: "Alto Comahue", region: "Patagonia", instagram: "https://www.instagram.com/altocomahue", logo: `${L}/alto-comahue-shopping.webp` },
  { name: "Alto NOA", region: "NOA", instagram: "https://www.instagram.com/altonoashopping", logo: `${L}/alto-noa.webp` },
  { name: "Alto Palermo", region: "CABA", instagram: "https://www.instagram.com/alto_palermo", logo: `${L}/alto-palermo.webp` },
  { name: "Alto Rosario", region: "Centro", instagram: "https://www.instagram.com/altorosario", logo: `${L}/alto-rosario.webp` },
  { name: "Annuar Shopping", region: "NOA", instagram: "https://www.instagram.com/annuarshopping", logo: `${L}/annuar-shopping.webp` },
  { name: "Bahía Blanca Plaza Shopping", region: "Buenos Aires", instagram: "https://www.instagram.com/bahiablancaplazashopping", logo: `${L}/bahia-blanca-plaza-shopping.webp` },
  { name: "Boulevard Shopping", region: "Buenos Aires", instagram: "https://www.instagram.com/boulevardshopp", logo: `${L}/boulevard-shopping.webp` },
  { name: "Caballito Shopping", region: "CABA", instagram: "https://www.instagram.com/caballitoshoppingcenter", logo: `${L}/caballito-shopping-center.webp` },
  { name: "Catán Shopping", region: "Buenos Aires", instagram: "https://www.instagram.com/catanshopping", logo: `${L}/catan-shopping.webp` },
  { name: "Córdoba Shopping", region: "Centro", instagram: "https://www.instagram.com/cordobashopping", logo: `${L}/cordoba-shopping.webp` },
  { name: "Dalvian Mall", region: "Cuyo", instagram: "https://www.instagram.com/dalvian.mall", logo: `${BSD}/dalvian-mall.png` },
  { name: "Devoto Shopping", region: "CABA", instagram: "https://www.instagram.com/devoto_shopping", logo: `${L}/devoto-shopping.webp` },
  { name: "Dino Mall Alto Verde", region: "Centro", instagram: "https://www.instagram.com/dino.mall", logo: `${L}/dinomall_altoverde.webp` },
  { name: "Dino Mall Ruta 20", region: "Centro", instagram: "https://www.instagram.com/dino.mall", logo: `${L}/dinomall-ruta20.webp` },
  { name: "Distrito Arcos Premium Outlet", region: "CABA", instagram: "https://www.instagram.com/distritoarcos", logo: `${L}/distrito-arcos-premium-outlet.webp` },
  { name: "DOT Baires Shopping", region: "CABA", instagram: "https://www.instagram.com/dotbaires", logo: `${L}/dot-baires-shopping.webp` },
  { name: "El Solar", region: "CABA", instagram: "https://www.instagram.com/elsolarshopping", logo: `${L}/el-solar-shopping.webp` },
  { name: "Espacio San Juan Shopping", region: "Cuyo", instagram: "https://www.instagram.com/espaciosanjuanshopping", logo: `${L}/espacio-san-juan-shopping.webp` },
  { name: "Factory Parque Brown", region: "CABA", instagram: "https://www.instagram.com/factoryparquebrown", logo: `${L}/factory-parque-brown.webp` },
  { name: "Factory Quilmes", region: "Buenos Aires", instagram: "https://www.instagram.com/factoryquilmesshopping", logo: `${L}/factory-quilmes.webp` },
  { name: "Factory San Martín", region: "Buenos Aires", instagram: "", logo: `${L}/factory-san-martin.webp` },
  { name: "Galerías Pacífico", region: "CABA", instagram: "https://www.instagram.com/galeriaspacificoshopping", logo: `${L}/galerias-pacifico.webp` },
  { name: "Los Gallegos Shopping", region: "Buenos Aires", instagram: "https://www.instagram.com/losgallegosoficial", logo: "" },
  { name: "Mendoza Shopping", region: "Cuyo", instagram: "https://www.instagram.com/mendozashopping", logo: `${L}/mendoza-shopping.webp` },
  { name: "Nine Shopping", region: "Buenos Aires", instagram: "https://www.instagram.com/nineshoppingok", logo: `${L}/nine-shopping.webp` },
  { name: "Nordelta Centro Comercial", region: "Buenos Aires", instagram: "https://www.instagram.com/nordeltacc", logo: `${L}/nordelta-centro-comercial.webp` },
  { name: "Nuevo Quilmes Plaza", region: "Buenos Aires", instagram: "https://www.instagram.com/nuevoquilmesplaza", logo: `${L}/nuevo-quilmes-plaza.webp` },
  { name: "Nuevocentro", region: "Centro", instagram: "https://www.instagram.com/nuevocentro_shopping", logo: `${L}/nuevocentro-shopping.webp` },
  { name: "OperaFun", region: "Centro", instagram: "https://www.instagram.com/opera.fun", logo: `${L}/operafun.webp` },
  { name: "Palmares Mall", region: "Cuyo", instagram: "https://www.instagram.com/palmares.mall", logo: `${L}/palmares-mall.webp` },
  { name: "Palmas del Pilar", region: "Buenos Aires", instagram: "https://www.instagram.com/palmasdelpilar", logo: `${L}/palmas-del-pilar.webp` },
  { name: "Parque Avellaneda Shopping", region: "Buenos Aires", instagram: "https://www.instagram.com/pavellanedashopping", logo: `${L}/parque-avellaneda-shopping.webp` },
  { name: "Parque Comercial Quilmes BA3", region: "Buenos Aires", instagram: "", logo: `${L}/parque-comercial-quilmes.webp` },
  { name: "Paseo Champagnat", region: "Buenos Aires", instagram: "https://www.instagram.com/paseochampagnat", logo: `${L}/paseo-champagnat.webp` },
  { name: "Paseo del Fuego", region: "Patagonia", instagram: "https://www.instagram.com/paseodelfuego", logo: `${L}/paseo-del-fuego-shopping.webp` },
  { name: "Paseo del Jockey", region: "Centro", instagram: "https://www.instagram.com/paseodeljockey", logo: `${L}/paseo-del-jockey.webp` },
  { name: "Paseo Lugones", region: "Centro", instagram: "https://www.instagram.com/paseo.lugones", logo: `${L}/paseo-libertad-lugones.webp` },
  { name: "Paseo Pilar", region: "Buenos Aires", instagram: "https://www.instagram.com/paseopilarpp", logo: `${L}/paseo-pilar.webp` },
  { name: "Paseo Rivera", region: "Centro", instagram: "https://www.instagram.com/paseo.rivera", logo: `${L}/paseo-libertad-rivera.webp` },
  { name: "Paseo Salta", region: "NOA", instagram: "https://www.instagram.com/paseo.salta", logo: `${L}/paseo-libertad-salta.webp` },
  { name: "Paseo San Juan", region: "Cuyo", instagram: "https://www.instagram.com/paseolibertad_sanjuan", logo: `${L}/paseo-libertad-san-juan.webp` },
  { name: "Paso del Bosque", region: "Centro", instagram: "https://www.instagram.com/pasodelbosque", logo: `${L}/paso-del-bosque.webp` },
  { name: "Paso del Paraná", region: "Centro", instagram: "https://www.instagram.com/pasodelparana", logo: `${L}/paso-del-parana.webp` },
  { name: "Patio Alvear", region: "Cuyo", instagram: "https://www.instagram.com/patioalvear", logo: `${BSD}/patio-alvear.png` },
  { name: "Patio Bullrich", region: "CABA", instagram: "https://www.instagram.com/patiobullrich", logo: `${L}/patio-bullrich.webp` },
  { name: "Patio Olmos", region: "Centro", instagram: "https://www.instagram.com/patioolmosshopping", logo: `${L}/patio-olmos.webp` },
  { name: "Plaza Liniers Shopping", region: "CABA", instagram: "https://www.instagram.com/plazaliniers", logo: `${L}/plaza-liniers-shopping.webp` },
  { name: "Plaza Oeste", region: "Buenos Aires", instagram: "https://www.instagram.com/plazaoestearg", logo: `${L}/plaza-oeste.webp` },
  { name: "Portal Escobar", region: "Buenos Aires", instagram: "https://www.portal-escobar.com.ar/", logo: `${L}/portal-escobar.webp` },
  { name: "Portal Lomas", region: "Buenos Aires", instagram: "https://www.instagram.com/portallomas", logo: `${L}/portal-lomas.webp` },
  { name: "Portal Los Andes", region: "Cuyo", instagram: "https://www.instagram.com/portallosandes", logo: `${L}/portal-los-andes.webp` },
  { name: "Portal Palermo", region: "CABA", instagram: "https://www.instagram.com/portalpalermoshopping", logo: `${L}/portal-palermo.webp` },
  { name: "Portal Patagonia", region: "Patagonia", instagram: "https://www.instagram.com/portalpatagonia", logo: `${L}/portal-patagonia.webp` },
  { name: "Portal Río Cuarto", region: "Centro", instagram: "", logo: "" },
  { name: "Portal Rosario", region: "Centro", instagram: "https://www.instagram.com/portalrosario", logo: `${L}/portal-rosario.webp` },
  { name: "Portal Salta", region: "NOA", instagram: "https://www.instagram.com/portalsaltashopping", logo: `${L}/portal-salta.webp` },
  { name: "Portal Santiago", region: "NOA", instagram: "https://www.instagram.com/portalsantiagoshopping", logo: `${L}/portal-santiago.webp` },
  { name: "Portal Trelew", region: "Patagonia", instagram: "https://www.instagram.com/portaltrelew", logo: `${L}/portal-trelew.webp` },
  { name: "Portal Tucumán", region: "NOA", instagram: "https://www.instagram.com/portaltucumanshopping", logo: `${L}/portal-tucuman.webp` },
  { name: "Puerto Plaza", region: "Centro", instagram: "https://www.instagram.com/puertoplazaok", logo: `${L}/puerto-plaza.webp` },
  { name: "Recoleta Urban Mall", region: "CABA", instagram: "https://www.instagram.com/recoletaurbanmall", logo: `${L}/recoleta-urban-mall.webp` },
  { name: "Remeros Plaza", region: "Buenos Aires", instagram: "https://www.instagram.com/remerosplaza", logo: `${L}/remeros-plaza.webp` },
  { name: "Ribera Shopping", region: "Centro", instagram: "https://www.instagram.com/riberashopping", logo: `${L}/ribera-shopping.webp` },
  { name: "San Justo Shopping", region: "Buenos Aires", instagram: "https://www.instagram.com/sanjustoshopping", logo: `${L}/san-justo-shopping.webp` },
  { name: "Shopping del Siglo", region: "Centro", instagram: "https://www.instagram.com/sh.delsiglo", logo: `${L}/shopping-del-siglo.webp` },
  { name: "Soleil Premium Outlet", region: "Buenos Aires", instagram: "https://www.instagram.com/soleilpremiumoutlet", logo: `${L}/soleil-premium-outlet.webp` },
  { name: "Tablada Shopping", region: "Buenos Aires", instagram: "https://www.instagram.com/tabladashopping", logo: `${L}/tablada-shopping.webp` },
  { name: "Terrazas de Mayo", region: "Buenos Aires", instagram: "https://www.instagram.com/terrazasdemayo", logo: `${L}/terrazas-de-mayo-shopping.webp` },
  { name: "TOM (Tortugas Open Mall)", region: "Buenos Aires", instagram: "https://www.instagram.com/tortugasmall", logo: `${L}/tortugas-open-mall.webp` },
  { name: "Toscas Shopping", region: "Buenos Aires", instagram: "https://www.instagram.com/toscas_shopping", logo: `${L}/toscas-shopping.webp` },
  { name: "Unicenter", region: "Buenos Aires", instagram: "https://www.instagram.com/unicentershopping", logo: `${L}/unicenter.webp` },
];

/** Region rows, in display order, with their accent color. */
export const bsdRegions: { name: BsdRegion; color: string }[] = [
  { name: "CABA", color: "#c2ff03" },
  { name: "Buenos Aires", color: "#dcb8fd" },
  { name: "Centro", color: "#41e081" },
  { name: "Cuyo", color: "#ffd36b" },
  { name: "NOA", color: "#ff9f7a" },
  { name: "Patagonia", color: "#8ed8ff" },
];
