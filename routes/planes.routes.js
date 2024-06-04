const express = require("express");
const {
  consultarPlanes,
  actualizarPlan,
  CargarPlan,
  CambioEstadoPlan,
  ObtenerPlanesHabilitados,
} = require("../controllers/planes.controllers");
const auth = require("../middleware/auth");
const { check } = require("express-validator");
const multer = require("../middleware/multer");
const router = express.Router();

router.get("/planesHabilitados", ObtenerPlanesHabilitados);
router.get("/", consultarPlanes);
router.post("/", CargarPlan);
router.put("/cambioEstadoPlan/:id", CambioEstadoPlan);
router.put("/:id", actualizarPlan);

module.exports = router;
