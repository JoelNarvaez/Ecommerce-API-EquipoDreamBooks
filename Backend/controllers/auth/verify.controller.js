const jwt = require("jsonwebtoken")
const { obtenerUserPorId, actualizarUsuarioVerificado } = require("../../models/usersModel");
const enviarCorreoBienvenido = require("../../services/email/enviarBienvenido.service")

exports.verificarUsuario = async (req, res) => {
    try {

        const { idUser } = jwt.verify(req.params.token, process.env.JWT_SECRET);

        // Verificar si el usuario ya existe
        const userExists = await obtenerUserPorId(idUser);
        if (!userExists) {
            return res.status(404).json({ message: "El usuario no esta registrado" });
        }

        await actualizarUsuarioVerificado(idUser);

        await enviarCorreoBienvenido(userExists.nombre, userExists.email);

      /*  const faIcono = `http://localhost:3000/public/images/favicon-sf.png`
        const logo = `http://localhost:3000/public/images/logo-header.png`
        const enlace = "http://127.0.0.1:5501../pages/login.html";*/

        const faIcono = `https://ecommerce-api-equipodreambooks-production.up.railway.app/imagenes/favicon-sf.png`
        const logo = `https://ecommerce-api-equipodreambooks-production.up.railway.app/imagenes/logo-header.png`
        const enlace = "https://ecommerce-api-equipodreambooks.netlify.app/pages/login.html";

        const contenidoHTML = `<!DOCTYPE html>
                                <html lang="es">

                                <head>
                                    <meta charset="UTF-8" />
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                                    <link rel="shortcut icon" href="${faIcono}" type="image/x-icon">
                                    <title>Correo verificado</title>
                                </head>

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

                                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                                <tr>
                                                                    <td align="center">
                                                                        <div
                                                                            style="width:120px; height:120px; background-color:#703030; border-radius:50%; margin-bottom:20px;">
                                                                            <img src="${logo}" style="width: 100px; height: 35px; margin-top: 40px;" alt="">
                                                                        </div>
                                                                    </td>
                                                                </tr>

                                                                <tr>
                                                                    <td style="text-align:center;">
                                                                        <h1 style="margin:0; color:#703030; font-size:32px; font-weight:700;">
                                                                            ¡Tu correo ha sido verificado!
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

                                                    <tr>
                                                        <td style="height:20px; line-height:20px; font-size:0;">&nbsp;</td>
                                                    </tr>

                                                    <!-- Bloque principal -->
                                                    <tr>
                                                        <td style="background-color:#ffffff; padding:30px; border-radius:12px;">
                                                            <p style="margin:0; color:#000; font-size:16px; line-height:1.6; margin-bottom: 20px;">
                                                                ¡Hola <strong style="color:#703030;">${userExists.nombre}</strong>!
                                                            </p>

                                                            <p style="margin:0; color:#000; font-size:16px; line-height:1.6;">
                                                                Hemos confirmado que tu dirección de correo electrónico es válida.  
                                                                Desde este momento, tu cuenta en <strong style="color:#703030;">DreamBooks</strong> está completamente activa.
                                                            </p>

                                                            <p style="margin:12px 0 0; color:#000; font-size:16px; line-height:1.6;">
                                                                <strong style="color:#703030;">¿Qué puedes hacer ahora?</strong>
                                                            </p>

                                                            <ul style="margin-top:8px; padding-left:20px; color:#703030; font-size:15px; line-height:1.6;">
                                                                <li>Acceder a tu panel personal</li>
                                                                <li>Gestionar tus listas de lectura</li>
                                                                <li>Comprar libros y revisar tu historial</li>
                                                                <li>Personalizar tus preferencias</li>
                                                            </ul>

                                                            <p style="margin:14px 0 0; color:#000; font-size:16px; line-height:1.6;">
                                                                Usa el siguiente botón para acceder a tu cuenta:
                                                            </p>

                                                            <div style="text-align:center; margin-top:22px;">
                                                                <a href="${enlace}"
                                                                    style="background-color:#c77965; color:#ffffff; padding:14px 36px; border-radius:6px; font-size:16px; text-decoration:none; font-weight:700; display:inline-block;">
                                                                    Acceder a mi cuenta
                                                                </a>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td style="height:20px; line-height:20px; font-size:0;">&nbsp;</td>
                                                    </tr>

                                                    <!-- Mensaje secundario -->
                                                    <tr>
                                                        <td
                                                            style="background-color:#ffffff; padding:25px; border-radius:12px; border-left:4px solid #c77965;">
                                                            <p style="margin:0; color:#737373; font-size:14px; line-height:1.6;">
                                                                Si no solicitaste esta verificación, puedes ignorar este mensaje o contactar a nuestro equipo de soporte inmediatamente.
                                                            </p>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td style="height:20px; line-height:20px; font-size:0;">&nbsp;</td>
                                                    </tr>

                                                    <!-- Footer -->
                                                    <tr>
                                                        <td
                                                            style="background-color:#a9806a; padding:30px; border-radius:12px; text-align:center;">
                                                            <p style="margin:0; color:#ffffff; font-size:14px; line-height:1.6;">
                                                                © 2025 DreamBooks. Todos los derechos reservados.
                                                            </p>
                                                            <p style="margin:10px 0 0; color:#ffffff; font-size:12px; opacity:0.9;">
                                                                Recibiste este correo porque registraste una cuenta en DreamBooks.
                                                            </p>
                                                        </td>
                                                    </tr>

                                                </table>

                                            </td>
                                        </tr>
                                    </table>

                                </body>

                                </html>`


        return res.status(201).send(contenidoHTML);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
