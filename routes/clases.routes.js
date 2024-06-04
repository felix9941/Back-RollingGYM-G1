const express = require("express");
const auth = require("../middleware/auth");
const { check } = require("express-validator");
const {
  crearClase,
  eliminarClase,
  consultarClases,
  cambiarEstadoClase,
  consultarClasesCategoria,
  consultarClasesHabilitadas,
  consultarUnaClase,
} = require("../controllers/clases.controllers");
const router = express.Router();

router.get("/unaClase/:id", consultarUnaClase);
router.delete("/:id", eliminarClase);
router.post("/:id", cambiarEstadoClase);
router.get("/habilitadas", consultarClasesHabilitadas);
router.get("/:categoria", consultarClasesCategoria);
router.get("/", consultarClases);
router.post(
  "/",
  [
    check("nombre", "Campo nombre vacio").notEmpty(),
    check("dia", "Campo dia vacio").notEmpty(),
    check("hora", "Campo hora vacio").notEmpty(),
    check("categoria", "Campo categoria vacio").notEmpty(),
    check("idProfesor", "Campo idProfesor vacio").notEmpty(),
    check("cupo", "Campo cupo vacio").notEmpty(),
    check("nombre", "El nombre debe tener entre 5 y 50 caracteres").isLength({
      min: 5,
      max: 50,
    }),
  ],
  crearClase
);

module.exports = router;
