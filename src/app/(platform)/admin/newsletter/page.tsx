import { SectionHeading } from "@/components/shared/section-heading";
import { getDataLayer } from "@/lib/data";
import { NewsletterManager } from "./newsletter-manager";

export const metadata = { title: "Newsletter" };

/** Admin Newsletter: server-loads the list, delegates CRUD to the client manager. */
export default async function AdminNewsletterPage() {
  const newsletters = await getDataLayer().newsletters.list();

  return (
    <>
      <SectionHeading
        title="Newsletter"
        subtitle="Archivo de ediciones del boletín"
      />
      <NewsletterManager newsletters={newsletters} />
    </>
  );
}
