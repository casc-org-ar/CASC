/**
 * Participating shopping centers, grouped by region.
 *
 * Migrated verbatim from the WordPress/Elementor site: each region was a
 * separate Elementor "nested carousel" widget with one image widget per slide,
 * each image wrapped in a link to the mall's Instagram profile.
 *
 * `name` did not exist in the original markup (every `<img>` had an empty
 * `alt`). It is derived from the logo filename and used for accessible alt
 * text, which is an accessibility fix, not a visual change.
 */

export type Shopping = {
  name: string;
  logo: string;
  href: string;
};

export type Region = {
  id: string;
  title: string;
  shoppings: Shopping[];
};

export const REGIONS: Region[] = [
  {
    id: "caba",
    title: "CABA",
    shoppings: [
      { name: "Abasto Shopping", logo: "/logos/abasto.png", href: "https://www.instagram.com/abasto_shopping" },
      { name: "Alcorta Shopping", logo: "/logos/alcorta.png", href: "https://www.instagram.com/alcortashopping" },
      { name: "Alto Palermo", logo: "/logos/altopalermo.png", href: "https://www.instagram.com/alto_palermo" },
      { name: "Caballito Shopping Center", logo: "/logos/caballito.png", href: "https://www.instagram.com/caballitoshoppingcenter" },
      { name: "Del Parque Outlet", logo: "/logos/delparque.png", href: "https://www.instagram.com/delparqueoutlet" },
      { name: "Devoto Shopping", logo: "/logos/devoto.png", href: "https://www.instagram.com/devoto_shopping" },
      { name: "Distrito Arcos", logo: "/logos/distrito-arcos.png", href: "https://www.instagram.com/distritoarcos" },
      { name: "Dot Baires Shopping", logo: "/logos/dot-baires-shopping.png", href: "https://www.instagram.com/dotbaires" },
      { name: "El Solar Shopping", logo: "/logos/el-solar.png", href: "https://www.instagram.com/elsolarshopping" },
      { name: "Factory Parque Brown", logo: "/logos/factory.png", href: "https://www.instagram.com/factoryparquebrown" },
      { name: "Galerías Pacífico", logo: "/logos/galerias-pacifico.png", href: "https://www.instagram.com/galeriaspacificoshopping" },
      { name: "Patio Bullrich", logo: "/logos/patio-bullrich.png", href: "https://www.instagram.com/patiobullrich" },
      { name: "Plaza Liniers", logo: "/logos/plaza-liniers.png", href: "https://www.instagram.com/plazaliniers" },
      { name: "Recoleta Urban Mall", logo: "/logos/recoleta-urbanmall.png", href: "https://www.instagram.com/recoletaurbanmall" },
    ],
  },
  {
    id: "gba",
    title: "GBA",
    shoppings: [
      { name: "Alto Avellaneda", logo: "/logos/altoavellaneda.png", href: "https://www.instagram.com/alto_avellaneda" },
      { name: "Bahía Blanca Plaza Shopping", logo: "/logos/bahia-blanca.png", href: "https://www.instagram.com/bahiablancaplazashopping" },
      { name: "Boulevard Shopping", logo: "/logos/boulevard.png", href: "https://www.instagram.com/boulevardshopp" },
      { name: "Catán Shopping", logo: "/logos/catan.png", href: "https://www.instagram.com/catanshopping" },
      { name: "Factory Quilmes", logo: "/logos/factory-quilmes.png", href: "https://www.instagram.com/factoryquilmesshopping" },
      { name: "Maschwitz Mall", logo: "/logos/maschwitz.png", href: "https://www.instagram.com/maschwitz_mall" },
      { name: "Nine Shopping", logo: "/logos/nine.png", href: "https://www.instagram.com/nineshoppingok" },
      { name: "Nordelta Centro Comercial", logo: "/logos/nordelta.png", href: "https://www.instagram.com/nordeltacc" },
      { name: "Nuevo Quilmes Plaza", logo: "/logos/nuevo-quilmes.png", href: "https://www.instagram.com/nuevoquilmesplaza" },
      { name: "Palmas del Pilar", logo: "/logos/palmas-de-pilar.png", href: "https://www.instagram.com/palmasdelpilar" },
      { name: "Parque Avellaneda Shopping", logo: "/logos/parque-avellaneda.jpg", href: "https://www.instagram.com/pavellanedashopping?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D" },
      { name: "Paseo Champagnat", logo: "/logos/champagnat.png", href: "https://www.instagram.com/paseochampagnat" },
      { name: "Paseo Pilar", logo: "/logos/paseo-pilar.png", href: "https://www.instagram.com/paseopilarpp" },
      { name: "Plaza Oeste", logo: "/logos/plaza-oeste.png", href: "https://www.instagram.com/plazaoestearg" },
      { name: "Portal Escobar", logo: "/logos/portal-escobar.png", href: "https://www.portal-escobar.com.ar/" },
      { name: "Portal Lomas", logo: "/logos/portal-lomas.png", href: "https://www.instagram.com/portallomas" },
      { name: "Remeros Plaza", logo: "/logos/remeros.png", href: "https://www.instagram.com/remerosplaza" },
      { name: "San Justo Shopping", logo: "/logos/sanjusto.png", href: "https://www.instagram.com/sanjustoshopping" },
      { name: "Soleil Premium Outlet", logo: "/logos/soleil.jpg", href: "https://www.instagram.com/soleilpremiumoutlet" },
      { name: "Tablada Shopping", logo: "/logos/tablada.jpg", href: "https://www.instagram.com/tabladashopping?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D" },
      { name: "Terrazas de Mayo", logo: "/logos/terrazas.png", href: "https://www.instagram.com/terrazasdemayo" },
      { name: "Tortugas Open Mall", logo: "/logos/tom.png", href: "https://www.instagram.com/tortugasmall" },
      { name: "Toscas Shopping", logo: "/logos/toscas.png", href: "https://www.instagram.com/toscas_shopping" },
      { name: "Unicenter Shopping", logo: "/logos/unicenter.png", href: "https://www.instagram.com/unicentershopping" },
    ],
  },
  {
    id: "pampeana",
    title: "PAMPEANA",
    shoppings: [
      { name: "Alto Rosario", logo: "/logos/altorosario.png", href: "https://www.instagram.com/altorosario" },
      { name: "Córdoba Shopping", logo: "/logos/cordoba-shopping.png", href: "https://www.instagram.com/cordobashopping" },
      { name: "Nuevocentro Shopping", logo: "/logos/nuevo-centro.png", href: "https://www.instagram.com/nuevocentro_shopping" },
      { name: "Patio Olmos Shopping", logo: "/logos/patio-olmos.jpg", href: "https://www.instagram.com/patioolmosshopping/" },
      { name: "Paseo del Jockey", logo: "/logos/paseo-del-jockey.jpg", href: "https://www.instagram.com/paseodeljockey/" },
      { name: "Opera Fun", logo: "/logos/operafun.png", href: "https://www.instagram.com/opera.fun" },
      { name: "Paseo Libertad Lugones", logo: "/logos/paseo-libertad-lugones.png", href: "https://www.instagram.com/paseo.lugones/" },
      { name: "Paseo Libertad Rivera", logo: "/logos/paseo-libertad-river.png", href: "https://www.instagram.com/paseo.rivera" },
      { name: "Paso del Bosque", logo: "/logos/paso-del-bosque.png", href: "https://www.instagram.com/pasodelbosque" },
      { name: "Paso del Paraná", logo: "/logos/paso-del-parana.png", href: "https://www.instagram.com/pasodelparana" },
      { name: "Portal Rosario", logo: "/logos/portal-rosario.png", href: "https://www.instagram.com/portalrosario" },
      { name: "Puerto Plaza", logo: "/logos/puerto-plaza.png", href: "https://www.instagram.com/puertoplazaok" },
      { name: "Ribera Shopping", logo: "/logos/ribera.png", href: "https://www.instagram.com/riberashopping" },
      { name: "Shopping del Siglo", logo: "/logos/shopping-del-siglo.png", href: "https://www.instagram.com/sh.delsiglo" },
    ],
  },
  {
    id: "norte",
    title: "NORTE",
    shoppings: [
      { name: "Alto NOA Shopping", logo: "/logos/alto-noa.png", href: "https://www.instagram.com/altonoashopping" },
      { name: "Annuar Shopping", logo: "/logos/annuar-shopping.png", href: "https://www.instagram.com/annuarshopping" },
      { name: "Paseo Libertad Salta", logo: "/logos/paseo-libertad-salta.png", href: "https://www.instagram.com/paseo.salta/" },
      { name: "Portal Salta Shopping", logo: "/logos/portal-salta.png", href: "https://www.instagram.com/portalsaltashopping" },
      { name: "Portal Santiago Shopping", logo: "/logos/portal-santiago.png", href: "https://www.instagram.com/portalsantiagoshopping" },
      { name: "Portal Tucumán Shopping", logo: "/logos/portal-tucuman.png", href: "https://www.instagram.com/portaltucumanshopping" },
    ],
  },
  {
    id: "cuyo",
    title: "CUYO",
    shoppings: [
      { name: "Espacio San Juan Shopping", logo: "/logos/espacio-san-juan-shopping.png", href: "https://www.instagram.com/espaciosanjuanshopping" },
      { name: "La Barraca Mall", logo: "/logos/labarraca.jpg", href: "https://www.instagram.com/labarracamall/" },
      { name: "Mendoza Shopping", logo: "/logos/mendoza.png", href: "https://www.instagram.com/mendozashopping" },
      { name: "Palmares Open Mall", logo: "/logos/palmares.png", href: "https://www.instagram.com/palmares.mall?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" },
      { name: "Paseo Libertad San Juan", logo: "/logos/paseo-san-juan.png", href: "https://www.instagram.com/paseolibertad_sanjuan" },
      { name: "Portal Los Andes", logo: "/logos/portal-los-andes.png", href: "https://www.instagram.com/portallosandes" },
    ],
  },
  {
    id: "patagonia",
    title: "PATAGONIA",
    shoppings: [
      { name: "Alto Comahue", logo: "/logos/alto-comahue.png", href: "https://www.instagram.com/altocomahue" },
      { name: "Paseo de la Patagonia", logo: "/logos/paseo-de-la-patagonia.png", href: "https://www.instagram.com/paseopatagonia" },
      { name: "Paseo del Fuego", logo: "/logos/paseo-del-fuego.png", href: "https://www.instagram.com/paseodelfuego" },
      { name: "Portal Patagonia", logo: "/logos/portal-patagonoia.png", href: "https://www.instagram.com/portalpatagonia" },
      { name: "Portal Trelew", logo: "/logos/portal-trelew.png", href: "https://www.instagram.com/portaltrelew" },
    ],
  },
];

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/shoppingfestarg?igsh=MTJ5cmt6M2psbXZ3bg==",
  facebook: "https://www.facebook.com/share/1DpcCcuMxu/?mibextid=wwXIfr",
  tiktok: "https://www.tiktok.com/@shoppingfestarg?_r=1&_t=ZS-95LXxmmWqfI",
} as const;
