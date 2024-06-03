const ClientesModel = require("../models/clientesSchema");
const ReservasModel = require("../models/reservasSchema");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { welcomeMessage } = require("../middleware/messages");

const registroCliente = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const clienteExists = await ClientesModel.findOne({
      email: req.body.email,
    });
    if (clienteExists) {
      res.status(409).json({ message: "El cliente ya existe" });
      return;
    }
    const newCliente = new ClientesModel(req.body);
    const newReservas = ReservasModel({ idCliente: newCliente._id });
    const salt = bcrypt.genSaltSync(10);
    newCliente.idReservas = newReservas._id;
    newCliente.password = bcrypt.hashSync(req.body.contrasenia, salt);
    const messageResponse = await welcomeMessage(
      newCliente.email,
      newCliente.nombre
    );
    if (messageResponse === 200) {
      await newReservas.save();
      await newCliente.save();
      res.status(200).json({ message: "Cliente creado con exito", newCliente });
    } else {
      res.status(500).json({ message: "Error nodemailer", error });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "No se puede crear el cliente" });
  }
};

const loginCliente = async (req, res) => {
  try {
    const clienteExist = await ClientesModel.findOne({ email: req.body.email });

    if (!clienteExist) {
      res.status(404).json({ message: "Cliente no encontrado" });
      return;
    }

    const validContrasenia = await bcrypt.compare(
      req.body.contrasenia,
      clienteExist.contrasenia
    );

    if (!validContrasenia) {
      res.status(401).json({ message: "Contraseña incorrecta" });
      return;
    }

    const payload = {
      cliente: {
        id: clienteExist._id,
        email: clienteExist.email,
        idReservas: clienteExist.idReservas,
        plan: clienteExist.plan,
      },
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY_JWT);

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      role: "cliente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
};

module.exports = {
  registroCliente,
  loginCliente,
};
