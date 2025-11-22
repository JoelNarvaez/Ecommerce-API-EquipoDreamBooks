const pool = require('../config/conexion');

// Obtener usuario por email (para login)
async function obtenerUserPorId(email) {
    const [rows] = await pool.query(
        'SELECT * FROM usuarios WHERE email = ?',
        [email]
    );
    return rows[0];
}

// Registrar nuevo usuario
async function crearUser(nombre, email, contraseña, rol, telefono, pais) {
    const [result] = await pool.query(
        `INSERT INTO usuarios 
        (nombre, email, contraseña, rol, intentos_fallidos, bloqueado_hasta, telefono, pais)
        VALUES (?, ?, ?, ?, 0, NULL, ?, ?)`,
        [nombre, email, contraseña, rol, telefono, pais]
    );
    return result.insertId;
}

// Actualizar intentos fallidos
async function actualizarIntentosFallidos(email, intentos) {
    await pool.query(
        `UPDATE usuarios 
        SET intentos_fallidos = ?
        WHERE email = ?`,
        [intentos, email]
    );
}

// Bloquear usuario temporalmente
async function bloquearkUser(email, dateTime) {
    await pool.query(
        `UPDATE usuarios 
        SET bloqueado_hasta = ?
        WHERE email = ?`,
        [dateTime, email]
    );
}

// Reiniciar intentos fallidos (cuando inicia sesión correctamente)
async function resetearIntentos(email) {
    await pool.query(
        `UPDATE usuarios
        SET intentos_fallidos = 0,
            bloqueado_hasta = NULL
        WHERE email = ?`,
        [email]
    );
}

module.exports = {
    obtenerUserPorId,
    crearUser,
    actualizarIntentosFallidos,
    bloquearkUser,
    resetearIntentos
};
