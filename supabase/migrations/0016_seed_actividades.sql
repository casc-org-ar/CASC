-- Migration 0016 — Seed the real activities into Supabase
--
-- The 5 activities that were hardcoded in the app (home-content.ts, "2026"
-- set) are inserted so the admin panel and public site read them from the DB.
-- Idempotent: an activity whose slug already exists is skipped, so a second run
-- is a no-op. Run AFTER 0015 (which creates the table).

insert into actividades (titulo, slug, descripcion, imagen, fecha, lugar, status)
select
  v.titulo, v.slug, v.descripcion, v.imagen, v.fecha, v.lugar,
  v.status::publication_status
from (values
  (
    '4.º Congreso Latinoamericano de Centros Comerciales CLICC 2026',
    'clicc-2026',
    'Unidos desde el centro del mundo: transformando la experiencia. El sector de los centros comerciales de América Latina volverá a reunirse en uno de los eventos más relevantes de la industria.',
    '/assets/blog/clicc-congreso.webp',
    null::text,
    null::text,
    'publicado'
  ),
  (
    'FASE 2026: más de 200 profesionales analizaron el presente y futuro de los shopping centers',
    'fase-2026',
    'La Cámara Argentina de Shopping Centers llevó adelante la segunda edición de FASE - Foro Argentino de Shoppings y Experiencias, el pasado 28 de mayo, en el Auditorio Plaza Galicia de la Ciudad de Buenos Aires.',
    '/assets/blog/fase-2026.webp',
    '28 de mayo de 2026',
    'Auditorio Plaza Galicia, Ciudad de Buenos Aires',
    'publicado'
  ),
  (
    'Gestión de mall integral: la experiencia de La Vaguada',
    'gestion-de-mall-integral-la-vaguada',
    'CASC organiza un nuevo webinar con foco en buenas prácticas internacionales.',
    '/assets/blog/gestion-de-mall-integral.webp',
    null::text,
    'Webinar online',
    'publicado'
  ),
  (
    'Webinar: “Monitoreo Inteligente”',
    'webinar-monitoreo-inteligente',
    'Descubrí cómo la inteligencia artificial y el monitoreo inteligente pueden mejorar la gestión y operación de los shopping centers.',
    '/assets/blog/monitoreo-inteligente.webp',
    null::text,
    'Webinar online',
    'publicado'
  ),
  (
    'Webinar: Remodelar un shopping',
    'webinar-remodelar-un-shopping',
    'Errores que cuestan millones y cómo evitarlos.',
    '/assets/blog/remodelar-un-shopping.webp',
    null::text,
    'Webinar online',
    'publicado'
  )
) as v(titulo, slug, descripcion, imagen, fecha, lugar, status)
where not exists (
  select 1 from actividades a where a.slug = v.slug
);
