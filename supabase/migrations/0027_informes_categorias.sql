-- Migration 0027 — Audiencia por informe
--
-- Hasta ahora TODA la sección Informes estaba reservada a los shopping centers:
-- una regla global en `navigation.ts` (INFORMES_CATEGORIAS), igual para los
-- siete informes cargados. CASC necesita decidirlo informe por informe —hay
-- material que sí le sirve a un proveedor y material que no— y hoy la única
-- forma de abrir uno sería abrirlos todos.
--
-- La sección pasa a estar disponible para cualquier socio y es CADA INFORME el
-- que declara qué categorías lo ven. Quien entre sin ningún informe asignado ve
-- la sección vacía con una explicación, no una grilla en blanco.
--
-- `categorias` es socio_categoria[] y no una tabla puente: son tres valores
-- como máximo, se leen siempre junto al informe y nunca se consultan al revés
-- ("qué informes ve esta categoría" se resuelve filtrando la lista que el
-- panel ya trae). Una tabla puente agregaría un join a cada lectura para
-- modelar un arreglo de tres elementos.

alter table informes
  add column categorias socio_categoria[] not null default '{shopping}';

-- El default y el backfill son deliberadamente CONSERVADORES: los informes ya
-- cargados son estadísticas del sector e investigación de mercados de shopping
-- centers, visibles hoy solo para ellos. Abrirlos a proveedores y retailers en
-- la misma migración los expondría sin que nadie los revise uno por uno, y un
-- cambio de visibilidad silencioso es difícil de notar y fácil de lamentar.
--
-- Abrirlos es un clic en el panel; deshacer una exposición no lo es.
update informes set categorias = '{shopping}' where categorias is null;

comment on column informes.categorias is
  'Categorías de socio que ven este informe. Vacío = nadie lo ve (sirve para '
  'sacarlo de circulación sin despublicarlo). El default reserva los informes '
  'nuevos a shoppings; el panel los abre explícitamente.';

-- Índice GIN para el filtro por categoría (`categorias && array[...]`). Mismo
-- criterio que `candidatos_skills_gin` en la migración 0005: es la consulta que
-- corre en cada carga de la sección para cada socio.
create index informes_categorias_gin on informes using gin (categorias);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
--
-- Las políticas de `informes` (migración 0004) NO cambian: siguen dejando leer
-- las filas publicadas a cualquier miembro. La audiencia por categoría se
-- aplica en la aplicación, no acá, y conviene dejar dicho por qué.
--
-- Para filtrarla en RLS haría falta que la política cruzara `informes` contra
-- `socios` en cada fila leída, y esa lectura de `socios` pasa a su vez por
-- `socios_select_self` — una política que depende de otra tabla con RLS propia
-- es difícil de razonar y fácil de romper sin darse cuenta.
--
-- El límite real sigue siendo el mismo que ya protege al PDF: la URL del
-- archivo se firma en el servidor después de verificar la categoría (ver
-- `socio/informes/[id]`). Un socio que conozca el id de un informe que no le
-- toca puede, como mucho, leer su título en una respuesta que igual no le
-- muestra el documento.
