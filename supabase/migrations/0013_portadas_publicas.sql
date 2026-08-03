-- Migration 0013 — Make the `portadas` bucket public
--
-- Cover images for content (noticias, blog, webinars, informes) are shown on
-- the PUBLIC site and in cards to anyone, so they need a permanent public URL.
-- The bucket was created private in 0008, which only works with short-lived
-- signed URLs — wrong for images that must render for every visitor forever.
--
-- Making the bucket public gives each object a stable URL
-- (…/storage/v1/object/public/portadas/<path>) with no signing needed. Only
-- the `portadas` bucket changes; `cvs` and `informes` stay private (CVs carry
-- personal data; informe PDFs are member-only).
--
-- Writes are still restricted: the admin-only INSERT/UPDATE/DELETE policies
-- from 0008 remain, so a public bucket does NOT mean anyone can upload — only
-- admins write, everyone can read.

update storage.buckets
set public = true
where id = 'portadas';

-- Public read for portadas objects. A public bucket serves objects without a
-- session, so an explicit permissive SELECT policy for anon keeps the object
-- listing/reads working alongside the existing admin write policy.
drop policy if exists portadas_member_select on storage.objects;

create policy portadas_public_select on storage.objects
  for select
  using (bucket_id = 'portadas');
