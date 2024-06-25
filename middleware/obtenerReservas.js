const jwt = require("jsonwebtoken");

module.exports = () => async (req, res, next) => {
  try {
    const token = req.header("auth")?.replace("Bearer ", "");
    if (!token) {
      return res.status(400).json({ message: "Error al encontrar el token" });
    }
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY_JWT);
    req.reservas = await verifyToken.cliente.idReservas;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error: Token incorrecto" });
  }
};
