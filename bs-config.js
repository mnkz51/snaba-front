module.exports = {
  ui: {
    port: 13501
  },
  watch: true,
  server: {
    baseDir: "./dist"
  },
  port: 13443,
  https: {
    key: "/etc/ssl/dev-server.key",
    cert: "/etc/ssl/dev-server.crt",
  },
  open: false,
};
