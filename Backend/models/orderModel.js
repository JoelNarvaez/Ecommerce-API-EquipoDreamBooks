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

// Obtener todos los pedidos (admin)
async function obtenerPedidos() {
    const [rows] = await db.query(
        `SELECT p.id, u.nombre AS usuario, p.total, p.estado, p.creado_en
         FROM pedidos p
         LEFT JOIN usuarios u ON p.usuario_id = u.id
         ORDER BY p.id DESC`
    );
    return rows;
}

// Obtener detalles de un pedido
async function obtenerPedidoDetalles(id) {
    const [rows] = await db.query(
        `SELECT d.*, pr.nombre
         FROM pedido_detalles d
         LEFT JOIN productos pr ON pr.id = d.product_id
         WHERE d.pedido_id = ?`,
        [id]
    );
    return rows;
}

async function obtenerIngresosTotales() {
    const [rows] = await db.query(`
        SELECT 
            IFNULL(SUM(total), 0) AS ingresos
        FROM pedidos
    `);

    return rows[0].ingresos;
}

module.exports = {
    crearPedido,
    agregarDetalle,
    obtenerPedidos,
    obtenerPedidoDetalles,
    obtenerIngresosTotales
};
