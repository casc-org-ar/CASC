import { SectionHeading } from "@/components/shared/section-heading";
import { getDataLayer } from "@/lib/data";
import { BlogManager } from "./blog-manager";

/** Admin Blog: server-loads posts, delegates CRUD to the client manager. */
export default async function AdminBlogPage() {
  const posts = await getDataLayer().blog.list();

  return (
    <>
      <SectionHeading
        title="Blog"
        subtitle="Artículos para el sitio público (plantilla de visualización: próxima etapa)"
      />
      <BlogManager posts={posts} />
    </>
  );
}
