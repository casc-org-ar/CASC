/**
 * Brand appearance shared by every Clerk component (sign-in, UserButton,
 * UserProfile). Defined once so the whole auth surface matches the platform.
 * Colors mirror the CSS tokens in globals.css (--casc-navy-500 is the primary
 * institutional blue). Kept as literals because Clerk renders some UI in a
 * portal/iframe that can't read our CSS variables.
 *
 * Typed via the component prop rather than importing `@clerk/types` (not a
 * direct dependency); `as const`-free literals are structurally compatible.
 */
export const clerkAppearance = {
  variables: {
    colorPrimary: "#19557b", // --casc-navy-500
    colorText: "#0b2535", // --casc-navy-900 (--ink)
    colorTextSecondary: "#113b55", // --casc-navy-700
    borderRadius: "0.5rem",
    fontFamily: "var(--font-inter)",
  },
  elements: {
    // Match the platform's button treatment.
    formButtonPrimary:
      "bg-[#19557b] hover:bg-[#113b55] text-white normal-case",
    card: "shadow-sm",
  },
};
