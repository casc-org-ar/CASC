"use client";

import { useMemo, useState } from "react";
import {
  Briefcase,
  FileDown,
  GraduationCap,
  MapPin,
  Clock,
} from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchInput } from "@/components/shared/search-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Candidato, Disponibilidad } from "@/lib/types/domain";

const disponibilidadLabel: Record<Disponibilidad, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  ambas: "Full o part-time",
};

function CandidatoCard({ candidato }: { candidato: Candidato }) {
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-bold leading-tight text-ink">
            {candidato.nombre}
          </h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-muted">
            <Briefcase className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            {candidato.puestoBuscado}
          </p>
        </div>
        <Badge tone="accent">{candidato.areaInteres}</Badge>
      </div>

      <ul className="mt-3 flex flex-wrap gap-1.5">
        {candidato.skills.map((skill) => (
          <li
            key={skill}
            className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium leading-tight text-ink-muted"
          >
            {skill}
          </li>
        ))}
      </ul>

      <dl className="mt-4 grid grid-cols-1 gap-1.5 text-sm text-ink-muted">
        {typeof candidato.aniosExperiencia === "number" && (
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <span>{candidato.aniosExperiencia} años de experiencia</span>
          </div>
        )}
        {(candidato.ciudad || candidato.provincia) && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <span>
              {[candidato.ciudad, candidato.provincia]
                .filter(Boolean)
                .join(", ")}
            </span>
          </div>
        )}
        {candidato.nivelEducativo && (
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <span>{candidato.nivelEducativo}</span>
          </div>
        )}
        {candidato.disponibilidad && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <span>{disponibilidadLabel[candidato.disponibilidad]}</span>
          </div>
        )}
      </dl>

      <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-border pt-4">
        <a
          href={`mailto:${candidato.email}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          {candidato.email}
        </a>
        {/* CV opens in a new tab; real storage will serve it as an attachment. */}
        <a
          href={candidato.cvUrl}
          target="_blank"
          rel="noreferrer"
          className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          <FileDown className="h-4 w-4" aria-hidden="true" />
          Ver CV
        </a>
      </div>
    </Card>
  );
}

/** Recruiter-facing candidate grid with skill/area/availability filters. */
export function CandidatosList({ candidatos }: { candidatos: Candidato[] }) {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState<string | null>(null);
  const [skill, setSkill] = useState<string | null>(null);

  // Filter option lists derived from the actual data, so empty options never show.
  const areas = useMemo(
    () => [...new Set(candidatos.map((c) => c.areaInteres))].sort(),
    [candidatos],
  );
  const skills = useMemo(
    () => [...new Set(candidatos.flatMap((c) => c.skills))].sort(),
    [candidatos],
  );

  const q = query.trim().toLowerCase();
  const visible = candidatos.filter((c) => {
    const matchesArea = !area || c.areaInteres === area;
    const matchesSkill = !skill || c.skills.includes(skill);
    const matchesQuery =
      !q ||
      c.nombre.toLowerCase().includes(q) ||
      c.puestoBuscado.toLowerCase().includes(q) ||
      c.skills.some((s) => s.toLowerCase().includes(q));
    return matchesArea && matchesSkill && matchesQuery;
  });

  const clearFilters = () => {
    setArea(null);
    setSkill(null);
    setQuery("");
  };

  if (candidatos.length === 0) {
    return (
      <EmptyState message="Todavía no hay candidatos disponibles en la Bolsa de Trabajo." />
    );
  }

  return (
    <>
      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Buscar por nombre, puesto o habilidad…"
        />
        <select
          value={area ?? ""}
          onChange={(e) => setArea(e.target.value || null)}
          aria-label="Filtrar por área"
          className="h-11 rounded-lg border border-border bg-white px-3.5 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-accent/30"
        >
          <option value="">Todas las áreas</option>
          {areas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <select
          value={skill ?? ""}
          onChange={(e) => setSkill(e.target.value || null)}
          aria-label="Filtrar por habilidad"
          className="h-11 rounded-lg border border-border bg-white px-3.5 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-accent/30"
        >
          <option value="">Todas las habilidades</option>
          {skills.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <p className="mb-4 text-sm text-ink-muted">
        {visible.length} candidato{visible.length === 1 ? "" : "s"}
      </p>

      {visible.length === 0 ? (
        <EmptyState message="No encontramos candidatos con esos criterios.">
          <Button variant="secondary" onClick={clearFilters}>
            Limpiar filtros
          </Button>
        </EmptyState>
      ) : (
        <div className="stagger-children grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((candidato) => (
            <CandidatoCard key={candidato.id} candidato={candidato} />
          ))}
        </div>
      )}
    </>
  );
}
