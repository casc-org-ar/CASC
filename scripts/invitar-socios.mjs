/**
 * Alta masiva de socios: crea el registro, la invitación en Clerk y envía el
 * correo con la plantilla de CASC.
 *
 * Replica exactamente lo que hace el alta desde el panel
 * (`admin/socios/actions.ts` → `clerk-invitations.ts`), en el mismo orden:
 *
 *   1. Inserta la fila en `socios` (invitacion_status "pendiente").
 *      Sin este paso el invitado se registra pero no puede entrar: el guard
 *      lee la tabla `socios`, no Clerk.
 *   2. Crea la invitación en Clerk con `notify: false` y el rol preasignado.
 *      El flag evita que Clerk mande SU correo: mandamos el nuestro.
 *   3. Envía la plantilla propia por Resend con el link de aceptación.
 *   4. Marca la fila como "enviada" solo si el correo salió.
 *
 * Uso:
 *   node scripts/invitar-socios.mjs --file socios.csv            (simulación)
 *   node scripts/invitar-socios.mjs --file socios.csv --apply    (ejecuta)
 *
 * El CSV necesita cabecera y las columnas: email, nombre, shopping, cargo, role.
 * `cargo` y `role` son opcionales (role por defecto: "socio").
 *
 * Es reejecutable: un email que ya existe en `socios` se saltea, así que si el
 * proceso se corta a la mitad se puede volver a correr sin duplicar a nadie.
 */

import { readFileSync } from "node:fs";

// --- configuración -------------------------------------------------------

/**
 * Pausa entre envíos. Resend limita a 2 solicitudes por segundo; 600 ms deja
 * margen para que un lote grande no empiece a recibir rechazos por rate limit.
 */
const PAUSA_MS = 600;

const APPLY = process.argv.includes("--apply");
const fileArg = process.argv.indexOf("--file");
const FILE = fileArg !== -1 ? process.argv[fileArg + 1] : null;

// --- entorno -------------------------------------------------------------

function cargarEnv() {
  const env = {};
  for (const linea of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
  return env;
}

const env = cargarEnv();
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const CLERK_KEY = env.CLERK_SECRET_KEY;
const RESEND_KEY = process.env.RESEND_API_KEY ?? env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM ?? env.RESEND_FROM ?? "CASC <no-reply@casc.org.ar>";
const APP_URL = env.NEXT_PUBLIC_APP_URL ?? "https://casc.org.ar";

const faltantes = [
  ["NEXT_PUBLIC_SUPABASE_URL", SUPABASE_URL],
  ["SUPABASE_SERVICE_ROLE_KEY", SUPABASE_KEY],
  ["CLERK_SECRET_KEY", CLERK_KEY],
  ["RESEND_API_KEY", RESEND_KEY],
].filter(([, v]) => !v).map(([k]) => k);

if (faltantes.length) {
  console.error(`Faltan variables en .env.local: ${faltantes.join(", ")}`);
  process.exit(1);
}

const SB = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

// --- plantilla -----------------------------------------------------------

/**
 * Extrae el HTML de la plantilla del módulo TypeScript, sin compilarlo.
 * Así el script y la plataforma mandan EXACTAMENTE el mismo correo: si alguien
 * edita el diseño, este script lo toma sin tener que actualizarse.
 */
function plantilla() {
  const src = readFileSync(
    "src/lib/email/templates/invitacion-socio.ts",
    "utf8",
  );
  const html = src.match(/return `(<!doctype html>[\s\S]*?)`;\n\}/);
  const logo = src.match(/const LOGO_URL = "([^"]+)"/);
  if (!html || !logo) {
    throw new Error("No pude extraer la plantilla del correo.");
  }
  return { html: html[1], logo: logo[1] };
}

const TPL = plantilla();

function armarHtml({ nombre, url }) {
  const escapar = (v) =>
    v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  return TPL.html
    .replace(/\$\{LOGO_URL\}/g, TPL.logo)
    .replace(/\$\{saludo\}/g, nombre ? `Hola ${escapar(nombre)},` : "Hola,")
    .replace(/\$\{url\}/g, escapar(url));
}

// --- entrada -------------------------------------------------------------

function leerCsv(ruta) {
  const lineas = readFileSync(ruta, "utf8").split(/\r?\n/).filter(Boolean);
  const cabecera = lineas[0].split(",").map((c) => c.trim().toLowerCase());
  return lineas.slice(1).map((linea) => {
    const celdas = linea.split(",").map((c) => c.trim());
    const fila = {};
    cabecera.forEach((col, i) => (fila[col] = celdas[i] ?? ""));
    return fila;
  });
}

/** Lista embebida, para la prueba antes de usar un CSV real. */
const PRUEBA = [
  { email: "florenciagazzo@casc.org.ar", nombre: "Florencia Gazzo", shopping: "CASC", cargo: "Equipo CASC", role: "socio" },
  { email: "carolopesperera@gmail.com", nombre: "Carolina Lopes Perera", shopping: "CASC", cargo: "Equipo CASC", role: "socio" },
  { email: "laureanosierra.wallet@gmail.com", nombre: "Laureano Sierra", shopping: "Wonder Digital Agency", cargo: "Desarrollo", role: "socio" },
];

