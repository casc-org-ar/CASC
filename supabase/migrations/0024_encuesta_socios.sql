-- Migration 0023 — Encuesta de satisfacción a socios
--
-- CASC necesita medir tres ejes entre sus asociados: satisfacción con los
-- servicios, prioridades para el año, y usabilidad del portal. Es UNA encuesta
-- concreta con preguntas fijas, no un motor de encuestas genérico: modelarla
-- como columnas tipadas deja que la base rechace valores inválidos (los enums y
-- el check de escala) y que la exportación a CSV salga con columnas estables.
--
-- Reglas del pedido, y dónde vive cada una:
--
--   - "una vez que el usuario respondió que no le aparezca de nuevo"
--     → `socio_id` unique. Un socio tiene a lo sumo una respuesta.
--
--   - "el socio no puede modificar las respuestas una vez enviada"
--     → NO existe policy de UPDATE ni de DELETE para socios (RLS es
--       fail-closed: lo que ninguna policy habilita, queda prohibido).
--       El candado vive acá, no en la interfaz: una pantalla se puede saltear,
--       una policy no.
--
--   - "de la CASC necesitan poder descargar las respuestas"
--     → policy de SELECT para admin sobre toda la tabla.
--
-- `encuesta_slug` versiona la encuesta. Hoy hay una sola ('satisfaccion-2026'),
-- pero el unique es (socio_id, encuesta_slug): una segunda encuesta en el
-- futuro se responde de nuevo sin tocar ni migrar las respuestas de esta.

-- ---------------------------------------------------------------------------
-- Enums. Igual que en 0001: valores cerrados que la base valida por sí misma,
-- en lugar de texto libre que hay que confiar que el app filtró bien.
-- ---------------------------------------------------------------------------

-- "¿Participarías de próximas acciones comerciales conjuntas?"
create type encuesta_participacion as enum ('si', 'no', 'depende');

-- "¿Abrís el portal desde el celular o desktop, principalmente?"
create type encuesta_dispositivo as enum ('celular', 'desktop');

-- ---------------------------------------------------------------------------
-- encuesta_respuestas: una fila por socio y por encuesta.
--
-- Las preguntas abiertas y las de opción múltiple son opcionales por diseño
-- (el pedido marca "abierta, opcional"); las de escala y las de opción única
-- son obligatorias, que es lo que hace que la encuesta sirva para medir.
-- ---------------------------------------------------------------------------
create table encuesta_respuestas (
  id            uuid primary key default gen_random_uuid(),

  -- Quién respondió. `on delete cascade`: si CASC borra a un socio, sus
  -- respuestas se van con él (dato personal, no dato de la Cámara).
  socio_id      uuid not null references socios (id) on delete cascade,

  -- Qué encuesta respondió. Ver nota de versionado arriba.
  encuesta_slug text not null default 'satisfaccion-2026',

  -- Eje 1 — Satisfacción general
  satisfaccion_servicios    smallint not null check (satisfaccion_servicios between 1 and 5),
  utilidad_comunicacion     smallint not null check (utilidad_comunicacion between 1 and 5),
  que_mejorarias            text,

  -- Eje 2 — Prioridades y participación
  -- `temas_prioritarios` es text[] y no un enum[]: la opción "Otro" del
  -- formulario deja escribir un tema propio, y encerrar eso en un enum
  -- obligaría a migrar la base cada vez que alguien nombra un tema nuevo.
  -- La lista cerrada de sugerencias vive en el dominio (TEMAS_PRIORITARIOS).
  temas_prioritarios        text[] not null default '{}',
  participacion_acciones    encuesta_participacion not null,
  -- Canales preferidos: el pedido admite más de uno (Email/WhatsApp/Portal/Redes).
  canales_preferidos        text[] not null default '{}',

  -- Eje 3 — Portal
  facilidad_portal          smallint not null check (facilidad_portal between 1 and 5),
  funcionalidad_sugerida    text,
  dispositivo_principal     encuesta_dispositivo not null,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger encuesta_respuestas_set_updated_at
  before update on encuesta_respuestas
  for each row execute function set_updated_at();

-- EL candado del "una sola vez". A nivel base: aunque la interfaz fallara, un
-- segundo INSERT del mismo socio para la misma encuesta es rechazado por
-- Postgres.
create unique index encuesta_respuestas_socio_unica
  on encuesta_respuestas (socio_id, encuesta_slug);

-- El panel de CASC lista las respuestas de una encuesta, más nuevas primero;
-- el socio consulta si ya respondió. Ambas consultas entran por este índice.
create index encuesta_respuestas_slug_created
  on encuesta_respuestas (encuesta_slug, created_at desc);

comment on table encuesta_respuestas is
  'Respuestas de la encuesta a socios. Una fila por socio y encuesta; '
  'inmutable una vez enviada (no hay policy de UPDATE para socios).';

comment on column encuesta_respuestas.encuesta_slug is
  'Versiona la encuesta. Una encuesta nueva usa otro slug y se responde de '
  'nuevo, sin migrar ni pisar las respuestas anteriores.';

-- ---------------------------------------------------------------------------
-- RLS. Mismo modelo que 0004: nada es accesible hasta que una policy lo abra.
-- ---------------------------------------------------------------------------
alter table encuesta_respuestas enable row level security;

-- El socio inserta SU propia respuesta. El `with check` ata la fila al socio
-- autenticado: no alcanza con estar logueado, la fila tiene que apuntar a la
-- fila de socios que lleva el `clerk_user_id` del token. Así un socio no puede
-- responder en nombre de otro aunque manipule el payload.
create policy encuesta_insert_propia on encuesta_respuestas
  for insert
  to authenticated
  with check (
    socio_id in (
      select s.id from socios s
      where s.clerk_user_id = clerk_user_id()
    )
  );

-- El socio lee SOLO su propia respuesta, y solo para saber si ya respondió
-- (con eso el portal decide si muestra o no el CTA).
create policy encuesta_select_propia on encuesta_respuestas
  for select
  using (
    socio_id in (
      select s.id from socios s
      where s.clerk_user_id = clerk_user_id()
    )
  );

-- DELIBERADAMENTE NO HAY policy de UPDATE ni de DELETE para socios.
-- "El socio no puede modificar las respuestas una vez enviada la encuesta":
-- con RLS activo y sin policy que lo habilite, el UPDATE no es que falle en la
-- interfaz — es que la base no lo ejecuta. Si alguna vez CASC necesita
-- corregir una respuesta, lo hace como admin (policy de abajo), que queda
-- registrado en `updated_at`.

-- CASC (admin) lee todo: es lo que habilita la descarga de respuestas.
-- `for all` y no `for select` para que el admin pueda además depurar una
-- respuesta de prueba o borrar la de un socio que lo pida (habeas data).
create policy encuesta_admin_all on encuesta_respuestas
  for all using (is_admin()) with check (is_admin());
