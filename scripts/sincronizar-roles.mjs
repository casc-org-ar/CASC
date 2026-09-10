/**
 * Audita y repara la desincronización de roles entre `socios` y Clerk.
 *
 * El rol vive en dos lugares: la fila de `socios` es lo que edita el admin,
 * pero la autorización lee el rol de la sesión firmada de Clerk
 * (publicMetadata.role, expuesto como claim en el token). Hasta la corrección
 * de `updateSocio`, ese valor se escribía UNA sola vez —en la invitación— y
 * editar el rol desde el panel no lo tocaba. Un socio marcado "socio" en la
 * tabla podía seguir entrando como admin.
 *
 * Este script encuentra esos casos y, con --apply, escribe en Clerk el rol que
 * dice la tabla. La tabla es la fuente de verdad: es lo que el admin editó a
 * conciencia desde el panel.
 *
 * Uso:
 *   CLERK_SECRET_KEY=sk_live_... node scripts/sincronizar-roles.mjs
 *   CLERK_SECRET_KEY=sk_live_... node scripts/sincronizar-roles.mjs --apply
 *
 * Sin --apply solo informa; no escribe nada.
 */

import { readFileSync } from "node:fs";

const APPLY = process.argv.includes("--apply");

// --- entorno -------------------------------------------------------------

function cargarEnv() {
  const env = {};
  try {
    for (const linea of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
      const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
    }
  } catch {
    // Sin .env.local dependemos de las variables del proceso.
  }
  return env;
}

const env = cargarEnv();
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? env.SUPABASE_SERVICE_ROLE_KEY;
const CLERK_KEY = process.env.CLERK_SECRET_KEY ?? env.CLERK_SECRET_KEY;

const faltantes = [
  ["NEXT_PUBLIC_SUPABASE_URL", SUPABASE_URL],
  ["SUPABASE_SERVICE_ROLE_KEY", SUPABASE_KEY],
  ["CLERK_SECRET_KEY", CLERK_KEY],
]
  .filter(([, v]) => !v)
  .map(([k]) => k);

if (faltantes.length) {
  console.error(`Faltan variables: ${faltantes.join(", ")}`);
  process.exit(1);
}

/**
 * La base y la clave de Clerk tienen que ser del MISMO entorno. Los socios de
 * producción viven en la instancia `sk_live_`; con una clave de desarrollo cada
 * consulta devolvería 404 y el informe diría "sin usuario en Clerk" para todos,
 * que es exactamente la conclusión equivocada.
 */
if (!CLERK_KEY.startsWith("sk_live_")) {
  console.error(
    "\nERROR: CLERK_SECRET_KEY es de DESARROLLO (sk_test_), pero los socios se\n" +
      "leen de la base de producción. Los usuarios no existen en esa instancia\n" +
      "y el informe sería incorrecto.\n\n" +
      "Volvé a correrlo con la clave de producción:\n" +
      "  CLERK_SECRET_KEY=sk_live_... node scripts/sincronizar-roles.mjs\n",
  );
  process.exit(1);
}

// --- lectura -------------------------------------------------------------

async function leerSocios() {
  const url =
    `${SUPABASE_URL}/rest/v1/socios` +
    `?select=nombre,email,shopping,role,categoria,clerk_user_id&order=email.asc`;
  const r = await fetch(url, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!r.ok) throw new Error(`Supabase respondió ${r.status}`);
  return r.json();
}

async function leerUsuarioClerk(id) {
  const r = await fetch(`https://api.clerk.com/v1/users/${id}`, {
    headers: { Authorization: `Bearer ${CLERK_KEY}` },
  });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`Clerk respondió ${r.status}`);
  return r.json();
}

/**
 * Escribe el rol en Clerk. PATCH sobre metadata hace merge, no reemplazo: las
 * demás claves de publicMetadata (por ejemplo `shopping`, que lee
 * `getCurrentUser`) quedan intactas.
 */
async function escribirRol(id, role) {
  const r = await fetch(`https://api.clerk.com/v1/users/${id}/metadata`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${CLERK_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ public_metadata: { role } }),
  });
  if (!r.ok) throw new Error(`Clerk respondió ${r.status}: ${(await r.text()).slice(0, 200)}`);
}

// --- ejecución -----------------------------------------------------------

const socios = await leerSocios();
console.log(`\n${socios.length} socios en la tabla.`);
console.log(APPLY ? "MODO: aplicar cambios\n" : "MODO: simulación (sin escribir)\n");

const desincronizados = [];
let sinVincular = 0;
let coinciden = 0;
let sinUsuario = 0;

for (const s of socios) {
  if (!s.clerk_user_id) {
    sinVincular += 1;
    continue;
  }

  const usuario = await leerUsuarioClerk(s.clerk_user_id);
  if (!usuario) {
    sinUsuario += 1;
    console.log(`  SIN USUARIO EN CLERK  ${s.email} (id ${s.clerk_user_id})`);
    continue;
  }

  const rolClerk = usuario.public_metadata?.role ?? "(sin rol)";
  if (rolClerk === s.role) {
    coinciden += 1;
    continue;
  }
  desincronizados.push({ ...s, rolClerk });
  console.log(
    `  DESINCRONIZADO  ${s.email}\n` +
      `      tabla: ${s.role}   clerk: ${rolClerk}   → se aplica "${s.role}"`,
  );
}

console.log(
  `\nResumen: ${coinciden} coinciden · ${desincronizados.length} desincronizados · ` +
    `${sinVincular} sin vincular (invitación pendiente) · ${sinUsuario} sin usuario en Clerk`,
);

if (!desincronizados.length) {
  console.log("\nNada que corregir.\n");
  process.exit(0);
}

if (!APPLY) {
  console.log("\nVolvé a correrlo con --apply para escribir estos cambios.\n");
  process.exit(0);
}

console.log("\nAplicando...");
let ok = 0;
for (const s of desincronizados) {
  try {
    await escribirRol(s.clerk_user_id, s.role);
    console.log(`  OK  ${s.email} → ${s.role}`);
    ok += 1;
  } catch (error) {
    console.log(`  ERROR  ${s.email}: ${error.message}`);
  }
}

console.log(`\n${ok}/${desincronizados.length} corregidos.`);
console.log(
  "El cambio de rol se aplica en la PRÓXIMA sesión: quien esté logueado tiene\n" +
    "que cerrar sesión y volver a entrar para que su token traiga el rol nuevo.\n",
);
