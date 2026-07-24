import { SectionHeading } from "@/components/shared/section-heading";
import { getDataLayer } from "@/lib/data";
import { InformesManager } from "./informes-manager";

export const metadata = { title: "Informes" };

/** Admin Informes: server-loads the list, delegates CRUD to the client manager. */
export default async function AdminInformesPage() {
  const informes = await getDataLayer().informes.list();

  return (
    <>
      <SectionHeading
        title="Informes"
        subtitle="Gestión de informes y documentos"
      />
      <InformesManager informes={informes} />
    </>
  );
}
