const db = require("../config/db");

// Crear carrito
async function crearCarrito(usuarioId) {
    const [result] = await db.query(`
        INSERT INTO Carritos (usuarioId)
        VALUES (?)
    `, [usuarioId]);

    return result.affectedRows === 1;
}

async function obtenerCarritoUsuario(UsuarioId) {
    const [rows] = await db.query(`
        SELECT * FROM carritos WHERE UsuarioId =  ?`, [UsuarioId]);
    return rows;
}

async function obtenerItemsCarrito(CarritoId) {
    const [rows] = await db.query(`
        SELECT * FROM carrito_items WHERE CarritoId =  ?`, [CarritoId]);

    return rows;
}

async function GetItemCarrito(itemId) {
    const [rows] = await db.query(`
        SELECT * FROM carrito_items WHERE Id =  ?`, [itemId]);

    return rows[0];
}

async function eliminarItemCarrito(itemId) {
    const [rows] = await db.query(`
        DELETE FROM carrito_items WHERE Id =  ?`, [itemId]);

    return rows;
}

async function actualizarItemCarrito(CarritoId, ProductoId, NuevaCantidad) {
    console.log(CarritoId, ProductoId, NuevaCantidad);
    
    const [result] = await db.query(`
        UPDATE carrito_items SET Cantidad = ? WHERE CarritoId = ? AND ProductoId = ?`, [NuevaCantidad, CarritoId, ProductoId]);
    return result.affectedRows === 1;
}

async function crearItemCarrito(CarritoId, ProductoId, Cantidad, PrecioUnitario) {
    const [result] = await db.query(`
        INSERT INTO carrito_items(CarritoId, ProductoId, Cantidad, PrecioUnitario) VALUES (?,?,?,?)`,[CarritoId, ProductoId, Cantidad, PrecioUnitario]);

    return result.affectedRows === 1;
}

module.exports = {
    crearCarrito,
    crearItemCarrito,
    obtenerCarritoUsuario,
    actualizarItemCarrito,
    obtenerItemsCarrito,
    GetItemCarrito,
    eliminarItemCarrito
};
