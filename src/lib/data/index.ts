import type {
  BlogRepository,
  CandidatoRepository,
  ConsultaRepository,
  DataLayer,
  HotelRepository,
  NoticiaRepository,
  SolicitudRepository,
} from "@/lib/data/repositories";
import { mockDataLayer } from "@/lib/data/mock";
import {
  publicBlog,
  publicCandidatos,
  publicConsultas,
  publicHoteles,
  publicNoticias,
  publicSolicitudes,
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

/**
 * PUBLIC WRITE repositories for the anonymous forms (contact, membership, CV
 * upload). The sender is a logged-out visitor, so these use the anonymous
 * Supabase client — the authenticated client would try to read a Clerk token
 * that doesn't exist and the INSERT would fail. RLS allows `anon` to INSERT
 * only into these three tables. Public actions MUST write through here, never
 * `getDataLayer()`.
 */
export function getPublicWriteDataLayer(): {
  candidatos: CandidatoRepository;
  solicitudes: SolicitudRepository;
  consultas: ConsultaRepository;
} {
  if (!clerkEnabled()) {
    return {
      candidatos: mockDataLayer.candidatos,
      solicitudes: mockDataLayer.solicitudes,
      consultas: mockDataLayer.consultas,
    };
  }
  return {
    candidatos: publicCandidatos,
    solicitudes: publicSolicitudes,
    consultas: publicConsultas,
  };
}

export type { DataLayer } from "@/lib/data/repositories";
