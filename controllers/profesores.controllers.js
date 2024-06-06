const ProfesoresModel = require("../models/profesoresSchema");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
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
    const profesorExists = await ProfesoresModel.findOne({
      email: req.body.email,
    });
    if (profesorExists) {
      res
        .status(409)
        .json({ message: "El profesor ya se encuentra registrado" });
      return;
    }
    const newProfesor = new ProfesoresModel(req.body);
    const salt = bcrypt.genSaltSync(10);
    newProfesor.contrasenia = bcrypt.hashSync(req.body.contrasenia, salt);
    const messageResponse = await welcomeMessage(
      newProfesor.email,
      newProfesor.nombre
    );
    if (messageResponse === 200) {
      await newProfesor.save();
      res
        .status(200)
        .json({ message: "Profesor fue creado con éxito", newProfesor });
    } else {
      res.status(500).json({ message: "Error nodemailer", error });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error, No se puede crear el profesor" });
  }
};

const loginProfesor = async (req, res) => {
  try {
    const profesorExist = await ProfesoresModel.findOne({
      email: req.body.email,
    });

    if (!profesorExist) {
      res.status(404).json({ message: "Profesor no encontrado" });
      return;
    }

    const validContrasenia = await bcrypt.compare(
      req.body.contrasenia,
      profesorExist.contrasenia
    );

    if (!validContrasenia) {
      res.status(401).json({ message: "Contraseña incorrecta" });
      return;
    }

    const payload = {
      profesor: {
        id: profesorExist._id,
        email: profesorExist.email,
      },
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY_JWT);

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      role: "profesor",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
};

const cambioEstadoProfesor = async (req, res) => {
  try {
    const profesor = await ProfesoresModel.findById(req.params.id);
    if (!profesor) {
      res.status(404).json({ message: "El profesor no existe" });
      return;
    }
    if (profesor.deleted === true) {
      profesor.deleted = false;
      await profesor.save();
      res
        .status(400)
        .json({ message: "Profesor habilitado con éxito", profesor });
      return;
    }
    profesor.deleted = true;
    await profesor.save();
    res
      .status(200)
      .json({ message: "Profesor deshabilitado con éxito", profesor });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error al cambiar el estado del profesor", error });
  }
};

const actualizarProfesor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { nombre, apellido, email, telefono, foto } = req.body;
    const profesor = await ProfesoresModel.findByIdAndUpdate(
      req.params.id,
      { nombre, apellido, email, telefono, foto },
      { new: true }
    );
    if (!profesor || profesor.deleted) {
      return res.status(404).json({ message: "Profesor no encontrado" });
    }
    res
      .status(200)
      .json({ message: "Profesor actualizado con éxito", profesor });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error al actualizar el profesor", error });
  }
};

const eliminarProfesor = async (req, res) => {
  try {
    const profesor = await ProfesoresModel.findByIdAndUpdate(
      req.params.id,
      { deleted: true },
      { new: true }
    );
    if (!profesor) {
      return res.status(404).json({ message: "Profesor no encontrado" });
    }
    res.status(200).json({ message: "Profesor eliminado con éxito" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al eliminar el profesor", error });
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
