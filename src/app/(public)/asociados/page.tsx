import type { Metadata } from "next";
import { PageHero } from "@/components/public/page-hero";
import { JoinCta } from "@/components/public/join-cta";
import {
  AsociadosDirectory,
  type AsociadoDirectoryItem,
  type AsociadosDirectoryFilters,
  type RegionSlug,
} from "@/components/public/asociados-directory";
import {
  asociadoRubros,
  asociados,
  type Asociado,
  type AsociadoRubro,
} from "@/lib/data/asociados";

/**
 * Asociados directory — migrated from asociados.html. Lists every associate
 * and supports URL-driven category filters, including Shopping Centers by region.
 */

export const metadata: Metadata = {
  title: "Asociados — CASC",
  description:
    "Directorio de asociados de la Cámara Argentina de Shopping Centers: Shopping Centers, Retailers y Proveedores de servicios.",
};

const categoryPageSlugs = new Set([
  "shopping-centers",
  "retailers",
  "proveedores-de-servicios",
  "comision-directiva",
  "datos-del-sector",
  "delegaciones-regionales",
  "estatuto",
  "nosotros",
]);

const regionLabels: Record<RegionSlug, string> = {
  caba: "CABA",
  gba: "GBA",
  pampeana: "Pampeana",
  cuyo: "Cuyo",
  norte: "Norte",
  patagonia: "Patagonia",
};

const regionBySlug: Partial<Record<string, RegionSlug>> = {
  "la-barraca-mall": "cuyo",
  "paseo-del-jockey": "pampeana",
  "paso-del-parana": "pampeana",
};

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function getShoppingCenterRegion(asociado: Asociado): RegionSlug | undefined {
  if (asociado.category !== "Shopping Centers") {
    return undefined;
  }

  const explicitRegion = regionBySlug[asociado.slug];
  if (explicitRegion) {
    return explicitRegion;
  }

  const text = normalizeText(`${asociado.name} ${asociado.direccion ?? ""}`);

  if (text.includes("capital federal") || text.includes("caba")) {
    return "caba";
  }

  if (
    text.includes("neuquen") ||
    text.includes("chubut") ||
    text.includes("tierra del fuego") ||
    text.includes("ushuaia")
  ) {
    return "patagonia";
  }

  if (
    text.includes("mendoza") ||
    text.includes("guaymallen") ||
    text.includes("godoy cruz") ||
    text.includes("san juan")
  ) {
    return "cuyo";
  }

  if (
    text.includes("salta") ||
    text.includes("jujuy") ||
    text.includes("tucuman") ||
    text.includes("santiago del estero")
  ) {
    return "norte";
  }

  if (
    text.includes("cordoba") ||
    text.includes("santa fe") ||
    text.includes("rosario") ||
    text.includes("entre rios") ||
    text.includes("parana") ||
    text.includes("bahia blanca")
  ) {
    return "pampeana";
  }

  if (
    text.includes("buenos aires") ||
    text.includes("bs. as") ||
    text.includes("avellaneda") ||
    text.includes("adrogue") ||
    text.includes("quilmes") ||
    text.includes("moron") ||
    text.includes("tigre") ||
    text.includes("pilar") ||
    text.includes("ezeiza") ||
    text.includes("martinez") ||
    text.includes("san justo") ||
    text.includes("la matanza") ||
    text.includes("malvinas argentinas") ||
    text.includes("escobar") ||
    text.includes("lomas de zamora") ||
    text.includes("moreno") ||
    text.includes("san martin")
  ) {
    return "gba";
  }

  return undefined;
}

function isDirectoryItem(asociado: Asociado): boolean {
  return asociado.category !== "Otros" && !categoryPageSlugs.has(asociado.slug);
}

function toDirectoryItem(asociado: Asociado): AsociadoDirectoryItem {
  const region = getShoppingCenterRegion(asociado);

  return {
    slug: asociado.slug,
    name: asociado.name,
    category: asociado.category,
    logo: asociado.logo,
    direccion: asociado.direccion,
    telefono: asociado.telefono,
    web: asociado.web,
    contacto: asociado.contacto,
    region,
    regionLabel: region ? regionLabels[region] : undefined,
    rubro: asociado.rubro,
  };
}

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function getInitialFilters(searchParams: {
  [key: string]: string | string[] | undefined;
}): AsociadosDirectoryFilters {
  const category = firstParam(searchParams.categoria);
  const region = firstParam(searchParams.region);
  const rubro = firstParam(searchParams.rubro);
  const sort = firstParam(searchParams.orden);
  const query = firstParam(searchParams.q) ?? "";

  const safeCategory: AsociadosDirectoryFilters["category"] =
    category === "shopping-centers" ||
    category === "retailers" ||
    category === "proveedores-de-servicios"
      ? category
      : "all";

  const safeRegion: AsociadosDirectoryFilters["region"] =
    region === "caba" ||
    region === "gba" ||
    region === "pampeana" ||
    region === "cuyo" ||
    region === "norte" ||
    region === "patagonia"
      ? region
      : "all";

  const safeRubro: AsociadosDirectoryFilters["rubro"] =
    rubro && (asociadoRubros as string[]).includes(rubro)
      ? (rubro as AsociadoRubro)
      : "all";

  // A region implies Shopping Centers; a rubro implies Proveedores.
  const resolvedCategory =
    safeRegion !== "all"
      ? "shopping-centers"
      : safeRubro !== "all"
        ? "proveedores-de-servicios"
        : safeCategory;

  return {
    category: resolvedCategory,
    region: safeRegion,
    rubro: safeRubro,
    query,
    sort: sort === "za" ? "za" : "az",
  };
}

export default async function AsociadosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const directoryItems = asociados.filter(isDirectoryItem).map(toDirectoryItem);
  const initialFilters = getInitialFilters(params);
  const directoryKey = [
    initialFilters.category,
    initialFilters.region,
    initialFilters.rubro,
    initialFilters.query,
    initialFilters.sort,
  ].join(":");

  return (
    <>
      <PageHero
        title="Asociados"
        subtitle="Directorio de los Shopping Centers, Retailers y Proveedores de servicios que integran la Cámara Argentina de Shopping Centers."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <AsociadosDirectory
          key={directoryKey}
          items={directoryItems}
          initialFilters={initialFilters}
        />
      </section>

      <JoinCta />
    </>
  );
}
