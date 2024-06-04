const express = require("express");
const {
  consultarPlanes,
  actualizarPlan,
} = require("../controllers/planes.controllers");
const auth = require("../middleware/auth");
const { check } = require("express-validator");
const multer = require("../middleware/multer");
const router = express.Router();

router.get("/", consultarPlanes);
router.put("/:id", actualizarPlan);

module.exports = router;
