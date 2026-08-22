# Invitación de socios — plantilla y configuración de envío

La plantilla está en [`email-invitacion-socio.html`](./email-invitacion-socio.html).

Se pega en **Clerk Dashboard → Customization → Emails → Invitation**, en el editor
de código del template.

---

## Cómo se ve

Sigue el manual de marca (`marca/CASC_Manual_de_Marca.md`):

- **Paleta**: negro `#000000`, gris `#DBDAD7`, blanco `#FFFFFF`. El azul
  institucional `#19557B` se usa solo en el botón y los enlaces.
- **Logo**: el corchete `[ ]` con las siglas, reproducido con tipografía y
  bordes CSS en vez de una imagen. Los clientes de correo bloquean imágenes
  remotas por defecto, así que de esta forma la cabecera se ve completa aunque
  el socio nunca habilite la descarga.
- **Tipografía**: Inter con fallback a Helvetica/Arial. Las webfonts no cargan
  en la mayoría de los clientes de correo, así que en la práctica se ve el
  fallback.

El HTML usa tablas y estilos inline. Se ve anticuado como código, pero es lo que
sobrevive en Outlook de escritorio, que usa el motor de Word y descarta la mayor
parte del CSS moderno. El MX de `casc.org.ar` apunta a Microsoft 365, así que
buena parte de los socios abre el correo justamente ahí.

### Variable de Clerk

`{{action_url}}` es la única variable y es imprescindible: es el link que lleva
a `/sign-up` con el `__clerk_ticket`. Sin ella el socio no puede registrarse.

Aparece tres veces: en el `href` del botón, y en el `href` y el texto visible
del enlace alternativo (algunos clientes corporativos desactivan los botones,
por eso el link va también como texto copiable).

---

## Pendiente antes de enviar con Resend

> El dominio figura verificado en Resend, pero **el DNS todavía no tiene los
> registros necesarios**. Verificado el 2026-08-22 contra `8.8.8.8`.

### 1. El SPF actual rechaza a Resend

```
casc.org.ar  TXT  "v=spf1 include:spf.protection.outlook.com -all"
```

El `-all` del final significa "rechazá todo lo que no venga de Outlook". Si
Resend envía desde `casc.org.ar` sin estar incluido, los mensajes se rechazan o
caen en spam.

**Importante**: no se puede agregar un segundo registro SPF. Un dominio admite
uno solo — publicar dos los invalida a ambos. Hay que **editar el existente**:

```
v=spf1 include:spf.protection.outlook.com include:amazonses.com -all
```

(Resend envía sobre Amazon SES; confirmar el `include` exacto en el panel de
Resend, que muestra el valor que corresponde a la cuenta.)

### 2. Falta el DKIM

`resend._domainkey.casc.org.ar` no existe. Sin DKIM, Gmail y Outlook marcan el
correo como no autenticado. El valor exacto lo da Resend en la pantalla del
dominio.

### 3. Revisar `send.casc.org.ar`

Hoy resuelve a `45.162.170.147`, que no es de Resend — probablemente lo atrapa
un registro comodín. Si Resend pide un subdominio de envío, hay que apuntarlo a
sus valores, porque el comodín actual lo pisa.

### 4. Conectar Resend con Clerk

Clerk permite configurar un proveedor SMTP propio en
**Customization → Emails → Email settings**. Ahí van las credenciales SMTP de
Resend y la dirección de envío (por ejemplo `no-reply@casc.org.ar`).

Sin este paso los correos siguen saliendo por la infraestructura de Clerk,
aunque el template ya se vea con la marca de CASC.

---

## Orden sugerido

1. Pegar la plantilla en Clerk y enviarse una invitación de prueba a una
   casilla propia. Esto ya funciona sin Resend: el diseño se puede aprobar con
   Flor antes de tocar nada del DNS.
2. Publicar DKIM y corregir el SPF.
3. Configurar el SMTP de Resend en Clerk.
4. Probar de nuevo, revisando que el correo llegue a Gmail **y** a Outlook, y
   que no caiga en spam.

El paso 1 es independiente de los demás: conviene arrancar por ahí para
destrabar la revisión del diseño mientras se gestionan los cambios de DNS.
