require("dotenv").config();
require("../DB/config");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

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
    this.app.use("/api/prueba", require("../routes/prueba.routes"));
    this.app.use("/api/clientes", require("../routes/clientes.routes"));
  }

  listen() {
    this.app.listen(3002, () => {
      console.log("Server is running on port", 3002);
    });
  }
}

module.exports = Servidor;
