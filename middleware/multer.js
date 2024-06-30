const multer = require("multer");
const path = require("path");

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(
        new Error("Solo se permiten archivos con extension jpg, jpeg o png"),
        false
      );
    } else {
      cb(null, true);
    }
  },
});
