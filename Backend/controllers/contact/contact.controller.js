const { crearContacto } = require("../../models/modelContacto");
const enviarCorreoContactoMensaje = require("../../services/email/enviarContactoMensaje.service");

exports.contactMessage = async (req, res) => {
    try {
        const { nombre, mensaje, email } = req.body;

        const creado = await crearContacto(nombre, mensaje, email);

        if (!creado) {
            return res.status(500).json({ message: "Error al guardar el mensaje de contacto" });
        }

        // Enviar correo de confirmación al cliente
        const send = await enviarCorreoContactoMensaje(nombre, email);

        if (!send) {
            return res.status(500).json({ message: "Error al enviar el correo de confirmación" });
        }

        return res.status(200).json({
            message: "Mensaje de contacto recibido. Te contactaremos pronto."
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
