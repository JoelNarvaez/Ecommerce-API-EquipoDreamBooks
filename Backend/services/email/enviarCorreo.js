// Modules
const nodemailer = require('nodemailer');
const path = require("path");

const enviarCorreo = async (contenidoHTML, asunto, correo, archivos=[], archivoPdf = []) => {
    
    const archivosAdjuntos = archivos.map(item => ({
        filename: item.filename,
        path: path.join(__dirname, `../../assets/public/${item.filename}`),
        cid: item.cid
    }));

    archivosAdjuntos.push(...archivoPdf);

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.BUSINESS_EMAIL,
            pass: process.env.PWD_EMAIL
        },
        tls: {
            rejectUnauthorized: false
        }
    });


    const info = await transporter.sendMail({
        from: "DreamBooks <dreambooks5ac@gmail.com>",
        to: `${correo}`,
        subject: asunto,
        html: contenidoHTML,
        attachments: archivosAdjuntos.length > 0 ? archivosAdjuntos : undefined
    });

    return info;
}

module.exports = enviarCorreo;