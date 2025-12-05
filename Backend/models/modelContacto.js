const db = require("../config/db");

// Crear oferta
async function crearContacto(nombre, mensaje, correo) {
    const [result] = await db.query(`
        INSERT INTO Contactos (Nombre, Mensaje, CorreoElectronico, Atendido)
        VALUES (?, ?, ?, 0)
    `, [nombre, mensaje, correo]);

    return result.affectedRows === 1;
}

module.exports = {
    crearContacto,
};
