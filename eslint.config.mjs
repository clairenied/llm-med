import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      // Build outputs
      ".next/**/*",
      "out/**/*",
      "build/**/*",
      "dist/**/*",

      // Dependencies
      "node_modules/**/*",

      // Generated code
      "src/lib/prisma/**/*",
      "src/generated/prisma/**/*",

      // Legacy JS files (not migrated to TS yet)
      "database-ops/create-custom-admin.js",
      "dev-tools/**/*.js",

      // Cache and temp files
      ".cache/**/*",
      ".temp/**/*",
      "*.log",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default eslintConfig;
