-- Migration 0026 — Textos editables de la encuesta
--
-- CASC pidió poder reformular las preguntas y retocar las opciones sin pasar
-- por un deploy. Hasta ahora los enunciados vivían en el JSX del formulario y
-- las opciones en constantes de TypeScript: cambiar una coma era una release.
--
-- Lo que NO cambia: las nueve preguntas y sus tipos siguen siendo columnas
-- tipadas en `encuesta_respuestas`. Esto edita CÓMO SE LEE la encuesta, no de
-- qué está hecha. Agregar o quitar preguntas es otra cosa —un motor de
-- encuestas— y queda fuera de alcance a propósito.
--
-- Dos piezas:
--
--   1. `encuesta_textos`: una fila por encuesta con todos sus enunciados y
--      opciones. Es lo que el formulario lee y lo que el panel edita.
--
--   2. `encuesta_respuestas.textos` (jsonb): la copia de esos textos tal como
--      estaban cuando el socio respondió.
--
-- El punto 2 es lo importante y es el pedido explícito: "se conserva con qué
-- texto respondió cada uno". Si CASC cambia "¿Qué mejorarías?" por "¿Qué te
-- gustaría que cambiemos del portal?", las respuestas anteriores fueron a la
-- primera pregunta. Mostrarlas bajo la segunda sería atribuirle a un socio
-- algo que nunca contestó, y el CSV —que es lo que CASC analiza— saldría
-- mintiendo. Guardar el enunciado con la respuesta es la única forma de que
-- una exportación vieja siga siendo cierta.
--
-- Por qué una fila jsonb y no una tabla de preguntas: las preguntas son fijas
-- y conocidas. Una tabla con una fila por pregunta invita a agregar filas, que
-- es justamente lo que este alcance no soporta —quedaría una pregunta en la
-- base que ninguna columna de `encuesta_respuestas` puede guardar—. Un único
-- documento por encuesta hace imposible ese estado.

-- ---------------------------------------------------------------------------
-- encuesta_textos: los enunciados vigentes de cada encuesta.
-- ---------------------------------------------------------------------------
create table encuesta_textos (
  -- La encuesta a la que pertenecen. Misma clave que usa `encuesta_respuestas`,
  -- y primary key: una encuesta tiene exactamente un juego de textos.
  encuesta_slug text primary key,

  -- Todos los enunciados y opciones, en la forma que consume el formulario.
  -- Se valida en la app (zod) antes de escribir: Postgres puede garantizar que
  -- es jsonb, no que tenga las nueve preguntas.
  contenido jsonb not null,

  -- Quién tocó por última vez, para poder preguntarle. Texto y no una FK a
  -- socios: es un dato de auditoría, y si esa persona se da de baja el registro
  -- de que editó no debería irse con ella.
  editado_por text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger encuesta_textos_set_updated_at
  before update on encuesta_textos
  for each row execute function set_updated_at();

comment on table encuesta_textos is
  'Enunciados y opciones vigentes de cada encuesta. El formulario los lee; el '
  'panel de admin los edita. Las preguntas en sí son fijas (columnas de '
  'encuesta_respuestas): esto cambia cómo se leen, no de qué está hecha.';

comment on column encuesta_textos.contenido is
  'Documento con los nueve enunciados, las opciones de las preguntas de '
  'elección y los extremos de las escalas. Validado en la app antes de grabar.';

-- ---------------------------------------------------------------------------
-- El snapshot en cada respuesta.
-- ---------------------------------------------------------------------------

-- Nullable porque las respuestas ya guardadas no lo tienen: se enviaron cuando
-- los textos vivían en el código. `null` significa "los textos originales", y
-- la app los resuelve contra la redacción inicial, que queda versionada en el
-- repositorio. Rellenarlas acá sería inventar un dato que nadie registró.
alter table encuesta_respuestas
  add column textos jsonb;

comment on column encuesta_respuestas.textos is
  'Copia de los enunciados tal como los leyó quien respondió. Null en las '
  'respuestas anteriores a esta migración, que corresponden a los textos '
  'originales del código.';

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table encuesta_textos enable row level security;

-- Cualquier miembro autenticado los lee: el formulario los necesita para
-- renderizarse, y un socio que no puede leer los enunciados no puede responder.
-- No hay nada sensible acá; es el texto que la encuesta muestra.
create policy encuesta_textos_select_member on encuesta_textos
  for select using (is_member());

-- Editar es solo de CASC.
create policy encuesta_textos_admin_all on encuesta_textos
  for all using (is_admin()) with check (is_admin());
