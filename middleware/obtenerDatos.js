const jwt = require("jsonwebtoken");

module.exports = () => async (req, res, next) => {
  try {
    const token = req.header("auth")?.replace("Bearer ", "");
    if (!token) {
      return res.status(400).json({ message: "Error al encontrar el token" });
    }
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY_JWT);
    const roles = ["administrador", "cliente", "profesor"];
    for (const role of roles) {
      if (verifyToken[role]?.id) {
        req.id = verifyToken[role].id;
        req.role = role;
        break;
      }
    }
    if (!req.id) {
      return res
        .status(400)
        .json({ message: "Error: Token inválido, no se encontró ID" });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error: Token incorrecto" });
  }
};
