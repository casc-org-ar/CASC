"use client";

import { useState } from "react";
import { Download, MessageSquareText, Star, Users } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { downloadFile, toCsv } from "@/lib/utils/csv-export";
import {
  DISPOSITIVO_LABEL,
  PARTICIPACION_LABEL,
  type EncuestaRespuesta,
} from "@/lib/types/domain";

/** One answer joined with the member who sent it (joined on the server). */
export interface RespuestaConSocio {
  respuesta: EncuestaRespuesta;
  socioNombre: string;
  socioShopping: string;
  socioEmail: string;
}

/**
 * Admin view of the survey results.
 *
 * Read-only by design: CASC reads and exports, and an answer is never edited
 * from here (the member cannot change theirs either — see migration 0023).
 * That is why this is not built on the generic `DataTable`, whose whole shape
 * is edit/delete row actions.
 *
 * Aggregates are computed client-side over the loaded rows. That is fine at
 * this scale: the population is CASC's active members — hundreds, not
 * millions — and the same rows are already needed for the table and the CSV.
 * Should the survey ever outgrow one page, this is the seam to move behind a
 * SQL aggregate.
 */

/** Average of a numeric answer, to one decimal. `null` with nothing to average. */
function promedio(valores: number[]): number | null {
  if (valores.length === 0) return null;
  const total = valores.reduce((sum, v) => sum + v, 0);
  return Math.round((total / valores.length) * 10) / 10;
}

/** How many times each option was chosen, for a multi-choice question. */
function conteo(listas: string[][]): Map<string, number> {
  const acc = new Map<string, number>();
  for (const lista of listas) {
    for (const valor of lista) {
      acc.set(valor, (acc.get(valor) ?? 0) + 1);
    }
  }
  return acc;
}

/**
 * A counted breakdown, sorted most-chosen first.
 *
 * Bars are relative to the most-chosen option rather than to the response
 * count: with multi-choice answers the totals exceed the number of responses,
 * so a percentage-of-total bar would be misleading. This shows relative
 * weight, and the raw count beside it carries the absolute number.
 */
