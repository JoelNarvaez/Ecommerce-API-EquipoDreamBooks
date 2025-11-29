const express = require("express");
const router = express.Router();

// IMPORTAR CONTROLADORES DE ADMIN
const { getBooks, addBook } = require("../controllers/admin/books.controller.js");
const upload = require("../middlewares/subirImagen.middleware.js");

// RUTAS DE ADMIN
router.get("/books", getBooks); 
router.post("/agregar", upload.single("imagen"), addBook);

module.exports = router;
