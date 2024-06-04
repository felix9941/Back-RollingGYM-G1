const { validationResult } = require("express-validator");
const CategoriasModel = require("../models/categoriasSchema");

const ConsultarCategorias = async (req, res) => {
  try {
    const categorias = await CategoriasModel.find();
    res.status(200).json({ msg: "Categorias obtenidas", categorias });
  } catch (error) {
    res.status(500).json({ msg: "ERROR. Categorias no encontradas", error });
  }
};

const CargarCategoria = async (req, res) => {
  try {
    const nuevaCategoria = new CategoriasModel(req.body);
    await nuevaCategoria.save();
    if (!nuevaCategoria) {
      return res.json({ msg: "No se pudo cargar la categoria" });
    }
    res.status(200).json({ msg: "Categorias cargados", nuevaCategoria });
  } catch (error) {
    res.status(500).json({ msg: "ERROR. Categoria no cargada", error });
  }
};

const ActualizarCategoria = async (req, res) => {
  try {
    const categoriaActualizada = await CategoriasModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!categoriaActualizada) {
      return res
        .status(404)
        .json({ msg: "Categorias no encontrada. No se puede actualizar" });
    }
    res
      .status(200)
      .json({ msg: "Categorias actualizadas", categoriaActualizada });
  } catch (error) {
    res.status(500).send("ERROR: No se pudo actualizar el categorias");
  }
};

const CambioEstadoCategoria = async (req, res) => {
  try {
    const Categorias = await CategoriasModel.findById(req.params.id);
    if (!Categorias) {
      return res.status(404).json({ msg: "Categoria no encontrada." });
    }

    if (Categorias.deleted) {
      Categorias.deleted = false;
      await Categorias.save();
      res.status(200).json({ msg: "La Categoria fue habilitada" });
    } else {
      Categorias.deleted = true;
      await Categorias.save();
      res.status(200).json({ msg: "La Categoria fue deshabilitada" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al cambiar el estado de Categoria", error });
  }
};

const EliminarCatFisicamente = async (req, res) => {
  try {
    const CategoriaPorBorrar = await CategoriasModel.findOne({
      _id: req.params.id,
    });
    if (!CategoriaPorBorrar) {
      return res
        .status(400)
        .json({ msg: "No se encuentra la Categoria - ID incorrecto" });
    }
    await CategoriasModel.findByIdAndDelete({ _id: req.params.id });
    res.status(200).json({ msg: "Categoria eliminada con exito" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "ERROR: La Categoria no fue eliminada", error });
  }
};

module.exports = {
  ConsultarCategorias,
  CargarCategoria,
  ActualizarCategoria,
  CambioEstadoCategoria,
  EliminarCatFisicamente,
};
