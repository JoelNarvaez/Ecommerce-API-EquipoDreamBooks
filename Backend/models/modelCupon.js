const db = require("../config/db");


function generarCodigoCupon( prefijo = '', descuento = 0) {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // sin 0 ni 1 para evitar confusiones
    let codigo = prefijo ? prefijo.toUpperCase() + '-' : '';
    for (let i = 0; i < 8; i++) {
        codigo += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return codigo + '-' + descuento;
}


// Crear oferta
async function crearCupon(Codigo, IdUsuario) {
    const [result] = await db.query(`
        INSERT INTO Cupones (Codigo, IdUsuario, Activo, Utilizado)
        VALUES (?, ?, 1, 0)
    `, [Codigo, IdUsuario]);

    return result.affectedRows === 1;
}

module.exports = {
    crearCupon,
    generarCodigoCupon
};
