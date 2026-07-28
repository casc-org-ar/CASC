# Fase 2 — Conectar Clerk + Supabase (pasos de dashboard)

El código de la Fase 2 ya está escrito. Lo que sigue son los pasos que se hacen
en los **dashboards** de Clerk y Supabase. Sin estos pasos, el código corre pero
el rol nunca llega a las RLS y **las queries vuelven vacías sin dar error**
(el modo de fallo silencioso). Hacerlos en este orden.

Trabajamos primero sobre la **app de desarrollo** de Clerk. Cuando esté todo
verificado, se clona a producción.

---

## 0. Clerk → desactivar el registro público (solo por invitación)

Los socios NO se auto-registran: el admin los invita desde `/admin/socios` y su
rol se pre-asigna en la invitación. El registro abierto debe cerrarse en Clerk.

> Importante: quitar la ruta `/sign-up` de la app **no alcanza**. Clerk hospeda
> su propio account portal (`https://<tu-app>.accounts.dev/sign-up`) que seguiría
> aceptando registros por fuera de la app. La cerradura real es esta, en el
> dashboard.

1. Dashboard de Clerk → **Configure** → **Restrictions** (o **User & Authentication
   → Restrictions**, según la versión).
2. Desactivá **Sign-up** / activá el modo **"Invitations only"** (o
   **"Allowlist"**): solo emails invitados pueden crear cuenta.
3. Guardar.

Efecto combinado con el código: la app redirige `/sign-up` a `/sign-in` y el
formulario de ingreso ya no ofrece "crear cuenta"; Clerk rechaza cualquier alta
que no venga de una invitación.

> Un usuario ya autenticado pero SIN rol asignado no puede entrar: la app le
> muestra "tu cuenta no tiene un rol asignado" (esto es el control de acceso
> funcionando, no un error). Ese usuario existe en Clerk pero no en la
> plataforma hasta que un admin le asigne rol.

---

## 1. Clerk → exponer el rol en el token de sesión

El rol (`admin` / `socio`) vive en `publicMetadata.role` de cada usuario. Para
que llegue al token que Supabase lee, hay que agregarlo como **custom claim**.

1. Dashboard de Clerk → **Configure** → **Sessions**.
2. En **Customize session token**, editar el claim y agregar:

   ```json
   {
     "metadata": {
       "role": "{{user.public_metadata.role}}"
     }
   }
   ```

   > La RLS lee exactamente `auth.jwt() -> 'metadata' ->> 'role'`
   > (ver `supabase/migrations/0006_clerk_role_claim.sql`). Si cambiás el
   > nombre del claim acá, hay que cambiarlo también en esa migración. Deben
   > coincidir.

3. Guardar.

> **No** creamos un "JWT template" — ese método está deprecado desde abril 2025.
> Es el custom claim de la sesión, que es lo de arriba.

---

## 2. Clerk → crear usuarios de prueba y asignarles el rol

No hace falta la pantalla de registro de la app para crear el primer usuario:
se crea directo desde el dashboard de Clerk.

1. Dashboard de Clerk → **Users** → **Create user**.
2. Poné email + contraseña (ej. un usuario admin y un usuario socio).
3. En ese usuario → **Metadata** → **Public metadata**, poné:

   ```json
   { "role": "admin" }
   ```

   o, para el socio:

   ```json
   { "role": "socio", "shopping": "Alto Palermo" }
   ```

4. Guardar.

> El `shopping` es opcional y solo aplica a socios. El `clerkAuth` lo lee de
> `publicMetadata.shopping` si está.
>
> Más adelante esto se automatiza al invitar socios (webhook de Clerk que crea
> la fila en `socios` con su `clerk_user_id`). Por ahora, manual para probar.

---

## 3. Supabase → aceptar a Clerk como proveedor de identidad

Para que Supabase verifique el token de Clerk (integración nativa, no template):

1. En el dashboard de **Clerk** → buscar el **Frontend API URL** / dominio de la
   instancia (algo como `https://<tu-app>.clerk.accounts.dev` en desarrollo).
2. Dashboard de **Supabase** → **Authentication** → **Sign In / Providers** →
   agregar **Clerk** como third-party auth provider.
3. Pegar el dominio de Clerk del paso 1.
4. Guardar.

---

## 4. Aplicar la migración 0006

La migración que alinea `current_app_role()` con el claim de arriba:

```
supabase db push
```

