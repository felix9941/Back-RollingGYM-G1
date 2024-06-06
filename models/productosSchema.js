const { Schema, model, Types } = require("mongoose");

const ProductosSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  foto: {
    type: String,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

ProductosSchema.methods.toJSON = function () {
  const { __v, ...producto } = this.toObject();
  return producto;
};

const ProductosModel = model("productos", ProductosSchema);
module.exports = ProductosModel;
