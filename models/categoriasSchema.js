const { Schema, model, Types } = require("mongoose");

const CategoriasSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  foto: {
    type: String,
    required: true,
  },
  idPlanAlQuePertenece: {
    type: Types.ObjectId,
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

CategoriasSchema.methods.toJSON = function () {
  const { __v, ...categoria } = this.toObject();
  return categoria;
};

const CategoriasModel = model("categoria", CategoriasSchema);
module.exports = CategoriasModel;
