import { SectionHeading } from "@/components/shared/section-heading";
import { getDataLayer } from "@/lib/data";
import { ActividadesManager } from "./actividades-manager";

export const metadata = { title: "Actividades" };

/** Admin Actividades: server-loads the list, delegates CRUD to the client manager. */
export default async function AdminActividadesPage() {
  const actividades = await getDataLayer().actividades.list();

  return (
    <>
      <SectionHeading
        title="Actividades"
        subtitle="Capacitaciones, congresos y eventos que se muestran en el sitio público"
      />
      <ActividadesManager actividades={actividades} />
    </>
  );
}
