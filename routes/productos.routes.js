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

/**
 * @swagger
 * tags:
 *   - name: Productos
 *     description: Gestión de productos
 */

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos
 */
/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crear un producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       200:
 *         description: Producto creado
 */

router.put("/cambioEstadoProducto/:id", CambioEstadoProducto);
router.get("/prodHabilitados", ObtenerProdHabilitados);
router.put("/:id", ActualizarProducto);
router.delete("/:id", EliminarProdFisicamente);
router.get("/", ConsultarProductos);
router.post("/", multer.single("foto"), CargarProducto);

module.exports = router;
