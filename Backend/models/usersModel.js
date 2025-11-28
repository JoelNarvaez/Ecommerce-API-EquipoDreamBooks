// Importar pool desde config/db (ruta corregida)
const pool = require('../config/db');

// Obtener usuario por id (para login)
async function obtenerUserPorId(idUser) {
    const [rows] = await pool.query(
        'SELECT * FROM usuarios WHERE id = ?',
        [idUser]
    );
    return rows[0];
}

// Obtener usuario por email (para login)
async function obtenerUserPorCorreo(email) {
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
async function bloquearUser(email, dateTime) {
    await pool.query(
        `UPDATE usuarios 
        SET bloqueado_hasta = ?
        WHERE email = ?`,
        [dateTime, email]
    );
}

// Reiniciar intentos fallidos
async function resetearIntentos(email) {
    await pool.query(
        `UPDATE usuarios
        SET intentos_fallidos = 0,
            bloqueado_hasta = NULL
        WHERE email = ?`,
        [email]
    );
}

// Actualizar usuario como verificado
async function actualizarUsuarioVerificado(id) {
    await pool.query(
        `UPDATE usuarios
        SET verificado = true
        WHERE id = ?`,
        [id]
    );
}

// setear token de restablecimiento y su expiración
async function actualizarTokenExpiracion(idUser, tokenHasheado, fechaExpiracion) {
    await pool.query(
        `UPDATE usuarios
        SET resetPasswordToken = ?,
            resetPasswordExpires = ?
        WHERE id = ?`,
        [tokenHasheado, fechaExpiracion, idUser]
    );
}

// Actualizar contraseña del usuario
async function actualizarContrasenia(idUser, nuevaContraseniaHasheada) {
    await pool.query(
        `UPDATE usuarios SET contraseña = ? WHERE id = ?`,
        [nuevaContraseniaHasheada, idUser]
    );
}

// Obtener usuario por token de restablecimiento
async function obtenerUserPorTokenRestablecimiento(hashedToken) {
    const [rows] = await pool.query(
        `SELECT * FROM usuarios WHERE resetPasswordToken = ?`,
        [hashedToken]
    );

    return rows[0];
}

module.exports = {
    obtenerUserPorId,
    obtenerUserPorCorreo,
    crearUser,
    actualizarIntentosFallidos,
    bloquearUser,
    resetearIntentos,
    actualizarUsuarioVerificado,
    actualizarTokenExpiracion,
    obtenerUserPorTokenRestablecimiento,
    actualizarContrasenia
};
