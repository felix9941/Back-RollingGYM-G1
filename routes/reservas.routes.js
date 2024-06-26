const express = require("express");
const {
  crearReserva,
  eliminarReserva,
  obtenerReservasPorCliente,
  limpiezaReservas,
} = require("../controllers/reservas.controllers");
const auth = require("../middleware/auth");
const obtenerReservas = require("../middleware/obtenerReservas");
const router = express.Router();

router.post("/:idClase", obtenerReservas(), crearReserva);
router.delete("/limpieza", limpiezaReservas);
router.delete("/eliminar", obtenerReservas(), eliminarReserva);
router.get("/", obtenerReservas(), obtenerReservasPorCliente);
module.exports = router;
