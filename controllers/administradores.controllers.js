const AdministradoresModel = require("../models/administradoresSchema");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { welcomeMessage } = require("../middleware/messages");

const consultarAdministradores = async (req, res) => {
  try {
    const administradores = await AdministradoresModel.find();
    if (!administradores.length) {
      res.status(404).json({ message: "No hay administradores registrados" });
      return;
    }
    res
      .status(200)
      .json({ message: "Administradores encontrados", administradores });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error al consultar administradores", error });
  }
};

const consultarAdministradoresHabilitados = async (req, res) => {
  try {
    const administradores = await AdministradoresModel.find({ deleted: false });
    if (!administradores.length) {
      res.status(404).json({ message: "No hay administradores habilitados" });
      return;
    }
    res.status(200).json({
      message: "Administradores habilitados encontrados",
      administradores,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al consultar los administradores habilitados",
      error,
    });
  }
};

const registroAdministrador = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const administradorExists = await AdministradoresModel.findOne({
      email: req.body.email,
    });
    if (administradorExists) {
      res
        .status(409)
        .json({ message: "El administrador ya se encuentra registrado" });
      return;
    }
    const newAdministrador = new AdministradoresModel(req.body);
    const salt = bcrypt.genSaltSync(10);
    newAdministrador.contrasenia = bcrypt.hashSync(req.body.contrasenia, salt);
    const messageResponse = await welcomeMessage(
      newAdministrador.email,
      newAdministrador.nombre
    );
    if (messageResponse === 200) {
      await newAdministrador.save();
      res.status(200).json({
        message: "Administrador fue creado con éxito",
        newAdministrador,
      });
    } else {
      res.status(500).json({ message: "Error nodemailer", error });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error, No se puede crear el administrador" });
  }
};

const loginAdministrador = async (req, res) => {
  try {
    const administradorExist = await AdministradoresModel.findOne({
      email: req.body.email,
    });

    if (!administradorExist) {
      res.status(404).json({ message: "Administrador no encontrado" });
      return;
    }

    const validContrasenia = await bcrypt.compare(
      req.body.contrasenia,
      administradorExist.contrasenia
    );

    if (!validContrasenia) {
      res.status(401).json({ message: "Contraseña incorrecta" });
      return;
    }

    const payload = {
      administrador: {
        id: administradorExist._id,
        email: administradorExist.email,
      },
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY_JWT);

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      role: "administrador",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
};

const cambioEstadoAdministrador = async (req, res) => {
  try {
    const administrador = await AdministradoresModel.findById(req.params.id);
    if (!administrador) {
      res.status(404).json({ message: "El administrador no existe" });
      return;
    }
    if (administrador.deleted === true) {
      administrador.deleted = false;
      await administrador.save();
      res
        .status(400)
        .json({ message: "Administrador habilitado con éxito", administrador });
      return;
    }
    administrador.deleted = true;
    await administrador.save();
    res.status(200).json({
      message: "Administrador deshabilitado con éxito",
      administrador,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error al cambiar el estado del administrador", error });
  }
};

const actualizarAdministrador = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { nombre, apellido, email, telefono } = req.body;
    const administrador = await AdministradoresModel.findByIdAndUpdate(
      req.params.id,
      { nombre, apellido, email, telefono },
      { new: true }
    );
    if (!administrador || administrador.deleted) {
      return res.status(404).json({ message: "Administrador no encontrado" });
    }
    res
      .status(200)
      .json({ message: "Administrador actualizado con éxito", administrador });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Error al actualizar el administrador", error });
  }
};

const eliminarAdministrador = async (req, res) => {
  try {
    const administrador = await AdministradoresModel.findByIdAndUpdate(
      req.params.id,
      { deleted: true },
      { new: true }
    );
    if (!administrador) {
      return res.status(404).json({ message: "Administrador no encontrado" });
    }
    res.status(200).json({ message: "Administrador eliminado con éxito" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error al eliminar el administrador", error });
  }
};

module.exports = {
  registroAdministrador,
  loginAdministrador,
  consultarAdministradores,
  consultarAdministradoresHabilitados,
  cambioEstadoAdministrador,
  actualizarAdministrador,
  eliminarAdministrador,
};