import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Proxy (Next.js 16 renamed `middleware.ts` → `proxy.ts`; same functionality).
 *
 * When Clerk is the active provider it initializes the Clerk request context
 * so `auth()`/`currentUser()` work in server code. It intentionally does NOT
 * enforce route authorization here: per Clerk's own guidance, protection lives
 * as close to the resource as possible — that's `requireRole` inside each
 * server action (see src/lib/auth/guard.ts). Defense in depth, not a single
 * middleware gate.
 *
 * With the mock provider (local/dev/tests) Clerk is bypassed entirely so the
 * prototype runs without any Clerk keys.
 */
const clerkProxy = clerkMiddleware();

export default function proxy(
  ...args: Parameters<typeof clerkProxy>
) {
  if (process.env.NEXT_PUBLIC_AUTH_PROVIDER === "clerk") {
    return clerkProxy(...args);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next internals and static assets unless found in search params.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // API/trpc routes, EXCEPT the Clerk webhook: it arrives server-to-server
    // with no Clerk session and verifies its own signature, so the middleware
    // must not touch it. Matcher forbids capturing groups, so api and trpc are
    // listed separately with a non-capturing negative lookahead.
    "/api/((?!webhooks).*)",
    "/trpc/(.*)",
    "/__clerk/(.*)",
  ],
};
