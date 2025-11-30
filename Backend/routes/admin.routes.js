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
const {verifyToken} = require("../middlewares/authMiddleware.js");

// ========================
//  Libros CRUD (PROTEGIDO)
// ========================
router.get("/books", verifyToken, getBooks);

router.post("/agregar", verifyToken, upload.single("imagen"), addBook);

router.get("/books/:id", verifyToken, obtenerLibro);

router.put("/books/:id", verifyToken, upload.single("imagen"), editarLibro);

router.delete("/books/:id", verifyToken, eliminarLibro);

// ========================
//  Reporte existencias (PROTEGIDO)
// ========================
router.get("/reporte-existencias", verifyToken, obtenerReporteExistencias);

// ========================
//  Eliminar stock (PROTEGIDO)
// ========================
router.put("/eliminar-stock/:id", verifyToken, eliminarStock);

module.exports = router;
