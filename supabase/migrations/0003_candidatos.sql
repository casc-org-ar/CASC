-- Migration 0003 — Candidatos (Bolsa de Trabajo)
--
-- The most sensitive table: personal data of third parties (name, email, phone,
-- CV) submitted through the PUBLIC landing. Access rules (0004) are strict:
--   - public (anon): may INSERT only — never SELECT.
--   - socio: may SELECT published candidates only.
--   - admin: full access (moderation).
--
-- `consentimiento` records explicit data-storage consent (ley 25.326) and is
-- enforced NOT NULL + true at the DB level: a row cannot exist without consent.

create table candidatos (
  id                uuid primary key default gen_random_uuid(),
  -- Datos básicos
  nombre            text not null,
  email             text not null,
  telefono          text,
  -- Perfil profesional
  puesto_buscado    text not null,
  area_interes      text not null,
  skills            text[] not null default '{}',
  anios_experiencia smallint check (anios_experiencia between 0 and 60),
  nivel_educativo   text,
  disponibilidad    disponibilidad,
  -- Ubicación
  ciudad            text,
  provincia         text,
  -- CV (stored file reference; the file itself lives in storage)
  cv_url            text not null,
  cv_nombre         text,
  -- Legal: consent is mandatory. The CHECK guarantees no row without it.
  consentimiento    boolean not null default false check (consentimiento = true),
  -- Moderación: 'borrador' = pending review, 'publicado' = visible to socios.
  status            publication_status not null default 'borrador',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create trigger candidatos_set_updated_at
  before update on candidatos for each row execute function set_updated_at();

comment on table candidatos is
  'Job candidates from the public landing. Sensitive personal data — see RLS in 0004. Public may INSERT only.';
comment on column candidatos.consentimiento is
  'Ley 25.326 consent. Enforced true by CHECK: no candidate row exists without it.';
