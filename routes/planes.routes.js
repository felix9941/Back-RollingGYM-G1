const express = require("express");
const {
  consultarPlanes,
  actualizarPlan,
  CargarPlan,
  CambioEstadoPlan,
  ObtenerPlanesHabilitados,
  ObtenerPlanPorId,
} = require("../controllers/planes.controllers");
const auth = require("../middleware/auth");
const { check } = require("express-validator");
const multer = require("../middleware/multer");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Planes
 *     description: Gestión de planes
 */

/**
 * @swagger
 * /api/planes:
 *   get:
 *     summary: Obtener todos los planes
 *     tags: [Planes]
 *     responses:
 *       200:
 *         description: Lista de planes
 */
/**
 * @swagger
 * /api/planes:
 *   post:
 *     summary: Crear un plan
 *     tags: [Planes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plan'
 *     responses:
 *       200:
 *         description: Plan creado
 */

router.put("/cambioEstadoPlan/:id", CambioEstadoPlan);
router.get("/planesHabilitados", ObtenerPlanesHabilitados);
router.get("/planesHabilitados/:id", ObtenerPlanPorId);
router.put("/:id", actualizarPlan);
router.get("/", consultarPlanes);
router.post("/", CargarPlan);

module.exports = router;
