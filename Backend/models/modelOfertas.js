const db = require("../config/db");

// Crear oferta
async function crearOferta(product_id, tipo, valor) {
    await db.query(`
        INSERT INTO ofertas (product_id, tipo, valor, activa)
        VALUES (?, ?, ?, 1)
    `, [product_id, tipo, valor]);
}

// Obtener oferta por ID del producto
async function getOfertaByProduct(product_id) {
    const [rows] = await db.query(`
        SELECT * FROM ofertas WHERE product_id = ?
        LIMIT 1
    `, [product_id]);
    return rows[0] || null;
}

// Actualizar oferta
async function actualizarOferta(id, tipo, valor, activa) {
    await db.query(`
        UPDATE ofertas 
        SET tipo=?, valor=?, activa=?
        WHERE id=?
    `, [tipo, valor, activa, id]);
}

// Eliminar oferta
async function eliminarOferta(id) {
    await db.query("DELETE FROM ofertas WHERE id=?", [id]);
}

module.exports = {
    crearOferta,
    getOfertaByProduct,
    actualizarOferta,
    eliminarOferta
};
