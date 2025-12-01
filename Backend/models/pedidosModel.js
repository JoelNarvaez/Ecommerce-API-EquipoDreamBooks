const db = require("../config/db");

async function crearPedido(usuario_id, total) {
    const [result] = await db.query(
        "INSERT INTO pedidos (usuario_id, total) VALUES (?, ?)",
        [usuario_id, total]
    );
    return result.insertId;
}

async function agregarDetalle(pedido_id, producto_id, cantidad, precio_unitario) {
    await db.query(
        `INSERT INTO pedido_detalles (pedido_id, producto_id, cantidad, precio_unitario)
         VALUES (?, ?, ?, ?)`,
        [pedido_id, producto_id, cantidad, precio_unitario]
    );
}

module.exports = { crearPedido, agregarDetalle };
