# Migración del sitio público CASC — Plan y Auditoría (Etapa 0)

> **Estado:** Etapa 0 (relevamiento). No se ha migrado ni modificado nada todavía.
> **Objetivo:** paridad de contenido primero (Etapa 1), rediseño después (Etapa 2).

---

## 0. Hallazgos clave (leer antes que nada)

Antes de listar páginas, tres cosas que difieren del brief original y condicionan el plan:

1. **El sitio original NO está en `/_legacy/casc-original/`.** Vive fuera del repo, en
   `c:\My Web Sites\CASC\web`. Para la Etapa 0 se auditó in-situ; **no se movió nada**.
   La decisión de copiarlo a `/_legacy` se toma al iniciar la Etapa 1 (ver §6).

2. **No es HTML estático: es el scrape de una app Laravel + Filament + Livewire.**
   Todo `build/`, `vendor/`, `css/filament/`, `js/filament/`, `vendor/livewire.js`,
   `storage/`, `index.php/`, `password-reset/` es infraestructura del panel PHP original.
   **Nada de eso se migra** — la plataforma interna ya existe en `(platform)`.

3. **De 286 archivos HTML, solo ~20 son páginas reales del sitio.** El resto (~250) son
   copias de sitios EXTERNOS de terceros que el scraper siguió por los links:
   `asociados/_http_.../`, `asociados/_https_.../`, `asociados/_mailto_...`. **Son ruido, se descartan.**

**Buena noticia técnica:** el markup usa **Tailwind CSS** (mismas utilidades que ya usás
en el proyecto: `text-4xl font-extrabold tracking-tight text-gray-900`). La migración de
clases será mayormente directa, con ajustes puntuales Tailwind v3 → **v4** (tu stack).

---

## 1. Stack destino (ya existente en el repo)

| Item        | Valor |
|-------------|-------|
| Framework   | Next.js **16.2.10** (App Router) |
| React       | 19.2.4 |
| Estilos     | **Tailwind CSS v4** (`@tailwindcss/postcss`) |
| Iconos      | `lucide-react` |
| Utilidades  | `clsx` + `tailwind-merge` |
| Estructura  | Route groups `(public)` y `(platform)` ya creados |

La arquitectura objetivo del brief **ya está armada**: un solo Next.js, route groups
separados, `components/{platform,shared,ui}`, `lib/data` con repositorios y Supabase.

---

## 2. Inventario de páginas del sitio original

### 2.1 Páginas núcleo → migrar en Etapa 1 (12)

| # | Archivo original | Contenido | Ruta propuesta `(public)` |
|---|------------------|-----------|---------------------------|
| 1 | `index.html` | Home institucional (hero, secciones, destacados) | `/` |
| 2 | `nosotros.html` | Quiénes somos + Objetivos (Defender/Impulsar/Colaborar/Propiciar/Participar) | `/nosotros` |
| 3 | `comision-directiva.html` | Comisión directiva | `/comision-directiva` |
| 4 | `estatuto.html` | Estatuto | `/estatuto` |
| 5 | `datos-del-sector.html` | Datos y estadísticas del sector | `/datos-del-sector` |
| 6 | `delegaciones-regionales.html` | Delegaciones regionales | `/delegaciones-regionales` |
| 7 | `asociados.html` | Listado/directorio de asociados | `/asociados` |
| 8 | `como-asociarse.html` | Cómo asociarse | `/como-asociarse` |
| 9 | `beneficios.html` | Beneficios para asociados | `/beneficios` |
| 10 | `actividades.html` | Actividades / agenda | `/actividades` |
| 11 | `bolsa-de-trabajo.html` | Bolsa de trabajo | `/bolsa-de-trabajo` |
| 12 | `contacto.html` | Contacto (form) | `/contacto` |

### 2.2 Páginas legales → migrar en Etapa 1 (4)

| # | Archivo original | Ruta propuesta |
|---|------------------|----------------|
| 13 | `politicas-de-privacidad.html` | `/politicas-de-privacidad` |
| 14 | `politica-de-cookies.html` | `/politica-de-cookies` |
| 15 | `terminos-y-condiciones.html` | `/terminos-y-condiciones` |
| 16 | `estatuto.html` | (ya contado arriba) |

### 2.3 Fichas de asociados → 103 páginas individuales

Slugs reales en `asociados/` (ej. `abasto-shopping.html`, `alto-palermo.html`,
`galerias-pacifico.html`, `dot-baires-shopping.html`…). Son fichas por shopping.

- **Ruta propuesta:** `/asociados/[slug]` (una ruta dinámica, no 103 archivos).
- **Decisión pendiente (§5):** ¿migrar como páginas estáticas ahora, o modelar como
  datos y alimentar desde el panel interno más adelante? Recomiendo lo segundo — pero
  para Etapa 1 basta con extraer su contenido a un dataset y renderizar con `[slug]`.
