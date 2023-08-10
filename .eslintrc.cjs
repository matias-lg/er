/* eslint-env node */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "prettier",
    "plugin:prettier/recommended",
  ],
  ignorePatterns: ["src/parser/peggy/*.js", "src/peggy-parser/*.js", "jest.config.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  plugins: ["@typescript-eslint"],
  root: true,
};
