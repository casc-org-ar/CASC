import type { Metadata } from "next";
import { PageHero } from "@/components/public/page-hero";
import { JoinCta } from "@/components/public/join-cta";

/**
 * Comisión Directiva — migrated verbatim from comision-directiva.html.
 */

export const metadata: Metadata = {
  title: "Comisión Directiva — CASC",
  description:
    "La Comisión Directiva de la CASC está integrada por referentes de la industria que conducen y acompañan la gestión institucional de la Cámara.",
};

interface Member {
  role: string;
  name: string;
  org?: string;
  alternate?: string;
}

const board: Member[] = [
  { role: "Presidente", name: "Santiago Blaksley", org: "Fortín Maure S.A.", alternate: "Pablo Peralta Ramos" },
  { role: "Vicepresidente 1º", name: "Ezequiel Herszage", org: "IRSA Inversiones y Representaciones S.A.", alternate: "Ben Elsztain" },
  { role: "Vicepresidente 2º", name: "Sebastián Núñez", org: "CENCOSUD S.A.", alternate: "Franco González" },
  { role: "Secretario", name: "Fabián Tutundjian", org: "Constructora Km. 44 S.A.", alternate: "Claudio Tutundjian" },
  { role: "Tesorero", name: "Issel Kiperszmid", org: "Continental Urbana S.A.I.", alternate: "Juan Pablo Albano" },
  { role: "Vocal", name: "Marcelo Chane", org: "Fideicomiso Nuevo Quilmes Plaza", alternate: "Leonardo Domnanovich" },
  { role: "Vocal", name: "Silvia Fachinsky", org: "Galerías Pacífico S.A.", alternate: "Juan Ignacio Gómez" },
  { role: "Vocal", name: "Roberto Garegnani", org: "Restate Pamani S.A.", alternate: "Mariano Jorge Nine" },
  { role: "Vocal", name: "Antonio Eduardo Heinz", org: "Capdel S.A.", alternate: "Manuel Rodríguez" },
  { role: "Vocal", name: "Elvia Graciela Jorge", org: "Anuar Jorge", alternate: "Verónica Alejandra Aguirre" },
  { role: "Vocal", name: "Diego Lago", org: "Open Mall S.A.", alternate: "Carolina Groisman" },
  { role: "Vocal", name: "Catalina López Soto", org: "Fideicomiso Paseo Ushuaia", alternate: "Gustavo Susskind" },
  { role: "Vocal", name: "Joaquín Maggi", org: "BA Mall SAU", alternate: "Germán Herrera" },
  { role: "Vocal", name: "Fernando Monedero", org: "Libertad S.A.", alternate: "Ramón Quagliata" },
  { role: "Vocal", name: "Sebastián Schneider", org: "Deno S.A.", alternate: "Adrián Dimuro" },
  { role: "Vocal", name: "Nazareno Vega", org: "Bahía Blanca Plaza Shopping S.A.", alternate: "Elisabet Mena" },
];

const auditorsTitular: Member[] = [
  { role: "Titular", name: "Javier Cirnigliaro", org: "Otto Garde y Cía. SAICFEI" },
  { role: "Titular", name: "Gustavo Duben", org: "Inversora Fejosa S.A." },
  { role: "Titular", name: "Valeria Grand", org: "YMK S.A." },
];

const auditorsAlternate: Member[] = [
  { role: "Suplente", name: "Nicolás Báez", org: "CECNOR S.A." },
  { role: "Suplente", name: "Analía Delego", org: "Tosnak S.R.L." },
  { role: "Suplente", name: "María Laura Gregoriadis", org: "Else S.A." },
];

function MemberCard({ member }: { member: Member }) {
  return (
    <div className="rounded-lg border border-border bg-bg p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        {member.role}
      </p>
      <p className="mt-1 font-bold text-ink">{member.name}</p>
      {member.org && <p className="text-sm text-ink-muted">{member.org}</p>}
      {member.alternate && (
        <p className="mt-2 text-sm text-ink-muted">
          {member.alternate} <span className="text-xs">(Suplente)</span>
        </p>
      )}
    </div>
  );
}

export default function ComisionDirectivaPage() {
  return (
    <>
      <PageHero
        title="Comisión Directiva"
        subtitle="La Comisión Directiva de la CASC está integrada por referentes de la industria que conducen y acompañan la gestión institucional de la Cámara, velando por el desarrollo, la representación y el fortalecimiento del sector."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {board.map((m) => (
            <MemberCard key={`${m.role}-${m.name}`} member={m} />
          ))}
        </div>

        <h2 className="mt-14 text-2xl font-bold text-ink">
          Revisores de Cuenta — Titulares
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {auditorsTitular.map((m) => (
            <MemberCard key={m.name} member={m} />
          ))}
        </div>

        <h2 className="mt-14 text-2xl font-bold text-ink">
          Revisores de Cuenta — Suplentes
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {auditorsAlternate.map((m) => (
            <MemberCard key={m.name} member={m} />
          ))}
        </div>

        {/* Staff anchor referenced by the header menu. */}
        <div id="staff" className="scroll-mt-24" />
      </section>

      <JoinCta />
    </>
  );
}