function Distribucion({
  titulo,
  entradas,
}: {
  titulo: string;
  entradas: [string, number][];
}) {
  const maximo = Math.max(1, ...entradas.map(([, n]) => n));
  return (
    <Card>
      <CardTitle className="mb-4">{titulo}</CardTitle>
      {entradas.length === 0 ? (
        <p className="text-sm text-ink-muted">Sin respuestas todavía.</p>
      ) : (
        <ul className="space-y-3">
          {entradas.map(([etiqueta, cantidad]) => (
            <li key={etiqueta}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-ink">{etiqueta}</span>
                <span className="text-sm font-semibold tabular-nums text-ink-muted">
                  {cantidad}
                </span>
              </div>
              <div
                className="mt-1 h-2 overflow-hidden rounded-full bg-surface"
                role="presentation"
              >
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(cantidad / maximo) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/** A labelled block of an individual answer, inside the detail modal. */
function Dato({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-ink">{children}</dd>
    </div>
  );
}

export function EncuestaManager({
  filas,
  sociosActivos,
}: {
  filas: RespuestaConSocio[];
  sociosActivos: number;
}) {
  const [detalle, setDetalle] = useState<RespuestaConSocio | null>(null);
  const toast = useToast();

  // Test answers (sent from an admin account to check the form works) are
  // listed but never counted: they answer nothing about what CASC's members
  // think, and a handful of them would visibly move an average taken over a
  // few dozen real answers.
  const reales = filas.filter((f) => !f.respuesta.esPrueba);
  const pruebas = filas.length - reales.length;
  const respuestas = reales.map((f) => f.respuesta);

  const promSatisfaccion = promedio(
    respuestas.map((r) => r.satisfaccionServicios),
  );
  const promUtilidad = promedio(respuestas.map((r) => r.utilidadComunicacion));
  const promFacilidad = promedio(respuestas.map((r) => r.facilidadPortal));

  // Response rate over the invited base — real answers only, for the same
  // reason. Guarded against a zero base, which would otherwise read
  // "Infinity%" on an empty instance.
  const tasa =
    sociosActivos > 0
      ? Math.round((reales.length / sociosActivos) * 100)
      : null;

  const temas = conteo(respuestas.map((r) => r.temasPrioritarios));
  const canales = conteo(respuestas.map((r) => r.canalesPreferidos));
  const participacion = conteo(
    respuestas.map((r) => [PARTICIPACION_LABEL[r.participacionAcciones]]),
  );
  const dispositivos = conteo(
    respuestas.map((r) => [DISPOSITIVO_LABEL[r.dispositivoPrincipal]]),
  );

  /**
   * Order a breakdown by count, most-chosen first, ties alphabetical so the
   * list does not reshuffle between renders.
   */
  const ordenar = (mapa: Map<string, number>): [string, number][] =>
    [...mapa.entries()].sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"),
    );

  /**
   * Export every answer with one column per question — what CASC asked for
   * ("necesitan poder descargar las respuestas").
   *
   * Multi-choice answers go in a single cell joined by `toCsv` rather than one
   * column per option: the topics question accepts free text under "Otro", so
   * the set of columns would otherwise change with the data and break any
   * sheet built on top of it.
   */
  const exportarCsv = () => {
    // Real answers only. The export is what CASC analyses, and a test row
    // among them would be counted as a member's opinion by whoever opens the
    // sheet — they have no way to tell it apart once it is out of here.
    const csv = toCsv(reales, [
      { header: "Fecha", value: (f) => f.respuesta.createdAt.slice(0, 10) },
      { header: "Socio", value: (f) => f.socioNombre },
      { header: "Shopping", value: (f) => f.socioShopping },
      { header: "Email", value: (f) => f.socioEmail },
      {
        header: "Satisfacción servicios (1-5)",
        value: (f) => f.respuesta.satisfaccionServicios,
      },
      {
        header: "Utilidad comunicación (1-5)",
        value: (f) => f.respuesta.utilidadComunicacion,
      },
      { header: "¿Qué mejorarías?", value: (f) => f.respuesta.queMejorarias },
      {
        header: "Temas a priorizar",
        value: (f) => f.respuesta.temasPrioritarios,
      },
      {
        header: "Participaría en acciones conjuntas",
        value: (f) => PARTICIPACION_LABEL[f.respuesta.participacionAcciones],
      },
      {
        header: "Canales preferidos",
        value: (f) => f.respuesta.canalesPreferidos,
      },
      {
        header: "Facilidad del portal (1-5)",
        value: (f) => f.respuesta.facilidadPortal,
      },
      {
        header: "Funcionalidad sugerida",
        value: (f) => f.respuesta.funcionalidadSugerida,
      },
      {
        header: "Dispositivo principal",
        value: (f) => DISPOSITIVO_LABEL[f.respuesta.dispositivoPrincipal],
      },
    ]);
    const fecha = new Date().toISOString().slice(0, 10);
    downloadFile(csv, `encuesta-socios-casc-${fecha}.csv`);
    toast.success("CSV descargado.");
  };

  if (filas.length === 0) {
    return (
      <EmptyState message="Todavía no hay respuestas de la encuesta. Los socios la ven al entrar al portal." />
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-muted">
          {reales.length} respuesta{reales.length === 1 ? "" : "s"}
          {tasa !== null && (
            <>
              {" · "}
              {tasa}% de {sociosActivos} socio
              {sociosActivos === 1 ? "" : "s"} activo
              {sociosActivos === 1 ? "" : "s"}
            </>
          )}
          {/* Named rather than folded into the total, so the count on screen
              always matches what the averages were taken over. */}
          {pruebas > 0 && (
            <>
              {" · "}
              {pruebas} de prueba
            </>
          )}
        </p>
        <Button
          variant="secondary"
          onClick={exportarCsv}
          // Nothing to export while every stored answer is a test — the file
          // would come out with headers and no rows.
          disabled={reales.length === 0}
          title={
            reales.length === 0
              ? "Todavía no hay respuestas de socios para exportar."
              : undefined
          }
        >
          <Download className="h-4 w-4" aria-hidden />
          Descargar CSV
        </Button>
      </div>

      {/* Headline averages: the three scale questions, one per survey block. */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Respuestas" value={reales.length} icon={Users} />
        <StatCard
          label="Satisfacción servicios"
          value={promSatisfaccion !== null ? `${promSatisfaccion} / 5` : "—"}
          icon={Star}
        />
        <StatCard
          label="Utilidad comunicación"
          value={promUtilidad !== null ? `${promUtilidad} / 5` : "—"}
          icon={MessageSquareText}
        />
        <StatCard
          label="Facilidad del portal"
          value={promFacilidad !== null ? `${promFacilidad} / 5` : "—"}
          icon={Star}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Distribucion
          titulo="Temas a priorizar"
          entradas={ordenar(temas)}
        />
        <Distribucion
          titulo="Canales preferidos"
          entradas={ordenar(canales)}
        />
        <Distribucion
          titulo="¿Participaría en acciones conjuntas?"
          entradas={ordenar(participacion)}
        />
        <Distribucion
          titulo="Dispositivo principal"
          entradas={ordenar(dispositivos)}
        />
      </div>

      {/* Individual answers. Clicking one opens it in full — the open-text
          questions are the part worth reading one by one, and they do not fit
          in a table cell. */}
      <Card className="mt-6 p-0">
        <div className="border-b border-border p-5">
          <CardTitle>Respuestas individuales</CardTitle>
        </div>
        <ul className="divide-y divide-border">
          {filas.map((fila) => (
            <li key={fila.respuesta.id}>
              <button
                type="button"
                onClick={() => setDetalle(fila)}
                className="flex w-full flex-wrap items-center justify-between gap-3 p-5 text-left transition-colors hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">
                    {fila.socioNombre}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {fila.socioShopping}
                    {fila.socioShopping && " · "}
                    {new Date(fila.respuesta.createdAt).toLocaleDateString(
                      "es-AR",
                    )}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {/* Marked in the list, not filtered out of it: a test answer
                      is still a stored row, and CASC should be able to see
                      (and delete) the ones they left behind. */}
                  {fila.respuesta.esPrueba && (
                    <Badge tone="accent">Prueba</Badge>
                  )}
                  <Badge tone="muted">
                    Servicios {fila.respuesta.satisfaccionServicios}/5
                  </Badge>
                  <Badge tone="muted">
                    Portal {fila.respuesta.facilidadPortal}/5
                  </Badge>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <Modal
        open={detalle !== null}
        onClose={() => setDetalle(null)}
        title={detalle ? detalle.socioNombre : "Respuesta"}
        size="lg"
      >
        {detalle && (
          <dl className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
              {detalle.socioShopping && <span>{detalle.socioShopping}</span>}
              {detalle.socioEmail && <span>· {detalle.socioEmail}</span>}
              <span>
                ·{" "}
                {new Date(detalle.respuesta.createdAt).toLocaleString("es-AR")}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Dato label="Satisfacción servicios">
                {detalle.respuesta.satisfaccionServicios} / 5
              </Dato>
              <Dato label="Utilidad comunicación">
                {detalle.respuesta.utilidadComunicacion} / 5
              </Dato>
              <Dato label="Facilidad del portal">
                {detalle.respuesta.facilidadPortal} / 5
              </Dato>
            </div>

            <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
              <Dato label="Temas a priorizar">
                {detalle.respuesta.temasPrioritarios.join(" · ") || "—"}
              </Dato>
              <Dato label="Canales preferidos">
                {detalle.respuesta.canalesPreferidos.join(" · ") || "—"}
              </Dato>
              <Dato label="Acciones conjuntas">
                {PARTICIPACION_LABEL[detalle.respuesta.participacionAcciones]}
              </Dato>
              <Dato label="Dispositivo principal">
                {DISPOSITIVO_LABEL[detalle.respuesta.dispositivoPrincipal]}
              </Dato>
            </div>

            <div className="space-y-4 border-t border-border pt-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  ¿Qué mejorarías?
                </p>
                {detalle.respuesta.queMejorarias ? (
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-ink">
                    {detalle.respuesta.queMejorarias}
                  </p>
                ) : (
                  <p className="mt-1 text-sm italic text-ink-muted">
                    Sin respuesta.
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  ¿Qué funcionalidad agregarías?
                </p>
                {detalle.respuesta.funcionalidadSugerida ? (
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-ink">
                    {detalle.respuesta.funcionalidadSugerida}
                  </p>
                ) : (
                  <p className="mt-1 text-sm italic text-ink-muted">
                    Sin respuesta.
                  </p>
                )}
              </div>
            </div>
          </dl>
        )}
      </Modal>
    </>
  );
}
