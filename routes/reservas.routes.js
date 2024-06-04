const express = require("express");
const {
  crearReserva,
  eliminarReserva,
} = require("../controllers/reservas.controllers");
const router = express.Router();

router.post("/:id", crearReserva);
router.delete("/:id", eliminarReserva);

module.exports = router;
