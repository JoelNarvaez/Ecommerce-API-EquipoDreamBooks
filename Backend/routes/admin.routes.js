const express = require("express");
const router = express.Router();

const { 
    getBooks, 
    addBook, 
    eliminarStock,
    eliminarLibro,
    obtenerLibro,
    editarLibro,
    obtenerReporteExistencias   
} = require("../controllers/admin/books.controller.js");

const upload = require("../middlewares/subirImagen.middleware.js");

// Libros
router.get("/books", getBooks);
router.post("/agregar", upload.single("imagen"), addBook);
router.get("/books/:id", obtenerLibro);
router.put("/books/:id", upload.single("imagen"), editarLibro);

// Reporte de existencias 
router.get("/reporte-existencias", obtenerReporteExistencias);

// Eliminar stock
router.put("/eliminar-stock/:id", eliminarStock);

// Eliminar libro completo
router.delete("/books/:id", eliminarLibro);

module.exports = router;
