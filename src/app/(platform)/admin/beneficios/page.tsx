import { SectionHeading } from "@/components/shared/section-heading";
import { getDataLayer } from "@/lib/data";
import { BeneficiosManager } from "./beneficios-manager";

export const metadata = { title: "Beneficios" };

/** Admin Beneficios: server-loads the hotels, delegates CRUD to the client manager. */
export default async function AdminBeneficiosPage() {
  const hoteles = await getDataLayer().hoteles.list();

  return (
    <>
      <SectionHeading
        title="Beneficios"
        subtitle="Hoteles con descuentos para socios"
      />
      <BeneficiosManager hoteles={hoteles} />
    </>
  );
}
