-- Migration 0025 — Respuestas de prueba desde una cuenta de administración
--
-- La encuesta la responden los socios, y cada respuesta apunta a su fila en
-- `socios`. Un admin no tiene esa fila: la foreign key y la policy de insert
-- (migración 0024) rechazaban su envío, así que CASC no tenía forma de probar
-- el formulario de punta a punta antes de mandárselo a sus asociados —
-- completarlo y ver que efectivamente se guarda y aparece en el panel.
--
-- Esta migración habilita ese caso SIN aflojar el de los socios:
--
--   - `socio_id` pasa a ser nullable. Es lo único que permite una respuesta
--     sin socio detrás.
--   - La policy de insert de socios NO cambia: sigue exigiendo que la fila
--     apunte a la fila de `socios` del que llama. Un socio no puede insertar
--     una respuesta sin socio_id; esa puerta queda cerrada.
--   - Una policy nueva, separada, permite a los admins insertar SOLO filas de
--     prueba (socio_id null y es_prueba true). Separada y no una policy más
--     permisiva: así se lee de un vistazo qué puede hacer cada rol, y aflojar
--     una no afloja la otra.
--
-- `es_prueba` existe para que las respuestas de test no se confundan con las
-- reales. Sin esa marca habría que inferirlo de `socio_id is null`, que es
-- una coincidencia, no una declaración: si mañana aparece otra razón para una
-- respuesta sin socio, el filtro del panel empezaría a esconder datos buenos.

alter table encuesta_respuestas
  alter column socio_id drop not null;

-- Marca explícita. `not null default false` para que toda fila ya cargada
-- quede declarada como real, que es lo que son.
alter table encuesta_respuestas
  add column es_prueba boolean not null default false;

comment on column encuesta_respuestas.es_prueba is
  'Respuesta enviada desde una cuenta de administración para probar el '
  'formulario. El panel las separa de las reales y no entran en los promedios.';

comment on column encuesta_respuestas.socio_id is
  'Socio que respondió. Null solo en respuestas de prueba (es_prueba), que no '
  'salen de ninguna cuenta de socio.';

-- El unique de "una sola vez por socio" sigue valiendo para los socios:
-- en Postgres los NULL no colisionan entre sí, así que las filas de prueba
-- (socio_id null) quedan fuera del índice y un admin puede probar el
-- formulario las veces que necesite sin chocar contra su propia respuesta
-- anterior. Es el comportamiento que se quiere, y conviene dejarlo escrito
-- porque parece un descuido y no lo es.

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

-- Los admins ya tenían `encuesta_admin_all` (for all), que los habilita a
-- insertar cualquier fila. Esta policy no agrega permiso: lo ACOTA en la
-- práctica, porque el formulario manda `es_prueba` en true y `socio_id` null,
-- y deja escrito en la base cuál es la forma esperada de una respuesta de
-- prueba. La verificación real de que un admin no se haga pasar por un socio
-- sigue estando en que `socio_id` lo pone el servidor, nunca el formulario.
create policy encuesta_insert_prueba_admin on encuesta_respuestas
  for insert
  to authenticated
  with check (is_admin() and socio_id is null and es_prueba = true);

-- La policy de socios (0024) queda igual: `socio_id` tiene que ser la fila de
-- `socios` del que llama, así que un socio no puede insertar una respuesta de
-- prueba ni responder por otro.
