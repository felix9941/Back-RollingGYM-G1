const { Schema, model, Types } = require("mongoose");

const ReservasSchema = new Schema({
  idCliente: {
    type: Types.ObjectId,
  },
  clases: [],
});

ReservasSchema.methods.toJSON = function () {
  const { __v, ...reserva } = this.toObject();
  return reserva;
};

const ReservasModel = model("reservas", ReservasSchema);
module.exports = ReservasModel;
