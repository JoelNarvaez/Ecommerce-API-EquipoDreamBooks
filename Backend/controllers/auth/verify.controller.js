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

        const faIcono = `http://localhost:3000/public/images/favicon-sf.png`
        const logo = `http://localhost:3000/public/images/logo-header-fondo.png`
        const enlace = "http://127.0.0.1:5501/Frontend/pages/login.html";

        const contenidoHTML = `<!DOCTYPE html>
                            <html lang="es">
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <link rel="shortcut icon" href="${faIcono}" type="image/x-icon">
                                <title>Correo verificado</title>
                            </head>

                            <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Quicksand', sans-serif; color: #000000;">

                                <!-- Contenedor principal -->
                                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
                                    <tr>
                                        <td align="center">

                                            <!-- Tarjeta -->
                                            <table width="600" border="0" cellspacing="0" cellpadding="0"
                                                style="background-color: #ebe6db; margin-top: 20px; border-radius: 10px; overflow: hidden;">

                                                <!-- HEADER DIFERENTE -->
                                                <tr>
                                                    <td align="center" style="padding: 40px 20px 20px 20px; background-color: #ffffff;">
                                                        <img src="${logo}" 
                                                            alt="Verificado" width="90" style="margin-bottom: 10px;">
                                                        <h1 style="color: #703030; font-size: 1.8rem; margin: 0; font-weight: bold;">¡Tu correo ha sido verificado!</h1>
                                                    </td>
                                                </tr>

                                                <!-- SECCIÓN EN CUADRO BLANCO DIFERENCIADA -->
                                                <tr>
                                                    <td style="padding: 25px 30px;">
                                                        <table width="100%" border="0" cellspacing="0" cellpadding="0"
                                                            style="background-color: #ffffff; border-radius: 10px; padding: 25px;">
                                                            <tr>
                                                                <td style="font-size: 1rem; color: #000000; line-height: 1.6rem;">
                                                                    <h2 style="color: #703030; font-size: 1.4rem; margin-top: 0;">Hola ${userExists.nombre},</h2>

                                                                    <p>
                                                                        ¡Excelente! Hemos confirmado que tu dirección de correo electrónico es válida.
                                                                        A partir de este momento, tu cuenta en <strong>DreamBooks</strong> está completamente activa.
                                                                    </p>

                                                                    <!-- Nueva sección de beneficios -->
                                                                    <p style="margin-bottom: 10px;"><strong>¿Qué puedes hacer ahora?</strong></p>
                                                                    <ul style="margin-top: 0; padding-left: 20px; color: #703030;">
                                                                        <li>Acceder a tu panel personal</li>
                                                                        <li>Gestionar tus listas de lectura</li>
                                                                        <li>Comprar libros y consultar tu historial</li>
                                                                        <li>Personalizar tus preferencias</li>
                                                                    </ul>

                                                                    <p>
                                                                        Para entrar a tu cuenta, usa el siguiente botón:
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>

                                                <!-- BOTÓN (más ancho) -->
                                                <tr>
                                                    <td align="center" style="padding: 25px;">
                                                        <a href="${enlace}" style="background-color: #c77965; color: #fff; padding: 15px 40px;
                                                                text-decoration: none; border-radius: 5px; font-size: 1.1rem;
                                                                display: inline-block; font-weight: bold;">
                                                            Acceder a mi cuenta
                                                        </a>
                                                    </td>
                                                </tr>

                                                <!-- MENSAJE SECUNDARIO DIFERENCIADO -->
                                                <tr>
                                                    <td style="padding: 10px 40px 20px 40px; font-size: 0.9rem; color: #737373; line-height: 1.6rem;">
                                                        Si no solicitaste esta verificación, por favor ignora este correo o ponte en contacto con nuestro equipo de soporte.
                                                    </td>
                                                </tr>

                                                <!-- FOOTER MODIFICADO -->
                                                <tr>
                                                    <td align="center"
                                                        style="background-color: #a9806a; padding: 20px; color: #ffffff; font-size: 0.9rem;">
                                                        DreamBooks — Leyendo contigo desde 2025.
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
