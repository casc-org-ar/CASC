/**
 * The mock↔Clerk switch, isolated in a dependency-free module so it can be
 * read from BOTH server and client code. It must NOT import the providers
 * (mock-auth / clerk-auth) — those pull in `server-only` and `next/headers`,
 * which would poison any client component that only needs the flag.
 *
 * NEXT_PUBLIC_ so the value is inlined at build time for the client too.
 */
export function clerkEnabled(): boolean {
  return process.env.NEXT_PUBLIC_AUTH_PROVIDER === "clerk";
}

/**
 * Whether the internal platform is open to users. Gates the public "Ingresar"
 * entry point so we don't send visitors to a login that isn't ready yet (e.g.
 * in production before Clerk's DNS is verified). Flip to "true" in Vercel once
 * the login works end-to-end — no code change or redeploy needed.
 *
 * Defaults to enabled in development so local work is unaffected; in production
 * it must be explicitly turned on.
 */
export function platformEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_PLATFORM_ENABLED === "true") return true;
  if (process.env.NEXT_PUBLIC_PLATFORM_ENABLED === "false") return false;
  // Unset: on in dev (so local login keeps working), off in production.
  return process.env.NODE_ENV === "development";
}
