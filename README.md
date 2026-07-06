# CASC — Plataforma institucional

Plataforma web de la **Cámara Argentina de Shopping Centers**. Panel interno
privado con dos roles (**admin** = comisión, **socio** = shopping center), más
un sitio público institucional que se desarrolla en la última etapa.

## Estado actual (fase prototipo)

La app corre **completa en localhost** con **auth mockeada** y **datos mock en
memoria**. La arquitectura ya es la definitiva: las capas de auth y datos están
detrás de interfaces intercambiables, listas para enchufar Clerk y Supabase sin
reescribir componentes.

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS 4** (tokens de diseño vía `@theme` en `globals.css`)
- **lucide-react** para iconos
- Producción (futuro): **Clerk** (auth), **Supabase** (DB), **Vercel Blob**
  (archivos), **Vercel** (hosting)

> Nota: el proyecto se inicializó con `create-next-app@latest`, que instaló
> Next 16 / Tailwind 4 (no Next 15 / Tailwind 3). Es una versión superior y las
> convenciones aplicadas siguen los docs de Next 16 (`node_modules/next/dist/docs/`).

## Cómo correr

```bash
pnpm install
pnpm dev
```

Abrí http://localhost:3000 → landing pública → **Ingresar** → login mock.
Elegí **Admin** o **Socio**. En desarrollo, la topbar muestra un **switcher de
rol** para alternar vistas sin volver a loguear.

## Arquitectura de capas intercambiables

```
src/lib/auth   → interfaz AuthProvider + impl. mock (Clerk después)
src/lib/data   → repository pattern: interfaces + impl. mock (Supabase después)
```

- **Componentes y páginas consumen SOLO las interfaces** (`getAuth()`,
  `getDataLayer()`), nunca la implementación concreta.
- Cambiar de mock a real se hace en **un único punto** (`getAuth()` /
  `getDataLayer()`), sin tocar la UI.

## Roadmap de infraestructura (localhost → producción)

1. **Ahora (localhost):** auth mock + datos mock en memoria. ✅
2. **Auth real:** reemplazar `mockAuth` por una implementación **Clerk** en
   `src/lib/auth`; roles admin/socio vía metadata.
3. **Datos reales:** implementar los repositorios contra **Supabase**
   (PostgreSQL) en `src/lib/data/supabase`; migrar el esquema de las entidades.
4. **Archivos:** conectar **Vercel Blob** para informes y adjuntos.
5. **Deploy:** subir a **Vercel**, configurar variables de entorno y dominio.
6. **Sitio público + blog:** desarrollar el bloque `(public)` con blog
   administrable desde el panel admin (última etapa).

## Variables de entorno

Creá un archivo `.env.local` (no versionado). No hace falta ninguna en la fase
actual — la app corre sin servicios externos. Claves para las etapas futuras:

```bash
# Auth: Clerk (paso 2)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# DB: Supabase (paso 3)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Storage: Vercel Blob (paso 4)
BLOB_READ_WRITE_TOKEN=
```

## Estructura

```
src/
  app/
    (public)/          sitio institucional (placeholder — última etapa)
    (platform)/
      login/           login mock (botones por rol)
      admin/           dashboard + CRUD (guard: solo admin)
      socio/           home + vistas de solo lectura
  components/
    ui/                primitivas (Button, Card, Badge)
    platform/          sidebar, topbar, shell, role switcher
    shared/            StatCard, SectionHeading, etc.
  lib/
    auth/              AuthProvider (mock) + server actions
    data/              repositories + mock + supabase (stub)
    types/             modelos de dominio
    platform/          navegación por rol
```
