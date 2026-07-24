import { FileText, Mail, Newspaper, Users, Video } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { getDataLayer } from "@/lib/data";

export const metadata = { title: "Dashboard" };

/** Admin dashboard: summary metrics + quick access + latest publications. */
export default async function AdminDashboardPage() {
  const data = getDataLayer();
  const [webinars, informes, noticias, newsletters, socios] =
    await Promise.all([
      data.webinars.list(),
      data.informes.list(),
      data.noticias.list(),
      data.newsletters.list(),
      data.socios.list(),
    ]);

  const publicados = (items: { status: string }[]) =>
    items.filter((i) => i.status === "publicado").length;

  const sociosActivos = socios.filter(
    (s) => s.role === "socio" && s.estado === "activo",
  ).length;

  const latest = [
    ...webinars.map((w) => ({ tipo: "Webinar", titulo: w.titulo, fecha: w.fecha, status: w.status })),
    ...informes.map((i) => ({ tipo: "Informe", titulo: i.titulo, fecha: i.fecha, status: i.status })),
    ...noticias.map((n) => ({ tipo: "Noticia", titulo: n.titulo, fecha: n.fecha, status: n.status })),
  ]
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, 5);

  return (
    <>
      <SectionHeading
        title="Dashboard"
        subtitle="Resumen de la actividad de la plataforma"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Webinars publicados" value={publicados(webinars)} icon={Video} />
        <StatCard label="Informes publicados" value={publicados(informes)} icon={FileText} />
        <StatCard label="Noticias publicadas" value={publicados(noticias)} icon={Newspaper} />
        <StatCard label="Socios activos" value={sociosActivos} icon={Users} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle className="mb-4">Últimas publicaciones</CardTitle>
          <ul className="divide-y divide-border">
            {latest.map((item, idx) => (
              <li key={idx} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-ink">{item.titulo}</p>
                  <p className="text-xs text-ink-muted">{item.tipo}</p>
                </div>
                <Badge tone={item.status === "publicado" ? "success" : "muted"}>
                  {item.status === "publicado" ? "Publicado" : "Borrador"}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardTitle className="mb-4">Accesos rápidos</CardTitle>
          <div className="space-y-2">
            <QuickLink href="/admin/webinars" icon={Video} label="Gestionar webinars" />
            <QuickLink href="/admin/informes" icon={FileText} label="Gestionar informes" />
            <QuickLink href="/admin/noticias" icon={Newspaper} label="Gestionar noticias" />
            <QuickLink href="/admin/newsletter" icon={Mail} label="Gestionar newsletter" />
            <QuickLink href="/admin/socios" icon={Users} label="Gestionar socios" />
          </div>
        </Card>
      </div>
    </>
  );
}

function QuickLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof Video;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-md border border-border px-3 py-2 text-sm text-ink transition-colors hover:bg-surface"
    >
      <Icon className="h-4 w-4 text-primary" />
      {label}
    </Link>
  );
}
