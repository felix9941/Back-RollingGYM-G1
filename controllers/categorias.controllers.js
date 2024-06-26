const { validationResult } = require("express-validator");
const CategoriasModel = require("../models/categoriasSchema");
const cloudinary = require("../middleware/cloudinary");

const ObtenerCategoriasHabilitadas = async (req, res) => {
  try {
    const categoria = await CategoriasModel.find({ deleted: false });

    if (!categoria || categoria.length === 0) {
      res.status(200).json({ msg: "No hay categorías habilitadas", categoria });
    } else {
      res
        .status(200)
        .json({ msg: "Categorias habilitados obtenidos", categoria });
    }
  } catch (error) {
    res.status(500).json({
      msg: "ERROR. No se pudieron obtener las categorias habilitados",
      error,
    });
  }
};
const ConsultarCategorias = async (req, res) => {
  try {
    const categorias = await CategoriasModel.find();
    res.status(200).json({ msg: "Categorias obtenidas", categorias });
  } catch (error) {
    res.status(500).json({ msg: "ERROR. Categorias no encontradas", error });
  }
};

const ObtenerCategoriasPorPlan = async (req, res) => {
  try {
    const plan = req.plan;

    const categoriasHabilitadas = await CategoriasModel.find({
      deleted: false,
    });

    if (!categoriasHabilitadas || categoriasHabilitadas.length === 0) {
      res
        .status(200)
        .json({ msg: "No hay categorías habilitadas", categoriasHabilitadas });
    }

    let categoria = ["hola"];

    if (plan === "Ninguno") {
      categoria = [];
    } else if (plan === "Plan Full") {
      categoria = categoriasHabilitadas;
    } else if (plan === "Plan Clases") {
      categoria = categoriasHabilitadas.filter((cat) =>
        cat.idPlanes.some((id) => id.toString() === "66677b6f5b741422f3a2fee0")
      );
    } else if (plan === "Plan Aparatos") {
      categoria = categoriasHabilitadas.filter((cat) =>
        cat.idPlanes.some((id) => id.toString() === "66677b045b741422f3a2fede")
      );
    }

    if (!categoria || categoria.length === 0) {
      res
        .status(200)
        .json({ msg: "No hay categorías para este plan", categoria });
    } else {
      res.status(200).json({ msg: "Categorias para este plan", categoria });
    }
  } catch (error) {
    res.status(500).json({
      msg: "ERROR. No se pudieron obtener las categorias para el plan especificado",
      error,
    });
  }
};

const CargarCategoria = async (req, res) => {
  try {
    const { nombre, idPlanes } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ msg: "No se ha proporcionado una imagen" });
    }
    const results = await cloudinary.uploader.upload(file.path, {
      transformation: [
        { width: 1000, crop: "scale" },
        { quality: "auto:best" },
        { fetch_format: "auto" },
      ],
    });
    const nuevaCategoria = new CategoriasModel({
      nombre,
      idPlanes,
      foto: results.secure_url,
    });
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
    const { nombre, idPlanes } = req.body;
    let updateData = { nombre, idPlanes };
    if (req.file) {
      const file = req.file;
      const results = await cloudinary.uploader.upload(file.path, {
        transformation: [
          { width: 1000, crop: "scale" },
          { quality: "auto:best" },
          { fetch_format: "auto" },
        ],
      });
      updateData = { ...updateData, foto: results.secure_url };
    }
    const categoriaActualizada = await CategoriasModel.findByIdAndUpdate(
      req.params.id,
      updateData,
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

const ObtenerCategoriasPorPlanId = async (req, res) => {
  try {
    const planId = req.params.planId;

    const categoriasHabilitadas = await CategoriasModel.find({
      deleted: false,
    });

    if (!categoriasHabilitadas || categoriasHabilitadas.length === 0) {
      return res
        .status(200)
        .json({ msg: "No hay categorías habilitadas", categoriasHabilitadas });
    }

    const categoria = categoriasHabilitadas.filter((cat) =>
      cat.idPlanes.some((id) => id.toString() === planId)
    );

    if (!categoria || categoria.length === 0) {
      res
        .status(200)
        .json({ msg: "No hay categorías para este plan", categoria });
    } else {
      res.status(200).json({ msg: "Categorias para este plan", categoria });
    }
  } catch (error) {
    res.status(500).json({
      msg: "ERROR. No se pudieron obtener las categorias para el plan especificado",
      error,
    });
  }
};

module.exports = {
  ObtenerCategoriasHabilitadas,
  ConsultarCategorias,
  CargarCategoria,
  ActualizarCategoria,
  CambioEstadoCategoria,
  EliminarCatFisicamente,
  ObtenerCategoriasPorPlan,
  ObtenerCategoriasPorPlanId,
};
