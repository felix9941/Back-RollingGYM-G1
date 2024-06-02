const express = require("express");
const auth = require("../middleware/auth");
const { check } = require("express-validator");
const { registroCliente } = require("../controllers/clientes.controllers");
const router = express.Router();

router.post(
  "/register",
  [
    check("nombre", "Campo nombre vacio").notEmpty(),
    check("nombre", "El nombre debe tener entre 2 y 50 caracteres").isLength({
      min: 2,
      max: 50,
    }),
    check("apellido", "Campo apellido vacio").notEmpty(),
    check(
      "apellido",
      "El apellido debe tener entre 2 y 50 caracteres"
    ).isLength({ min: 2, max: 50 }),
    check("email", "Campo email vacio").notEmpty(),
    check("email", "El email debe tener entre 10 y 70 caracteres").isLength({
      min: 10,
      max: 70,
    }),
    check("telefono", "Campo telefono vacio").notEmpty(),
    check("telefono", "El telefono es incorrecto").isLength({
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
      maxLength: 50,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    }),
  ],
  registroCliente
);
module.exports = router;
