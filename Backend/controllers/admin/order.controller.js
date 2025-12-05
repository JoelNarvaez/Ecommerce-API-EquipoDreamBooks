// controllers/admin/order.controller.js
const db = require("../../config/db");

const {
  crearPedido,
  agregarDetalle,
  obtenerPedidos,
  obtenerPedidoDetalles,
  obtenerIngresosTotales,
  obtenerIngresosDia,
  obtenerIngresosSemana,
  obtenerIngresosMes,
  obtenerHistorialDiarioMes,
} = require("../../models/orderModel");

/* ============================================================
    2. GET /api/admin/pedidos  → LISTADO DE PEDIDOS
   ============================================================ */
async function getPedidos(req, res) {
  try {
    const pedidos = await obtenerPedidos();

    res.json({
      ok: true,
      pedidos,
    });

  } catch (error) {
    console.error("❌ Error en getPedidos:", error);
    res.status(500).json({
      ok: false,
      message: "Error obteniendo pedidos"
    });
  }
}


/* ============================================================
    3. GET /api/admin/pedidos/:id  → DETALLES DE PEDIDO
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
    4. MÉTODO ANTIGUO (NO USAR PERO NO BORRAR)
       POST /api/admin/crear-pedido
   ============================================================ */
async function crearPedidoCompleto(req, res) {
  try {
    const usuario_id = req.usuario?.id || 1;
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ ok: false, msg: "No hay productos en el pedido" });
    }

    const total = items.reduce(
      (sum, item) => sum + item.cantidad * item.precio_unitario,
      0
    );

    const pedido_id = await crearPedido(usuario_id, total);

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
    5. GET /api/admin/ingresos → MÉTRICAS
   ============================================================ */
async function getIngresos(req, res) {
  try {
    const total  = await obtenerIngresosTotales();
    const dia    = await obtenerIngresosDia();
    const semana = await obtenerIngresosSemana();
    const mes    = await obtenerIngresosMes();

    let rows = [];
    try {
      rows = await obtenerHistorialDiarioMes();
    } catch (err) {
      console.error("❌ Error obteniendo historial diario:", err);
      rows = [];
    }

    const historial = rows.map(r => ({
      dia: Number(r.dia),
      total: Number(r.total)
    }));

    const promedio =
      historial.length > 0
        ? historial.reduce((acc, v) => acc + v.total, 0) / historial.length
        : 0;

    let tendencia = 0;
    if (historial.length >= 2) {
      const last = historial[historial.length - 1].total;
      const prev = historial[historial.length - 2].total;
      tendencia = last - prev;
    }

    res.json({
      ok: true,
      ingresos: {
        total,
        dia,
        semana,
        mes,
        historial,
        promedio,
        tendencia
      }
    });

  } catch (e) {
    console.error("❌ Error en getIngresos:", e);
    res.status(500).json({ ok: false, message: "Error obteniendo ingresos" });
  }
}


/* ============================================================
    EXPORTAR CONTROLADOR COMPLETO
   ============================================================ */
module.exports = {
  crearPedido,
  getPedidos,
  getPedidoById,
  crearPedidoCompleto,
  getIngresos
};
