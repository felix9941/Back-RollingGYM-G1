const mongoose = require("mongoose");

const PlanesSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  deleted: { type: Boolean, default: false },
});

PlanesSchema.methods.toJSON = function () {
  const { __v, ...plan } = this.toObject();
  return plan;
};

const PlanesModel = mongoose.model("planes", PlanesSchema);
module.exports = PlanesModel;
