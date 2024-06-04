const { validationResult } = require("express-validator");
const ProductosModel = require("../models/productosSchema");

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
    console.log(productoActualizado);
    res.status(200).json({ msg: "Producto actualizado", productoActualizado });
  } catch (error) {
    console.log(error);
    res.status(500).send("ERROR: No se pudo actualizar el producto");
  }
};

const EliminarProdLogicamente = async (req, res) => {
  try {
    const prodPorBorrarLogicamente = await UserModel.findById(req.params.id);

    if (prodPorBorrarLogicamente.delete) {
      return res
        .status(400)
        .json({ msg: "Producto ya fue eliminado logicamente" });
    }
    //Que busque en usuarios por id
    prodPorBorrarLogicamente.deleted = true;
    await prodPorBorrarLogicamente.save();
    res.status(200).json({ msg: "Producto borrado logicamente" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al eliminar producto ligicamente", error });
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
  ConsultarProductos,
  CargarProducto,
  ActualizarProducto,
  EliminarProdLogicamente,
  EliminarProdFisicamente,
};
