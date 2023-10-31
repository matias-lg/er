const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./docs.config.tsx",
});

module.exports = withNextra({
  output: "standalone",
});
