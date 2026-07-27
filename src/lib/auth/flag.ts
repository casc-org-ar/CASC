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
