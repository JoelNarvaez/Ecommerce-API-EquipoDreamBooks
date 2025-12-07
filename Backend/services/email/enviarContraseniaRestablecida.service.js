const enviarCorreo = require('./enviarCorreo');

const enviarContraseniaRestablecida = async (nombre, email) => {

    // URL pública del logo — AJÚSTALA si tu ruta cambia
    const logoURL = "https://ecommerce-api-equipodreambooks.netlify.app/imagenes/logo-header.png";

    const enlace = "https://ecommerce-api-equipodreambooks.netlify.app/pages/login.html";

    const contenidoHTML = `
    <body style="margin:0; padding:0; background-color:#f5f5f5; font-family:'Quicksand', sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0; background:#f5f5f5;">
            <tr>
                <td align="center">

                    <table width="600" cellpadding="0" cellspacing="0">

                        <!-- HEADER -->
                        <tr>
                            <td style="background:#ebe6db; padding:40px; border-radius:12px; text-align:center;">

                                <div style="width:120px; height:120px; background:#703030; border-radius:50%; margin:0 auto 20px;">
                                    <img src="${logoURL}" style="width:100px; height:35px; margin-top:40px;" alt="DreamBooks Logo">
                                </div>

                                <h1 style="margin:0; color:#703030; font-size:32px; font-weight:700;">
                                    ¡Tu contraseña ha sido restablecida!
                                </h1>
                                <p style="margin:10px 0 0; color:#703030; font-size:18px; font-weight:600;">DreamBooks</p>
                                <p style="color:#737373; font-size:14px; margin:0;">Sueña despierto</p>

                            </td>
                        </tr>

                        <tr><td style="height:20px"></td></tr>

                        <!-- MENSAJE PRINCIPAL -->
                        <tr>
                            <td style="background:#fff; padding:30px; border-radius:12px;">
                                <p style="font-size:16px; margin:0;">
                                    Hola <strong style="color:#703030;">${nombre}</strong>,
                                </p>

                                <p style="font-size:16px; margin-top:12px;">
                                    Te confirmamos que tu contraseña en <strong>DreamBooks</strong> ha sido actualizada correctamente.
                                    Ya puedes iniciar sesión usando tus nuevas credenciales.
                                </p>
                            </td>
                        </tr>

                        <tr><td style="height:20px"></td></tr>

                        <!-- RECOMENDACIONES -->
                        <tr>
                            <td style="background:#fff; padding:30px; border-radius:12px;">
                                <h2 style="margin:0 0 15px; color:#703030; font-size:18px; font-weight:600;">
                                    Recomendaciones de seguridad
                                </h2>

                                <ul style="padding-left:20px; font-size:15px; color:#000; line-height:1.6;">
                                    <li>No compartas tu contraseña con nadie</li>
                                    <li>Usa una contraseña única y difícil de adivinar</li>
                                    <li>Evita repetir contraseñas en otros sitios</li>
                                    <li>Cámbiala periódicamente</li>
                                </ul>

                                <p style="margin-top:20px; font-size:16px;">
                                    Puedes acceder a tu cuenta aquí:
                                </p>

                                <div style="text-align:center; margin-top:22px;">
                                    <a href="${enlace}"
                                        style="background:#c77965; color:#fff; padding:14px 40px; border-radius:6px;
                                        text-decoration:none; font-size:16px; font-weight:700; display:inline-block;">
                                        Iniciar sesión
                                    </a>
                                </div>

                            </td>
                        </tr>

                        <tr><td style="height:20px"></td></tr>

                        <!-- ALERTA -->
                        <tr>
                            <td style="background:#fff; padding:25px; border-left:4px solid #c77965; border-radius:12px;">
                                <p style="color:#737373; font-size:14px;">
                                    Si tú no realizaste esta solicitud, contacta inmediatamente a nuestro equipo de soporte.
                                </p>
                            </td>
                        </tr>

                        <tr><td style="height:20px"></td></tr>

                        <!-- FOOTER -->
                        <tr>
                            <td style="background:#a9806a; padding:30px; text-align:center; border-radius:12px;">
                                <p style="color:#fff; margin:0; font-size:14px;">© 2025 DreamBooks. Todos los derechos reservados.</p>
                                <p style="color:#fff; margin:10px 0 0; font-size:12px; opacity:0.9;">
                                    Recibiste este correo porque solicitaste un restablecimiento de contraseña.
                                </p>
                            </td>
                        </tr>

                    </table>

                </td>
            </tr>
        </table>

    </body>`;

    const send = await enviarCorreo(
        contenidoHTML,
        "Tu contraseña ha sido restablecida - DreamBooks",
        email
    );

    return !!send;
};

module.exports = enviarContraseniaRestablecida;
