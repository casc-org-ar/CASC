# Checklist — Clerk PRODUCCIÓN

La instancia de **producción** de Clerk arranca vacía: NO hereda la config de
desarrollo. Hay que reproducir en producción todo lo que se configuró en dev.
Este checklist es lo que destraba el acceso real al panel en `casc.org.ar`.

Casi todo es dashboard (de Clerk / Supabase / Vercel), no código.

---

## 1. Custom claim del rol (CRÍTICO — sin esto nadie tiene rol)

El código lee el rol del usuario desde el token de sesión, en `metadata.role`.
Si no está, todo usuario entra SIN rol y no accede al panel.

Clerk (producción) → **Configure → Sessions → Customize session token** → pegar:

```json
{
  "role": "authenticated",
  "metadata": {
    "role": "{{user.public_metadata.role}}"
  }
}
```

- `role: "authenticated"` lo exige Supabase (no tocar).
- `metadata.role` es el que lee la app y la RLS (migración 0006).
- Es el MISMO JSON que se configuró en dev. La coma entre las dos claves es
  obligatoria.

## 2. Restringir el registro (solo invitación)

Clerk (producción) → **Configure → Restrictions** → activar
**"Restrict sign-ups"** / modo invitación. Nadie se registra solo; los socios
entran por invitación del admin.

## 3. Google OAuth de producción (para "Continuar con Google")

En producción Clerk NO presta sus credenciales de Google (en dev sí). Hay que
crear las propias:

1. **Google Cloud Console** → crear proyecto → APIs & Services → Credentials →
   Create Credentials → **OAuth client ID** → Web application.
2. En "Authorized redirect URIs" poner la que indica Clerk (paso 3.b).
3. Copiar `Client ID` y `Client Secret`.

3.b. Clerk (producción) → **SSO Connections → Google** → desactivar "Use shared
credentials" → pegar `Client ID` y `Client Secret`. Ahí Clerk muestra la
redirect URI exacta para el paso 2.

## 4. Supabase ← Clerk producción (third-party auth)

El dominio de Clerk producción es distinto al de dev. Hay que registrarlo en
Supabase o el token no se valida.

Supabase → **Authentication → Sign In / Providers → Clerk** (third-party) →
poner el dominio de Clerk PRODUCCIÓN: `https://clerk.casc.org.ar`.

## 5. Darte a vos mismo rol admin

Tu usuario de producción necesita el rol (el de dev no existe en prod):

Clerk (producción) → **Users** → tu usuario → **Metadata → Public metadata**:

```json
{ "role": "admin" }
```

Guardar y **cerrar sesión / volver a entrar** (el rol viaja en el token; el
token viejo no lo tiene).

---

## Env vars en Vercel (Production)

Confirmar que estén TODAS (Settings → Environment Variables → Production). Las
`NEXT_PUBLIC_*` se hornean en el build: si agregás/cambiás una, **redeploy**.

| Variable | Valor | Para qué |
|---|---|---|
| `NEXT_PUBLIC_AUTH_PROVIDER` | `clerk` | Activa Clerk (sin esto, login mock) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_live_...` | Clerk prod (clave pública) |
| `CLERK_SECRET_KEY` | `sk_live_...` | Clerk prod (clave secreta) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://...supabase.co` | Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_...` | Supabase |
| `NEXT_PUBLIC_APP_URL` | `https://casc.org.ar` | Redirect de invitaciones |
| `NEXT_PUBLIC_PLATFORM_ENABLED` | `true` | Muestra "Ingresar" en el sitio |
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_...` | Seed y webhook de invitaciones |
| `CLERK_WEBHOOK_SIGNING_SECRET` | `whsec_...` | Verifica el webhook (paso 6) |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | (de Upstash) | Rate limiting (opcional) |
| `VIRUSTOTAL_API_KEY` | (de VirusTotal) | Antivirus de CVs (opcional) |

---

## 6. Webhook de aceptación de invitación (opcional pero recomendado)

Cierra el ciclo: cuando un socio acepta la invitación y crea su cuenta, el
webhook linkea su `clerk_user_id` en la tabla `socios` y pasa su estado a
"aceptada" (sin esto, el admin ve "enviada" para siempre aunque el socio ya
haya entrado).

Requisitos:
1. `SUPABASE_SERVICE_ROLE_KEY` en Vercel (el webhook escribe saltando RLS).
2. Clerk (producción) → **Configure → Webhooks → Add Endpoint**:
   - URL: `https://casc.org.ar/api/webhooks/clerk`
   - Evento: **`user.created`**.
3. Clerk muestra un **Signing Secret** → copiarlo a Vercel como
   `CLERK_WEBHOOK_SIGNING_SECRET`.
4. Redeploy (o esperar el próximo).

Sin configurar: la invitación sigue funcionando (el socio entra con su rol);
solo que el estado en el panel no se auto-actualiza a "aceptada".

---

## Verificación final (prueba adversarial en producción)

1. Entrar a `casc.org.ar` → "Ingresar" → login de Clerk (marca CASC, en español).
2. Loguearte con tu usuario admin → debés entrar al panel `/admin`.
3. Como socio (o sin rol) intentar `/admin` → debe rebotar.
4. Dar de alta un socio de prueba → llega la invitación → el link abre
   `casc.org.ar/sign-up` (no el portal de Clerk en inglés).

Si el login entra pero NO accedés al panel → falta el paso 1 (custom claim) o el
paso 5 (tu rol). Si "Continuar con Google" falla → falta el paso 3.
