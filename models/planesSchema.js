const mongoose = require("mongoose");

const PlanesSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  deleted: { type: Boolean, default: false },
});

const PlanesModel = mongoose.model("planes", PlanesSchema);
module.exports = PlanesModel;
