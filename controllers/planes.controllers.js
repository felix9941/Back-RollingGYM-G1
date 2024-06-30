const { validationResult } = require("express-validator");
const PlanesModel = require("../models/planesSchema");

const ObtenerPlanesHabilitados = async (req, res) => {
  try {
    const planesHabilitados = await PlanesModel.find({ deleted: false });
    res
      .status(200)
      .json({ msg: "Planes habilitados obtenidos", planesHabilitados });
  } catch (error) {
    res.status(500).json({
      msg: "ERROR. No se pudieron obtener los planes habilitados",
      error,
    });
  }
};

const consultarPlanes = async (req, res) => {
  try {
    const planes = await PlanesModel.find();
    res.status(200).json({ msg: "Planes obtenidos", planes });
  } catch (error) {
    res.status(500).json({ msg: "ERROR. Planes no encontrados", error });
  }
};

const CargarPlan = async (req, res) => {
  try {
    const nuevoPlan = new PlanesModel(req.body);
    await nuevoPlan.save();
    if (!nuevoPlan) {
      return res.json({ msg: "No se pudo cargar el Plan" });
    }
    res.status(200).json({ msg: "Plan cargados", nuevoPlan });
  } catch (error) {
    res.status(500).json({ msg: "ERROR. Plan no cargado", error });
  }
};

const CambioEstadoPlan = async (req, res) => {
  try {
    const plan = await PlanesModel.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ msg: "Plan no encontrado." });
    }

    if (plan.deleted) {
      plan.deleted = false;
      await plan.save();
      res.status(200).json({ msg: "El plan fue habilitado" });
    } else {
      plan.deleted = true;
      await plan.save();
      res.status(200).json({ msg: "El plan fue deshabilitado" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Error al cambiar el estado el plan", error });
  }
};

const actualizarPlan = async (req, res) => {
  try {
    const planActualizado = await PlanesModel.findByIdAndUpdate(
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

const ObtenerPlanPorId = async (req, res) => {
  try {
    const plan = await PlanesModel.findById({ deleted: false });
    if (!plan) {
      return res.status(404).json({ msg: "Plan no encontrado" });
    }
    res.status(200).json({ msg: "Plan obtenido", plan });
  } catch (error) {
    res.status(500).json({
      msg: "ERROR. No se pudo obtener el plan",
      error,
    });
  }
};

module.exports = {
  ObtenerPlanesHabilitados,
  consultarPlanes,
  CargarPlan,
  CambioEstadoPlan,
  actualizarPlan,
  ObtenerPlanPorId,
};
