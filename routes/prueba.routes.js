const express = require("express");
const {
  getPrueba,
  postPrueba,
  getUnoPrueba,
  updatePrueba,
  deletePrueba,
  loginPrueba,
  disablePrueba,
} = require("../controllers/prueba.controllers");
const auth = require("../middleware/auth");
const { check } = require("express-validator");
const multer = require("../middleware/multer");
const router = express.Router();

router.get("/login", loginPrueba);

router.post("/:id", disablePrueba);

router.get("/:id", getUnoPrueba);

router.put("/:id", updatePrueba);

router.delete("/:id", deletePrueba);

router.get("/", auth("user"), getPrueba);

router.post(
  "/",
  /* [
    check("username", "Campo username vacio").notEmpty(),
    check("password", "Campo password vacio").notEmpty(),
    check(
      "username",
      "El username debe tener entre 3 y 10 caracteres"
    ).isLength({ min: 3, max: 10 }),
  ], */
  multer.single("image"),
  postPrueba
);

module.exports = router;
