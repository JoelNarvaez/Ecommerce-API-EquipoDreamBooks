// services/email/enviarCorreoBienvenido.js
const enviarCorreo = require("./enviarCorreo");

const enviarCorreoBienvenido = async (nombre, email) => {
    const enlace = "https://ecommerce-api-equipodreambooks.netlify.app/pages/login.html";

    // URL pública del logo en Netlify
    const logoURL = "https://ecommerce-api-equipodreambooks.netlify.app/assets/logo-header.png";

    const contenidoHTML = `
    <body style="margin:0; padding:0; background-color:#f5f5f5; font-family:'Quicksand', sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5; padding:40px 0;">
            <tr>
                <td align="center">

                    <table width="600" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">

                        <!-- Header -->
                        <tr>
                            <td style="background-color:#ebe6db; padding:40px; border-radius:12px; text-align:center;">

                                <div style="width:120px; height:120px; background-color:#703030; 
                                            border-radius:50%; margin:0 auto 20px auto;">
                                    <img src="${logoURL}" 
                                         style="width:100px;height:35px;margin-top:40px;" alt="DreamBooks Logo">
                                </div>

                                <h1 style="color:#703030; font-size:32px; font-weight:700; margin:0;">
                                    ¡Tu correo ha sido verificado!
                                </h1>

                                <p style="color:#703030; font-size:18px; font-weight:600; margin:10px 0 0;">
                                    DreamBooks
                                </p>
                                <p style="color:#737373; font-size:14px; line-height:0;">
                                    Sueña despierto
                                </p>

                            </td>
                        </tr>

                        <tr><td style="height:20px;"></td></tr>

                        <!-- Mensaje principal -->
                        <tr>
                            <td style="background-color:#ffffff; padding:30px; border-radius:12px;">

                                <p style="font-size:16px; line-height:1.6;">
                                    Hola <strong style="color:#703030;">${nombre}</strong>,
                                </p>

                                <p style="font-size:16px; line-height:1.6; margin-top:10px;">
                                    Hemos confirmado que tu dirección de correo es válida. 
                                    Tu cuenta ya está <strong style="color:#703030;">activada</strong>.
                                </p>

                                <p style="font-size:16px; line-height:1.6; margin-top:12px;">
                                    <strong style="color:#703030;">¿Qué puedes hacer ahora?</strong>
                                </p>

                                <ul style="font-size:15px; color:#703030; line-height:1.6;">
                                    <li>Acceder a tu panel personal</li>
                                    <li>Comprar libros</li>
                                    <li>Gestionar tus listas de lectura</li>
                                    <li>Revisar tu historial de compras</li>
                                </ul>

                                <div style="text-align:center; margin-top:22px;">
                                    <a href="${enlace}"
                                        style="background-color:#c77965; color:#ffffff;
                                               padding:14px 36px; border-radius:6px; 
                                               font-size:16px; font-weight:700; text-decoration:none;">
                                        Acceder a mi cuenta
                                    </a>
                                </div>

                            </td>
                        </tr>

                        <tr><td style="height:20px;"></td></tr>

                        <!-- Mensaje secundario -->
                        <tr>
                            <td style="background-color:#ffffff; padding:25px; border-radius:12px;
                                       border-left:4px solid #c77965;">
                                <p style="font-size:14px; color:#737373; line-height:1.6; margin:0;">
                                    Si no solicitaste esta verificación, ignora este mensaje 
                                    o contacta a soporte de inmediato.
                                </p>
                            </td>
                        </tr>

                        <tr><td style="height:20px;"></td></tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color:#a9806a; padding:30px; border-radius:12px; text-align:center;">
                                <p style="color:#fff; font-size:14px; margin:0;">
                                    © 2025 DreamBooks. Todos los derechos reservados.
                                </p>
                                <p style="color:#fff; font-size:12px; opacity:0.9; margin-top:10px;">
                                    Recibiste este correo porque creaste una cuenta en DreamBooks.
                                </p>
                            </td>
                        </tr>

                    </table>

                </td>
            </tr>
        </table>

    </body>
    `;

    const send = await enviarCorreo(contenidoHTML, "Bienvenid@ a DreamBooks", email);

    return send ? true : false;
};

module.exports = enviarCorreoBienvenido;
