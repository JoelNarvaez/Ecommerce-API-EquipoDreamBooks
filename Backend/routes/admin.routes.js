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

const { 
    getPedidos,
    getPedidoById,
    crearPedidoCompleto,
    getIngresos     // 👈 AÑADIDO AQUÍ
} = require("../controllers/admin/order.controller.js");

const upload = require("../middlewares/subirImagen.middleware.js");
const { verifyToken } = require("../middlewares/authMiddleware.js");

router.get("/books", verifyToken, getBooks);
router.post("/agregar", verifyToken, upload.single("imagen"), addBook);
router.get("/books/:id", verifyToken, obtenerLibro);
router.put("/books/:id", verifyToken, upload.single("imagen"), editarLibro);
router.delete("/books/:id", verifyToken, eliminarLibro);
router.get("/reporte-existencias", verifyToken, obtenerReporteExistencias);
router.put("/eliminar-stock/:id", verifyToken, eliminarStock);

// PEDIDOS
router.get("/pedidos", verifyToken, getPedidos);
router.get("/pedidos/:id", verifyToken, getPedidoById);
router.post("/crear-pedido", verifyToken, crearPedidoCompleto);

// INGRESOS 💰
router.get("/ingresos", verifyToken, getIngresos);

module.exports = router;
