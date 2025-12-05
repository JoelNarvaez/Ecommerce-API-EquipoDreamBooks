// models/orderModel.js
const db = require("../config/db");

// Crear pedido
async function crearPedido(usuarioId, total) {
  const [result] = await db.query(
    `INSERT INTO pedidos (usuario_id, total) VALUES (?, ?)`,
    [usuarioId, total]
  );
  return result.insertId;
}

// Agregar detalle
async function agregarDetalle(pedidoId, productoId, cantidad, precio) {
  await db.query(
    `INSERT INTO pedido_detalles (pedido_id, producto_id, cantidad, precio_unitario)
     VALUES (?, ?, ?, ?)`,
    [pedidoId, productoId, cantidad, precio]
  );
}

/// Obtener pedidos con productos incluidos
async function obtenerPedidos() {
  const [rows] = await db.query(`
    SELECT 
      p.id AS pedido_id,
      u.nombre AS usuario,
      p.total,
      p.estado,
      p.creado_en,
      d.producto_id,
      d.cantidad,
      d.precio_unitario,
      pr.nombre AS producto_nombre
    FROM pedidos p
    LEFT JOIN usuarios u       ON u.id = p.usuario_id
    LEFT JOIN pedido_detalles d ON d.pedido_id = p.id
    LEFT JOIN productos pr      ON pr.id = d.producto_id
    ORDER BY p.id DESC
  `);

  // Agrupar productos dentro del pedido
  const pedidosMap = {};

  rows.forEach(r => {

    if (!pedidosMap[r.pedido_id]) {
      pedidosMap[r.pedido_id] = {
        id: r.pedido_id,
        usuario: r.usuario,
        total: r.total,
        estado: r.estado,
        creado_en: r.creado_en,
        productos: []
      };
    }

    // Si el pedido tiene productos (puede haber pedidos sin detalles)
    if (r.producto_id) {
      pedidosMap[r.pedido_id].productos.push({
        producto_id: r.producto_id,
        nombre: r.producto_nombre,
        cantidad: r.cantidad,
        precio_unitario: r.precio_unitario
      });
    }
  });

  return Object.values(pedidosMap);
}


// Obtener detalles
async function obtenerPedidoDetalles(id) {
  const [rows] = await db.query(`
    SELECT d.*, pr.nombre
    FROM pedido_detalles d
    LEFT JOIN productos pr ON pr.id = d.producto_id
    WHERE d.pedido_id = ?
  `, [id]);
  return rows;
}

// ==================== INGRESOS ====================

// Total acumulado
async function obtenerIngresosTotales() {
  const [rows] = await db.query(`
    SELECT IFNULL(SUM(total), 0) AS total
    FROM pedidos
  `);
  return Number(rows[0].total) || 0;
}

// Ingresos de hoy
async function obtenerIngresosDia() {
  const [rows] = await db.query(`
    SELECT IFNULL(SUM(total), 0) AS dia
    FROM pedidos
    WHERE DATE(creado_en) = CURDATE()
  `);
  return Number(rows[0].dia) || 0;
}

// Ingresos de la semana
async function obtenerIngresosSemana() {
  const [rows] = await db.query(`
    SELECT IFNULL(SUM(total), 0) AS semana
    FROM pedidos
    WHERE YEARWEEK(creado_en, 1) = YEARWEEK(CURDATE(), 1)
  `);
  return Number(rows[0].semana) || 0;
}

// Ingresos del mes
async function obtenerIngresosMes() {
  const [rows] = await db.query(`
    SELECT IFNULL(SUM(total), 0) AS mes
    FROM pedidos
    WHERE YEAR(creado_en) = YEAR(CURDATE())
      AND MONTH(creado_en) = MONTH(CURDATE())
  `);
  return Number(rows[0].mes) || 0;
}

// Historial diario del mes actual
async function obtenerHistorialDiarioMes() {
  const [rows] = await db.query(`
    SELECT 
      DAY(creado_en) AS dia,
      SUM(total)     AS total
    FROM pedidos
    WHERE creado_en >= DATE_FORMAT(NOW(), '%Y-%m-01')
      AND creado_en <  DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 1 MONTH), '%Y-%m-01')
    GROUP BY dia
    ORDER BY dia ASC
  `);

  return rows; // [{ dia: 1, total: '300.00' }, ...]
}

module.exports = {
  crearPedido,
  agregarDetalle,
  obtenerPedidos,
  obtenerPedidoDetalles,
  obtenerIngresosTotales,
  obtenerIngresosDia,
  obtenerIngresosSemana,
  obtenerIngresosMes,
  obtenerHistorialDiarioMes
};
