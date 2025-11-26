const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { obtenerUserPorTokenRestablecimiento, actualizarContrasenia, actualizarTokenExpiracion } = require("../../models/usersModel");
const enviarContraseniaRestablecida = require("../../services/email/enviarContraseniaRestablecida.service");

exports.resetPassword = async (req, res) => {
    try {

        const { password } = req.body

        const hashedToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex")

        const user = await obtenerUserPorTokenRestablecimiento(hashedToken);

        if (!user || user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ message: "Token inválido o expirado" });
        }

        const hash = await bcrypt.hash(password, 10);

        await actualizarContrasenia(user.id, hash);
        await actualizarTokenExpiracion(user.id, null, null)
        await enviarContraseniaRestablecida(user.nombre,user.email);

        return res.status(201).json({
            success: true,
            message: "token de restablecimiento válido",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
