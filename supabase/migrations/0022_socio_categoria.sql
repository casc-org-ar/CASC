-- Migration 0022 — Categoría de socio
--
-- Hasta ahora la plataforma tenía un solo tipo de socio: todos veían las
-- mismas secciones. CASC necesita distinguir entre los shopping centers y el
-- resto de los asociados (proveedores de servicios y retailers), para
-- reservarles ciertas secciones —Informes y Estadísticas— solo a los primeros.
--
-- Los valores del enum replican las categorías que CASC ya usa en el directorio
-- público de asociados y en el formulario de solicitud de asociación
-- ("Shopping center" / "Proveedor de servicio" / "Retailer"), para que exista
-- UNA sola taxonomía en todo el sistema y no dos que haya que reconciliar.

create type socio_categoria as enum ('shopping', 'proveedor', 'retailer');

-- `default 'shopping'` respalda el backfill: al momento de esta migración
-- todos los socios cargados son shopping centers (verificado cruzando el
-- dominio de cada correo contra la web declarada en el directorio de
-- asociados), y no hay ningún proveedor ni retailer invitado todavía.
--
-- El default vive SOLO en la base, como red de seguridad para que ninguna fila
-- quede sin categoría. El alta desde el panel exige elegir explícitamente: un
-- campo precargado se pasa por alto con facilidad, y un socio mal categorizado
-- no da ningún error visible — se descubre cuando alguien ve algo que no
-- debería.
alter table socios
  add column categoria socio_categoria not null default 'shopping';

comment on column socios.categoria is
  'Tipo de asociado. Decide qué secciones de la plataforma ve el socio; '
  'las reglas viven en src/lib/platform/navigation.ts.';

-- Las políticas RLS de `socios` (migración 0004) no cambian: la categoría es
-- un atributo más de la fila, y quién puede leer o escribir esa fila sigue
-- gobernado por las mismas reglas (cada socio ve la suya, el admin todas).
