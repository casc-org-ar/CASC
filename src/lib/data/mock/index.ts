import type { DataLayer } from "@/lib/data/repositories";
import { InMemoryContentRepository } from "@/lib/data/mock/in-memory-repository";
import {
  blogPosts,
  candidatos,
  consultas,
  hoteles,
  informes,
  newsletters,
  noticias,
  socios,
  solicitudes,
  webinars,
} from "@/lib/data/mock/seed-data";

/**
 * Mock data layer: wires each in-memory repository to its seed store.
 * The stores are module singletons, so mutations survive across requests
 * within a running dev session — the demo shows admin writes in real time.
 */
export const mockDataLayer: DataLayer = {
  webinars: new InMemoryContentRepository(webinars),
  informes: new InMemoryContentRepository(informes),
  noticias: new InMemoryContentRepository(noticias),
  newsletters: new InMemoryContentRepository(newsletters),
  blog: new InMemoryContentRepository(blogPosts),
  hoteles: new InMemoryContentRepository(hoteles),
  candidatos: new InMemoryContentRepository(candidatos),
  solicitudes: new InMemoryContentRepository(solicitudes),
  consultas: new InMemoryContentRepository(consultas),
  socios: new InMemoryContentRepository(socios),
};
