// Modules
const jwt = require("jsonwebtoken");

const enviarCorreo = require('./enviarCorreo');


const enviarCorreoVerificacion = async ( idUser, nombre, email) => {

    const token = jwt.sign({ idUser }, process.env.JWT_SECRET, { expiresIn: "1d" })

    const enlace = `http://localhost:3000/api/auth/verify/${token}`

    const archivosImg = [
        {
            filename: "logo-header.png",
            cid: "logoDreamBooks"
        }
    ]

    const contenidoHTML = `<body style="margin:0; padding:0; background-color:#f5f5f5; font-family:'Quicksand', sans-serif;">

                            <!-- Wrapper principal -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5; padding:40px 0;">
                                <tr>
                                    <td align="center">

                                        <!-- Contenedor -->
                                        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">

                                            <!-- Header -->
                                            <tr>
                                                <td style="background-color:#ebe6db; padding:40px; border-radius:12px; text-align:center;">

                                                    <table width="100%" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td align="center">
                                                                <div
                                                                    style="width:120px; height:120px; background-color:#703030; border-radius:50%; margin-bottom:20px;">
                                                                    <img src="cid:logoDreamBooks" style="width: 100px; height: 35px; margin-top: 40px;" alt="">
                                                                </div>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td style="text-align:center;">
                                                                <h1 style="margin:0; color:#703030; font-size:32px; font-weight:700;">
                                                                    Verifica tu correo
                                                                </h1>
                                                                <p style="margin:10px 0 0; color:#703030; font-size:18px; font-weight:600;">
                                                                    DreamBooks
                                                                </p>
                                                                <p style="color:#737373; font-size:14px; line-height:0;">
                                                                    Sueña despierto
                                                                </p>
                                                            </td>
                                                        </tr>

                                                    </table>

                                                </td>
                                            </tr>

                                            <!-- Espaciado -->
                                            <tr>
                                                <td style="height:20px; line-height:20px; font-size:0;">&nbsp;</td>
                                            </tr>

                                            <!-- Texto principal -->
                                            <tr>
                                                <td style="background-color:#ffffff; padding:30px; border-radius:12px;">
                                                    <p style="margin:0; color:#000; font-size:16px; line-height:1.6;">
                                                        ¡Hola <strong style="color:#703030;">${nombre}</strong>!
                                                    </p>

                                                    <p style="margin:12px 0 0; color:#000; font-size:16px; line-height:1.6;">
                                                        Gracias por registrarte en <strong>DreamBooks</strong>, tu tienda favorita de libros en línea.
                                                    </p>

                                                    <p style="margin:12px 0 0; color:#000; font-size:16px; line-height:1.6;">
                                                        Antes de comenzar a explorar nuestras colecciones, necesitamos confirmar que este correo electrónico es tuyo. Para completar tu registro, solo haz clic en el siguiente botón:
                                                    </p>


                                                    <!-- Botón centrado -->
                                                    <div style="text-align:center; margin-top:25px;">
                                                        <a href="${enlace}"
                                                        style="background-color:#c77965; color:#ffffff; padding:14px 32px; 
                                                                text-decoration:none; border-radius:6px; font-size:16px; font-weight:600; 
                                                                display:inline-block;">
                                                            Verificar correo
                                                        </a>
                                                    </div>

                                                </td>
                                            </tr>

                                            <!-- Espaciado -->
                                            <tr>
                                                <td style="height:20px; line-height:20px; font-size:0;">&nbsp;</td>
                                            </tr>

                                            <!-- Mensaje secundario con borde lateral -->
                                            <tr>
                                                <td style="background-color:#ffffff; padding:25px; border-radius:12px; 
                                                        border-left:4px solid #c77965;">
                                                    <p style="margin:0; color:#737373; font-size:14px; line-height:1.6;">
                                                        Si no creaste una cuenta en DreamBooks, puedes ignorar este mensaje.
                                                    </p>
                                                </td>
                                            </tr>

                                            <!-- Espaciado -->
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
                                                        Recibiste este correo como parte del proceso de verificación de cuenta.
                                                    </p>
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