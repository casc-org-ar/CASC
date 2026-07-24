import { SectionHeading } from "@/components/shared/section-heading";
import { getDataLayer } from "@/lib/data";
import { SociosManager } from "./socios-manager";

export const metadata = { title: "Socios" };

/** Admin Socios: server-loads the members, delegates CRUD to the client manager. */
export default async function AdminSociosPage() {
  const socios = await getDataLayer().socios.list();

  return (
    <>
      <SectionHeading
        title="Socios"
        subtitle="Gestión de usuarios y centros comerciales asociados"
      />
      <SociosManager socios={socios} />
    </>
  );
}
