const ClasesModel = require("../models/clasesSchema");
const { validationResult } = require("express-validator");
const moment = require("moment");

const crearClase = async (req, res) => {
  try {
    const { nombre, dia, hora, categoria, idProfesor, cupo } = req.body;
    const soloHora = moment(hora, "HH:mm").toDate();
    const newClase = new ClasesModel({
      nombre,
      dia,
      hora: soloHora,
      categoria,
      idProfesor,
      cupo,
    });
    await newClase.save();
    res.status(200).json({ message: "Clase creada con exito", newClase });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "No se puede crear la clase" });
  }
};

module.exports = {
  crearClase,
};
