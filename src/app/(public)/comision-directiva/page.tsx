import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import {
  BriefcaseBusiness,
  Building2,
  Network,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import { PageHero } from "@/components/public/page-hero";
import { JoinCta } from "@/components/public/join-cta";
import { Card } from "@/components/ui/card";
import { IconFrame } from "@/components/ui/icon-frame";
import { cn } from "@/lib/utils";

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
  photo?: {
    src: string;
    alt: string;
  };
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

/**
 * Staff — migrated verbatim from comision-directiva.html. Not part of the
 * Comisión Directiva: this is the Cámara's operational management.
 */
const staff: Member[] = [
  { role: "Gerente General", name: "Carolina Lopes Perera" },
  { role: "Staff", name: "Gabriela Domínguez" },
  { role: "Staff", name: "Florencia Gazzo" },
];

const president = board[0];
const vicePresidents = board.filter((member) =>
  member.role.startsWith("Vicepresidente"),
);
const executiveRoles = board.filter((member) =>
  ["Secretario", "Tesorero"].includes(member.role),
);
const directors = board.filter((member) => member.role === "Vocal");

type IconComponent = typeof UsersRound;

function SectionHeading({
  title,
  icon: Icon,
}: {
  title: string;
  icon: IconComponent;
}) {
  return (
    <div className="flex items-center gap-3">
      <IconFrame size="xl">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </IconFrame>
      <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}

function SectionHeader({
  title,
  icon,
  aside,
}: {
  title: string;
  icon: IconComponent;
  aside?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
      <SectionHeading title={title} icon={icon} />
      {aside && (
        <p className="text-sm font-medium text-ink-muted sm:text-right">
          {aside}
        </p>
      )}
    </div>
  );
}

function SectionBlock({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "animate-fade-in-up rounded-xl border border-border bg-surface/60 p-5 shadow-none sm:p-7 lg:p-8",
        className,
      )}
    >
      {children}
    </section>
  );
}

function MemberCard({
  member,
  variant = "default",
}: {
  member: Member;
  variant?: "featured" | "default" | "auditor";
}) {
  const isFeatured = variant === "featured";
  const isAuditor = variant === "auditor";
  const isSupplementary = member.role === "Suplente";

  return (
    <Card
      className={cn(
        "card-depth h-full rounded-lg bg-white p-4 transition-all duration-200 ease-out hover:border-accent/60 sm:p-5",
        isFeatured && "border-primary/25 bg-surface/60 p-5 shadow-none sm:p-6",
        isAuditor && "bg-bg",
      )}
    >
      <div className="flex gap-4">
        <IconFrame
          size={
            isFeatured ? "avatarLg" : isSupplementary ? "md" : "avatar"
          }
          variant={isFeatured ? "solid" : "primary"}
          contentClassName={cn(
            member.photo && "from-white to-white",
            isAuditor && "from-accent/10 to-white",
          )}
        >
          {member.photo ? (
            <Image
              src={member.photo.src}
              alt={member.photo.alt}
              fill
              sizes={isFeatured ? "80px" : "64px"}
              className="object-cover"
            />
          ) : (
            <UserRound
              className={cn(
                "h-7 w-7",
                isFeatured && "h-9 w-9",
                isSupplementary && "h-5 w-5",
              )}
            />
          )}
        </IconFrame>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase leading-none tracking-[0.18em] text-primary">
            {member.role}
          </p>
          <h3
            className={cn(
              "mt-1 text-lg font-bold leading-tight tracking-tight text-ink",
              isFeatured && "text-xl sm:text-2xl",
            )}
          >
            {member.name}
          </h3>
          {member.org && (
            <p className="mt-2 flex items-start gap-2 text-sm leading-5 text-ink-muted">
              <Building2
                className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                aria-hidden="true"
              />
              <span>{member.org}</span>
            </p>
          )}
        </div>
      </div>

      {member.alternate && (
        <dl className="mt-4 border-t border-border pt-3">
          <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink-muted">
            Suplente
          </dt>
          <dd className="mt-1 text-sm font-semibold text-ink">
            {member.alternate}
          </dd>
        </dl>
      )}
    </Card>
  );
}

