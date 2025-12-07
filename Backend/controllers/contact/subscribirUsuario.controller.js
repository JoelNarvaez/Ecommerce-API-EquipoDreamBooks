const { generarCodigoCupon, crearCupon } = require("../../models/modelCupon");
const { obtenerUserPorCorreo, subscribirUsuario } = require("../../models/usersModel");
const enviarSubscripcionUsuario = require("../../services/email/enviarSubscripcionUsuario.service");

exports.subscribirUsuario = async (req, res) => {
    try {
        const { email } = req.body;

        const usuario = await obtenerUserPorCorreo(email);

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        if (usuario.Subscrito) {
            return res.status(400).json({ message: "El usuario ya está suscrito." });
        }

        const actualizado = await subscribirUsuario(email);

        if (!actualizado) {
            return res.status(500).json({ message: "Error al suscribir el usuario." });
        }

        // CREAR CUPÓN NUEVO (parámetros: prefijo, descuento FIXED)
        const descuento = 20;
        const codigoCupon = generarCodigoCupon("DREAMBOOKS", descuento);

        // Crear cupón con el nuevo modelo
        const cuponCreado = await crearCupon(codigoCupon, descuento);

        if (!cuponCreado) {
            return res.status(500).json({ message: "Error al crear el cupón de descuento." });
        }

        // Enviar correo
        const send = await enviarSubscripcionUsuario(usuario.nombre, codigoCupon, email);

        if (!send) {
            return res.status(500).json({ message: "Error al enviar correo de subscripcion" });
        }

        return res.status(200).json({
            message: "Usuario suscrito exitosamente. Te hemos enviado un cupón de descuento."
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
