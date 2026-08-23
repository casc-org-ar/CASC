# Invitación de socios — plantilla propia enviada con Resend

## Cómo funciona

El correo de invitación lo genera y envía la plataforma. Clerk no manda ningún
email: solo emite la invitación y devuelve el link de aceptación.

```
Alta de socio (admin)
      │
      ├─ 1. Clerk: crea la invitación con notify:false
      │        → no envía correo, devuelve `url` (lleva el __clerk_ticket)
      │
      └─ 2. Resend: envía NUESTRA plantilla con ese link
               → el socio hace clic y cae en /sign-up
```

`notify: false` es lo que evita el correo por defecto de Clerk. Sin ese flag el
socio recibiría **dos** invitaciones: la de Clerk y la nuestra.

### Archivos

| Archivo | Rol |
|---|---|
| [`src/lib/email/templates/invitacion-socio.ts`](../src/lib/email/templates/invitacion-socio.ts) | La plantilla: asunto, HTML y versión en texto plano |
| [`src/lib/email/resend.ts`](../src/lib/email/resend.ts) | Cliente de Resend (un `fetch`, sin SDK) |
| [`src/lib/invitations/clerk-invitations.ts`](../src/lib/invitations/clerk-invitations.ts) | Une las dos partes: crea en Clerk, envía por Resend |
| [`email-invitacion-socio.html`](./email-invitacion-socio.html) | Copia estática del HTML, para previsualizar en el navegador |

Para cambiar el texto o el diseño se edita el `.ts`. El `.html` es solo una
copia de referencia para mirar el resultado sin levantar la app.

---

## Variables de entorno

Van en `.env.local` y en Vercel (Production):

```
RESEND_API_KEY=re_...                     # clave de API de Resend
RESEND_FROM=CASC <no-reply@casc.org.ar>   # remitente; el dominio debe estar verificado
```

Alcanza con una clave de tipo **"sending only"**: puede enviar, pero no leer ni
modificar la configuración de la cuenta. Es la opción más segura.

Si falta cualquiera de las dos, el alta de socio **igual funciona**: se crea el
miembro y la invitación en Clerk, pero el panel informa que el correo no salió
y queda disponible "Reenviar invitación".

---

## Pendiente antes de enviar en producción

> Verificado el 2026-08-22 contra `8.8.8.8`. Resend responde
> `403 The casc.org.ar domain is not verified` a los envíos desde ese dominio.

### 1. El SPF actual rechaza a Resend

```
casc.org.ar  TXT  "v=spf1 include:spf.protection.outlook.com -all"
```

El `-all` significa "rechazá todo lo que no venga de Outlook".

**No se puede agregar un segundo registro SPF.** Un dominio admite uno solo:
publicar dos los invalida a ambos y rompe también el correo de Outlook que hoy
funciona. Hay que **editar el existente**:

```
v=spf1 include:spf.protection.outlook.com include:amazonses.com -all
```

(Resend envía sobre Amazon SES. Confirmar el `include` exacto en el panel de
Resend, que muestra el valor de la cuenta.)

### 2. Falta el DKIM

`resend._domainkey.casc.org.ar` no existe. Sin DKIM, Gmail y Outlook marcan el
correo como no autenticado. El valor lo da Resend en la pantalla del dominio.

### 3. Revisar `send.casc.org.ar`

Hoy resuelve a `45.162.170.147`, que no es de Resend — probablemente lo atrapa
un registro comodín. Si Resend pide un subdominio de envío, hay que apuntarlo a
sus valores.

---

## Verificación

Con los registros publicados:

1. Dar de alta un socio de prueba con una casilla propia.
2. Confirmar que llega **un solo** correo, con el diseño de CASC.
3. Abrirlo en Gmail **y** en Outlook, y revisar que no caiga en spam.
4. Hacer clic en "Activar mi cuenta" y verificar que lleva a `/sign-up` y
   permite completar el registro.

El paso 4 es el que importa: valida que el `__clerk_ticket` viaja bien en el
link. Un correo lindo con un enlace roto no sirve de nada.

---

## Notas de la plantilla

Sigue el manual de marca (`marca/CASC_Manual_de_Marca.md`): paleta negro, gris
y blanco, con el azul institucional `#19557B` solo en el botón y los enlaces.

Tres decisiones que explican por qué el HTML se ve anticuado:

- **Tablas y estilos inline**: Outlook de escritorio renderiza con el motor de
  Word y descarta la mayor parte del CSS moderno. El MX de `casc.org.ar` apunta
  a Microsoft 365, así que muchos socios lo abren justamente ahí.
- **El logo se dibuja con bordes y tipografía**, no es una imagen: los clientes
  de correo bloquean imágenes remotas por defecto y la cabecera llegaría vacía.
- **El link va en el botón y también como texto copiable**: algunos clientes
  corporativos desactivan los botones.

Se envía junto con una versión en texto plano. Eso evita filtros de spam que
penalizan los correos que solo traen HTML.
