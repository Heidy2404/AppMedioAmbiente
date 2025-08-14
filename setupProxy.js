// src/setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    [
      // públicos
      "/servicios", "/noticias", "/videos", "/areas_protegidas",
      "/medidas", "/equipo", "/voluntarios",
      // protegidos
      "/normativas", "/reportes", "/usuarios", "/auth",
      // por si alguna instancia usa /api/...
      "/api",
    ],
    createProxyMiddleware({
      target: "https://adamix.net/medioambiente",
      changeOrigin: true,
      secure: true,
      // opcional: para ver a dónde se está yendo realmente
      // logLevel: "debug",
    })
  );
};
