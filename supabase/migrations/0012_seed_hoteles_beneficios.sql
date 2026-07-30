-- Migration 0012 — Seed real hoteles / beneficios into Supabase
--
-- The Beneficios (hotel discounts) section is fed by the `hoteles` table. These
-- are REAL benefits the CASC team had loaded during the prototype; they lived
-- only in the app seed (src/lib/data/mock/seed-data.ts) and were never inserted
-- into Supabase during the DB migration, so the production panel shows none.
--
-- This seeds the 8 real hotels verbatim from the app seed. It is idempotent:
-- a hotel whose `nombre` already exists is skipped, so a second run is a no-op.
--
-- ─────────────────────────────────────────────────────────────────────────────
-- VERIFY BEFORE / AFTER
--   select count(*) from hoteles;                       -- before (likely 0)
--   select count(*) from hoteles where status='publicado';  -- after: 8
-- ─────────────────────────────────────────────────────────────────────────────

insert into hoteles
  (nombre, estrellas, ciudad, direccion, telefono, web, logo_url, descuento, beneficios, reservas, nota, status)
select
  v.nombre, v.estrellas, v.ciudad, v.direccion, v.telefono, v.web, v.logo_url,
  v.descuento, v.beneficios, v.reservas, v.nota,
  v.status::publication_status
from (values
  (
    'Scala Hotel Buenos Aires', 4::smallint, 'CABA',
    'Bernardo de Irigoyen 740 — CABA', '54 11 4343 0606', 'www.scalabuenosaires.com',
    '/assets/hoteles/scala.png',
    'Tarifas corporativas (varían según la fecha de estadía)',
    '{}'::text[],
    'Gala Pérez Mansilla — corporate@scalabuenosaires.com',
    'Informar que se trata de un asociado de la Cámara Argentina de Shopping Centers.',
    'publicado'
  ),
  (
    'Hotel Madero', 5::smallint, 'CABA',
    'Rosario Vera Peñaloza 360 — Puerto Madero — CABA', '54 11 5776 7777', 'www.hotelmadero.com/es',
    '/assets/hoteles/hotel-madero.png',
    'Tarifas corporativas (expresadas en U$S)',
    '{}'::text[],
    'Carolina Vidal Domínguez — cvidal@hotelmadero.com',
    'Informar que se trata de un asociado de la Cámara Argentina de Shopping Centers.',
    'publicado'
  ),
  (
    'Minor Hotels — NH y NH Collection', 4::smallint, 'CABA e Interior',
    'NH Collection Centro Histórico (Bolívar 120), City Hotel NH (Bolívar 160), NH Collection Lancaster (Av. Córdoba 405), NH Collection Jousten (Av. Corrientes 280), NH Collection Crillón (Av. Santa Fe 796), NH 9 de Julio (Cerrito 156), NH Tango (Cerrito 550), NH Latino (Suipacha 309) y NH Florida (San Martín 639) en CABA; NH Panorama y NH Urbano en Córdoba; NH Cordillera en Mendoza. El grupo incluye además las marcas Avani, Tivoli, Nhow y Anantara en distintas ciudades de América y Europa.',
    NULL, NULL,
    '/assets/hoteles/minor-hotels.png',
    '12% a 20% de descuento',
    array[
      '10% de descuento en Restaurantes del Hotel',
      'Cancelaciones flexibles',
      'Wifi premium',
      'Prioridad en check in / check out sujeto a disponibilidad',
      '5% de descuento en reuniones y eventos'
    ],
    'Llamando al 11 6841 9937, informando N° de cliente CASC: 2201331423. También escribiendo a María Yasmín Mancuso — my.mancuso@nh-hotels.com',
    'Informar que se trata de un asociado de la Cámara Argentina de Shopping Centers.',
    'publicado'
  ),
  (
    'InterTower Hotel', 4::smallint, 'Santa Fe',
    'San Jerónimo 2779 — Santa Fe Capital', '54 342 450 3430', 'www.intertowerhotel.com',
    '/assets/hoteles/intertower.jpg',
    '10% sobre tarifa pública',
    '{}'::text[],
    'info@intertowerhotel.com',
    'Informar que se trata de un asociado de la Cámara Argentina de Shopping Centers.',
    'publicado'
  ),
  (
    'Los Silos Hotel', 4::smallint, 'Santa Fe',
    'Dique I, Puerto de Santa Fe — Santa Fe', '54 342 450 2800', 'www.hotellossilos.com.ar',
    '/assets/hoteles/los-silos.jpg',
    '25% sobre tarifa pública',
    '{}'::text[],
    'recepcion.LS@hotellossilos.com.ar — WhatsApp: +54 9 3424 50 2801',
    'Informar que se trata de un asociado de la Cámara Argentina de Shopping Centers.',
    'publicado'
  ),
  (
    'Diplomatic Hotel', 5::smallint, 'Mendoza',
    'Av. Belgrano 1041 — Ciudad de Mendoza', '54 261 405 1900', 'www.diplomatichotel.com.ar',
    '/assets/hoteles/diplomatic.jpg',
    'Tarifas corporativas (expresadas en U$S)',
    array[
      'Early y late check, sujeto a disponibilidad',
      'Upgrade a categoría superior, sujeto a disponibilidad',
      '20% de descuento en el restaurante',
      'Una copa de vino en cortesía durante la estadía, en el Wine tasting de 19 a 20:30 hs.',
      'Dos botellas de agua mineral de 500 ml en cortesía, por habitación',
      'Estacionamiento cubierto del hotel y convenio en aledaño, según disponibilidad',
      'Servicio de Concierge Member of Les Clefs d''Or'
    ],
    'reservas@diplomatichotel.com.ar — Mencionar: convenio especial CASC',
    NULL,
    'publicado'
  ),
  (
    'Howard Johnson Plaza Jujuy', 4::smallint, 'Jujuy',
    'Gral. Güemes 864 — San Salvador de Jujuy', '54 388 340 7627', 'www.hjjujuy.com.ar',
    '/assets/hoteles/howard-johnson-jujuy.jpg',
    'Tarifas corporativas',
    '{}'::text[],
    'reservas@hjjujuy.com.ar',
    'Informar que se trata de un asociado de la Cámara Argentina de Shopping Centers.',
    'publicado'
  ),
  (
    'CityCenter Rosario — Hotel Pullman', 5::smallint, 'Rosario',
    'CityCenter Rosario — Rosario, Santa Fe', '0800-222-2489', NULL,
    '/assets/sponsors/citycenter.webp',
    '15% en alojamiento (lunes a domingo, sobre la tarifa disponible del día, no acumulable). 10% en el restaurante ALL DAY (almuerzo y cena, domingos a jueves). 10% en DAY SPA.',
    array[
      '15% de descuento en alojamiento sobre la tarifa disponible del día',
      '10% de descuento en el restaurante ALL DAY, de domingos a jueves',
      '10% de descuento sobre las tarifas de DAY SPA vigentes'
    ],
    'reservas@citycenter-rosario.com.ar — Tel.: 0800-222-2489 (lunes a domingo, 24 hs.). Mencionar el beneficio al reservar.',
    'CityCenter Rosario es asociado de la CASC.',
    'publicado'
  )
) as v(nombre, estrellas, ciudad, direccion, telefono, web, logo_url, descuento, beneficios, reservas, nota, status)
where not exists (
  select 1 from hoteles h where h.nombre = v.nombre
);
