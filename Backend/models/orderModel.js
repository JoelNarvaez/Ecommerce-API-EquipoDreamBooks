const db = require("../config/db");

// Crear pedido
async function crearPedido(usuarioId, total) {
    const [result] = await db.query(
        `INSERT INTO pedidos (usuario_id, total) VALUES (?, ?)`,
        [usuarioId, total]
    );
    return result.insertId;
}

// Agregar cada producto al pedido
async function agregarDetalle(pedidoId, productoId, cantidad, precio) {
    await db.query(
        `INSERT INTO pedido_detalles (pedido_id, producto_id, cantidad, precio_unitario)
         VALUES (?, ?, ?, ?)`,
        [pedidoId, productoId, cantidad, precio]
    );
}

// Obtener todos los pedidos
async function obtenerPedidos() {
    const [rows] = await db.query(`
        SELECT p.id, u.nombre AS usuario, p.total, p.estado, p.creado_en
        FROM pedidos p
        LEFT JOIN usuarios u ON p.usuario_id = u.id
        ORDER BY p.id DESC
    `);
    return rows;
}

// Obtener detalles de un pedido
async function obtenerPedidoDetalles(id) {
    const [rows] = await db.query(`
        SELECT d.*, pr.nombre
        FROM pedido_detalles d
        LEFT JOIN productos pr ON pr.id = d.product_id
        WHERE d.pedido_id = ?
    `, [id]);
    return rows;
}

// ---------------------------
// INGRESOS → CONSULTAS SQL
// ---------------------------

// Total acumulado
async function obtenerIngresosTotales() {
    const [rows] = await db.query(`
        SELECT IFNULL(SUM(total), 0) AS total
        FROM pedidos
    `);
    return rows[0].total;
}

// Ingresos de hoy
async function obtenerIngresosDia() {
    const [rows] = await db.query(`
        SELECT IFNULL(SUM(total), 0) AS dia
        FROM pedidos
        WHERE DATE(creado_en) = CURDATE()
    `);
    return rows[0].dia;
}

// Ingresos de la semana
async function obtenerIngresosSemana() {
    const [rows] = await db.query(`
        SELECT IFNULL(SUM(total), 0) AS semana
        FROM pedidos
        WHERE YEARWEEK(creado_en, 1) = YEARWEEK(CURDATE(), 1)
    `);
    return rows[0].semana;
}

// Ingresos del mes
async function obtenerIngresosMes() {
    const [rows] = await db.query(`
        SELECT IFNULL(SUM(total), 0) AS mes
        FROM pedidos
        WHERE YEAR(creado_en) = YEAR(CURDATE())
        AND MONTH(creado_en) = MONTH(CURDATE())
    `);
    return rows[0].mes;
}

module.exports = {
    crearPedido,
    agregarDetalle,
    obtenerPedidos,
    obtenerPedidoDetalles,
    obtenerIngresosTotales,
    obtenerIngresosDia,
    obtenerIngresosSemana,
    obtenerIngresosMes
};
