const ReservasModel = require("../models/reservasSchema");
const ClasesModel = require("../models/clasesSchema");
const mongoose = require("mongoose");

const crearReserva = async (req, res) => {
  try {
    const idReserva = req.reservas;
    const idClase = req.params.idClase;

    if (!mongoose.Types.ObjectId.isValid(idReserva)) {
      return res.status(400).send("Id Reserva invalido");
    }
    if (!mongoose.Types.ObjectId.isValid(idClase)) {
      return res.status(400).send("Id Clase invalido");
    }

    const reserva = await ReservasModel.findById(idReserva);
    if (!reserva) {
      return res.status(404).send("Reserva no encontrada");
    }

    const clase = await ClasesModel.findById(idClase);
    if (!clase) {
      return res.status(404).send("Clase no encontrada");
    }

    if (reserva.clases.includes(idClase)) {
      return res.status(405).send("La clase ya se encuentra en las reservas");
    }

    const reservasActuales = await ReservasModel.countDocuments({
      clases: clase._id,
    });

    if (reservasActuales >= clase.cupo) {
      return res.status(400).send("La clase no tiene cupos disponibles");
    }

    const agregarClase = await ReservasModel.findByIdAndUpdate(
      { _id: idReserva },
      { $push: { clases: idClase } },
      { new: true }
    );

    if (!agregarClase) {
      return res.status(400).json({ message: "No se pudo crear la reserva" });
    }

    clase.reservas = reservasActuales + 1;
    await clase.save();

    res.status(200).json({ message: "Reserva creada con exito", agregarClase });
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
      return res.status(400).send("Id Reserva invalido");
    }
    if (!mongoose.Types.ObjectId.isValid(idClase)) {
      return res.status(400).send("Id Clase invalido");
    }

    const reserva = await ReservasModel.findById(idReserva);
    if (!reserva) {
      return res.status(404).send("Reserva no encontrada");
    }

    const clase = await ClasesModel.findById(idClase);
    if (!clase) {
      return res.status(404).send("Clase no encontrada");
    }

    if (!reserva.clases.includes(idClase)) {
      return res.status(400).send("La clase no se encuentra en las reservas");
    }

    const quitarClase = await ReservasModel.findByIdAndUpdate(
      { _id: idReserva },
      { $pull: { clases: idClase } },
      { new: true }
    );

    if (!quitarClase) {
      return res.status(400).json({ message: "No se pudo eliminar la reserva" });
    }

    const reservasActuales = await ReservasModel.countDocuments({
      clases: clase._id,
    });
    clase.reservas = Math.max(0, reservasActuales);
    await clase.save();

    res.status(200).json({ message: "Reserva eliminada con exito", quitarClase });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "No se pudo eliminar la reserva" });
  }
};

const limpiezaReservas = async (req, res) => {
  try {
    const idReserva = req.body.reservas;
    const idClase = req.body.idClase;

    if (!mongoose.Types.ObjectId.isValid(idReserva)) {
      return res.status(400).send("Id Reserva invalido");
    }
    if (!mongoose.Types.ObjectId.isValid(idClase)) {
      return res.status(400).send("Id Clase invalido");
    }

    const reserva = await ReservasModel.findById(idReserva);
    if (!reserva) {
      return res.status(404).send("Reserva no encontrada");
    }

    const clase = await ClasesModel.findById(idClase);
    if (!clase) {
      return res.status(404).send("Clase no encontrada");
    }

    if (!reserva.clases.includes(idClase)) {
      return res.status(200).send("La clase no se encuentra en las reservas");
    }

    const quitarClase = await ReservasModel.findByIdAndUpdate(
      { _id: idReserva },
      { $pull: { clases: idClase } },
      { new: true }
    );

    if (!quitarClase) {
      return res.status(400).json({ message: "No se pudo eliminar la reserva" });
    }

    const reservasActuales = await ReservasModel.countDocuments({
      clases: clase._id,
    });
    clase.reservas = Math.max(0, reservasActuales);
    await clase.save();

    res.status(200).json({ message: "Reserva eliminada con exito", quitarClase });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "No se pudo eliminar la reserva" });
  }
};

const obtenerReservasPorCliente = async (req, res) => {
  try {
    const idReserva = req.reservas;
    if (!mongoose.Types.ObjectId.isValid(idReserva)) {
      return res.status(400).send("Id Reserva invalido");
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
  limpiezaReservas,
};
