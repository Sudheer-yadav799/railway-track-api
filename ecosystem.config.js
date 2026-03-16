module.exports = {
  apps: [
    {
      name: "railway-api",
      script: "server.js",
      cwd: "D:/WebSiteApplication/apps/dharaniwebgis/railway-track-api",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "dev"
      }
    }
  ]
};