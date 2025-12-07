// Modules
const nodemailer = require('nodemailer');
const path = require("path");

const enviarCorreo = async (contenidoHTML, asunto, correo, archivos = [], archivoPdf = []) => {
    try {
        console.log("📧 Preparando envío de correo a:", correo);

        const archivosAdjuntos = archivos.map(item => ({
            filename: item.filename,
            path: path.join(__dirname, `../../assets/public/${item.filename}`),
            cid: item.cid
        }));

        archivosAdjuntos.push(...archivoPdf);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.BUSINESS_EMAIL,
                pass: process.env.PWD_EMAIL
            }
        });

        console.log("🔌 Conectando a Gmail SMTP...");

        const info = await transporter.sendMail({
            from: `DreamBooks <${process.env.BUSINESS_EMAIL}>`,
            to: correo,
            subject: asunto,
            html: contenidoHTML,
            attachments: archivosAdjuntos.length > 0 ? archivosAdjuntos : undefined
        });

        console.log("Correo enviado exitosamente:", info.messageId);
        return true;

    } catch (error) {
        console.error("ERROR enviando correo:", error);
        return false;
    }
};

module.exports = enviarCorreo;
