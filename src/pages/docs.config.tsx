import { ThemeConfig } from "nextra";
import React from "react";

const DocsConfig: ThemeConfig = {
  head: (
    <>
      <meta property="og:title" content="ERdoc Docs" />
    </>
  ),
  project: {
    link: "https://github.com/matias-lg/er",
  },
  docsRepositoryBase: "https://github.com/matias-lg/er/tree/main",
  logo: <span style={{ fontWeight: 800 }}>ERdoc Playground</span>,
  useNextSeoProps: () => ({
    titleTemplate: "%s",
  }),
  footer: {
    text: (
      <span>
        MIT {new Date().getFullYear()} ©{" "}
        <a href="https://github.com/matias-lg/er" target="_blank">
          ERdoc Playground
        </a>
        .
      </span>
    ),
  },
};

export default DocsConfig;
