# Fase 4 — Seguridad (transversal)

Endurecimiento de seguridad sobre lo ya construido. Se hace por capas.

## Capa 1 — Headers de seguridad (hecho)

CSP + HSTS + X-Frame-Options + otros, en `next.config.ts`. El CSP permite
exactamente Clerk, Supabase, YouTube e imágenes externas; todo lo demás,
denegado. `'unsafe-eval'` solo en desarrollo (React lo usa para debug), nunca
en producción. No requiere configuración adicional.

## Capa 2 — Validación de inputs (hecho)

Esquemas Zod en todos los bordes: formularios públicos, carga de CV y las 9
actions del admin. No requiere configuración.

## Capa 3 — Rate limiting (requiere setup)

Limita los endpoints públicos (carga de CV, formularios) para frenar abuso/spam.
Usa Upstash Redis porque en Vercel serverless un limitador en memoria no sirve
(cada request puede caer en otra instancia).

### Setup (una vez)

1. Crear una base **Redis** en Upstash:
   - Opción A: desde Vercel → Storage → Marketplace → Upstash → Create.
   - Opción B: en upstash.com → Create Database (Redis) → región cercana.
   Tiene free tier suficiente para esto.

2. Copiar las dos credenciales que da Upstash y ponerlas en las env vars
   (en `.env.local` para dev y en Vercel para producción):

   ```
   UPSTASH_REDIS_REST_URL=https://...upstash.io
   UPSTASH_REDIS_REST_TOKEN=...
   ```

   > Si se crea desde el marketplace de Vercel, estas variables se inyectan
   > solas en el proyecto. Si se crea en upstash.com, cargarlas a mano.

### Comportamiento

- Sin estas variables, el rate limiting queda **desactivado** (fail open): la
  app funciona igual, solo sin límite. Ideal para desarrollo local.
- Con Upstash configurado: por IP, ventana deslizante.
  - Carga de CV: 5 por hora.
  - Formularios (contacto/asociarse): 5 cada 10 minutos.
- **Fail open**: si Upstash no responde, se permite el request. El limitador no
  puede tirar abajo el sitio; es control de abuso, no la barrera principal
  (esa es la validación de inputs + RLS).

Al superar el límite, el usuario ve "Demasiados envíos, esperá unos minutos".

## Capa 4 — Antivirus de CVs (seam listo, requiere env var)

La carga pública de CV acepta PDFs de desconocidos. Antes de que un reclutador
descargue uno, se escanea con VirusTotal (API v3). Ya existían otras capas
(magic bytes, tamaño, nombre saneado, descarga como attachment); esta cierra el
riesgo de un PDF con exploit.

### Setup (una vez, cuando se quiera activar)

1. Crear cuenta gratuita en virustotal.com y obtener la API key (Community).
2. Poner la env var (en `.env.local` para dev y en Vercel para producción):

   ```
   VIRUSTOTAL_API_KEY=...
   ```

### Comportamiento

- Sin la key: el escaneo queda **desactivado** (el CV se acepta si pasa las
  demás capas). Ideal para dev.
- Con la key: el archivo se sube a VirusTotal, se espera el veredicto (~hasta
  20s) y se **rechaza** si algún motor lo marca malicioso o sospechoso.
- **FAIL CLOSED**: si el escaneo falla o se agota el tiempo, el CV se rechaza
  (a diferencia del rate limiting). Un archivo que no se pudo verificar no debe
  llegar a la máquina de un reclutador.

> Consideración (ley 25.326): activar VirusTotal envía el CV (dato personal de
> un tercero) a un servicio externo. Evaluar/contemplar esto antes de habilitarlo
> en producción; el free tier de VirusTotal comparte muestras públicamente en
> algunos planes — revisar los términos para datos personales.

## Capa 5 — Logging de eventos de seguridad + auditoría de dependencias (hecho)

### Logging de eventos de seguridad

Helper `securityLog(event, context)` en `src/lib/security/security-log.ts`:
registra eventos relevantes a los logs del servidor (Vercel), de forma
estructurada y greppable. **Regla dura: nunca loguea secretos ni datos
personales** — solo el TIPO de evento y contexto no identificante. Para emails
existe `maskEmail` (ej. `m***@dominio.com`).

Eventos que registra hoy:
- `auth.role_denied` — `requireRole` rechazó a un caller (guarda de rol).
- `ratelimit.exceeded` — un endpoint público alcanzó su límite.
- `write.failed` — una escritura pública (contacto/asociarse/CV) falló.

Sink actual: `console` (a los logs de Vercel). Se puede cambiar por un servicio
de observabilidad (Sentry/Axiom) sin tocar los call sites.

### Auditoría de dependencias

`pnpm audit` reporta 7 vulnerabilidades (6 high, 1 moderate) en **postcss,
sharp y brace-expansion**. Conclusión tras revisarlas:

- Son **transitivas de Next.js / eslint**, no dependencias directas del código.
- Su superficie es **build-time (postcss/sharp) o dev-tooling
  (brace-expansion)** — no son explotables en el runtime de producción de esta
  app (no se procesa CSS ni imágenes de usuarios no confiables en runtime; el
  sitio usa `<img>` plano para imágenes externas, no `next/image`).
- Se resolverán solas cuando Next actualice sus dependencias fijadas. Forzar los
  overrides rompería el build de Next (usa APIs de esas versiones).

Postura: **riesgo reconocido y aceptado** para esta etapa. Re-auditar al
actualizar Next. (Auditar es evaluar el riesgo real, no forzar el número a
cero a costa de romper el build.)

---

## Estado: Fase 4 completa

Las 5 capas están implementadas. Pendientes de ACTIVACIÓN por configuración
(no de código): rate limiting (env vars de Upstash) y antivirus (VIRUSTOTAL_API_KEY),
ambos documentados arriba y con fail-open/fail-closed definido.
