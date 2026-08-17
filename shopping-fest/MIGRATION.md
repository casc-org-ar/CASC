# Shopping Fest — migración de WordPress/Elementor a código

Migración de la landing de [shoppingfest.com.ar](https://shoppingfest.com.ar) a
una app Next.js autocontenida, sin WordPress ni Elementor.

El sitio se migró **en su estado actual (post-evento)**: todo el copy dice
"¡Gracias por venir!" y "Nos vemos en la próxima edición". No hay countdown ni
fechas activas, porque el original tampoco los tiene.

---

## 1. Cómo estaba construido el original

| Pieza | Versión / detalle |
| --- | --- |
| WordPress | 7.0.4 |
| Tema | Hello Elementor 3.4.7 |
| Page builder | Elementor 4.2.2 + Elementor Pro 4.0.1 |
| Instagram feed | Smash Balloon "Instagram Feed" 6.12.0 |
| jQuery | 3.7.1 + jquery-migrate 3.4.1 + jquery-ui-core |
| Carruseles | Swiper 8.4.5 (vía Elementor) |
| Animaciones scroll | GSAP 3.12.5 + ScrollTrigger (CDN jsdelivr) |
| Smooth scroll | Lenis 1.1.18 (CDN unpkg) |
| Tracking | Google Tag Manager `GTM-KP5SKLH2` |

Una sola página (`page-id-7`) con plantilla `elementor_canvas` — sin header ni
footer de tema, todo dentro de la página. Más una segunda página de Términos y
Condiciones (`page-id-3`) con su propio CSS autocontenido.

El material de partida fue un mirror de HTTrack (`../Shopping Fest/`), con el
CSS de Elementor embebido inline en el HTML (~67KB en una sola línea).

---

## 2. Qué se migró

### Secciones (en orden de aparición)

| # | Sección | Componente |
| --- | --- | --- |
| 1 | Barra marquee superior | `AnnouncementBar` |
| 2 | Hero (banner full-width) | `Hero` |
| 3 | Sobre el evento + redes | `About` |
| 4 | "¡Gracias por venir!" | `ThankYou` |
| 5 | "¡Nos vemos en la próxima edición!" | `NextEdition` |
| 6 | Shoppings adheridos (6 regiones) | `Shoppings` + `ShoppingCarousel` |
| 7 | Impulsado por CASC | `PoweredByCasc` |
| 8 | Instagram (banda teal) | `InstagramSection` |
| 9 | Footer | `Footer` |
| 10 | Barra legal | `LegalBar` |

### Datos

Los **69 shoppings** viven en [`src/data/shoppings.ts`](src/data/shoppings.ts),
agrupados en 6 regiones, cada uno con su logo y su link:

| Región | Cantidad |
| --- | --- |
| CABA | 14 |
| GBA | 24 |
| PAMPEANA | 14 |
| NORTE | 6 |
| CUYO | 6 |
| PATAGONIA | 5 |

En el original cada `<img>` tenía `alt=""`. Se agregó un `name` derivado del
logo para dar texto alternativo accesible — es la única mejora sobre el
original, y es de accesibilidad, no visual.

### Diseño

- **Tipografías**: `Funnel Display` Bold (self-hosted, woff2 + woff) e `Inter`
  (self-hosted vía `next/font`, ya no pega a `fonts.googleapis.com`).
- **Paleta**: en `globals.css` como tokens de Tailwind v4.
  `#F4ECE7` crema · `#E1562B` naranja · `#144E51`/`#156064`/`#135558` verde
  petróleo · `#D4E9A3` verde claro · `#F69C07`/`#EEAD41` ámbar · `#919191` gris.
- **Breakpoints**: 767px (mobile) y 1024px (tablet), los de Elementor.
- **Tamaños en `vw`**: se conservaron **literales** (`3.75vw`, `1.354vw`, …).
  Son relativos al viewport por diseño; pasarlos a una escala fija cambiaría
  cómo se lee la página.

---

## 3. Dependencias de WordPress eliminadas

| Se eliminó | Reemplazo |
| --- | --- |
| WordPress + tema Hello Elementor | Next.js 16 (App Router) |
| Elementor + Elementor Pro | Componentes React |
| jQuery + jquery-migrate + jquery-ui | Nada — no hacía falta |
| Swiper 8 (carruseles) | CSS scroll-snap nativo |
| GSAP + ScrollTrigger | `IntersectionObserver` (`ScrollReveal`) |
| CSS de Elementor inline (67KB) | Tailwind v4 |
| `wp-emoji-loader` | Nada |
| Google Fonts remoto | `next/font` (self-hosted) |
| Lenis desde CDN | Dependencia local (`lenis`) |
| `/wp-content/uploads/` | `public/images`, `public/logos`, `public/icons` |

Notas sobre dos reemplazos que merecen explicación:

**Carruseles.** El widget "nested carousel" de Elementor Pro corría sobre
Swiper 8 (~140KB con jQuery). Se reemplazó por `overflow-x: auto` +
`scroll-snap`, que da el mismo paginado y además suma scroll táctil, trackpad y
teclado gratis. El JS que queda solo calcula qué página está activa para pintar
los bullets.

**Animaciones on-scroll.** GSAP + ScrollTrigger se usaban únicamente para
alternar una clase `.ativo` en elementos `.scroll-*`. Eso es literalmente lo que
hace `IntersectionObserver`. El CSS de la animación se copió tal cual.

---

## 4. Funcionalidad NO migrada

### Feed de Instagram (única pérdida real)

El footer del original mostraba **6 reels** de `@shoppingfestarg` mediante el
plugin Smash Balloon. Ese plugin:

- guardaba el **access token** de Instagram del lado servidor de WordPress;
- refrescaba el feed vía `wp-admin/admin-ajax.php`;
- cacheaba las imágenes en `wp-content/uploads/sb-instagram-feed-images/`.

Sin WordPress no hay token ni endpoint, así que **el feed no es reproducible**.
En el propio mirror ya está roto: HTTrack recibió **400 Bad Request** en
`admin-ajax.php`.

No se rellenó con los thumbnails del mirror a propósito: las URLs de
`cdninstagram.com` vienen firmadas y **caducan en días**, así que habrían dejado
una grilla de imágenes rotas.

`InstagramSection` conserva la banda teal, el handle y las formas decorativas.
Falta solo la grilla de posts.

**Opciones de reemplazo**, de menor a mayor esfuerzo:

1. **Grilla estática curada** — 6 imágenes subidas a mano, cada una linkeando a
   su reel. Cero dependencias, cero mantenimiento; hay que actualizarla a mano.
2. **Instagram Basic Display API** — token propio en variable de entorno + una
   Route Handler que cachee la respuesta. Es lo más cercano al original; el token
   de larga duración caduca a los 60 días y hay que refrescarlo.
3. **Servicio de terceros** (Behold, EmbedSocial, Elfsight) — resuelve el token
   y el cache; es un costo mensual y un script externo.

Si el feed no es prioridad, la opción 1 alcanza y se hace en minutos.

### Otras cosas que conviene saber

- **Meta Pixel**: no aparece en el HTML del original. Si existe, está dentro del
  contenedor de GTM y no es visible desde el código. Se migró el contenedor
  completo, así que cualquier tag que viva ahí sigue funcionando.
- **Formularios, popups, reCAPTCHA, WhatsApp**: no existen en esta landing. No
  hay nada que reemplazar.
- **Videos**: el original no aloja videos propios; los reels viven en Instagram.

---

## 5. Cómo correrlo localmente

```bash
cd shopping-fest
pnpm install
pnpm dev          # http://localhost:3100
```

El puerto es 3100 para no chocar con el sitio principal de CASC (3000).

```bash
pnpm build        # build de producción
pnpm start        # sirve el build en :3100
pnpm lint
```

> Es un proyecto **independiente**, con su propio `package.json`, `tsconfig.json`
> y `node_modules`. No forma parte del workspace pnpm del repo raíz (por eso el
> `.npmrc` con `ignore-workspace-root-check`), y está excluido del `tsconfig.json`
> del raíz para que su alias `@/*` no interfiera con el del sitio CASC.

---

## 6. Variables de entorno

Una sola, y es opcional:

```bash
# .env.local
NEXT_PUBLIC_GTM_ID=GTM-KP5SKLH2
```

Sin ella, `GoogleTagManager` no renderiza nada — útil en desarrollo, para no
mandar hits de prueba a producción.

---

## 7. Verificación hecha

Se comparó contra el original servido en paralelo, con Playwright/Chromium en
**1440 / 1280 / 900 / 390 px**:

- **Estilos**: 44 chequeos (tamaño y peso de fuente, color, alineación,
  line-height, familia) sobre 11 elementos clave → **sin diferencias**.
- **Alturas por sección**: 10 bandas × 3 anchos. 28 de 30 dentro del 3%; las 2
  restantes por debajo del 8%.
- **Alturas totales**: dentro del **1%** en los 4 breakpoints.
- **Consola y red**: **0 errores** y **0 requests fallidas**, original y nueva.
- **Assets**: los 101 devuelven 200.
- **Textos**: diff del contenido renderizado sin diferencias no explicadas.

Dos hallazgos del proceso que vale documentar, porque no se ven a ojo:

1. **El contenedor de 1140px.** Los contenedores `e-con-boxed` de Elementor
   limitan el contenido a `min(100%, 1140px)` centrado. Sin eso, todo el texto
   quedaba pegado al borde izquierdo. Vive en la clase `.boxed`.
2. **El reset de tipografía.** Los widgets de Elementor ponen `line-height: 1` y
   márgenes en 0 en los headings; el preflight de Tailwind los deja en 1.5 y con
   márgenes. Cada heading medía 1.5× de más y **cada sección crecía con él**. Los
   párrafos, en cambio, sí conservan el 1.5 del body, y los widgets `icon-box`
   conservan el `1.2` del tema — tres reglas distintas que hay que respetar por
   separado (ver `globals.css` y los comentarios en `About`/`LegalBar`).

### Cómo reproducir la comparación

```bash
# 1. servir el mirror original (desde la raíz del repo)
#    cualquier server estático sobre "Shopping Fest/" en :3300

# 2. servir la versión nueva
cd shopping-fest && pnpm build && pnpm start   # :3100
```

Los scripts de comparación quedaron en el scratchpad de la sesión, no en el
repo: son herramientas de una sola vez, no algo a mantener.

---

## 8. Notas para el despliegue

- **No reemplazar todavía el sitio en producción.** La versión WordPress sigue
  siendo la publicada; esta migración es para validar primero.
- Es un proyecto Next.js estándar: en Vercel, apuntar el root a `shopping-fest/`.
- Las 3 rutas son **estáticas** (`/`, `/terminos-y-condiciones`, `/_not-found`),
  así que sirve cualquier hosting estático o CDN.
- Definir `NEXT_PUBLIC_GTM_ID` en el entorno de producción.
- **Redirects pendientes** para no perder SEO cuando se corte el WordPress:

  | Vieja | Nueva |
  | --- | --- |
  | `/terminos-y-condiciones/` | `/terminos-y-condiciones` |
  | `/feed/`, `/comments/feed/` | eliminar (RSS de WP) |
  | `/wp-json/*`, `/wp-admin/*`, `/xmlrpc.php` | eliminar |

- **Favicon y metadata** ya migrados (title, description, OG, iconos 32/180/192).
- Al pasar a producción conviene revisar el sitemap: el original no tenía uno
  propio más allá del que generaba WordPress.

---

## 9. Pendientes

| Tema | Estado |
| --- | --- |
| Feed de Instagram | **Decisión pendiente** — ver sección 4 |
| Reemplazar producción | Bloqueado a propósito hasta validar |
| Sitemap / `robots.txt` | No migrados (los generaba WP) |
| Convertir en repo aparte | Preparado: la carpeta es autocontenida |
