require("dotenv").config();
require("../DB/config");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

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
    this.app.use(
      "/uploads",
      express.static(path.join(__dirname, "../uploads"))
    );
  }

  routes() {
    this.app.use("/api/prueba", require("../routes/prueba.routes"));
    this.app.use("/api/clientes", require("../routes/clientes.routes"));
    this.app.use("/api/profesores", require("../routes/profesores.routes"));
    this.app.use("/api/reservas", require("../routes/reservas.routes"));
    this.app.use("/api/clases", require("../routes/clases.routes"));
  }

  listen() {
    this.app.listen(3002, () => {
      console.log("servidor levantado en el puerto:", 3002);
    });
  }
}

module.exports = Servidor;
