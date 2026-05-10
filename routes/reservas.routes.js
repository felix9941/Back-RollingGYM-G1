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

/**
 * @swagger
 * tags:
 *   - name: Reservas
 *     description: Gestión de reservas
 */

/**
 * @swagger
 * /api/reservas/{idClase}:
 *   post:
 *     summary: Crear una reserva para una clase
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: idClase
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reserva'
 *     responses:
 *       200:
 *         description: Reserva creada
 */

router.post("/:idClase", obtenerReservas(), crearReserva);
router.delete("/limpieza", limpiezaReservas);
router.delete("/eliminar", obtenerReservas(), eliminarReserva);
router.get("/", obtenerReservas(), obtenerReservasPorCliente);
module.exports = router;
