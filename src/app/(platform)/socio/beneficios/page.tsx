import { SectionHeading } from "@/components/shared/section-heading";
import { getDataLayer } from "@/lib/data";
import { onlyPublished } from "@/lib/data/published";
import { BeneficiosList } from "./beneficios-list";

export const metadata = { title: "Beneficios" };

/** Socio Beneficios: hotels with discounts for members, searchable by name/city. */
export default async function SocioBeneficiosPage() {
  const hoteles = onlyPublished(await getDataLayer().hoteles.list()).sort(
    (a, b) => a.nombre.localeCompare(b.nombre, "es"),
  );

  return (
    <>
      <SectionHeading
        title="Beneficios"
        subtitle="Hoteles con descuentos para socios de la CASC"
      />
      <BeneficiosList hoteles={hoteles} />
    </>
  );
}
