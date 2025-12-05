const multer = require("multer");
const path = require("path");

// CONFIGURAR ALMACENAMIENTO
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "..", "assets", "public", "libros"));
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9) + ext;
        cb(null, uniqueName);
    }
});

// FILTRO DE TIPOS DE IMAGEN
function fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("El archivo debe ser una imagen"), false);
    }
    cb(null, true);
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB máximo
});

module.exports = upload;
