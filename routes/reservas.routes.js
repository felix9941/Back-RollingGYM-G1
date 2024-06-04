const express = require("express");
const { crearReserva } = require("../controllers/reservas.controllers");
const router = express.Router();

router.post("/", crearReserva);

module.exports = router;
