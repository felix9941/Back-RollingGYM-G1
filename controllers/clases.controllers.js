const ClasesModel = require("../models/clasesSchema");
const ReservasModel = require("../models/reservasSchema");
const { validationResult } = require("express-validator");

const mapearClasesConReservasReales = async (clases) => {
  const reservas = await ReservasModel.find({}, { clases: 1, _id: 0 });
  const contadorReservas = {};

  reservas.forEach((reserva) => {
    (reserva.clases || []).forEach((idClase) => {
      const key = idClase.toString();
      contadorReservas[key] = (contadorReservas[key] || 0) + 1;
    });
  });

  return clases.map((clase) => {
    const reservasReales = contadorReservas[clase._id.toString()] || 0;
    return {
      ...clase.toObject(),
      reservas: reservasReales,
    };
  });
};

const crearClase = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const newClase = new ClasesModel(req.body);
    await newClase.save();
    res.status(200).json({ message: "Clase creada con exito", newClase });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "No se puede crear la clase" });
  }
};

const eliminarClase = async (req, res) => {
  try {
    const clase = await ClasesModel.findByIdAndDelete(req.params.id);
    if (!clase) {
      return res.status(404).json({ message: "Clase no encontrada" });
    }

    res.status(200).json({ message: "Clase eliminada con éxito", clase });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "No se pudo eliminar la clase", error });
  }
};

const consultarClases = async (req, res) => {
  try {
    const clases = await ClasesModel.find();
    if (!clases) {
      return res.status(404).json({ message: "No se encontraron clases" });
    }
    const clasesConReservasActualizadas =
      await mapearClasesConReservasReales(clases);

    res
      .status(200)
      .json({ message: "Clases encontradas", clases: clasesConReservasActualizadas });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al encontrar las clases", error });
  }
};

const consultarUnaClase = async (req, res) => {
  try {
    const clase = await ClasesModel.findById(req.params.id);
    if (!clase) {
      return res.status(404).json({ message: "No se encontro la clase" });
    }
    res.status(200).json({ message: "Clase encontrada", clase });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al encontrar la clase", error });
  }
};

const cambiarEstadoClase = async (req, res) => {
  try {
    const clase = await ClasesModel.findById(req.params.id);
    if (!clase) {
      res.status(404).json({ message: "La clase no existe" });
      return;
    }
    if (clase.deleted === true) {
      clase.deleted = false;
      await clase.save();
      res.status(200).json({ message: "Clase habilitada con exito", clase });
      return;
    }
    clase.deleted = true;
    await clase.save();
    res.status(200).json({ message: "Clase deshabilitada con éxito", clase });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error al cambiar el estado de la clase", error });
  }
};

const agregarReserva = async (req, res) => {
  try {
    const clase = await ClasesModel.findById(req.params.id);
    if (!clase) {
      res.status(404).json({ message: "La clase no existe" });
      return;
    }
    // Sincroniza reservas contra la coleccion reservas para evitar dobles conteos.
    const reservasReales = await ReservasModel.countDocuments({
      clases: clase._id,
    });
    clase.reservas = reservasReales;
    await clase.save();

    res.status(200).json({ message: "Reserva sincronizada con exito", clase });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al generar la reserva", error });
  }
};

const reservaCero = async (req, res) => {
  try {
    const clase = await ClasesModel.findById(req.params.id);
    if (!clase) {
      res.status(404).json({ message: "La clase no existe" });
      return;
    }
    clase.reservas = 0;
    await clase.save();
    res.status(200).json({ message: "Reservas en cero con exito", clase });
    return;
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error al volver a cero las reservas", error });
  }
};

const consultarClasesCategoria = async (req, res) => {
  try {
    const clases = await ClasesModel.find({
      categoria: req.params.categoria,
      deleted: false,
    });
    if (!clases) {
      return res
        .status(404)
        .json({ message: "No se encontraron clases de esa categoria" });
    }
    const clasesConReservasActualizadas =
      await mapearClasesConReservasReales(clases);

    res.status(200).json({
      message: `Clases de ${req.params.categoria} encontradas`,
      clases: clasesConReservasActualizadas,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al encontrar las clases", error });
  }
};

const consultarClasesProfesor = async (req, res) => {
  try {
    const idProfe = req.id;
    const clases = await ClasesModel.find({
      idProfesor: req.id,
      deleted: false,
    });
    res.status(200).json({
      message: `Clases de ${req.params.categoria} encontradas`,
      clases,
      idProfe,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al encontrar las clases", error });
  }
};

const consultarClasesHabilitadas = async (req, res) => {
  try {
    const clases = await ClasesModel.find({ deleted: false });
    if (!clases) {
      return res.status(404).json({ message: "No se encontraron clases" });
    }
    res.status(200).json({ message: "Clases encontradas", clases });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al encontrar las clases", error });
  }
};

const consultarClasesDia = async (req, res) => {
  try {
    const clases = await ClasesModel.find({ deleted: false });
    if (!clases) {
      return res.status(404).json({ message: "No se encontraron clases" });
    }
    diaBusqueda = req.params.dia;
    const clasesDia = clases.filter((clase) => clase.dia === diaBusqueda);
    if (!clasesDia) {
      return res
        .status(404)
        .json({ message: "No se encontraron clases para el dia" });
    }
    res.status(200).json({ message: "Clases encontradas", clasesDia });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al encontrar las clases", error });
  }
};

module.exports = {
  consultarClasesCategoria,
  eliminarClase,
  cambiarEstadoClase,
  crearClase,
  consultarClases,
  consultarClasesHabilitadas,
  consultarUnaClase,
  agregarReserva,
  consultarClasesProfesor,
  consultarClasesDia,
  reservaCero,
};