- Excluidos: `asociados/1..6.html` (paginación del scrape) y `_mailto_*`.

### 2.4 Artículos (noticias + actividades) → Etapa 3 (futuro)

Sistema de blog/noticias. **No se migra en Etapas 1-2** (el brief lo posterga a Etapa 3,
alimentado desde el panel). Se inventaría para no perderlo:

- `articulos/noticias.html` + 3 notas
- `articulos/actividades.html` + 7 actividades/webinars
- Sueltos en raíz: `webinar-gestion-de-mall-integral-abril-2026.html`,
  `webinar-remodelar-un-shopping-junio-20266883.html`

### 2.5 Descartar explícitamente

| Qué | Por qué |
|-----|---------|
| `login.html` | La auth ya vive en `(platform)/login` |
| `index564a.html`, `indexc8dc.html` | Duplicados del home (variantes del scrape) |
| `asociados/_http_/`, `_https_/`, `_mailto_*` (~250 HTML) | Sitios EXTERNOS de terceros, no son CASC |
| `index.php/`, `password-reset/`, `storage/*.html` | Infra del panel Laravel |

---

## 3. Recursos (assets)

| Tipo | Cantidad | Ubicación original | Destino |
|------|----------|--------------------|---------|
| Imágenes | ~209 | ver desglose abajo | `/public/assets/…` |
| PDFs | **0** | — | — |
| Fuentes | **0** en el scrape | (Inter se carga vía `next/font`) | — |

**Desglose de imágenes:**

| Origen | Nº | Qué son | ¿Migrar? |
|--------|----|---------| -------- |
| `storage/casc70152122/shop/logos` | 95 | Logos de shoppings asociados | Sí → `/public/assets/asociados/logos` |
| `storage/casc70152122/creator/uploads` | 80 | Imágenes de contenido/páginas | Sí (filtrar las usadas) |
| `storage/casc70152122/creator/blog` | 10 | Imágenes de notas | Etapa 3 |
| `storage/casc70152122/creator/banners` | 9 | Banners de home | Sí → `/public/assets/banners` |
| `storage/imgs/creator/widget/carusel` | 5 | Carrusel del home | Sí |
| `storage/uploads` + `storage/blog` + otros | ~10 | Varios | Revisar caso a caso |
| `images/` | 1 | — | Revisar |

> Regla: se conservan las originales en `/public/assets` y se sirven optimizadas con
> `next/image`. No se completa ni inventa ningún asset faltante; si algo está roto, se marca.

---

## 4. Navegación

### 4.1 Menú principal (extraído del `index.html`)

Institucional → **Nosotros · Comisión Directiva · Estatuto · Datos del Sector · Delegaciones Regionales**
Asociados → **Asociados (directorio) · Cómo Asociarse · Beneficios**
Actividades · Bolsa de Trabajo · Contacto · [Acceso / Login → `(platform)`]

### 4.2 Footer

Contiene links legales (Privacidad, Cookies, Términos) + datos de contacto + redes.
Se reconstruye en `components/public/Footer`.

### 4.3 Layout público

`(public)/layout.tsx` → Header + Footer compartidos por todas las páginas públicas.
Header y Footer como componentes en `components/public/`.

---

## 5. Decisiones tomadas ✅

1. **`/_legacy`:** copiar **solo lo esencial** a `/_legacy/casc-original/` (NO el scrape
   entero). Copiado: 15 HTML núcleo/legales + 103 fichas de asociados. Excluido de
   `tsconfig` (`exclude`), `eslint` (`_legacy/**`) y del build (Next solo compila `src/`).
   **Versionado en git** (repo autocontenido). Original en `c:\My Web Sites` intacto.

2. **Fichas de asociados (103):** **data-driven** → dataset en `lib/data` + ruta
   `/asociados/[slug]`. Escala mejor y conecta con el panel en Etapa 3.

3. **URLs con `.html`:** **rutas limpias** (`/pagina`) + **redirects 301** de `*.html`
   → `/*` para no perder SEO. Documentado en `next.config.ts` al llegar a Etapa 1.

---

## 6. Plan de ejecución (resumen de etapas)

- **Etapa 0 — Auditoría** ✅ (este documento).
- **Etapa 1 — Migración fiel** ✅ (completa, ver §7).
- **Etapa 2 — Rediseño institucional:** aplicar design system CASC (Inter, motivo `[ ]`,
  paleta neutra + azul de acento), jerarquía, responsive, `next/image`, microinteracciones.
