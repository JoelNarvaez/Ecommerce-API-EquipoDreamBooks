const crypto = require("crypto");
const {
  obtenerUserPorCorreo,
  actualizarTokenExpiracion
} = require("../../models/usersModel");

const enviarCorreoRestablecerContrasenia = require("../../services/email/enviarRestablecerContrasenia.service")

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const usuario = await obtenerUserPorCorreo(email);

    // Respuesta neutra para evitar revelar si el correo existe
    if (!usuario) {
        return res.status(200).json({ message: "Si el correo existe, se ha enviado un enlace para restablecer la contraseña" });
    }

    // Hashear token (lo que se guarda en la DB)
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHasheado = await crypto.createHash("sha256").update(token).digest("hex");

    // expiración del token
    const fechaExpiracion = new Date(Date.now() + 1000 * 60 * 15); // 15 min

    // actualizar usuario con token y expiración
    await actualizarTokenExpiracion(usuario.id, tokenHasheado, fechaExpiracion);

    // enviar correo con el token (enlace de restablecimiento)
    const send = await enviarCorreoRestablecerContrasenia(usuario.nombre, email, token);

    if (send) {
      return res.status(200).json({ message: "Si el correo existe, se ha enviado un enlace para restablecer la contraseña" });

    } else {
      return res.json({ auth: true, token, message: "Error al enviar el correo de restablecimiento de contraseña" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
