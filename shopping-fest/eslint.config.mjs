import js from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";

/**
 * Flat config (ESLint 9). Kept deliberately small: this project is a static
 * landing page, so the useful rules are the TypeScript defaults plus Next's
 * own checks.
 */
export default [
  // Build output and dependencies are not ours to lint.
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
];
