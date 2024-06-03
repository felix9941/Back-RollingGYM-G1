const ClientesModel = require("../models/clientesSchema");
const ReservasModel = require("../models/reservasSchema");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { welcomeMessage } = require("../middleware/messages");

const consultarClientes = async (req, res) => {
  try {
    const clientes = await ClientesModel.find();
    if (!clientes.length) {
      res.status(404).json({ message: "No hay clientes registrados" });
      return;
    }
    res.status(200).json({ message: "Clientes encontrados", clientes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al consultar los clientes", error });
  }
};

const consultarClientesHabilitados = async (req, res) => {
  try {
    const clientes = await ClientesModel.find({ deleted: false });
    if (!clientes.length) {
      res.status(404).json({ message: "No hay clientes habilitados" });
      return;
    }
    res
      .status(200)
      .json({ message: "Clientes habilitados encontrados", clientes });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error al consultar los clientes habilitados", error });
  }
};

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
    newCliente.contrasenia = bcrypt.hashSync(req.body.contrasenia, salt);
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

const cambioEstadoCliente = async (req, res) => {
  try {
    const cliente = await ClientesModel.findById(req.params.id);
    if (!cliente) {
      res.status(404).json({ message: "El cliente no existe" });
      return;
    }
    if (cliente.deleted === true) {
      cliente.deleted = false;
      await cliente.save();
      res
        .status(400)
        .json({ message: "Cliente habilitado con exito", cliente });
      return;
    }
    cliente.deleted = true;
    await cliente.save();
    res
      .status(200)
      .json({ message: "Cliente deshabilitado con éxito", cliente });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error al cambiar el estado del cliente", error });
  }
};

const pagoCuotaCliente = async (req, res) => {
  try {
    const updatedCliente = await ClientesModel.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res
      .status(201)
      .json({ message: "Vencimiento y Plan actualizados", updatedCliente });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "No se pudo actualizar el vencimiento y plan", error });
  }
};

module.exports = {
  registroCliente,
  loginCliente,
  consultarClientes,
  consultarClientesHabilitados,
  cambioEstadoCliente,
  pagoCuotaCliente,
};
