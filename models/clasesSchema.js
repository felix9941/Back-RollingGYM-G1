const { Schema, model, Types } = require("mongoose");

const ClasesSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    maxlength: [50, "El nombre no puede tener más de 50 caracteres"],
    minlength: [2, "El nombre no puede tener menos de 2 caracteres"],
  },
  dia: {
    type: String,
    required: true,
    maxlength: [9, "El dia no puede tener más de 9 caracteres"],
    minlength: [5, "El dia no puede tener menos de 5 caracteres"],
  },
  hora: {
    type: Date,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
    maxlength: [50, "La categoria no puede tener más de 50 caracteres"],
    minlength: [2, "La categoria no puede tener menos de 2 caracteres"],
  },
  idProfesor: {
    type: Types.ObjectId,
  },
  cupo: {
    type: Number,
    required: true,
  },
  reservas: {
    type: Number,
    default: 0,
  },
  claseLlena: {
    type: Boolean,
    default: false,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

ClasesSchema.methods.toJSON = function () {
  const { __v, ...clase } = this.toObject();
  return clase;
};

const ClasesModel = model("clases", ClasesSchema);
module.exports = ClasesModel;
