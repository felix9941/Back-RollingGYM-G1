const ProfesoresModel = require("../models/profesoresSchema");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { welcomeMessage } = require("../middleware/messages");

const consultarProfesores = async (req, res) => {
  try {
    const profesores = await ProfesoresModel.find();
    if (!profesores.length) {
      res.status(404).json({ message: "No hay profesores registrados" });
      return;
    }
    res.status(200).json({ message: "Profesores encontrados", profesores });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al consultar profesores", error });
  }
};

const consultarProfesoresHabilitados = async (req, res) => {
  try {
    const profesores = await ProfesoresModel.find({ deleted: false });
    if (!profesores.length) {
      res.status(404).json({ message: "No hay profesores habilitados" });
      return;
    }
    res
      .status(200)
      .json({ message: "Profesores habilitados encontrados", profesores });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al consultar los profesores habilitados",
      error,
    });
  }
};

const registroProfesor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const clienteExists = await ClientesModel.findOne({
      email: req.body.email,
    });
    const adminExists = await AdministradoresModel.findOne({
      email: req.body.email,
    });
    const profeExists = await ProfesoresModel.findOne({
      email: req.body.email,
    });
    if (clienteExists || adminExists || profeExists) {
      res.status(409).json({ message: "El email ya esta registrado" });
      return;
    }
    const newProfesor = new ProfesoresModel(req.body);
    const salt = bcrypt.genSaltSync(10);
    newProfesor.contrasenia = bcrypt.hashSync(req.body.contrasenia, salt);
    const messageResponse = welcomeMessage(
      req.body.nombre,
      req.body.apellido,
      req.body.email
    );
    const savedProfesor = await newProfesor.save();
    res.status(201).json({
      message: "Profesor registrado con exito",
      savedProfesor,
      messageResponse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al registrar profesor", error });
  }
};

const loginProfesor = async (req, res) => {
  try {
    const { email, contrasenia } = req.body;
    const profesor = await ProfesoresModel.findOne({ email });
    if (!profesor) {
      return res.status(404).json({ message: "Profesor no encontrado" });
    }
    const isMatch = await bcrypt.compare(contrasenia, profesor.contrasenia);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }
    const payload = { id: profesor._id, email: profesor.email };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Login exitoso", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
};

const cambioEstadoProfesor = async (req, res) => {
  try {
    const { id } = req.params;
    const profesor = await ProfesoresModel.findById(id);
    if (!profesor) {
      return res.status(404).json({ message: "Profesor no encontrado" });
    }
    profesor.deleted = !profesor.deleted;
    await profesor.save();
    res.status(200).json({
      message: "Estado del profesor actualizado",
      deleted: profesor.deleted,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error al cambiar estado del profesor", error });
  }
};

const actualizarProfesor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    const profesor = await ProfesoresModel.findById(id);
    if (!profesor) {
      return res.status(404).json({ message: "Profesor no encontrado" });
    }
    Object.assign(profesor, req.body);
    await profesor.save();
    res.status(200).json({ message: "Profesor actualizado", profesor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al actualizar profesor", error });
  }
};

const eliminarProfesor = async (req, res) => {
  try {
    const { id } = req.params;
    const profesor = await ProfesoresModel.findById(id);
    if (!profesor) {
      return res.status(404).json({ message: "Profesor no encontrado" });
    }
    await profesor.remove();
    res.status(200).json({ message: "Profesor eliminado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al eliminar profesor", error });
  }
};

module.exports = {
  registroProfesor,
  loginProfesor,
  consultarProfesores,
  consultarProfesoresHabilitados,
  cambioEstadoProfesor,
  actualizarProfesor,
  eliminarProfesor,
};
