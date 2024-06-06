const { validationResult } = require("express-validator");
const ProductosModel = require("../models/productosSchema");

const ObtenerProdHabilitados = async (req, res) => {
  try {
    const productosHabilitados = await ProductosModel.find({ deleted: false });
    res
      .status(200)
      .json({ msg: "Productos habilitados obtenidos", productosHabilitados });
  } catch (error) {
    res.status(500).json({
      msg: "ERROR. No se pudieron obtener los productos habilitados",
      error,
    });
  }
};

const ConsultarProductos = async (req, res) => {
  try {
    const productos = await ProductosModel.find();
    res.status(200).json({ msg: "Productos obtenidos", productos });
  } catch (error) {
    res.status(500).json({ msg: "ERROR. Productos no encontrados", error });
  }
};

const CargarProducto = async (req, res) => {
  try {
    const nuevoProducto = new ProductosModel(req.body);
    const results = await cloudinary.uploader.upload(req.file.path, {
      transformation: [
        { width: 1000, crop: "scale" },
        { quality: "auto:best" },
        { fetch_format: "auto" },
      ],
    });
    nuevoProducto.foto = results.secure_url;
    await nuevoProducto.save();
    if (!nuevoProducto) {
      return res.json({ msg: "No se pudo cargar el producto" });
    }
    res.status(200).json({ msg: "Productos cargados", nuevoProducto });
  } catch (error) {
    res.status(500).json({ msg: "ERROR. Productos no encontrados", error });
  }
};

const ActualizarProducto = async (req, res) => {
  try {
    const productoActualizado = await ProductosModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!productoActualizado) {
      return res
        .status(404)
        .json({ msg: "Producto no encontrado. No se puede actualizar" });
    }
    res.status(200).json({ msg: "Producto actualizado", productoActualizado });
  } catch (error) {
    console.log(error);
    res.status(500).send("ERROR: No se pudo actualizar el producto");
  }
};

const CambioEstadoProducto = async (req, res) => {
  try {
    const producto = await ProductosModel.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ msg: "Producto no encontrado." });
    }

    if (producto.deleted) {
      producto.deleted = false;
      await producto.save();
      res.status(200).json({ msg: "El producto fue habilitado" });
    } else {
      producto.deleted = true;
      await producto.save();
      res.status(200).json({ msg: "El producto fue deshabilitado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al cambiar el estado el producto", error });
  }
};

const EliminarProdFisicamente = async (req, res) => {
  try {
    const productoPorBorrar = await ProductosModel.findOne({
      _id: req.params.id,
    });
    if (!productoPorBorrar) {
      return res
        .status(400)
        .json({ msg: "No se encuentra el producto - ID incorrecto" });
    }
    await ProductosModel.findByIdAndDelete({ _id: req.params.id });
    res.status(200).json({ msg: "Producto borrado con exito" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "ERROR: El producto no fue borrado" });
  }
};

module.exports = {
  ObtenerProdHabilitados,
  ConsultarProductos,
  CargarProducto,
  ActualizarProducto,
  CambioEstadoProducto,
  EliminarProdFisicamente,
};
