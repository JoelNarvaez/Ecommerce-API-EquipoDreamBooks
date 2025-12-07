const express = require("express");
const router = express.Router();
const { obtenerCarrito } = require("../controllers/cart/obtenerCarrito.controller");
const { agregarCarrito } = require("../controllers/cart/agregarCarrito.controller");
const { actualizarCarrito } = require("../controllers/cart/actualizarCarrito.controller");
const { eliminarCarrito } = require("../controllers/cart/eliminarCarrito.controller");
const { aplicarCupon } = require("../controllers/cupones/aplicarCupon.controller");
// Controlador que CREARÁ el pedido desde compra.js
const {
    crearPedidoDesdeCarrito
} = require("../controllers/cart/pedidoCarrito.controller");


const { verifyToken } = require("../middlewares/authMiddleware");


router.get("/", verifyToken, obtenerCarrito);
router.post("/agregar", verifyToken, agregarCarrito);
router.put("/actualizar", verifyToken, actualizarCarrito);
router.delete("/eliminar/:idItem", verifyToken, eliminarCarrito); // ← CORREGIDO
router.post("/aplicar", verifyToken, aplicarCupon);
router.post("/checkout", verifyToken, crearPedidoDesdeCarrito);


module.exports = router;
