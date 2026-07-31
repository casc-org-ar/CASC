import { SectionHeading } from "@/components/shared/section-heading";
import { getDataLayer } from "@/lib/data";
import { BlogManager } from "./blog-manager";

export const metadata = { title: "Noticias y Blog" };

/** Admin Blog: server-loads posts, delegates CRUD to the client manager. */
export default async function AdminBlogPage() {
  const posts = await getDataLayer().blog.list();

  return (
    <>
      <SectionHeading
        title="Noticias y Blog"
        subtitle="Artículos con visibilidad configurable: panel de socios, sitio público o ambos."
      />
      <BlogManager posts={posts} />
    </>
  );
}
