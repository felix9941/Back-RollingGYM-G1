const { Schema, model } = require("mongoose");

const ProfesoresSchema = new Schema({
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
    maxlength: [50, "El mail no puede tener más de 50 caracteres"],
    minlength: [10, "El mail no puede tener menos de 10 caracteres"],
  },
  celular: {
    type: Number,
    required: true,
    maxlength: [10, "El telefono debe tener 10 numeros"],
    minlength: [10, "El telefono debe tener 10 numeros"],
  },
  contrasenia: {
    type: String,
    required: true,
    maxlength: [20, "La contraseña no puede tener más de 20 caracteres"],
    minlength: [8, "La contraseña no puede tener menos de 8 caracteres"],
  },
  deleted: {
    type: Boolean,
    default: true,
  },
  foto: {
    type: String,
    required: true,
    default: "uploads/default-profile.jpg",
  },
});

ProfesoresSchema.methods.toJSON = function () {
  const { __v, password, ...profesor } = this.toObject();
  return profesor;
};

const ProfesoresModel = model("profesores", ProfesoresSchema);
module.exports = ProfesoresModel;
