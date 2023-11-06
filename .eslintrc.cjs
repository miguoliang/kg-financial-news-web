/** @type {import("eslint").Linter.Config } */
module.exports = {
  root: true,
  ignorePatterns: ["node_modules", "dist"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.eslint.json",
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@tanstack/eslint-plugin-query/recommended",
  ],
  plugins: ["@typescript-eslint", "@tanstack/query", "prettier"],
  overrides: [
    {
      files: ["*.js"],
      extends: ["plugin:@typescript-eslint/disable-type-checked"],
    },
  ],
};
