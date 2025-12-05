const db = require("../config/db");

/* ============================================================
   CREAR CARRITO
============================================================ */
async function crearCarrito(usuarioId) {
    const [result] = await db.query(`
        INSERT INTO carritos (UsuarioId)
        VALUES (?)
    `, [usuarioId]);

    return result.affectedRows === 1;
}

/* ============================================================
   OBTENER CARRITO DEL USUARIO
============================================================ */
async function obtenerCarritoUsuario(usuarioId) {
    const [rows] = await db.query(`
        SELECT * FROM carritos 
        WHERE UsuarioId = ?
    `, [usuarioId]);

    return rows;
}

/* ============================================================
   OBTENER ITEMS DEL CARRITO + PRODUCTO + OFERTA + PRECIO FINAL
============================================================ */
async function obtenerItemsCarrito(CarritoId) {
    const [rows] = await db.query(`
        SELECT 
            ci.Id AS itemId,
            ci.Cantidad,
            ci.ProductoId,

            p.nombre,
            p.autor,
            p.imagen,
            p.stock,
            p.precio AS precioNormal,

            o.tipo AS tipoOferta,
            o.valor AS valorOferta,
            o.activa,

            CASE
                WHEN o.activa = 1 AND o.tipo = 'porcentaje'
                    THEN p.precio - (p.precio * o.valor / 100)
                WHEN o.activa = 1 AND o.tipo = 'monto'
                    THEN p.precio - o.valor
                ELSE p.precio
            END AS precioFinal

        FROM carrito_items ci
        JOIN productos p ON p.id = ci.ProductoId
        LEFT JOIN ofertas o ON o.product_id = p.id
        WHERE ci.CarritoId = ?
    `, [CarritoId]);

    return rows;
}


/* ============================================================
   OBTENER ITEM POR ID
============================================================ */
async function GetItemCarrito(itemId) {
    const [rows] = await db.query(`
        SELECT * FROM carrito_items WHERE Id = ?
    `, [itemId]);

    return rows[0];
}

/* ============================================================
   ELIMINAR ITEM
============================================================ */
async function eliminarItemCarrito(itemId) {
    const [result] = await db.query(`
        DELETE FROM carrito_items WHERE Id = ?
    `, [itemId]);

    return result.affectedRows === 1;
}

/* ============================================================
   ACTUALIZAR CANTIDAD DE ITEM
============================================================ */
async function actualizarItemCarrito(carritoId, productoId, nuevaCantidad) {
    const [result] = await db.query(`
        UPDATE carrito_items 
        SET Cantidad = ?
        WHERE CarritoId = ? AND ProductoId = ?
    `, [nuevaCantidad, carritoId, productoId]);

    return result.affectedRows === 1;
}

/* ============================================================
   AGREGAR ITEM AL CARRITO (EL PRECIO YA SE CALCULA EN EL CONTROLADOR)
============================================================ */
async function crearItemCarrito(carritoId, productoId, cantidad, precioUnitario) {
    const [result] = await db.query(`
        INSERT INTO carrito_items (CarritoId, ProductoId, Cantidad, PrecioUnitario)
        VALUES (?, ?, ?, ?)
    `, [carritoId, productoId, cantidad, precioUnitario]);

    return result.affectedRows === 1;
}

async function vaciarCarritoDB(usuario_id) {
    await db.query(
        "DELETE FROM carrito_items WHERE CarritoId = (SELECT Id FROM carritos WHERE UsuarioId = ?)",
        [usuario_id]
    );
}



/* ============================================================
   EXPORTAR
============================================================ */
module.exports = {
    crearCarrito,
    crearItemCarrito,
    obtenerCarritoUsuario,
    actualizarItemCarrito,
    obtenerItemsCarrito,
    GetItemCarrito,
    eliminarItemCarrito, 
    vaciarCarritoDB
};
