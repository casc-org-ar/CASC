-- Migration 0006 — align current_app_role() with Clerk's native integration
--
-- Context: migration 0004 read the app role from `auth.jwt() ->> 'role'` first,
-- falling back to `metadata.role`. That worked with the (now deprecated) Clerk
-- JWT template. The native Clerk↔Supabase integration (the supported path since
-- April 2025) INJECTS a top-level `"role": "authenticated"` claim into every
-- session token — Supabase requires it. That value would shadow our app role:
-- `current_app_role()` would always return 'authenticated', so is_admin() and
-- is_member() would always be false and RLS would deny everyone (the silent
-- "returns empty" failure mode).
--
-- Fix: read the app role ONLY from the nested custom claim, never from the
-- reserved top-level `role`. The role is surfaced into the token via a Clerk
-- session-token custom claim built from `user.public_metadata.role`, exposed
-- under `metadata.role` (adjust the path here if the claim is named otherwise).
--
-- This function is the single source of truth for the app role; the policies in
-- 0004 (is_admin / is_member) call it unchanged.

create or replace function current_app_role()
returns text
language sql stable
as $$
  select nullif(auth.jwt() -> 'metadata' ->> 'role', '');
$$;
