import { SectionHeading } from "@/components/shared/section-heading";
import { getDataLayer } from "@/lib/data";
import { WebinarsManager } from "./webinars-manager";

/** Admin Webinars: server-loads the list, delegates CRUD to the client manager. */
export default async function AdminWebinarsPage() {
  const webinars = await getDataLayer().webinars.list();

  return (
    <>
      <SectionHeading
        title="Webinars"
        subtitle="Gestión de webinars y material asociado"
      />
      <WebinarsManager webinars={webinars} />
    </>
  );
}
