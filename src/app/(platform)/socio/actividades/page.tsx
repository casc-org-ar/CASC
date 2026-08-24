import { SectionHeading } from "@/components/shared/section-heading";
import { readPublishedActividades } from "@/lib/data/actividades-read";
import { ActividadesList } from "./actividades-list";

export const metadata = { title: "Actividades" };

/**
 * Socio Actividades: the same published activities shown on the public site,
 * surfaced inside the panel for members. The grid, search and filter live in
 * <ActividadesList> (a client component), matching how informes, noticias and
 * webinars are built — this page only reads the data.
 */
export default async function SocioActividadesPage() {
  const actividades = await readPublishedActividades("socios");

  return (
    <>
      <SectionHeading
        title="Actividades"
        subtitle="Capacitaciones, congresos y eventos de la Cámara"
      />
      <ActividadesList actividades={actividades} />
    </>
  );
}
