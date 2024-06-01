const multer = require("multer");
const path = require("path");

module.exports = multer({
  /* Esto nos habilita el guardado en nuestro almacenamiento, en este caso
  no vamos a usarlo porque las imagenes se van a guardar en cloudinary */
  storage: multer.diskStorage({}),
  /* Con esto vamos a empezar a filtrar la extension como el archivo en si */
  /* Esta funcion recibe estos tres parametros, el cb es como el next que usamos
  anteriormente, viene de callback y si todo esta bien sigue y sino manda error,
  y file es el archivo que vamos a examinar si esta correcto */
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    /* Usamos este ext para verificar que la extension sea jpg, jpeg o png */
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      /* Vamos a usar el callback o cb, este primero nos pregunta si hay un error,
      en este caso como si lo hay lo creamos asi, luego ponemos una coma y va true o
      false dependiendo si aceptamos o no el archivo, en este caso claramente no
      porque no cumple con las extensiones permitidas */
      cb(
        new Error("Solo se permiten archivos con extension jpg, jpeg o png"),
        false
      );
    } else {
      /* En el caso que si cumpla con las extensiones, no hay un error, por
      lo tanto ponemos null coma y true ya que si aceptamos el archivo */
      cb(null, true);
    }
  },
});
