const ReservasModel = require("../models/reservasSchema");
const ClasesModel = require("../models/clasesSchema");
const mongoose = require("mongoose");

const crearReserva = async (req, res) => {
  try {
    const idReserva = req.reservas;
    const idClase = req.params.idClase;
    if (!mongoose.Types.ObjectId.isValid(idReserva)) {
      return res.status(400).send("Id Reserva inválido");
    }
    if (!mongoose.Types.ObjectId.isValid(idClase)) {
      return res.status(400).send("Id Clase inválido");
    }
    const reserva = await ReservasModel.findById(idReserva);
    if (reserva.clases.includes(idClase)) {
      return res.status(405).send("La clase ya se encuentra en las reservas");
    }
    const agregarClase = await ReservasModel.findByIdAndUpdate(
      { _id: idReserva },
      { $push: { clases: idClase } },
      { new: true }
    );
    if (!agregarClase) {
      return res.status(400).json({ message: "No se pudo crear la reserva" });
    }
    res.status(200).json({ message: "Reserva creada con éxito", agregarClase });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "No se pudo crear la reserva" });
  }
};

const eliminarReserva = async (req, res) => {
  try {
    const idReserva = req.reservas;
    const idClase = req.body.idClase;
    if (!mongoose.Types.ObjectId.isValid(idReserva)) {
      return res.status(400).send("Id Reserva inválido");
    }
    if (!mongoose.Types.ObjectId.isValid(idClase)) {
      return res.status(400).send("Id Clase inválido");
    }
    const reserva = await ReservasModel.findById(idReserva);
    if (!reserva.clases.includes(idClase)) {
      return res.status(400).send("La clase no se encuentra en las reservas");
    }
    const quitarClase = await ReservasModel.findByIdAndUpdate(
      { _id: idReserva },
      { $pull: { clases: idClase } },
      { new: true }
    );
    if (!quitarClase) {
      return res.status(400).json({ message: "No se pudo crear la reserva" });
    }
    res
      .status(200)
      .json({ message: "Reserva eliminada con éxito", quitarClase });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "No se pudo eliminar la reserva" });
  }
};

const obtenerReservasPorCliente = async (req, res) => {
  try {
    const idReserva = req.reservas;
    if (!mongoose.Types.ObjectId.isValid(idReserva)) {
      return res.status(400).send("Id Reserva inválido");
    }

    const reserva = await ReservasModel.findById(idReserva);
    if (!reserva) {
      return res.status(404).send("Reserva no encontrada");
    }

    const clases = await ClasesModel.find({
      _id: { $in: reserva.clases },
    });
    res.status(200).json({ message: "Reservas obtenidas", clases });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "No se pudo obtener las reservas", error });
  }
};
module.exports = {
  crearReserva,
  eliminarReserva,
  obtenerReservasPorCliente,
};
