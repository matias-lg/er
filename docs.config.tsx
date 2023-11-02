import React from "react";

const DocsConfig = {
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
