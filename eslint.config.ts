import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Enforce explicit return types on functions
      "@typescript-eslint/explicit-function-return-type": "error",
      // Disallow use of `any`
      "@typescript-eslint/no-explicit-any": "error",
      // Disallow floating promises
      "@typescript-eslint/no-floating-promises": "error",
      // Require awaiting promises
      "@typescript-eslint/await-thenable": "error",
      // Disallow unused variables (use _ prefix to opt out)
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Enforce consistent type imports
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
      // Disallow non-null assertions
      "@typescript-eslint/no-non-null-assertion": "error",
      // General JS rules
      "no-console": "warn",
      "eqeqeq": ["error", "always"],
      "no-var": "error",
      "prefer-const": "error",
    },
  },
  {
    // Ignore compiled output and config files that don't need strict checking
    ignores: ["dist/**", "node_modules/**"],
  }
);
