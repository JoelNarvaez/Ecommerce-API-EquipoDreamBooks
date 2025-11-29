const express = require("express");
const router = express.Router();

const { 
    getBooks, 
    addBook, 
    eliminarStock,
    eliminarLibro,
    obtenerLibro,      // ⭐ NUEVO
    editarLibro        // ⭐ NUEVO
} = require("../controllers/admin/books.controller.js");

const upload = require("../middlewares/subirImagen.middleware.js");

// Libros
router.get("/books", getBooks);
router.post("/agregar", upload.single("imagen"), addBook);

// Obtener por id
router.get("/books/:id", obtenerLibro);

// Actualizar Libro
router.put("/books/:id", upload.single("imagen"), editarLibro);

// Eliminar stock
router.put("/eliminar-stock/:id", eliminarStock);

// Eliminar libro completo
router.delete("/books/:id", eliminarLibro);

module.exports = router;
