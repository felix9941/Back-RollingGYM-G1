const express = require("express");
const auth = require("../middleware/auth");
const { check } = require("express-validator");
const { crearClase } = require("../controllers/clases.controllers");
const router = express.Router();

router.post("/", crearClase);

module.exports = router;
