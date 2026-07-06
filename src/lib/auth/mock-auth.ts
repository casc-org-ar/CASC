import "server-only";
import { cookies } from "next/headers";
import type { AuthProvider } from "@/lib/auth/types";
import type { CurrentUser, UserRole } from "@/lib/types/domain";

/** Cookie key holding the mocked active role. */
const ROLE_COOKIE = "casc_mock_role";

/**
 * Static identities returned for each mocked role. When Clerk lands, this
 * comes from real session metadata instead — the interface stays identical.
 */
const MOCK_USERS: Record<UserRole, CurrentUser> = {
  admin: {
    id: "adm-1",
    nombre: "Comisión CASC",
    email: "comision@casc.org.ar",
    role: "admin",
  },
  socio: {
    id: "soc-1",
    nombre: "María González",
    email: "mgonzalez@altopalermo.com.ar",
    role: "socio",
    shopping: "Alto Palermo",
  },
};

/**
 * Mock auth provider. Persists the active role in a cookie so both server
 * components and route handlers can read it. Replaced wholesale by a Clerk
 * implementation later — consumers never change.
 */
export const mockAuth: AuthProvider = {
  async getRole(): Promise<UserRole | null> {
    const store = await cookies();
    const value = store.get(ROLE_COOKIE)?.value;
    return value === "admin" || value === "socio" ? value : null;
  },

  async getCurrentUser(): Promise<CurrentUser | null> {
    const role = await mockAuth.getRole();
    return role ? MOCK_USERS[role] : null;
  },

  async signIn(role: UserRole): Promise<void> {
    const store = await cookies();
    store.set(ROLE_COOKIE, role, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
  },

  async signOut(): Promise<void> {
    const store = await cookies();
    store.delete(ROLE_COOKIE);
  },
};

export { ROLE_COOKIE };
