-- Migration 0019 — Normalize socios.email to lowercase
--
-- Emails were stored with whatever casing the admin typed ("Gerencia@..."),
-- so code had to compare them case-insensitively. The Clerk webhook did that
-- with `ilike`, which also treats `%` and `_` in the value as WILDCARDS: an
-- address like "juan_perez@x.com" matched "juanXperez@x.com", and a value of
-- "%@%" matched every member — linking one Clerk user across unrelated rows.
--
-- Storing emails lowercased makes `eq` the correct comparison everywhere: exact,
-- no pattern semantics, and it matches the unique lower(email) index from 0001.
-- Clerk already delivers addresses lowercased, so both sides now agree.

-- 1. Normalize the rows that exist today.
update socios
   set email = lower(trim(email))
 where email <> lower(trim(email));

-- 2. Keep the invariant: reject anything not already normalized, so a future
--    insert cannot silently reintroduce mixed casing and break `eq` lookups.
alter table socios
  add constraint socios_email_lowercase
  check (email = lower(trim(email)));
