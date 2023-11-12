require("dotenv").config();

module.exports = {
  apps: [
    {
      name: "erdoc playground",
      script: "npm",
      args: "start",
      instances: 2,
      exec_mode: "cluster",
      env: {
        PORT: 3000,
      },
    },
  ],

  deploy: {
    production: {
      user: process.env.DEPLOY_USER,
      host: [{ host: process.env.DEPLOY_HOST, port: process.env.DEPLOY_PORT }],
      key: process.env.DEPLOY_KEY,
      ref: "origin/main",
      repo: "https://github.com/matias-lg/er.git",
      path: process.env.DEPLOY_PATH,
      "post-deploy":
        "npm i && npm run build:next && pm2 startOrRestart pm2.config.js",
    },
  },
};
