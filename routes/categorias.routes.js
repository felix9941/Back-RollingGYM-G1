const express = require("express");
const {
  ObtenerCategoriasHabilitadas,
  ConsultarCategorias,
  CargarCategoria,
  ActualizarCategoria,
  CambioEstadoCategoria,
  EliminarCatFisicamente,
  ObtenerCategoriasPorPlan,
} = require("../controllers/categorias.controllers");
const auth = require("../middleware/auth");
const { check } = require("express-validator");
const multer = require("../middleware/multer");
const router = express.Router();

router.put("/cambioEstadoCategoria/:id", CambioEstadoCategoria);
router.get("/categoriasHabilitadas", ObtenerCategoriasHabilitadas);
router.get("/categoriasPlan", ObtenerCategoriasPorPlan);
router.put("/:id", ActualizarCategoria);
router.delete("/:id", EliminarCatFisicamente);
router.get("/", ConsultarCategorias);
router.post("/", multer.single("foto"), CargarCategoria);

module.exports = router;
