const express = require("express");
const router = express.Router();

// ==============================================
// CONTROLLERS – LIBROS
// ==============================================
const { 
    getBooks, 
    addBook, 
    eliminarStock,
    eliminarLibro,
    obtenerLibro,
    editarLibro,
    obtenerReporteExistencias
} = require("../controllers/admin/books.controller.js");

// ==============================================
// CONTROLLERS – PEDIDOS
// ==============================================
const { 
    getPedidos,
    getPedidoById,
    crearPedidoCompleto,
    getIngresos    // 👈 YA AGREGADO
} = require("../controllers/admin/order.controller.js");

// ==============================================
// MIDDLEWARES
// ==============================================
const upload = require("../middlewares/subirImagen.middleware.js");
const { verifyToken } = require("../middlewares/authMiddleware.js");


// ==============================================
// RUTAS DE LIBROS
// ==============================================
router.get("/books", verifyToken, getBooks);
router.post("/agregar", verifyToken, upload.single("imagen"), addBook);
router.get("/books/:id", verifyToken, obtenerLibro);
router.put("/books/:id", verifyToken, upload.single("imagen"), editarLibro);
router.delete("/books/:id", verifyToken, eliminarLibro);

router.get("/reporte-existencias", verifyToken, obtenerReporteExistencias);
router.put("/eliminar-stock/:id", verifyToken, eliminarStock);


// ==============================================
// RUTAS DE PEDIDOS
// ==============================================
router.get("/pedidos", verifyToken, getPedidos);
router.get("/pedidos/:id", verifyToken, getPedidoById);
router.post("/crear-pedido", verifyToken, crearPedidoCompleto);


// ==============================================
// RUTA DE INGRESOS (totales, día, semana, mes)
// ==============================================
router.get("/ingresos", verifyToken, getIngresos);


// EXPORTACIÓN
module.exports = router;
