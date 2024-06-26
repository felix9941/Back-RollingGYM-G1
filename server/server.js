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
    this.app.use(express.json());
    this.app.use(morgan("dev"));
    this.app.use(cors());
  }

  routes() {
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
