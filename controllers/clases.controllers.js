const ClasesModel = require("../models/clasesSchema");
const { validationResult } = require("express-validator");

const crearClase = async (req, res) => {
  try {
    const newClase = new ClasesModel(req.body);
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
