# Fase 3 — Backend real sobre Supabase (pasos de dashboard + verificación)

El código de la Fase 3 está escrito. La app persiste en Supabase (Postgres +
Storage) cuando Clerk está activo, con las RLS como última línea de defensa.
Igual que la Fase 2, hay pasos que se hacen en el dashboard/CLI antes de probar.

Requiere la Fase 2 conectada (ver `FASE-2-clerk-supabase-conexion.md`): sin el
token de Clerk llegando a Supabase, las RLS devuelven vacío.

---

## 1. Aplicar las migraciones nuevas

La Fase 3 agregó tres migraciones:

- `0007_solicitudes_consultas.sql` — tablas que faltaban (solicitudes, consultas)
  + enum `gestion_status` + RLS + índices.
- `0008_storage_buckets.sql` — buckets privados (`cvs`, `informes`, `portadas`)
  + políticas RLS de storage.
- `0009_public_read_published.sql` — deja al público anónimo leer SOLO filas
  `status = 'publicado'` en blog/noticias/hoteles (para el sitio público).

Aplicalas como corras las migraciones en el proyecto:

```
supabase db push
```

---

## 2. Env var del sitio público

El sitio público lee contenido con un cliente Supabase anónimo (sin token), para
funcionar en visitantes sin login y en build (static generation). Usa las mismas
`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` ya cargadas.
No requiere env var nueva.

> Nota de build: las páginas públicas (`/noticias`, `/actividades`, home) usan
> `getPublicDataLayer()`, NUNCA `getDataLayer()`. El primero usa el cliente
> anónimo; el segundo usa el cliente autenticado, que llama a Clerk `auth()` y
> fallaría en build time (no hay request). Respetar esa separación al agregar
> páginas públicas nuevas.

---

## 3. Verificación de persistencia

Con `NEXT_PUBLIC_AUTH_PROVIDER=clerk` y las migraciones aplicadas:

1. Login como admin. Dar de alta un contenido (ej. una noticia).
2. **Reiniciar el server.** La noticia debe seguir ahí — ya no es memoria.
3. Cargar un CV desde la Bolsa de Trabajo pública. Confirmar en el dashboard de
   Supabase Storage que el archivo llegó al bucket `cvs` (privado).
4. Como socio/admin, abrir "Ver CV": debe abrir el PDF vía URL firmada temporal.

---

## 4. Prueba adversarial de RLS (cierre de Fase 2 + 3)

El criterio real de que las fases están cerradas. No confiar en que "parece
andar" — intentar romperlo:

1. Login como **socio**: ve contenido publicado + candidatos publicados + su
   perfil. NO ve borradores ni otros socios.
2. Como socio, intentar leer un borrador o la fila de otro socio → **vacío**.
3. Como socio, intentar abrir el CV de un candidato en `borrador` (no
   publicado) → **no debe poder**.
4. Visitante **anónimo** (sin login) en el sitio público: ve noticias/blog
   publicados; NO puede leer borradores, candidatos, socios ni solicitudes.
5. Login como **admin**: ve y gestiona todo.
6. Si algún rol ve lo que no debe, o el admin no ve nada → revisar que el claim
   `metadata.role` llega en el token (migración 0006 + custom claim en Clerk).

---

## Checklist

- [ ] Migraciones 0007, 0008, 0009 aplicadas
- [ ] Alta de contenido persiste tras reiniciar el server
- [ ] CV sube al bucket privado `cvs` y se abre vía URL firmada
- [ ] Prueba adversarial pasada (socio, anónimo, admin)
- [ ] Antivirus de CVs: sigue stubbeado — enchufar scanner en Fase 4

---

## Pendiente para próximas tandas

- **Webhook `invitation.accepted`**: marcar el socio como "aceptada" y linkear
  su `clerk_user_id`. Necesita `service_role` (corre sin usuario). Ahora tiene
  dónde escribir (esta persistencia).
- **Subida de archivos del admin** (informes/newsletters/portadas): el helper de
  Storage ya existe; falta conectar los formularios del admin igual que se
  conectó la carga de CV.
- **Antivirus** de CVs (Fase 4 — seguridad): el seam `scanFile` está listo.
- **Migración de datos seed** del mock a Supabase (opcional).
