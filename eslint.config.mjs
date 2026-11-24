import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Reglas de higiene de seguridad (ver CLAUDE.md)
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "react/no-danger": "error",
      "no-restricted-globals": [
        "error",
        { name: "localStorage", message: "Prohibido: no almacenar datos en localStorage." },
        { name: "sessionStorage", message: "Prohibido: no almacenar datos en sessionStorage." },
      ],
      "no-console": "error",
    },
  },
  {
    // Único punto autorizado para escribir logs estructurados
    files: ["src/lib/logger.ts"],
    rules: { "no-console": "off" },
  },
  globalIgnores([".next/**", "node_modules/**", "next-env.d.ts"]),
]);