- **Etapa 3 — Blog/noticias** (futuro): `articulos/` alimentado desde el panel.

---

## 7. Estado Etapa 1 — Migración fiel

**Chrome público** ✅ — `(public)/layout.tsx` con Header (menú jerárquico + CTAs) y
Footer (contacto real, redes, legales). Componentes en `components/public/`.

**Páginas migradas (14/15 rutas en 200):**

| Ruta | Estado | Notas |
|------|--------|-------|
| `/` (home) | ✅ | Hero carrusel + ¿Qué es CASC? + funciones + CTA. Noticias/Capacitaciones → Etapa 3 |
| `/nosotros` | ✅ | Intro, 5 objetivos, Propuesta de Valor 2026 (PDF externo) |
| `/comision-directiva` | ✅ | Nómina completa + revisores + ancla `#staff` |
| `/estatuto` | ✅ | 74 artículos, texto legal preservado exacto (inyectado) |
| `/datos-del-sector` | ✅ | 9 estadísticas (peso Extra Light) |
| `/delegaciones-regionales` | ✅ | 6 delegados |
| `/como-asociarse` | ✅ | 3 bloques + formulario (submit TODO backend) |
| `/beneficios` | ✅ | Lista + descuentos Pullman + panel exclusivo |
| `/actividades` | ✅ | Estructura 2026/2025 → eventos Etapa 3 |
| `/bolsa-de-trabajo` | ✅ | "Próximamente" + mail RRHH |
| `/contacto` | ✅ | Datos + formulario (submit TODO backend) |
| `/terminos-y-condiciones` | ✅ | Texto legal preservado exacto |
| `/politicas-de-privacidad` | ✅ | Texto legal preservado exacto |
| `/politica-de-cookies` | ✅ | Texto legal preservado exacto |
| `/asociados` | ✅ | Directorio de 103 fichas agrupado por categoría (logos) |
| `/asociados/[slug]` | ✅ | Ficha dinámica, 103 pre-renderizadas, datos reales |

**Etapa 1 cerrada:**
1. ✅ Directorio `/asociados` + ruta dinámica `/asociados/[slug]` (dataset en
   `lib/data/asociados.ts`, 103 asociados, 98 logos en `/public/assets/asociados/logos`).
2. ✅ Redirects `*.html` → rutas limpias en `next.config.ts` (308 permanente;
   equivalente SEO al 301, preserva el método — así lo maneja Next).
3. ✅ Logos copiados y renombrados por slug.

**Criterios aplicados (paridad, sin inventar):**
- Contenido de blog (noticias, actividades, cards) marcado `TODO Etapa 3`, no fabricado.
- Formularios (asociarse, contacto) con campos reales pero submit sin cablear
  (el original era Livewire/PHP; el backend es fuera de alcance de la parидад).
- Textos legales inyectados desde HTML extraído para no re-tipear (fidelidad legal).

---

## 8. Ajustes de prototipo — feedback clienta (Victoria)

### ✅ Punto 1 — Imagen de portada en Novedades
Noticias, Webinars e Informes muestran imagen de portada tipo card/posteo en el
listado del Socio, con click al detalle. Componente `CardCover` con fallback al
motivo `[ ]` cuando no hay imagen. Campo de portada agregado a los forms del
Admin (webinar/informe; noticia ya lo tenía). Tipos: `portadaUrl?` en `Webinar`
e `Informe`.

### ✅ Punto 3 — Diferencial visual Admin/Socio
Misma marca CASC, distinta jerarquía: sidebar **negro** (`casc-black`) en Admin
vs **navy** en Socio, más un badge persistente **"Panel de administración"** en
el topbar del Admin. Un vistazo alcanza para saber en qué panel se está.

### ⬜ Punto 2 — Newsletter (DECISIÓN DE PRODUCTO PENDIENTE)
**No se programó**: requiere que Victoria defina el enfoque antes de tocar código.

El envío real se hace por un proveedor externo (Brevo/Mailchimp). La pregunta es
qué rol cumple la sección Newsletter de la plataforma:

- **Opción A (recomendada) — Repositorio de ediciones:** el admin sube el
  contenido o un link/embed de cada edición YA enviada por la herramienta
  externa; los socios acceden al historial. Menor alcance, encaja con el proyecto
  actual (la sección hoy ya es tipo archivo con `adjuntoUrl`).
- **Opción B — Editor propio + envío:** diseñar el newsletter en la plataforma y
  disparar el envío desde ahí. Es construir una herramienta de email marketing
  completa: mucho mayor alcance y complejidad, no contemplado hoy.

**Acción:** confirmar A o B con Victoria. Si es A, el trabajo es menor (la
estructura ya existe). Si es B, hay que replantear alcance y presupuesto.
