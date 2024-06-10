const { Schema, model } = require("mongoose");

const ProductosSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    maxlength: [50, "El nombre no puede tener más de 50 caracteres"],
    minlength: [2, "El nombre no puede tener menos de 2 caracteres"],
  },
  foto: {
    type: String,
    required: true,
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
