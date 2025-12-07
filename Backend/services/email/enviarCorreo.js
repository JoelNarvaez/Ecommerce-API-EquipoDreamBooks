// services/email/enviarCorreo.js

const brevo = require("@getbrevo/brevo");

// Crear instancia del API de correos transaccionales
const apiInstance = new brevo.TransactionalEmailsApi();

// Conectar a la API Key almacenada en Railway
apiInstance.setApiKey(
    brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
);

/**
 * Enviar correo genérico usando Brevo
 * @param {string} contenidoHTML - cuerpo HTML del correo
 * @param {string} asunto - asunto del correo
 * @param {string} correo - correo destino
 * @returns {boolean} true si se envió, false si falló
 */
const enviarCorreo = async (contenidoHTML, asunto, correo) => {
    try {
        console.log("📧 Preparando envío de correo con Brevo a:", correo);

        // Crear estructura del correo
        const emailData = {
            sender: {
                name: "DreamBooks",
                email: process.env.BUSINESS_EMAIL   // correo remitente
            },
            to: [
                { email: correo }  // destinatario
            ],
            subject: asunto,
            htmlContent: contenidoHTML  // contenido HTML
        };

        // Enviar correo vía API Brevo
        const response = await apiInstance.sendTransacEmail(emailData);

        console.log("📩 Correo enviado correctamente con Brevo →", correo);
        return true;

    } catch (error) {
        console.error("❌ ERROR enviando correo con Brevo:");
        console.error(error.response?.data || error);
        return false;
    }
};

module.exports = enviarCorreo;
