const express = require("express");
const {
  ObtenerCategoriasHabilitadas,
  ConsultarCategorias,
  CargarCategoria,
  ActualizarCategoria,
  CambioEstadoCategoria,
  EliminarCatFisicamente,
} = require("../controllers/categorias.controllers");
const auth = require("../middleware/auth");
const { check } = require("express-validator");
const multer = require("../middleware/multer");
const router = express.Router();

router.get("/categoriasHabilitadas", ObtenerCategoriasHabilitadas);
router.get("/", ConsultarCategorias);
router.post("/", CargarCategoria);
router.put("/:id", ActualizarCategoria);
router.put("/cambioEstadoCategoria/:id", CambioEstadoCategoria);
router.delete("/:id", EliminarCatFisicamente);

module.exports = router;
