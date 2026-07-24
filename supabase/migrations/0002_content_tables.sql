-- Migration 0002 — Content tables
--
-- The six content entities managed from the admin and shown (published-only)
-- to socios: webinars, informes, noticias, newsletters, blog, hoteles.
-- All share id / created_at / updated_at / status, each with its own updated_at
-- trigger. Columns mirror the domain types 1:1 (camelCase → snake_case).
-- RLS in 0004, indexes in 0005.

-- Text arrays (blog.imagenes/tags, hoteles.beneficios) use native text[] rather
-- than a join table: they are small, read whole, and never queried by element.

create table webinars (
  id                    uuid primary key default gen_random_uuid(),
  titulo                text not null,
  descripcion           text not null,
  fecha                 date not null,
  video_url             text not null,
  portada_url           text,
  categoria             text not null,
  material_adjunto_url  text,
  status                publication_status not null default 'borrador',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create trigger webinars_set_updated_at
  before update on webinars for each row execute function set_updated_at();

create table informes (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null,
  descripcion text not null,
  categoria   text not null,
  archivo_url text not null,
  portada_url text,
  fecha       date not null,
  status      publication_status not null default 'borrador',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger informes_set_updated_at
  before update on informes for each row execute function set_updated_at();

create table noticias (
  id         uuid primary key default gen_random_uuid(),
  titulo     text not null,
  bajada     text not null,
  cuerpo     text not null,
  imagen_url text,
  categoria  text,
  fecha      date not null,
  status     publication_status not null default 'borrador',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger noticias_set_updated_at
  before update on noticias for each row execute function set_updated_at();

create table newsletters (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null,
  edicion     text not null,
  contenido   text,
  fecha       date not null,
  adjunto_url text,
  status      publication_status not null default 'borrador',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger newsletters_set_updated_at
  before update on newsletters for each row execute function set_updated_at();

create table blog_posts (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null,
  slug        text not null unique,
  bajada      text not null,
  cuerpo      text not null,
  portada_url text,
  imagenes    text[] not null default '{}',
  autor       text not null,
  tags        text[] not null default '{}',
  fecha       date not null,
  status      publication_status not null default 'borrador',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger blog_posts_set_updated_at
  before update on blog_posts for each row execute function set_updated_at();

create table hoteles (
  id         uuid primary key default gen_random_uuid(),
  nombre     text not null,
  estrellas  smallint check (estrellas between 1 and 5),
  ciudad     text not null,
  direccion  text,
  telefono   text,
  web        text,
  logo_url   text,
  descuento  text not null,
  beneficios text[] not null default '{}',
  reservas   text,
  nota       text,
  status     publication_status not null default 'borrador',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger hoteles_set_updated_at
  before update on hoteles for each row execute function set_updated_at();
