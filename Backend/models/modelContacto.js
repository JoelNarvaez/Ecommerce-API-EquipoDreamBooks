const db = require("../config/db");

async function crearContacto(nombre, mensaje, correo) {
    const [result] = await db.query(
        `INSERT INTO contactos (Nombre, Mensaje, CorreoElectronico, Atendido)
         VALUES (?, ?, ?, 0)`,
        [nombre, mensaje, correo]
    );

    return result.affectedRows === 1;
}

module.exports = {
    crearContacto,
};
