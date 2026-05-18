const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const ReservasModel = require("../models/reservasSchema");
const ClientesModel = require("../models/clientesSchema");

module.exports = () => async (req, res, next) => {
  try {
    const token = req.header("auth")?.replace("Bearer ", "");
    if (!token) {
      return res.status(400).json({ message: "Error al encontrar el token" });
    }
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY_JWT);

    const idCliente = verifyToken?.cliente?.id;
    const idReservasToken = verifyToken?.cliente?.idReservas;

    let reserva = null;

    if (idReservasToken && mongoose.Types.ObjectId.isValid(idReservasToken)) {
      reserva = await ReservasModel.findById(idReservasToken);
    }

    if (!reserva && idCliente && mongoose.Types.ObjectId.isValid(idCliente)) {
      reserva = await ReservasModel.findOne({ idCliente });
    }

    if (!reserva && idCliente && mongoose.Types.ObjectId.isValid(idCliente)) {
      reserva = await ReservasModel.create({ idCliente, clases: [] });
    }

    if (!reserva) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    if (idCliente && mongoose.Types.ObjectId.isValid(idCliente)) {
      await ClientesModel.findByIdAndUpdate(
        idCliente,
        { idReservas: reserva._id },
        { new: false },
      );
    }

    req.reservas = reserva._id.toString();
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error: Token incorrecto" });
  }
};
