/* const mongoose = require("mongoose");

const PruebaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: [50, "El nombre no puede tener más de 50 caracteres"],
    minlength: [3, "El nombre no puede tener menos de 3 caracteres"],
  },
  precio: {
    type: Number,
    required: true,
  },
});

const PruebaModel = mongoose.model("pruebas", PruebaSchema);
module.exports = PruebaModel; */

const { Schema, model } = require("mongoose");

const PruebaSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: [50, "El mail no puede tener más de 50 caracteres"],
    minlength: [10, "El mail no puede tener menos de 10 caracteres"],
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "user",
  },
  image: {
    type: String,
    required: true,
  },
});

PruebaSchema.methods.toJSON = function () {
  const { __v, password, ...prueba } = this.toObject();
  return prueba;
};

const PruebaModel = model("pruebas", PruebaSchema);
module.exports = PruebaModel;
