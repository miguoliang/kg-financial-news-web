/** @type {import("eslint").Linter.Config } */
module.exports = {
  root: true,
  ignorePatterns: ["node_modules", "dist"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.eslint.json",
  },
  rules: {
    "@typescript-eslint/comma-dangle": ["error", "always-multiline"],
    "@typescript-eslint/member-ordering": "error",
    "@typescript-eslint/no-empty-function": "error",
    "@typescript-eslint/no-unnecessary-condition": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "react/prop-types": "off",
  },
  extends: [
    "plugin:@typescript-eslint/base",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@tanstack/eslint-plugin-query/recommended",
  ],
  plugins: [
    "@typescript-eslint",
    "@tanstack/query",
  ],
};
