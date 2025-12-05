const db = require("../config/db");

// GENERADOR DE CÓDIGOS
function generarCodigoCupon(prefijo = '', descuento = 0) {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let codigo = prefijo ? prefijo.toUpperCase() + '-' : '';

    for (let i = 0; i < 8; i++) {
        codigo += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // ejemplo: DREAMBOOKS-ABC12345-20
    return codigo + '-' + descuento;
}

// CREAR CUPÓN (con la nueva estructura)
async function crearCupon(codigoGenerado, montoDescuento) {
    const [result] = await db.query(`
        INSERT INTO cupones (Codigo, MontoDescuento, Activo)
        VALUES (?, ?, 1)
    `, [codigoGenerado, montoDescuento]);

    return result.affectedRows === 1;
}

// BUSCAR CUPÓN POR CÓDIGO
async function obtenerCuponPorCodigo(codigo) {
    const [rows] = await db.query(`
        SELECT * FROM cupones
        WHERE Codigo = ?
        AND Activo = 1
        AND (FechaExpiracion IS NULL OR FechaExpiracion >= CURDATE())
        LIMIT 1
    `, [codigo]);

    return rows[0];
}

module.exports = {
    generarCodigoCupon,
    crearCupon,
    obtenerCuponPorCodigo
};
