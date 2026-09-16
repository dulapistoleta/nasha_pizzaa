import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Артефакты инструментов проверки: профиль headless-Chrome (внутри лежат
    // чужие собранные скрипты — они давали 29 «ошибок» в общем отчёте),
    // кэш npm и папка скриншотов.
    ".chrome-profile/**",
    ".npm-cache/**",
    ".screens/**",
  ]),
]);

export default eslintConfig;