const filas = FILE ? leerCsv(FILE) : PRUEBA;

// --- pasos ---------------------------------------------------------------

async function yaExiste(email) {
  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/socios?select=id,invitacion_status&email=eq.${encodeURIComponent(email)}`,
    { headers: SB },
  );
  const filas = r.ok ? await r.json() : [];
  return filas[0] ?? null;
}

async function crearSocio({ email, nombre, shopping, cargo, role }) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/socios`, {
    method: "POST",
    headers: { ...SB, Prefer: "return=representation" },
    body: JSON.stringify({
      nombre,
      shopping,
      email,           // ya normalizado a minúscula por el llamador
      cargo: cargo || null,
      estado: "activo",
      role: role || "socio",
      invitacion_status: "pendiente",
    }),
  });
  if (!r.ok) throw new Error(`socios: ${(await r.text()).slice(0, 200)}`);
  return (await r.json())[0];
}

async function crearInvitacion({ email, role }) {
  const r = await fetch("https://api.clerk.com/v1/invitations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CLERK_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email_address: email,
      redirect_url: `${APP_URL}/sign-up`,
      public_metadata: { role: role || "socio" },
      notify: false,          // el correo lo mandamos nosotros
      ignore_existing: true,
    }),
  });
  const cuerpo = await r.json();
  if (!r.ok) throw new Error(`clerk: ${JSON.stringify(cuerpo).slice(0, 200)}`);
  if (!cuerpo.url) throw new Error("clerk: no devolvió la URL de aceptación");
  return cuerpo.url;
}

async function enviarCorreo({ email, nombre, url }) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [email],
      subject: "Te damos acceso a la Plataforma de Socios — CASC",
      html: armarHtml({ nombre, url }),
    }),
  });
  const cuerpo = await r.json();
  if (!r.ok) throw new Error(`resend: ${cuerpo.message ?? r.status}`);
  return cuerpo.id;
}

async function marcarEnviada(id) {
  await fetch(`${SUPABASE_URL}/rest/v1/socios?id=eq.${id}`, {
    method: "PATCH",
    headers: SB,
    body: JSON.stringify({
      invitacion_status: "enviada",
      invitacion_enviada_at: new Date().toISOString(),
    }),
  });
}

// --- ejecución -----------------------------------------------------------

const pausa = (ms) => new Promise((r) => setTimeout(r, ms));

console.log(
  APPLY
    ? "=== EJECUTANDO: se crean socios y se envían correos ===\n"
    : "=== SIMULACIÓN: no se escribe ni se envía nada ===\n",
);
console.log(`origen: ${FILE ?? "lista de prueba embebida"}`);
console.log(`remitente: ${RESEND_FROM}`);
console.log(`destinatarios: ${filas.length}\n`);

const resultado = { creados: 0, salteados: 0, fallidos: 0 };

for (const [i, cruda] of filas.entries()) {
  // El email se guarda en minúscula: la tabla tiene un check que lo exige
  // (migración 0019) y el webhook de Clerk busca la fila con `eq`.
  const fila = {
    ...cruda,
    email: (cruda.email || "").trim().toLowerCase(),
    nombre: (cruda.nombre || "").trim(),
    shopping: (cruda.shopping || "").trim(),
  };
  const prefijo = `${String(i + 1).padStart(2)}/${filas.length}  ${fila.email}`;

  if (!fila.email || !fila.nombre || !fila.shopping) {
    console.log(`${prefijo}\n     OMITIDO: faltan email, nombre o shopping`);
    resultado.fallidos += 1;
    continue;
  }

  try {
    const existente = await yaExiste(fila.email);
    if (existente) {
      console.log(`${prefijo}\n     YA EXISTE en socios (${existente.invitacion_status}) — se saltea`);
      resultado.salteados += 1;
      continue;
    }

    if (!APPLY) {
      console.log(`${prefijo}\n     se crearía: ${fila.nombre} · ${fila.shopping} · ${fila.role || "socio"}`);
      resultado.creados += 1;
      continue;
    }

    const socio = await crearSocio(fila);
    const url = await crearInvitacion(fila);
    const envioId = await enviarCorreo({ email: fila.email, nombre: fila.nombre, url });
    await marcarEnviada(socio.id);

    console.log(`${prefijo}\n     OK  socio:${socio.id.slice(0, 8)}  correo:${envioId.slice(0, 8)}`);
    resultado.creados += 1;
    await pausa(PAUSA_MS);
  } catch (error) {
    console.log(`${prefijo}\n     FALLÓ: ${error.message}`);
    resultado.fallidos += 1;
  }
}

console.log(
  `\n${APPLY ? "creados" : "se crearían"}: ${resultado.creados} | salteados: ${resultado.salteados} | fallidos: ${resultado.fallidos}`,
);
if (!APPLY) console.log("\nVolvé a correr con --apply para ejecutarlo.");
