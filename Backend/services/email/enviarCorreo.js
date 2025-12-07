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
 * @param {Array} adjuntos - archivos PDF u otros
 * @returns {boolean} true si se envió, false si falló
 */
const enviarCorreo = async (contenidoHTML, asunto, correo, adjuntos = []) => {
    try {
        console.log("📧 Preparando envío de correo con Brevo a:", correo);

        // ✨ Construcción del correo incluyendo adjuntos ✨
        const sendSmtpEmail = new brevo.SendSmtpEmail();

        sendSmtpEmail.to = [{ email: correo }];
        sendSmtpEmail.subject = asunto;
        sendSmtpEmail.htmlContent = contenidoHTML;
        sendSmtpEmail.sender = { name: "DreamBooks", email: process.env.BUSINESS_EMAIL };

        // 👇 SOLO si hay adjuntos, los agregamos
        if (adjuntos.length > 0) {
            sendSmtpEmail.attachment = adjuntos.map(file => ({
                name: file.filename,
                content: require("fs").readFileSync(file.path).toString("base64")
            }));
        }

        // Enviar
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("📧 Correo enviado correctamente ✔️");

        return true;

    } catch (error) {
        console.error("❌ Error enviando correo:", error.message);
        return false;
    }
};

module.exports = enviarCorreo;
