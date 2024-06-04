const express = require("express");
const {
  ConsultarProductos,
  ActualizarProducto,
  CargarProducto,
  EliminarProdLogicamente,
  EliminarProdFisicamente,
} = require("../controllers/productos.controllers");
const auth = require("../middleware/auth");
const { check } = require("express-validator");
const multer = require("../middleware/multer");
const router = express.Router();

router.get("/", ConsultarProductos);
router.post("/", CargarProducto);
router.put("/:id", ActualizarProducto);
router.put("/borradoLogico/:id", EliminarProdLogicamente);
router.delete("/:id", EliminarProdFisicamente);

module.exports = router;
