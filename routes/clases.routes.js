const express = require("express");
const auth = require("../middleware/auth");
const obtenerDatos = require("../middleware/obtenerDatos");
const { check } = require("express-validator");
const {
  crearClase,
  eliminarClase,
  consultarClases,
  cambiarEstadoClase,
  consultarClasesCategoria,
  consultarClasesHabilitadas,
  consultarUnaClase,
  agregarReserva,
  consultarClasesProfesor,
  consultarClasesDia,
  reservaCero,
} = require("../controllers/clases.controllers");
const router = express.Router();

router.put("/reserva/:id", agregarReserva);
router.put("/cero/:id", reservaCero);
router.get("/unaClase/:id", consultarUnaClase);
router.get("/dia/:dia", consultarClasesDia);
router.get("/habilitadas", consultarClasesHabilitadas);
router.get("/profesor", obtenerDatos(), consultarClasesProfesor);
router.delete("/:id", eliminarClase);
router.put("/:id", cambiarEstadoClase);
router.get("/:categoria", consultarClasesCategoria);
router.get("/", consultarClases);
router.post(
  "/",
  [
    check("dia", "Campo dia vacio").notEmpty(),
    check("hora", "Campo hora vacio").notEmpty(),
    check("categoria", "Campo categoria vacio").notEmpty(),
    check("idProfesor", "Campo idProfesor vacio").notEmpty(),
    check("cupo", "Campo cupo vacio").notEmpty(),
  ],
  crearClase
);

module.exports = router;
