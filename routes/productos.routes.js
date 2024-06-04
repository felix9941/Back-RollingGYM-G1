const express = require("express");
const {
  ConsultarProductos,
  ActualizarProducto,
  CargarProducto,
  EliminarProdFisicamente,
  CambioEstadoProducto,
  ObtenerProdHabilitados,
} = require("../controllers/productos.controllers");
const auth = require("../middleware/auth");
const { check } = require("express-validator");
const multer = require("../middleware/multer");
const router = express.Router();

router.get("/prodHabilitados", ObtenerProdHabilitados);
router.get("/", ConsultarProductos);
router.post("/", CargarProducto);
router.put("/:id", ActualizarProducto);
router.put("/cambioEstadoProducto/:id", CambioEstadoProducto);
router.delete("/:id", EliminarProdFisicamente);

module.exports = router;
