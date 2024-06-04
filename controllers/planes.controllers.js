const { validationResult } = require("express-validator");
const ProductModel = require("../models/productSchema");

const consultarPlanes = async (req, res) => {
  try {
    const planes = await ProductModel.find();
    res.status(200).json({ msg: "Planes obtenidos", planes });
  } catch (error) {
    res.status(500).json({ msg: "ERROR. Planes no encontrados", error });
  }
};

const actualizarPlan = async (req, res) => {
  try {
    const planActualizado = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    console.log(planActualizado);
    res.status(200).json({ msg: "Plan actualizado", planActualizado });
  } catch (error) {
    console.log(error);
    res.status(500).send("ERROR: No se pudo actualizar el plan");
  }
};

module.exports = {
  consultarPlanes,
  actualizarPlan,
};
