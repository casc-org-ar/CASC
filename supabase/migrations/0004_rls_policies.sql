-- Migration 0004 — Row Level Security (RLS)
--
-- THE security boundary of the platform. Defense in depth: even if the app
-- layer has a bug, the database itself refuses unauthorized access.
--
-- Model (matches the app's access patterns):
--   - anon (public site): can INSERT candidatos only. No SELECT anywhere.
--   - socio (authenticated member): SELECT published content + published
--     candidatos. No writes.
--   - admin: full access to everything.
--
-- Role source: Clerk issues a JWT whose claims Supabase exposes via auth.jwt().
-- We read the role from the token, NOT from any client-supplied value.
--
-- Fail-closed: enabling RLS denies everything by default; policies only open
-- the minimum. The service_role key (server-only) bypasses RLS for trusted
-- server code — never expose it to the browser.

-- ---------------------------------------------------------------------------
-- Helpers: read identity/role from the verified Clerk JWT.
-- ---------------------------------------------------------------------------

-- The Clerk user id from the token subject ('sub').
create or replace function clerk_user_id()
returns text
language sql stable
as $$
  select nullif(auth.jwt() ->> 'sub', '')::text;
$$;

-- The role claim carried in the token. Adjust the claim path if the Clerk
-- JWT template names it differently (e.g. metadata.role).
create or replace function current_app_role()
returns text
language sql stable
as $$
  select coalesce(
    auth.jwt() ->> 'role',
    auth.jwt() -> 'metadata' ->> 'role'
  );
$$;

create or replace function is_admin()
returns boolean
language sql stable
as $$
  select current_app_role() = 'admin';
$$;

-- Authenticated as a platform member (admin or socio).
create or replace function is_member()
returns boolean
language sql stable
as $$
  select current_app_role() in ('admin', 'socio');
$$;

-- ---------------------------------------------------------------------------
-- Enable RLS on every table. From here nothing is readable/writable until a
-- policy explicitly allows it.
-- ---------------------------------------------------------------------------
alter table socios       enable row level security;
alter table webinars     enable row level security;
alter table informes     enable row level security;
alter table noticias     enable row level security;
alter table newsletters  enable row level security;
alter table blog_posts   enable row level security;
alter table hoteles      enable row level security;
alter table candidatos   enable row level security;

-- ---------------------------------------------------------------------------
-- Content tables (webinars, informes, noticias, newsletters, blog, hoteles):
--   - socios & admins read PUBLISHED rows.
--   - admins additionally read drafts and do all writes.
-- Implemented per-table (Postgres policies are not parameterizable) but the
-- shape is identical everywhere.
-- ---------------------------------------------------------------------------

-- webinars
create policy webinars_select_published on webinars
  for select using (status = 'publicado' and is_member());
create policy webinars_admin_all on webinars
  for all using (is_admin()) with check (is_admin());

-- informes
create policy informes_select_published on informes
  for select using (status = 'publicado' and is_member());
create policy informes_admin_all on informes
  for all using (is_admin()) with check (is_admin());

-- noticias
create policy noticias_select_published on noticias
  for select using (status = 'publicado' and is_member());
create policy noticias_admin_all on noticias
  for all using (is_admin()) with check (is_admin());

-- newsletters
create policy newsletters_select_published on newsletters
  for select using (status = 'publicado' and is_member());
create policy newsletters_admin_all on newsletters
  for all using (is_admin()) with check (is_admin());

-- blog_posts
create policy blog_select_published on blog_posts
  for select using (status = 'publicado' and is_member());
create policy blog_admin_all on blog_posts
  for all using (is_admin()) with check (is_admin());

-- hoteles
create policy hoteles_select_published on hoteles
  for select using (status = 'publicado' and is_member());
create policy hoteles_admin_all on hoteles
  for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
-- socios: a member may read/update ONLY their own row; admins manage all.
-- ---------------------------------------------------------------------------
create policy socios_select_self on socios
  for select using (clerk_user_id() = socios.clerk_user_id);
create policy socios_update_self on socios
  for update using (clerk_user_id() = socios.clerk_user_id)
  with check (clerk_user_id() = socios.clerk_user_id);
create policy socios_admin_all on socios
  for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
-- candidatos (most sensitive):
--   - anon may INSERT only (public CV submission), and only with consent.
--   - socios read PUBLISHED candidates.
--   - admins do everything (moderation).
-- No SELECT is granted to anon anywhere — the public never lists candidates.
-- ---------------------------------------------------------------------------
create policy candidatos_public_insert on candidatos
  for insert
  to anon, authenticated
  with check (consentimiento = true and status = 'borrador');

create policy candidatos_select_published on candidatos
  for select using (status = 'publicado' and is_member());

create policy candidatos_admin_all on candidatos
  for all using (is_admin()) with check (is_admin());
