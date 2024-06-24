const express = require("express");
const {
  crearReserva,
  eliminarReserva,
} = require("../controllers/reservas.controllers");
const auth = require("../middleware/auth");
const obtenerReservas = require("../middleware/obtenerReservas");
const router = express.Router();

router.post("/:idClase", obtenerReservas(), crearReserva);
router.delete("/:id", eliminarReserva);

module.exports = router;
