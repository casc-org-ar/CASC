import type {
  BlogRepository,
  DataLayer,
  HotelRepository,
  NoticiaRepository,
} from "@/lib/data/repositories";
import { mockDataLayer } from "@/lib/data/mock";
import {
  publicBlog,
  publicHoteles,
  publicNoticias,
  supabaseDataLayer,
} from "@/lib/data/supabase";
import { clerkEnabled } from "@/lib/auth/flag";

/**
 * Single entry point to the AUTHENTICATED data layer (platform: socios/admin).
 * The ONLY place that decides which implementation is active. Selected by the
 * same flag as auth and invitations, so the whole stack is consistent: real
 * Supabase persistence when Clerk is on, in-memory mock otherwise.
 */
export function getDataLayer(): DataLayer {
  return clerkEnabled() ? supabaseDataLayer : mockDataLayer;
}

/**
 * PUBLIC read repositories for the anonymous website (no login, static
 * generation). With Supabase active these use the anonymous client + the
 * public-read RLS policy (published rows only); with the mock they reuse the
 * mock repos. Public pages MUST read through here, never `getDataLayer()`,
 * whose authenticated client would call Clerk `auth()` and fail at build time.
 */
export function getPublicDataLayer(): {
  blog: BlogRepository;
  noticias: NoticiaRepository;
  hoteles: HotelRepository;
} {
  if (!clerkEnabled()) {
    return {
      blog: mockDataLayer.blog,
      noticias: mockDataLayer.noticias,
      hoteles: mockDataLayer.hoteles,
    };
  }
  return { blog: publicBlog, noticias: publicNoticias, hoteles: publicHoteles };
}

export type { DataLayer } from "@/lib/data/repositories";
