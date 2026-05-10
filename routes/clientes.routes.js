const express = require("express");
const auth = require("../middleware/auth");
const { check } = require("express-validator");
const {
  registroCliente,
  loginCliente,
  consultarClientes,
  consultarClientesHabilitados,
  cambioEstadoCliente,
  pagoCuotaCliente,
  vencimientoCuotaCliente,
  eliminarCliente,
  editarCliente,
  obtenerDatosUsuario,
  actualizarDatosPropios,
  traerDatosCliente,
} = require("../controllers/clientes.controllers");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Clientes
 *     description: Gestión de clientes
 */

/**
 * @swagger
 * /api/clientes/register:
 *   post:
 *     summary: Registrar cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       200:
 *         description: Cliente registrado
 */
/**
 * @swagger
 * /api/clientes/login:
 *   post:
 *     summary: Login de cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login exitoso
 */
/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Obtener todos los clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
const obtenerDatos = require("../middleware/obtenerDatos");
const datosCliente = require("../middleware/datosCliente");

router.put(
  "/editar/:id",
  [
    check("nombre", "Campo nombre vacio").notEmpty(),
    check("nombre", "El nombre debe tener entre 2 y 50 caracteres").isLength({
      min: 2,
      max: 50,
    }),
    check("apellido", "Campo apellido vacio").notEmpty(),
    check(
      "apellido",
      "El apellido debe tener entre 2 y 50 caracteres",
    ).isLength({ min: 2, max: 50 }),
    check("email", "Campo email vacio").notEmpty(),
    check("email", "El email debe tener entre 10 y 70 caracteres").isLength({
      min: 10,
      max: 70,
    }),
    check("telefono", "Campo telefono vacio").notEmpty(),
    check(
      "telefono",
      "El telefono es incorrecto, debe tener 10 digitos",
    ).isLength({
      min: 10,
      max: 10,
    }),
  ],
  editarCliente,
);
router.put("/estado/:id", cambioEstadoCliente);
router.put(
  "/pago/:id",
  [
    check("plan", "Campo plan vacio").notEmpty(),
    check("expiracionCuota", "Campo expiracionCuota vacio").notEmpty(),
  ],
  pagoCuotaCliente,
);
router.put("/vencimiento/:id", vencimientoCuotaCliente);
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
      "El apellido debe tener entre 2 y 50 caracteres",
    ).isLength({ min: 2, max: 50 }),
    check("email", "Campo email vacio").notEmpty(),
    check("email", "El email debe tener entre 10 y 70 caracteres").isLength({
      min: 10,
      max: 70,
    }),
    check("telefono", "Campo telefono vacio").notEmpty(),
    check(
      "telefono",
      "El telefono es incorrecto, debe tener 10 digitos",
    ).isLength({
      min: 10,
      max: 10,
    }),
    check("contrasenia", "Campo contraseña vacio").notEmpty(),
    check(
      "contrasenia",
      "La contraseña debe tener entre 8 y 50 caracteres",
    ).isLength({ min: 8, max: 50 }),
    check(
      "contrasenia",
      "La contraseña debe contener numeros, simbolos, letras mayusculas y minusculas, y un minimo de 8 caracteres",
    ).isStrongPassword({
      minLength: 8,
      maxLength: 100,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    }),
  ],
  registroCliente,
);
router.get("/datos", datosCliente(), traerDatosCliente);
router.post("/login", loginCliente);

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
      "El apellido debe tener entre 2 y 50 caracteres",
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
      "La contraseña debe tener entre 8 y 50 caracteres",
    ).isLength({ min: 8, max: 50 }),
    check(
      "contrasenia",
      "La contraseña debe contener numeros, simbolos, letras mayusculas y minusculas, y un minimo de 8 caracteres",
    ).isStrongPassword({
      minLength: 8,
      maxLength: 100,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    }),
  ],
  actualizarDatosPropios,
);

router.get("/datosUsuario", obtenerDatos(), obtenerDatosUsuario);
router.get("/habilitados", consultarClientesHabilitados);
router.get("/", consultarClientes);
router.delete("/:id", eliminarCliente);

module.exports = router;
