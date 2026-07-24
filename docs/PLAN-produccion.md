# Plan de producción — CASC

De prototipo (mock) a plataforma real: Clerk (auth) + Supabase (datos + RLS),
backend, seguridad, SEO y mobile. Ejecución **por fases**, una a la vez,
verificando cada una antes de seguir. La app nunca queda rota entre medio.

## Principio rector (no negociable)

Esta plataforma maneja **datos personales reales** (CVs de candidatos, datos de
socios). Una filtración es un incidente legal (Ley 25.326), no un bug. Por eso:
- Validar en los bordes (todo input externo es hostil).
- Fail closed: ante error o duda, denegar acceso.
- Nunca confiar en el cliente: toda autorización se revalida en el servidor.
- Defensa en capas: RLS en la DB + guardas en el server + validación de input.
- Secretos nunca en el código; `.env` en `.gitignore`, `.env.example` commiteado.

## Estado de partida (bueno)

El proyecto YA está diseñado para este salto:
- Auth detrás de un port único (`getAuth()` en `src/lib/auth/index.ts`) → cambiar
  a Clerk es tocar un lugar, no cada componente.
- `requireRole` ya entiende que las server actions son endpoints públicos y se
  revalidan siempre (`src/lib/auth/guard.ts`).
- DataLayer hexagonal: la UI depende de `ContentRepository<T>`, no de la
  implementación. El stub de Supabase ya existe (`src/lib/data/supabase/`).

Trabajo = rellenar los ports diseñados, no reescribir.

## Arquitectura de responsabilidades

- **Clerk** → autenticación: login, sesión, contraseñas, gestión de usuarios,
  cuentas grupales (ej. "Grupo IRSA" del acta). Fuente de verdad de QUIÉN sos.
- **Supabase (Postgres)** → datos: todas las entidades. Row Level Security (RLS)
  atada al `user_id` de Clerk vía JWT. Fuente de verdad de QUÉ podés ver/tocar.
- **El código** → orquesta: valida input, aplica `requireRole`, y confía en RLS
  como última línea de defensa (defensa en capas).

---

## FASES (en orden de dependencia)

### Fase 0 — Higiene y preparación (antes de tocar nada)
- `.gitignore`: confirmar que `.env*` está excluido. Crear `.env.example`.
- Pushear la rama actual (13 commits sin backup remoto).
- Fijar versiones/lock; auditar dependencias (`npm audit`).
- **Sin esto, todo lo demás es riesgoso.**

### Fase 1 — Base de datos (el cimiento)
Depende de: nada. Todo lo demás depende de esto.
- Diseñar el esquema Postgres de cada entidad del dominio (socios, hoteles,
  candidatos, webinars, informes, noticias, newsletters, blog).
- Definir tipos, relaciones, índices (para performance — skill scalability).
- Migraciones versionadas (Supabase migrations, en git).
- **RLS desde el día uno**, no después: cada tabla con políticas explícitas.
  - Público: solo INSERT de candidatos (carga de CV), nada de SELECT.
  - Socio: SELECT de contenido publicado + candidatos publicados.
  - Admin: todo.
- Datos personales sensibles (email/teléfono de candidatos): acceso mínimo.

### Fase 2 — Auth con Clerk
Depende de: Fase 1 (necesita saber el modelo de usuario/rol).
- Instalar Clerk, configurar con las claves reales.
- Implementar `clerkAuth` con el contrato `AuthProvider` existente.
- Cambiar `getAuth()` para devolver Clerk detrás de un flag de entorno
  (mock sigue disponible para dev/tests).
- Mapear roles Clerk → `UserRole` ("admin" | "socio").
- Cuentas grupales (acta): analizar el modelo de organizaciones de Clerk.
- Middleware de protección de rutas + `requireRole` sigue en cada action.

### Fase 3 — Backend / DataLayer sobre Supabase
Depende de: Fases 1 y 2.
- Implementar cada repositorio del `ContentRepository<T>` contra Supabase.
- Queries parametrizadas siempre (nunca concatenar) — el cliente Supabase ya
  lo hace, pero revisar cada punto.
- Conexión segura (SSL), límites de pool.
- Server actions y endpoints: validación de input en cada borde, rate limiting
  en los públicos (carga de CV), tamaño/tipo de archivos.
- Storage real de CVs (Supabase Storage o Vercel Blob) + activar el escaneo
  antivirus que quedó como stub.
- Cambiar `getDataLayer()` a Supabase detrás de flag.

### Fase 4 — Sistema de seguridad (transversal, se refuerza acá)
Depende de: Fases 1-3 (la seguridad se construye con ellas, se audita al final).
- Headers de seguridad (CSP, HSTS, X-Frame-Options, etc.) en next.config.
- Rate limiting en auth y en la carga pública de CV.
- Validación exhaustiva de todos los inputs (esquemas).
- Revisar RLS end-to-end: intentar acceder a datos de otro rol y confirmar que
  falla (test adversarial).
- Auditoría de dependencias.
- Logging de eventos de seguridad (logins fallidos, denegaciones) sin loggear
  secretos ni datos personales.
- **Revisión de seguridad dedicada** con la skill `security` antes de producción.

### Fase 5 — SEO / SEM
Depende de: nada del backend (es capa de presentación). Puede ir en paralelo
tarde.
- Metadata por página (title/description ya empezado), Open Graph, Twitter cards.
- `sitemap.xml` y `robots.txt` dinámicos.
- Datos estructurados (JSON-LD) para la Cámara y asociados.
- Performance (Core Web Vitals) — impacta SEO y UX.
- Canonical URLs, redirects del sitio viejo (ya hay algunos en next.config).

### Fase 6 — Mobile / responsive
Depende de: nada crítico; se pule sobre lo construido.
- Auditar cada página en breakpoints reales.
- La plataforma interna, el mapa de delegaciones, los formularios largos
  (carga de CV) y las tablas del admin son los puntos de mayor riesgo mobile.

---

## Orden de ejecución recomendado

0 → 1 → 2 → 3 → 4 (transversal), luego 5 y 6 en paralelo.

Regla: **no se empieza una fase hasta que la anterior esté verificada** (build,
typecheck, y para las de datos/auth, prueba adversarial de acceso).

## Skills que aplican

- `security` — Fases 1 (RLS), 2 (auth), 3 (endpoints), 4 (auditoría). Crítica.
- `scalability` — Fases 1 (índices, esquema) y 3 (queries, pool, performance).
- `cost-reducer` — Fase 3 (elegir storage, dimensionar Supabase).
- `frontend-design` — Fase 6 (mobile) y pulido de UI.
- `researcher` — Decisiones con trade-offs (ej. modelo de cuentas grupales).

## Pendientes de definición (del cliente)

- Modelo exacto de "cuentas grupales" (Grupo IRSA): ¿una org con varios
  usuarios? ¿un usuario compartido? Afecta Fase 2.
- Dónde se almacenan los CVs (Supabase Storage vs otro) — Fase 3.
- Retención de datos de candidatos (¿cuánto tiempo se guardan? Ley 25.326).
