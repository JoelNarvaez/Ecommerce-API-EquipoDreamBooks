const db = require("../../config/db");

// Importar funciones del modelo
const {
    crearPedido,
    agregarDetalle,
    obtenerPedidos,
    obtenerPedidoDetalles,
    obtenerIngresosTotales,
    obtenerIngresosDia,
    obtenerIngresosSemana,
    obtenerIngresosMes
} = require("../../models/orderModel");

/* ============================================================
   GET /api/admin/pedidos
============================================================ */
async function getPedidos(req, res) {
    try {
        const pedidos = await obtenerPedidos();
        res.json({ ok: true, pedidos });
    } catch (error) {
        console.error("❌ Error en getPedidos:", error);
        res.status(500).json({ ok: false, message: "Error obteniendo pedidos" });
    }
}

/* ============================================================
   GET /api/admin/pedidos/:id
============================================================ */
async function getPedidoById(req, res) {
    try {
        const id = req.params.id;
        const detalles = await obtenerPedidoDetalles(id);
        res.json({ ok: true, detalles });
    } catch (error) {
        console.error("❌ Error en getPedidoById:", error);
        res.status(500).json({ ok: false, message: "Error obteniendo detalles del pedido" });
    }
}

/* ============================================================
   POST /api/admin/crear-pedido
============================================================ */
async function crearPedidoCompleto(req, res) {
    try {
        const usuario_id = req.usuario?.id || 1;
        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ ok: false, msg: "No hay productos en el pedido" });
        }

        // Calcular total
        const total = items.reduce(
            (sum, item) => sum + item.cantidad * item.precio_unitario,
            0
        );

        // Crear pedido
        const pedido_id = await crearPedido(usuario_id, total);

        // Crear detalles
        for (const item of items) {
            await agregarDetalle(
                pedido_id,
                item.producto_id,
                item.cantidad,
                item.precio_unitario
            );
        }

        res.json({
            ok: true,
            msg: "Pedido creado correctamente",
            pedido_id
        });

    } catch (error) {
        console.error("❌ Error en crearPedidoCompleto:", error);
        res.status(500).json({ ok: false, msg: "Error al crear pedido" });
    }
}

/* ============================================================
   GET /api/admin/ingresos
   → Regresa:
       • total
       • dia
       • semana
       • mes
============================================================ */
async function getIngresos(req, res) {
    try {
        const total = await obtenerIngresosTotales();
        const dia = await obtenerIngresosDia();
        const semana = await obtenerIngresosSemana();
        const mes = await obtenerIngresosMes();

        res.json({
            ok: true,
            ingresos: { total, dia, semana, mes }
        });

    } catch (error) {
        console.error("❌ Error en getIngresos:", error);
        res.status(500).json({ ok: false, message: "Error obteniendo ingresos" });
    }
}

module.exports = {
    getPedidos,
    getPedidoById,
    crearPedidoCompleto,
    getIngresos
};
