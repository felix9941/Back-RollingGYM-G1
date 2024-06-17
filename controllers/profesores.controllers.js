const ClientesModel = require("../models/clientesSchema");
const ProfesoresModel = require("../models/profesoresSchema");
const AdministradoresModel = require("../models/administradoresSchema");
const cloudinary = require("../middleware/cloudinary");
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
  try {
    const { nombre, apellido, email, telefono, contrasenia } = req.body;
    const file = req.file;
    let results;

    if (file) {
      results = await cloudinary.uploader.upload(file.path, {
        transformation: [
          { width: 1000, crop: "scale" },
          { quality: "auto:best" },
          { fetch_format: "auto" },
        ],
      });
    }

    const clienteExists = await ClientesModel.findOne({ email });
    const adminExists = await AdministradoresModel.findOne({ email });
    const profeExists = await ProfesoresModel.findOne({ email });

    if (clienteExists || adminExists || profeExists) {
      return res.status(409).json({ message: "El email ya está registrado" });
    }

    const newProfesorData = {
      nombre,
      apellido,
      email,
      telefono,
      contrasenia,
    };

    if (file && results) {
      newProfesorData.foto = results.secure_url;
    }

    const newProfesor = new ProfesoresModel(newProfesorData);

    const salt = bcrypt.genSaltSync(10);
    newProfesor.contrasenia = bcrypt.hashSync(contrasenia, salt);

    const messageResponse = await welcomeMessage(
      newProfesor.email,
      newProfesor.nombre
    );
    if (messageResponse === 200) {
      await newProfesor.save();
      res
        .status(200)
        .json({ message: "El profesor fue creado con éxito", newProfesor });
    } else {
      res.status(500).json({ message: "Error con nodemailer" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error, no se puede crear el profesor", error });
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
  try {
    const { id } = req.params;
    const { nombre, apellido, email, telefono, contrasenia } = req.body;
    const file = req.file;
    let results;

    const profesor = await ProfesoresModel.findById(id);
    if (!profesor) {
      return res.status(404).json({ message: "Profesor no encontrado" });
    }

    if (file) {
      results = await cloudinary.uploader.upload(file.path, {
        transformation: [
          { width: 1000, crop: "scale" },
          { quality: "auto:best" },
          { fetch_format: "auto" },
        ],
      });
    }

    profesor.nombre = nombre || profesor.nombre;
    profesor.apellido = apellido || profesor.apellido;
    profesor.email = email || profesor.email;
    profesor.telefono = telefono || profesor.telefono;

    if (contrasenia) {
      const salt = bcrypt.genSaltSync(10);
      profesor.contrasenia = bcrypt.hashSync(contrasenia, salt);
    }

    if (file && results) {
      profesor.foto = results.secure_url;
    }

    await profesor.save();

    return res
      .status(200)
      .json({ message: "Profesor actualizado con éxito", profesor });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error al actualizar el profesor", error });
  }
};

const eliminarProfesor = async (req, res) => {
  try {
    const profesor = await ProfesoresModel.findOne({
      _id: req.params.id,
    });
    if (!profesor) {
      return res
        .status(400)
        .json({ msg: "No se encuentra el profesor - ID incorrecto" });
    }
    await ProfesoresModel.findByIdAndDelete({ _id: req.params.id });
    res.status(200).json({ msg: "Profesor borrado con exito" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "ERROR: El profesor no fue borrado" });
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
