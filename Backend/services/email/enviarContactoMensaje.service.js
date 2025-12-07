// services/email/enviarContactoMensaje.service.js
const enviarCorreo = require("./enviarCorreo");

const enviarCorreoContactoMensaje = async (nombre, email) => {
    // URL pública del logo en tu front (ajusta si cambia la ruta)
    const logoURL = "https://ecommerce-api-equipodreambooks.netlify.app/imagenes/logo-header.png";

    const contenidoHTML = `
    <body style="margin:0; padding:0; background-color:#f5f5f5; font-family:'Quicksand', sans-serif;">

        <!-- Wrapper principal -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5; padding:40px 0;">
            <tr>
                <td align="center">

                    <!-- Contenedor -->
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">

                        <!-- Header -->
                        <tr>
                            <td style="background-color:#ebe6db; padding:40px; border-radius:12px; text-align:center;">

                                <div
                                    style="width:120px; height:120px; background-color:#703030; border-radius:50%; margin-bottom:20px; margin:0 auto 20px auto;">
                                    <img src="${logoURL}" style="width:100px; height:35px; margin-top:40px;" alt="DreamBooks Logo">
                                </div>

                                <h1 style="margin:0; color:#703030; font-size:32px; font-weight:700;">
                                    ¡Gracias por contactarnos!
                                </h1>
                                <p style="margin:10px 0 0; color:#703030; font-size:18px; font-weight:600;">
                                    DreamBooks
                                </p>
                                <p style="color:#737373; font-size:14px; line-height:0;">
                                    Sueña despierto
                                </p>

                            </td>
                        </tr>

                        <tr>
                            <td style="height:20px; line-height:20px; font-size:0;">&nbsp;</td>
                        </tr>

                        <!-- Greeting -->
                        <tr>
                            <td style="background-color:#ffffff; padding:30px; border-radius:12px;">
                                <p style="margin:0; color:#000; font-size:16px; line-height:1.6;">
                                    Hola <strong style="color:#703030;">${nombre}</strong>,
                                </p>
                                <p style="margin:12px 0 0; color:#000; font-size:16px; line-height:1.6;">
                                    Hemos recibido tu mensaje correctamente. Nuestro equipo revisará tu solicitud y en breve
                                    te contactaremos a tu correo:
                                    <strong style="color:#703030;">${email}</strong>.
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td style="height:20px; line-height:20px; font-size:0;">&nbsp;</td>
                        </tr>

                        <!-- Support Message -->
                        <tr>
                            <td
                                style="background-color:#ffffff; padding:25px; border-radius:12px; border-left:4px solid #c77965;">
                                <p style="margin:0; color:#737373; font-size:14px; line-height:1.6;">
                                    Nuestro tiempo de respuesta habitual es de 24 a 48 horas.
                                    Si tu consulta es urgente, no dudes en escribirnos nuevamente.
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td style="height:20px; line-height:20px; font-size:0;">&nbsp;</td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color:#a9806a; padding:30px; border-radius:12px; text-align:center;">
                                <p style="margin:0; color:#ffffff; font-size:14px; line-height:1.6;">
                                    © 2025 DreamBooks. Todos los derechos reservados.
                                </p>
                                <p style="margin:10px 0 0; color:#ffffff; font-size:12px; opacity:0.9;">
                                    Recibiste este correo porque enviaste un mensaje a nuestro centro de contacto.
                                </p>
                            </td>
                        </tr>

                    </table>

                </td>
            </tr>
        </table>

    </body>`;

    // OJO: ya sin 'archivosImg'
    const send = await enviarCorreo(
        contenidoHTML,
        "En breve será atendido - DreamBooks",
        email
    );

    return !!send;
};

module.exports = enviarCorreoContactoMensaje;
