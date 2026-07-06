import { SectionHeading } from "@/components/shared/section-heading";
import { getDataLayer } from "@/lib/data";
import { NoticiasManager } from "./noticias-manager";

/** Admin Noticias: server-loads the list, delegates CRUD to the client manager. */
export default async function AdminNoticiasPage() {
  const noticias = await getDataLayer().noticias.list();

  return (
    <>
      <SectionHeading title="Noticias" subtitle="Gestión del feed institucional" />
      <NoticiasManager noticias={noticias} />
    </>
  );
}
