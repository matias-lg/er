const { default: postcss } = require("postcss");

/* eslint-env node */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "prettier",
    "plugin:prettier/recommended",
  ],
  ignorePatterns: [
    "src/ERDoc/parser/peggy/*.js",
    "tailwind.config.js",
    "postcss.config.js",
    ".eslintrc.cjs",
    "next-env.d.ts",
    "jest.config.js",
  ],
  parser: "@typescript-eslint/parser",
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
      },
    ],
  },
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  plugins: ["@typescript-eslint"],
  root: true,
};
