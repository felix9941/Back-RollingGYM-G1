const express = require("express");
const auth = require("../middleware/auth");
const { check } = require("express-validator");
const {
  registroAdministrador,
  loginAdministrador,
  consultarAdministradores,
  consultarAdministradoresHabilitados,
  cambioEstadoAdministrador,
  actualizarAdministrador,
  eliminarAdministrador,
  obtenerDatosUsuario,
  actualizarDatosPropios,
} = require("../controllers/administradores.controllers");
const obtenerDatos = require("../middleware/obtenerDatos");
const router = express.Router();

router.put(
  "/editar/:id",
  [
    check("nombre", "Campo nombre vacío").notEmpty(),
    check("nombre", "El nombre debe tener entre 2 y 50 caracteres").isLength({
      min: 2,
      max: 50,
    }),
    check("apellido", "Campo apellido vacío").notEmpty(),
    check(
      "apellido",
      "El apellido debe tener entre 2 y 50 caracteres"
    ).isLength({
      min: 2,
      max: 50,
    }),
    check("email", "Campo email vacío").notEmpty(),
    check("email", "El email debe tener entre 10 y 70 caracteres").isLength({
      min: 10,
      max: 70,
    }),
    check("email", "El email no es válido").isEmail(),
    check("telefono", "Campo telefono vacío").notEmpty(),
    check("telefono", "El telefono debe tener 10 caracteres").isLength({
      min: 10,
      max: 10,
    }),
  ],
  actualizarAdministrador
);

router.put(
  "/editarDatosPropios/:id",
  [
    check("nombre", "Campo nombre vacío").notEmpty(),
    check("nombre", "El nombre debe tener entre 2 y 50 caracteres").isLength({
      min: 2,
      max: 50,
    }),
    check("apellido", "Campo apellido vacío").notEmpty(),
    check(
      "apellido",
      "El apellido debe tener entre 2 y 50 caracteres"
    ).isLength({
      min: 2,
      max: 50,
    }),
    check("email", "Campo email vacío").notEmpty(),
    check("email", "El email debe tener entre 10 y 70 caracteres").isLength({
      min: 10,
      max: 70,
    }),
    check("email", "El email no es válido").isEmail(),
    check("telefono", "Campo telefono vacío").notEmpty(),
    check("telefono", "El telefono debe tener 10 caracteres").isLength({
      min: 10,
      max: 10,
    }),
    check("contrasenia", "Campo contraseña vacio").notEmpty(),
    check(
      "contrasenia",
      "La contraseña debe tener entre 8 y 50 caracteres"
    ).isLength({ min: 8, max: 50 }),
    check(
      "contrasenia",
      "La contraseña debe contener numeros, simbolos, letras mayusculas y minusculas, y un minimo de 8 caracteres"
    ).isStrongPassword({
      minLength: 8,
      maxLength: 100,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    }),
  ],
  actualizarDatosPropios
);

router.get("/habilitados", consultarAdministradoresHabilitados);
router.get("/datosUsuario", obtenerDatos(), obtenerDatosUsuario);

router.post("/login", loginAdministrador);
router.post(
  "/register",
  [
    check("nombre", "Campo nombre vacío").notEmpty(),
    check("nombre", "El nombre debe tener entre 2 y 50 caracteres").isLength({
      min: 2,
      max: 50,
    }),
    check("apellido", "Campo apellido vacío").notEmpty(),
    check(
      "apellido",
      "El apellido debe tener entre 2 y 50 caracteres"
    ).isLength({
      min: 2,
      max: 50,
    }),
    check("email", "Campo email vacío").notEmpty(),
    check("email", "El email debe tener entre 10 y 50 caracteres").isLength({
      min: 10,
      max: 50,
    }),
    check("email", "El email no es válido").isEmail(),
    check("telefono", "Campo telefono vacío").notEmpty(),
    check("telefono", "El telefono debe tener 10 caracteres").isLength({
      min: 10,
      max: 10,
    }),
    check("contrasenia", "Campo contraseña vacio").notEmpty(),
    check(
      "contrasenia",
      "La contraseña debe tener entre 8 y 50 caracteres"
    ).isLength({ min: 8, max: 50 }),
    check(
      "contrasenia",
      "La contraseña debe contener numeros, simbolos, letras mayusculas y minusculas, y un minimo de 8 caracteres"
    ).isStrongPassword({
      minLength: 8,
      maxLength: 100,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    }),
  ],
  registroAdministrador
);
router.put("/:id", cambioEstadoAdministrador);
router.delete("/:id", eliminarAdministrador);
router.get("/", consultarAdministradores);

module.exports = router;
