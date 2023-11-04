/** @type {import("eslint").Linter.Config } */
module.exports = {
  root: true,
  ignorePatterns: ["node_modules", "dist"],
  parser: "@typescript-eslint/parser",
  rules: {
    // "@typescript-eslint/no-unused-vars": "error",
    // "@typescript-eslint/no-empty-function": "error",
  },
  extends: [
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@tanstack/eslint-plugin-query/recommended",
  ],
  plugins: ["@typescript-eslint", "@tanstack/query", "prettier"],
};
