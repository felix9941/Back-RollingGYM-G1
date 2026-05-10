const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const fs = require("fs");
const path = require("path");
const yaml = require("yaml");
require("dotenv").config();
require("../DB/config");

class Servidor {
  constructor() {
    this.app = express();
    this.middleware();
    this.routes();
  }

  middleware() {
    this.app.use(express.json());
    this.app.use(morgan("dev"));
    this.app.use(cors());
  }

  routes() {
    // Swagger - carga la definición base desde swagger.yml y genera la especificación
    const swaggerPath = path.join(__dirname, "..", "swagger.yml");
    let swaggerDefinition = {};
    try {
      const raw = fs.readFileSync(swaggerPath, "utf8");
      swaggerDefinition = yaml.parse(raw) || {};
    } catch (e) {
      console.warn(
        "No se pudo leer swagger.yml, se usará una definición mínima:",
        e.message,
      );
      swaggerDefinition = {
        openapi: "3.0.0",
        info: { title: "Rolling GYM API", version: "1.0.0" },
      };
    }

    const options = {
      definition: swaggerDefinition,
      apis: [__dirname + "/../routes/*.js", __dirname + "/../controllers/*.js"],
    };

    const swaggerSpec = swaggerJSDoc(options);
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    this.app.use("/api/clientes", require("../routes/clientes.routes"));
    this.app.use("/api/profesores", require("../routes/profesores.routes"));
    this.app.use("/api/reservas", require("../routes/reservas.routes"));
    this.app.use("/api/clases", require("../routes/clases.routes"));
    this.app.use(
      "/api/administradores",
      require("../routes/administradores.routes"),
    );
    this.app.use("/api/planes", require("../routes/planes.routes"));
    this.app.use("/api/categorias", require("../routes/categorias.routes"));
    this.app.use("/api/productos", require("../routes/productos.routes"));
  }

  listen() {
    const desiredPort = Number(process.env.PORT) || 3002;

    const startOnPort = (p) => {
      this.server = this.app.listen(p, () => {
        const actualPort = this.server.address().port;
        console.log("servidor levantado en el puerto:", actualPort);
      });

      this.server.on("error", (err) => {
        if (err && err.code === "EADDRINUSE") {
          console.warn(
            `Puerto ${p} ocupado. Solicitando al sistema un puerto libre...`,
          );
          // Intentar arrancar en puerto 0 (puerto libre asignado por OS)
          this.server = this.app.listen(0, () => {
            const actualPort = this.server.address().port;
            console.log(
              `servidor levantado en puerto libre asignado por el sistema: ${actualPort}`,
            );
          });
        } else {
          console.error("Error al iniciar el servidor:", err);
          process.exit(1);
        }
      });
    };

    // Manejo de cierre para liberar puerto correctamente
    const shutdown = (code = 0) => {
      if (this.server) {
        console.log("Cerrando servidor...");
        this.server.close(() => {
          console.log("Servidor cerrado.");
          process.exit(code);
        });
        setTimeout(() => process.exit(1), 10000);
      } else {
        process.exit(code);
      }
    };

    process.on("SIGINT", () => shutdown(0));
    process.on("SIGTERM", () => shutdown(0));
    process.on("uncaughtException", (err) => {
      console.error("Uncaught Exception:", err);
      shutdown(1);
    });

    startOnPort(desiredPort);
  }
}

module.exports = Servidor;
