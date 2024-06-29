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

router.put("/cambioEstadoPlan/:id", CambioEstadoPlan);
router.get("/planesHabilitados", ObtenerPlanesHabilitados);
router.put("/:id", actualizarPlan);
router.get("/", consultarPlanes);
router.post("/", CargarPlan);

module.exports = router;
