const crypto = require("crypto");
const {
  obtenerUserPorTokenRestablecimiento,
} = require("../../models/usersModel");

exports.verifyResetToken = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await obtenerUserPorTokenRestablecimiento(hashedToken);

    if (!user || user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    return res.status(201).json({
      success: true,
      message: "token de restablecimiento válido",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
