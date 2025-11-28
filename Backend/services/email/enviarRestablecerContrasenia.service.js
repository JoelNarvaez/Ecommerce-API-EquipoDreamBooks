// Modules
const jwt = require("jsonwebtoken");

const enviarCorreo = require('./enviarCorreo');

const enviarCorreoRestablecerContrasenia = async (nombre, email, token) => {

    const enlace = "http://127.0.0.1:5501/Frontend/pages/restablecerContrasenia.html?token=" + token;

    const archivosImg = [
        {
            filename: "logo-header-fondo.png",
            cid: "logoDreamBooks"
        }
    ]

    const contenidoHTML = `<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Quicksand', sans-serif; color: #000000;">
                            <!-- Contenedor principal -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
                                <tr>
                                    <td align="center">

                                        <!-- Tarjeta -->
                                        <table width="600" border="0" cellspacing="0" cellpadding="0"
                                            style="background-color: #ebe6db; margin-top: 20px; border-radius: 10px; overflow: hidden;">

                                            <!-- HEADER -->
                                            <tr>
                                                <td align="center"
                                                    style="padding: 0px; background-color: #ffffff; color: #703030; font-size: 2rem; font-weight: bold;">
                                                    <img src="cid:logoDreamBooks"  alt="Books" width="120"
                                                        style="margin-top: 20px;">
                                                </td>
                                            </tr>

                                            <tr>
                                                <td align="center"
                                                    style="padding: 30px; background-color: #ffffff; color: #703030; font-size: 2rem; font-weight: bold;">
                                                    Restablece tu contraseña
                                                </td>
                                            </tr>

                                            <!-- TEXTO PRINCIPAL -->
                                            <tr>
                                                <td style="padding: 30px; font-size: 1rem; color: #000000; line-height: 1.6rem;">
                                                    <h2 style="color: #703030; font-size: 1.6rem; margin-top: 0;">
                                                        ¡Hola ${nombre}!
                                                    </h2>

                                                    <p>
                                                        Recibimos una solicitud para restablecer la contraseña de tu cuenta en
                                                        <strong>DreamBooks</strong>.
                                                    </p>

                                                    <p>
                                                        Si realizaste esta solicitud, haz clic en el siguiente botón para crear una nueva
                                                        contraseña. Este enlace es válido por tiempo limitado.
                                                    </p>
                                                </td>
                                            </tr>

                                            <!-- BOTÓN -->
                                            <tr>
                                                <td align="center" style="padding: 20px;">
                                                    <a href="${enlace}" style="background-color: #c77965; color: #fff; padding: 15px 30px; 
                                                            text-decoration: none; border-radius: 5px; font-size: 1rem; 
                                                            display: inline-block;">
                                                        Restablecer contraseña
                                                    </a>
                                                </td>
                                            </tr>

                                            <!-- MENSAJE SECUNDARIO -->
                                            <tr>
                                                <td style="padding: 20px 30px; font-size: 0.9rem; color: #737373; line-height: 1.6rem;">
                                                    Si no solicitaste este cambio, puedes ignorar este mensaje con seguridad. Tu contraseña no
                                                    será modificada.
                                                </td>
                                            </tr>

                                            <!-- FOOTER -->
                                            <tr>
                                                <td align="center"
                                                    style="background-color: #a9806a; padding: 20px; color: #ffffff; font-size: 0.9rem;">
                                                    © 2025 DreamBooks. Todos los derechos reservados.
                                                </td>
                                            </tr>

                                        </table>

                                    </td>
                                </tr>
                            </table>

                        </body>`;

    const send = await enviarCorreo(contenidoHTML, "Restablecer contraseña dreamBooks", email, archivosImg);

    if (send)
        return true;

    return false

}

module.exports = enviarCorreoRestablecerContrasenia;