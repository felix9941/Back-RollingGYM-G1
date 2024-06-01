const PruebaModel = require("../models/pruebaSchema");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { welcomeMessage } = require("../middleware/messages");
const cloudinary = require("../middleware/cloudinary");

const disablePrueba = async (req, res) => {
  try {
    /* Busco la prueba con el id que recibimos en la url */
    const prueba = await PruebaModel.findById(req.params.id);
    /* Si no encuentra ninguna la prueba no existe */
    if (!prueba) {
      res.status(404).json({ message: "La prueba no existe" });
      return;
    }
    /* Si la prueba ya está deshabilitada no la deshabilito de nuevo */
    if (prueba.deleted === true) {
      res.status(400).json({ message: "La prueba ya está deshabilitada" });
      return;
    }
    /* Si la prueba no está deshabilitada lo deshabilita, pasando delete a true */
    prueba.deleted = true;
    /* Guardo la prueba actualizada */
    await prueba.save();
    res.status(200).json({ message: "Prueba deshabilitada con éxito", prueba });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al deshabilitar la prueba", error });
  }
};

const getUnoPrueba = async (req, res) => {
  try {
    const getPrueba = await PruebaModel.findOne({ _id: req.params.id });
    res.status(200).json({ message: "Prueba encontrada", getPrueba });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "No se pudo encontrar la prueba", error });
  }
};

const getPrueba = async (req, res) => {
  try {
    const getAllPruebas = await PruebaModel.find();
    res.status(200).json({ message: "Pruebas encontradas", getAllPruebas });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "No se pudieron encontrar las pruebas", error });
  }
};

const loginPrueba = async (req, res) => {
  try {
    const pruebaExist = await PruebaModel.findOne({
      username: req.body.username,
    });

    if (!pruebaExist) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      pruebaExist.password
    );

    if (!validPassword) {
      res.status(401).json({ message: "Contraseña incorrecta" });
      return;
    }

    const payload = {
      prueba: {
        id: pruebaExist._id,
        username: pruebaExist.username,
        role: pruebaExist.role,
      },
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY_JWT);

    res.status(200).json({ message: "Login de Prueba exitoso", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
};

const postPrueba = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const newPrueba = new PruebaModel(req.body);
    const salt = bcrypt.genSaltSync(10);
    newPrueba.password = bcrypt.hashSync(req.body.password, salt);
    /* Funcion para mandar mail de bienvenida */
    const messageResponse = await welcomeMessage(
      newPrueba.email,
      newPrueba.username
    );
    if (messageResponse === 200) {
      const results = await cloudinary.uploader.upload(req.file.path, {
        transformation: [
          { width: 1000, crop: "scale" },
          { quality: "auto:best" },
          { fetch_format: "auto" },
        ],
      });
      newPrueba.image = results.secure_url;
      await newPrueba.save();
      res.status(200).json({ message: "Prueba creada con exito", newPrueba });
    } else {
      res.status(500).json({ message: "Error nodemailer", error });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "No se puede crear la prueba" });
  }
};

const updatePrueba = async (req, res) => {
  try {
    const updatedPrueba = await PruebaModel.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res.status(200).json({ message: "Prueba actualizada", updatedPrueba });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "No se pudo actualizar la prueba", error });
  }
};

const deletePrueba = async (req, res) => {
  try {
    const pruebaExist = await PruebaModel.findOne({ _id: req.params.id });

    if (!pruebaExist) {
      res.status(500).json({ message: "Prueba no encontrada" });
      return;
    }

    await PruebaModel.findByIdAndDelete({ _id: req.params.id });
    res
      .status(200)
      .json({ message: "Prueba eliminada con exito", pruebaExist });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "No se pudo eliminar la prueba", error });
  }
};

module.exports = {
  getUnoPrueba,
  getPrueba,
  disablePrueba,
  loginPrueba,
  postPrueba,
  updatePrueba,
  deletePrueba,
};
