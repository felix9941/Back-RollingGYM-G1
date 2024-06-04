const { Schema, model, Types } = require("mongoose");

const ProductosSchema = new Schema({
  nombre: { type: String, required: true },
  foto: { type: String, required: true },
  deleted: { type: Boolean, default: false },
});

const ProductsModel = model("productos", ProductosSchema);
module.exports = ProductsModel;
