const db = require("../config/db");

/* ==========================================
   AGREGAR PRODUCTO A WISHLIST
========================================== */
async function agregarWishlistDB(usuarioId, productoId) {
    // verificar si ya existe
    const [existe] = await db.query(
        `SELECT * FROM wishlist WHERE UsuarioId = ? AND ProductoId = ?`,
        [usuarioId, productoId]
    );

    if (existe.length > 0) return false;

    await db.query(
        `INSERT INTO wishlist (UsuarioId, ProductoId) VALUES (?, ?)`,
        [usuarioId, productoId]
    );

    return true;
}

/* ==========================================
   OBTENER WISHLIST CON JOIN DE PRODUCTOS
========================================== */
async function obtenerWishlistDB(usuarioId) {
    const [rows] = await db.query(`
        SELECT 
            w.ProductoId,
            p.nombre,
            p.autor,
            p.stock,
            p.precio,
            p.imagen
        FROM wishlist w
        INNER JOIN productos p ON p.id = w.ProductoId
        WHERE w.UsuarioId = ?
        ORDER BY w.CreadoEn DESC
    `, [usuarioId]);

    return rows;
}

/* ==========================================
   ELIMINAR DE WISHLIST
========================================== */
async function eliminarWishlistDB(usuarioId, productoId) {
    await db.query(`
        DELETE FROM wishlist
        WHERE UsuarioId = ? AND ProductoId = ?
    `, [usuarioId, productoId]);
}

module.exports = {
    agregarWishlistDB,
    obtenerWishlistDB,
    eliminarWishlistDB
};