(o aplicá `supabase/migrations/0006_clerk_role_claim.sql` como corras las
migraciones en este proyecto).

---

## 5. Activar Clerk en la app

En `.env.local`, agregar estas variables:

```
# Enciende Clerk. Sin esto (o con otro valor) la app usa el mock y Clerk ni se
# carga: el <ClerkProvider>, el proxy.ts y el clerkAuth quedan inactivos.
NEXT_PUBLIC_AUTH_PROVIDER=clerk

# Rutas de los componentes de Clerk (deben coincidir con las carpetas creadas).
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/socio
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/socio
```

> Las claves `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` y `CLERK_SECRET_KEY` ya las
> tenés cargadas. `NEXT_PUBLIC_AUTH_PROVIDER` es el interruptor mock↔Clerk;
> es `NEXT_PUBLIC_` a propósito para que cliente y servidor lean el mismo flag.

Después de tocar `.env.local`, **reiniciar `next dev`** (las env vars se leen
al arrancar).

Rutas que quedan activas con el flag encendido:
- `/login` → redirige a `/sign-in` (pantalla real de Clerk).
- `/sign-in` y `/sign-up` → componentes `<SignIn/>` / `<SignUp/>` de Clerk.
- "Cerrar sesión" en el sidebar → usa el logout real de Clerk.

---

## 6. Prueba adversarial (obligatoria — la fase no está lista sin esto)

El objetivo es confirmar que las RLS frenan de verdad, no confiar en que "parece
andar":

1. Login como **socio**. Confirmar que ve contenido publicado (noticias,
   informes) y su propio perfil.
2. Como ese mismo socio, intentar leer datos que solo el admin debería ver
   (ej. un borrador, o la fila de otro socio). **Debe volver vacío.**
3. Login como **admin**. Confirmar que ve todo.
4. Si el socio ve algo que no debería, o si el admin no ve nada → el claim del
   paso 1 no está llegando. Revisar que el nombre del claim en Clerk coincida
   con `metadata.role` de la migración 0006.

---

## 7. Invitaciones reales (alta de socios desde la plataforma)

Con Clerk activo, el alta de un socio en `/admin/socios` ya NO es mock: crea una
invitación real de Clerk. El flujo:

1. El admin da de alta un socio (email + rol) en `/admin/socios`.
2. La app llama a `clerkClient().invitations.createInvitation()` con:
   - `redirectUrl` → `${NEXT_PUBLIC_APP_URL}/sign-up` (la invitación abre la
     pantalla de registro DENTRO de la app, con la marca CASC — no el Account
     Portal de Clerk en inglés).
   - `publicMetadata: { role }` → el rol viaja EN la invitación.
3. El socio recibe el email, hace clic, cae en `/sign-up?__clerk_ticket=...`,
   y el `<SignUp>` completa el registro.
4. Al aceptar, el `publicMetadata.role` queda en su usuario **automáticamente**.
   Ya no hace falta setear el rol a mano en el dashboard (eso era solo para los
   usuarios de prueba del paso 2).

### Env var requerida

En `.env.local`:

```
# URL base de la app, para construir el redirectUrl absoluto de las invitaciones.
# En dev: http://localhost:3000. En prod: el dominio real.
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Dashboard: rutas del Account Portal

Para que Clerk use las páginas de la app en vez de su portal hospedado:

1. Dashboard de Clerk → **Configure** → **Paths** (o **Account Portal**).
2. Apuntar **Sign-in** a `/sign-in` y **Sign-up** a `/sign-up`.

> Pendiente para la próxima tanda: el webhook `invitation.accepted`, que marca
> el `invitacionStatus` del socio como "aceptada" y linkea su `clerk_user_id`.
> Necesita persistencia real (Fase 3) para tener dónde escribir.

---

## Checklist

- [ ] Registro público desactivado en Clerk — solo invitación (paso 0)
- [ ] Custom claim `metadata.role` configurado en Clerk (paso 1)
- [ ] Usuarios de prueba creados con `publicMetadata.role` (paso 2)
- [ ] Clerk agregado como provider en Supabase (paso 3)
- [ ] Migración 0006 aplicada (paso 4)
- [ ] `NEXT_PUBLIC_AUTH_PROVIDER=clerk` + rutas de Clerk en `.env.local` (paso 5)
- [ ] Prueba adversarial pasada (paso 6)
- [ ] `NEXT_PUBLIC_APP_URL` + rutas del Account Portal para invitaciones (paso 7)
