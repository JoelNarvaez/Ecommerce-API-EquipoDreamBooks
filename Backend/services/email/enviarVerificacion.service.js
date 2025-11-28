// Modules
const jwt = require("jsonwebtoken");

const enviarCorreo = require('./enviarCorreo');


const enviarCorreoVerificacion = async ( idUser, nombre, email) => {

    const token = jwt.sign({ idUser }, process.env.JWT_SECRET, { expiresIn: "1d" })

    const enlace = `http://localhost:3000/api/auth/verify/${token}`

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
                                                    <img src="cid:logoDreamBooks" alt="Books" width="120" style="margin-top: 20px;">
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center"
                                                    style="padding: 30px; background-color: #ffffff; color: #703030; font-size: 2rem; font-weight: bold;">
                                                    Verifica tu correo
                                                </td>
                                            </tr>
                                        

                                            <!-- TEXTO PRINCIPAL -->
                                            <tr>
                                                <td style="padding: 30px; font-size: 1rem; color: #000000; line-height: 1.6rem;">
                                                    <h2 style="color: #703030; font-size: 1.6rem; margin-top: 0;">¡Hola ${nombre}!</h2>

                                                    <p>
                                                        Gracias por registrarte en <strong>DreamBooks</strong>, tu tienda favorita de libros en
                                                        línea.
                                                        Antes de comenzar a explorar nuestras colecciones, necesitamos confirmar que este correo
                                                        electrónico es tuyo.
                                                    </p>

                                                    <p>
                                                        Para completar tu registro, solo haz clic en el siguiente botón:
                                                    </p>
                                                </td>
                                            </tr>

                                            <!-- BOTÓN -->
                                            <tr>
                                                <td align="center" style="padding: 20px;">
                                                    <a href="${enlace}" style="background-color: #c77965; color: #fff; padding: 15px 30px; 
                                                            text-decoration: none; border-radius: 5px; font-size: 1rem; 
                                                            display: inline-block;">
                                                        Verificar correo
                                                    </a>
                                                </td>
                                            </tr>

                                            <!-- MENSAJE SECUNDARIO -->
                                            <tr>
                                                <td style="padding: 20px 30px; font-size: 0.9rem; color: #737373; line-height: 1.6rem;">
                                                    Si no creaste una cuenta en DreamBooks, puedes ignorar este mensaje.
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

    const send = await enviarCorreo(contenidoHTML, "Verificación de correo DreamBooks", email, archivosImg);

    if (send)
        return true;

    return false

}

module.exports = enviarCorreoVerificacion;