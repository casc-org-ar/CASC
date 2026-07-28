-- Migration 0008 — Storage buckets & policies
--
-- Real file storage for the platform. Three PRIVATE buckets:
--   - cvs:      candidate CVs (sensitive personal data, ley 25.326).
--   - informes: report PDFs (admin-uploaded, member-facing).
--   - portadas: cover images for content cards.
--
-- All private: no public URLs. The app serves files via short-lived signed
-- URLs minted server-side (see src/lib/data/supabase/storage.ts). Access is
-- governed by RLS on storage.objects, reusing the same Clerk-JWT helpers as the
-- table policies (is_member / is_admin from migration 0004) — defense in depth.

-- ---------------------------------------------------------------------------
-- Buckets (private).
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values
  ('cvs', 'cvs', false),
  ('informes', 'informes', false),
  ('portadas', 'portadas', false)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- cvs: the public Bolsa de Trabajo lets ANYONE upload a CV, but only members
-- (socios/admins) may read them — mirrors the candidatos table policy in 0004.
--   - anon + authenticated: INSERT only.
--   - members: SELECT.
--   - admins: full (moderation cleanup).
-- ---------------------------------------------------------------------------
create policy cvs_public_insert on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'cvs');

create policy cvs_member_select on storage.objects
  for select using (bucket_id = 'cvs' and is_member());

create policy cvs_admin_all on storage.objects
  for all using (bucket_id = 'cvs' and is_admin())
  with check (bucket_id = 'cvs' and is_admin());

-- ---------------------------------------------------------------------------
-- informes & portadas: admins write; members read (content is member-facing).
-- ---------------------------------------------------------------------------
create policy informes_member_select on storage.objects
  for select using (bucket_id = 'informes' and is_member());
create policy informes_admin_all on storage.objects
  for all using (bucket_id = 'informes' and is_admin())
  with check (bucket_id = 'informes' and is_admin());

create policy portadas_member_select on storage.objects
  for select using (bucket_id = 'portadas' and is_member());
create policy portadas_admin_all on storage.objects
  for all using (bucket_id = 'portadas' and is_admin())
  with check (bucket_id = 'portadas' and is_admin());
