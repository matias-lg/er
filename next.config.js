const { getHighlighter, BUNDLED_LANGUAGES } = require("shiki");

const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./docs.config.tsx",
  mdxOptions: {
    rehypePrettyCodeOptions: {
      getHighlighter: (options) =>
        getHighlighter({
          ...options,
          langs: [
            ...BUNDLED_LANGUAGES,
            // setup syntax highlighting for erdoc code blocks
            {
              id: "erdoc",
              scopeName: "source.erdoc",
              aliases: ["erdoc"],
              path: "../../public/erdoc_grammar.tmLanguage.json",
            },
          ],
        }),
    },
  },
});

module.exports = withNextra({
  output: "standalone",
});
