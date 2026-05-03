const mongoose = require("mongoose");

try {
  mongoose
    .connect(process.env.MONGO_CONNECT)
    .then(() => console.log("Connected!"));
} catch (error) {
  console.log("Error de conexion con la base de datos", error);
}
