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

router.put("/cambioEstadoPlan/:id", CambioEstadoPlan);
router.get("/planesHabilitados", ObtenerPlanesHabilitados);
router.get("/planesHabilitados/:id", ObtenerPlanPorId);
router.put("/:id", actualizarPlan);
router.get("/", consultarPlanes);
router.post("/", CargarPlan);

module.exports = router;
