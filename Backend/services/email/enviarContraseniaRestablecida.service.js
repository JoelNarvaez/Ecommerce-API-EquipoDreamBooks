// Modules
const jwt = require("jsonwebtoken");

const enviarCorreo = require('./enviarCorreo');

const enviarContraseniaRestablecida = async (nombre, email) => {

    const enlace = "http://127.0.0.1:5501/Frontend/pages/login.html";

    const archivosImg = [
        {
            filename: "logo-header-fondo.png",
            cid: "logoDreamBooks"
        }
    ]

    const contenidoHTML = `<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Quicksand', sans-serif; color: #000000;">

                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
                                <tr>
                                    <td align="center">

                                        <!-- Tarjeta -->
                                        <table width="600" border="0" cellspacing="0" cellpadding="0"
                                            style="background-color: #ebe6db; margin-top: 20px; border-radius: 10px; overflow: hidden;">

                                            <!-- HEADER -->
                                            <tr>
                                                <td align="center" style="padding: 40px 20px 20px 20px; background-color: #ffffff;">
                                                    <img src="cid:logoDreamBooks"  alt="Contraseña restablecida" width="90"
                                                        style="margin-bottom: 10px;">
                                                    <h1 style="color: #703030; font-size: 1.8rem; margin: 0; font-weight: bold;">
                                                        ¡Tu contraseña ha sido restablecida!
                                                    </h1>
                                                </td>
                                            </tr>

                                            <!-- SECCIÓN PRINCIPAL -->
                                            <tr>
                                                <td style="padding: 25px 30px;">
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0"
                                                        style="background-color: #ffffff; border-radius: 10px; padding: 25px;">
                                                        <tr>
                                                            <td style="font-size: 1rem; color: #000000; line-height: 1.6rem;">
                                                                <h2 style="color: #703030; font-size: 1.4rem; margin-top: 0;">
                                                                    Hola ${nombre},
                                                                </h2>

                                                                <p>
                                                                    Te confirmamos que tu contraseña en <strong>DreamBooks</strong> ha sido
                                                                    restablecida correctamente.
                                                                    A partir de este momento, ya puedes acceder con tus nuevas credenciales de
                                                                    forma segura.
                                                                </p>

                                                                <p style="margin-bottom: 10px;"><strong>Recomendaciones de seguridad:</strong>
                                                                </p>
                                                                <ul style="margin-top: 0; padding-left: 20px; color: #703030;">
                                                                    <li>No compartas tu contraseña con nadie</li>
                                                                    <li>Usa una contraseña única y segura</li>
                                                                    <li>Evita guardarla en dispositivos públicos</li>
                                                                    <li>Cámbiala periódicamente</li>
                                                                </ul>

                                                                <p>
                                                                    Para acceder a tu cuenta, haz clic en el siguiente botón:
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>

                                            <!-- BOTÓN -->
                                            <tr>
                                                <td align="center" style="padding: 25px;">
                                                    <a href="${enlace}" style="background-color: #c77965; color: #fff; padding: 15px 40px;
                                                            text-decoration: none; border-radius: 5px; font-size: 1.1rem;
                                                            display: inline-block; font-weight: bold;">
                                                        Iniciar sesión
                                                    </a>
                                                </td>
                                            </tr>

                                            <!-- MENSAJE SECUNDARIO -->
                                            <tr>
                                                <td
                                                    style="padding: 10px 40px 20px 40px; font-size: 0.9rem; color: #737373; line-height: 1.6rem;">
                                                    Si tú no realizaste esta solicitud de restablecimiento de contraseña, te recomendamos
                                                    contactar
                                                    inmediatamente a nuestro equipo de soporte para proteger tu cuenta.
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

                        </body>`

    const send = await enviarCorreo(contenidoHTML, "Tu contraseña ha sido restablecida - DreamBooks", email, archivosImg);

    if (send)
        return true;

    return false

}

module.exports = enviarContraseniaRestablecida;