function MemberGrid({
  members,
  variant,
  columns = "lg:grid-cols-3",
}: {
  members: Member[];
  variant?: "default" | "auditor";
  columns?: string;
}) {
  return (
    <ul className={cn("grid gap-5 sm:grid-cols-2", columns, "stagger-children")}>
      {members.map((member) => (
        <li key={`${member.role}-${member.name}`}>
          <MemberCard member={member} variant={variant} />
        </li>
      ))}
    </ul>
  );
}

export default function ComisionDirectivaPage() {
  return (
    <>
      <PageHero
        title="Comisión Directiva"
        subtitle="La Comisión Directiva de la CASC está integrada por referentes de la industria que conducen y acompañan la gestión institucional de la Cámara, velando por el desarrollo, la representación y el fortalecimiento del sector."
      />

      <section className="mx-auto max-w-7xl space-y-12 px-4 py-16 sm:px-6 lg:px-8">
        {/*
          The Comisión Directiva is a single body: the Comité Ejecutivo (Presidente,
          Vicepresidencias, Secretaría and Tesorería) together with the Vocales. Both
          live inside one block so that unity reads visually. Revisores de Cuentas is a
          separate organ, and Gerencia General is not part of the Comisión at all.
        */}
        <SectionBlock>
          <SectionHeader
            title="Comisión Directiva"
            icon={Network}
            aside={`${board.length} integrantes`}
          />

          <h3 className="mb-6 text-center text-lg font-bold tracking-tight text-ink">
            Comité Ejecutivo
          </h3>

          <div className="relative">
            <div className="mx-auto max-w-2xl animate-fade-in-up">
              <MemberCard member={president} variant="featured" />
            </div>

            <div
              className="mx-auto hidden h-8 w-px bg-border md:block"
              aria-hidden="true"
            />

            <div className="relative mx-auto max-w-5xl">
              <span
                className="absolute -top-4 left-1/4 right-1/4 hidden h-px bg-border md:block"
                aria-hidden="true"
              />
              <ul className="grid gap-5 md:grid-cols-2 stagger-children">
                {vicePresidents.map((member) => (
                  <li key={`${member.role}-${member.name}`}>
                    <MemberCard member={member} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5">
              <MemberGrid members={executiveRoles} columns="lg:grid-cols-2" />
            </div>
          </div>

          <div className="mt-10 border-t border-border pt-8">
            <h3 className="mb-6 text-lg font-bold tracking-tight text-ink">
              Vocales
            </h3>
            <MemberGrid members={directors} columns="lg:grid-cols-3" />
          </div>
        </SectionBlock>

        <SectionBlock className="bg-bg">
          <SectionHeader title="Revisores de Cuentas" icon={ShieldCheck} />

          <div className="grid gap-8 lg:grid-cols-2">
            <section>
              <h3 className="mb-5 text-lg font-bold text-ink">Titulares</h3>
              <MemberGrid
                members={auditorsTitular}
                variant="auditor"
                columns="lg:grid-cols-1"
              />
            </section>

            <section>
              <h3 className="mb-5 text-lg font-bold text-ink">Suplentes</h3>
              <MemberGrid
                members={auditorsAlternate}
                variant="auditor"
                columns="lg:grid-cols-1"
              />
            </section>
          </div>
        </SectionBlock>

        {/* Staff anchor referenced by the header menu. */}
        <SectionBlock id="staff" className="scroll-mt-24 bg-bg">
          <SectionHeader title="Staff" icon={BriefcaseBusiness} />
          <p className="mb-6 max-w-3xl text-sm leading-6 text-ink-muted">
            La Gerencia General no integra la Comisión Directiva: conduce la
            gestión operativa y administrativa de la Cámara.
          </p>
          <MemberGrid members={staff} columns="lg:grid-cols-2" />
        </SectionBlock>
      </section>

      <JoinCta />
    </>
  );
}
