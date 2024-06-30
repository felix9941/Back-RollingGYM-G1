const jwt = require("jsonwebtoken");

module.exports = (role) => async (req, res, next) => {
  try {
    const token = req.header("auth")?.replace("Bearer ", "");
    if (!token) {
      return res.status(400).json({ message: "Error al encontrar el token" });
    }
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY_JWT);
    if (role === verifyToken.prueba.role) {
      next();
    } else {
      return res
        .status(401)
        .json({ message: "No estas autorizado para este endpoint" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error: Token incorrecto" });
  }
};
