const { Schema, model, Types } = require("mongoose");

const ClientesSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    maxlength: [50, "El nombre no puede tener más de 50 caracteres"],
    minlength: [2, "El nombre no puede tener menos de 2 caracteres"],
  },
  apellido: {
    type: String,
    required: true,
    maxlength: [50, "El apellido no puede tener más de 50 caracteres"],
    minlength: [2, "El apellido no puede tener menos de 2 caracteres"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: [70, "El mail no puede tener más de 70 caracteres"],
    minlength: [10, "El mail no puede tener menos de 10 caracteres"],
  },
  telefono: {
    type: Number,
    required: true,
    maxlength: [10, "El telefono debe tener 10 numeros"],
    minlength: [10, "El telefono debe tener 10 numeros"],
  },
  contrasenia: {
    type: String,
    required: true,
    maxlength: [100, "La contraseña no puede tener más de 100 caracteres"],
    minlength: [8, "La contraseña no puede tener menos de 8 caracteres"],
  },
  plan: {
    type: String,
    default: "ninguno",
  },
  deleted: {
    type: Boolean,
    default: true,
  },
  cuotaPaga: {
    type: Boolean,
    default: false,
  },
  expiracionCuota: {
    type: Number,
    default: Date.now(),
  },
  idReservas: {
    type: Types.ObjectId,
  },
});

ClientesSchema.methods.toJSON = function () {
  const { __v, password, ...cliente } = this.toObject();
  return cliente;
};

const ClientesModel = model("clientes", ClientesSchema);
module.exports = ClientesModel;
