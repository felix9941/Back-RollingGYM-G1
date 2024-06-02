const { Schema, model, Types } = require("mongoose");

const ReservasSchema = new Schema({
  idClase: {
    type: Types.ObjectId,
  },
  idCliente: {
    type: Types.ObjectId,
  },
});

ReservasSchema.methods.toJSON = function () {
  const { __v, ...reserva } = this.toObject();
  return reserva;
};

const ReservasModel = model("reservas", ReservasSchema);
module.exports = ReservasModel;
