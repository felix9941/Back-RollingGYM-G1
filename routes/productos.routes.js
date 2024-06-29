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

router.put("/cambioEstadoProducto/:id", CambioEstadoProducto);
router.get("/prodHabilitados", ObtenerProdHabilitados);
router.put("/:id", ActualizarProducto);
router.delete("/:id", EliminarProdFisicamente);
router.get("/", ConsultarProductos);
router.post("/", multer.single("foto"), CargarProducto);

module.exports = router;
