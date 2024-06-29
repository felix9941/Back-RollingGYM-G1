const ClientesModel = require("../models/clientesSchema");
const ProfesoresModel = require("../models/profesoresSchema");
const AdministradoresModel = require("../models/administradoresSchema");
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
        .status(200)
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { plan, expiracionCuota } = req.body;
    const expiracionCuotaMilisegundos = new Date(expiracionCuota).getTime();
    const updatedCliente = await ClientesModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        plan,
        expiracionCuota: expiracionCuotaMilisegundos,
      },
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

const vencimientoCuotaCliente = async (req, res) => {
  try {
    const updatedCliente = await ClientesModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        plan: "Ninguno",
      },
      { new: true }
    );
    res
      .status(201)
      .json({ message: "El cliente ya no esta abonado", updatedCliente });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "No se pudo desabonar al cliente", error });
  }
};

const eliminarCliente = async (req, res) => {
  try {
    const cliente = await ClientesModel.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    const idReserva = cliente.idReservas;
    const reservaEliminada = await ReservasModel.findByIdAndDelete(idReserva);
    const clienteEliminado = await ClientesModel.findByIdAndDelete(
      req.params.id
    );
    if (!clienteEliminado) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    res.status(200).json({
      message1: "Cliente eliminado con éxito",
      clienteEliminado,
      message2: "Reserva del cliente eliminada con éxito",
      reservaEliminada,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "No se pudo eliminar el cliente", error });
  }
};

const editarCliente = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { nombre, apellido, email, telefono } = req.body;
    const updatedCliente = await ClientesModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        nombre,
        apellido,
        email,
        telefono,
      },
      { new: true }
    );
    res.status(201).json({ message: "Cliente actualizado", updatedCliente });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "No se pudo actualizar cliente", error });
  }
};

const obtenerDatosUsuario = async (req, res) => {
  try {
    const id = req.id;
    const usuario = await ClientesModel.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.status(200).json({
      message: "Cliente encontrado",
      usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al consultar los datos de cliente",
      error,
    });
  }
};

const actualizarDatosPropios = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { nombre, apellido, email, telefono, contrasenia } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const contraseniaEncriptada = bcrypt.hashSync(contrasenia, salt);

    const cliente = await ClientesModel.findByIdAndUpdate(
      req.params.id,
      { nombre, apellido, email, telefono, contrasenia: contraseniaEncriptada },
      { new: true }
    );

    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    res.status(200).json({
      message: "Cliente actualizado con éxito",
      cliente,
    });
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: "Error al actualizar el cliente", error });
  }
};

module.exports = {
  registroCliente,
  loginCliente,
  consultarClientes,
  consultarClientesHabilitados,
  cambioEstadoCliente,
  pagoCuotaCliente,
  vencimientoCuotaCliente,
  eliminarCliente,
  editarCliente,
  obtenerDatosUsuario,
  actualizarDatosPropios,
};
