# Plan — Bolsa de Trabajo

Basado en el acta CASC + WONDER (2026-07-21) y las decisiones del cliente.

## Concepto (del acta)

Tres actores, dos flujos, una regla de exclusión:

1. **Candidato (público):** carga su CV en una landing pública. Sus datos entran a una base filtrable por skills.
2. **Reclutador = shopping center (interno):** accede a la base de candidatos desde la plataforma de socios, filtra por skills/experiencia/ubicación, y ve/descarga el CV.
3. **Admin (interno):** modera candidatos (publicar/ocultar/eliminar) y ve todo.

**Regla de exclusión (acta, 00:02:45):** las búsquedas de empresas externas (IRSA, Cencosud, etc.) NO se cargan en el sitio. Se resuelven con un botón "Ver búsquedas en LinkedIn" que redirige al LinkedIn de la Cámara. Cero gestión de ofertas externas en el sistema.

## Decisiones tomadas

- **Ubicación:** carga pública (`/bolsa-de-trabajo`) + gestión interna (plataforma socios + admin).
- **CV:** subida de archivo simulada (mock), como el resto del proyecto (FileOrLinkField).
- **Datos:** modelo completo (básicos + skills + experiencia/ubicación + educación/disponibilidad + consentimiento legal).

## Modelo de dominio — `Candidato`

```ts
interface Candidato extends BaseEntity {
  // Básicos
  nombre: string;
  email: string;
  telefono?: string;
  // Perfil profesional
  puestoBuscado: string;         // "Encargado de local", "Marketing", etc.
  areaInteres: string;           // rubro/área → powers un filtro
  skills: string[];              // tags filtrables (el filtro clave del acta)
  aniosExperiencia?: number;
  // Ubicación
  ciudad?: string;
  provincia?: string;
  disponibilidad?: "full-time" | "part-time" | "ambas";
  // Educación
  nivelEducativo?: string;       // "Secundario", "Terciario", "Universitario", etc.
  // CV
  cvUrl: string;                 // archivo mock (o link)
  // Legal
  consentimiento: boolean;       // ley 25.326 — obligatorio para guardar
  // Moderación
  status: PublicationStatus;     // "borrador"(pendiente) | "publicado"(visible a reclutadores)
}
```

Nota: `status` acá significa moderación. Un candidato entra como "borrador" (pendiente de revisión) y el admin lo pasa a "publicado" para que los reclutadores lo vean. Evita que datos sin revisar aparezcan.

## Arquitectura (mismo patrón hexagonal que hoteles)

1. `domain.ts` → `interface Candidato`.
2. `repositories/index.ts` → `CandidatoRepository = ContentRepository<Candidato>` + en `DataLayer`.
3. `mock/index.ts` + `mock/seed-data.ts` → repo conectado + 4-6 candidatos de ejemplo.

## Rutas y componentes

### A. Landing pública — `/bolsa-de-trabajo`
Ya existe la ruta (hoy es "próximamente"). Se reemplaza por:
- Hero + explicación.
- **Formulario de carga de CV** (client component) → server action pública que crea el candidato como "borrador".
- Botón **"Ver búsquedas laborales en LinkedIn"** → link externo al LinkedIn CASC (regla del acta).
- Checkbox de **consentimiento** obligatorio (ley 25.326) antes de enviar.
- Toast de éxito al enviar.

### B. Vista reclutador — `/socio/bolsa-de-trabajo`
- Grid de candidatos **publicados** (solo los moderados).
- Filtros: por skills (tags), área, experiencia, ubicación, disponibilidad. Search por nombre/puesto.
- Cada card: datos del candidato + botón "Ver CV".
- Persistencia de filtros (como en asociados).
- "Beneficios" ya usó el patrón; se replica.
- Nav: agregar "Bolsa de trabajo" al menú socio.

### C. Gestión admin — `/admin/bolsa-de-trabajo`
- Tabla de candidatos (todos, incluidos pendientes).
- Acciones: publicar/despublicar (moderar), editar, eliminar.
- Badge de estado (pendiente/publicado).
- Nav: agregar "Bolsa de trabajo" al menú admin.

## Server actions

- **Pública** (`app/(public)/bolsa-de-trabajo/actions.ts`): `crearCandidato` — sin `requireRole`, valida consentimiento, crea como "borrador". NUEVO patrón: es la primera server action pública que escribe al DataLayer (los forms públicos actuales no persisten).
- **Admin** (`app/(platform)/admin/bolsa-de-trabajo/actions.ts`): update/delete/moderar con `requireRole("admin")`.

## Privacidad (importante)

- Los datos del candidato (email, teléfono, CV) NO se exponen en rutas públicas — solo dentro de la plataforma autenticada.
- La landing pública solo ESCRIBE (carga), nunca LEE candidatos.
- Consentimiento explícito guardado con cada registro.

## Seguridad de la carga de PDF (defensa en capas)

Nota de origen: la subida de PDF la propuso la agencia (Wonder), no el cliente.
El acta solo pide "recopilar CVs" y una base filtrable. Se optó por subir PDF
con validación por capas.

Como el prototipo NO sube archivos reales todavía (todo es mock), las capas se
diseñan ahora y se activan por etapas:

**Ahora (sin infraestructura extra):**
1. Validación de tipo real por magic bytes (`%PDF-`), no por extensión ni
   Content-Type — ambos se falsifican.
2. Límite de tamaño (5 MB).
3. Whitelist estricta: solo PDF.
4. Sanitización del nombre de archivo (evitar path traversal).
5. El CV nunca se sirve inline: siempre `Content-Disposition: attachment` para
   que se descargue y no se ejecute en el navegador.

**Después (al conectar storage real, ej. Vercel Blob):**
6. Escaneo antivirus antes de persistir (ClamAV self-hosted, o API tipo
   Cloudmersive/VirusTotal). Se deja el punto de integración marcado con `TODO`
   y una función `scanFile()` lista para enchufar el escáner — sin reescribir el
   flujo.

Alternativa más segura descartada por el cliente: recibir solo un LINK al CV
(Drive/LinkedIn), sin alojar archivo. Queda registrada por si se reconsidera.

## Fuera de alcance (explícito)

- Gestión de ofertas de empresas externas → van a LinkedIn (regla del acta).
- Notificaciones automáticas a RRHH → el acta lo menciona como paso posterior ("se notificará a los departamentos de RRHH"), no ahora.
- Matching automático candidato-búsqueda → no pedido.

## Orden de implementación

1. Modelo + DataLayer + seed.
2. Landing pública (form + action + LinkedIn + consentimiento).
3. Vista reclutador (socio) + nav.
4. Gestión admin + nav.
5. Verificación (typecheck, lint, build, prueba visual de los 3 flujos).
