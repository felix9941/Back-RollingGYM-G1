const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
require("../DB/config");

class Servidor {
  constructor() {
    this.app = express();
    this.middleware();
    this.routes();
  }

  middleware() {
    const corsOptions = {
      origin: "https://front-rolling-gym-g1.vercel.app", // Dominio del frontend
      methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
      allowedHeaders: ["Content-Type", "Authorization"], // Headers permitidos
      credentials: true, // Permitir envío de cookies y cabeceras de autorización
    };

    this.app.use(express.json());
    this.app.use(morgan("dev"));
    this.app.use(cors(corsOptions));
  }

  routes() {
    this.app.use("/api/prueba", require("../routes/prueba.routes"));
    this.app.use("/api/clientes", require("../routes/clientes.routes"));
    this.app.use("/api/profesores", require("../routes/profesores.routes"));
    this.app.use("/api/reservas", require("../routes/reservas.routes"));
    this.app.use("/api/clases", require("../routes/clases.routes"));
    this.app.use(
      "/api/administradores",
      require("../routes/administradores.routes")
    );
    this.app.use("/api/planes", require("../routes/planes.routes"));
    this.app.use("/api/categorias", require("../routes/categorias.routes"));
    this.app.use("/api/productos", require("../routes/productos.routes"));
  }

  listen() {
    this.app.listen(3002, () => {
      console.log("servidor levantado en el puerto:", 3002);
    });
  }
}

module.exports = Servidor;
