const enviarCorreo = require('./enviarCorreo');

// URL pública del logo en tu frontend (Netlify)
const logoURL = "https://ecommerce-api-equipodreambooks.netlify.app/assets/logo-header.png";

const enviarSubscripcionUsuario = async (nombre, codigoCupon, email) => {

    const contenidoHTML = `
<body style="margin:0; padding:0; background-color:#f5f5f5; font-family:'Quicksand', sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5; padding:40px 0;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">

<!-- HEADER -->
<tr>
<td style="background-color:#ebe6db; padding:40px; border-radius:12px; text-align:center;">

<div style="width:120px; height:120px; background-color:#703030; border-radius:50%; margin:0 auto 20px auto;">
    <img src="${logoURL}" style="width:100px; height:35px; margin-top:40px;">
</div>

<h1 style="color:#703030; font-size:32px; margin:0;">¡Bienvenido a DreamBooks!</h1>
<p style="color:#703030; font-size:18px; margin:10px 0 0;">Ya formas parte de nuestra comunidad</p>
<p style="color:#737373; font-size:14px; margin:0;">Sueña despierto</p>

</td>
</tr>

<tr><td style="height:20px"></td></tr>

<!-- MENSAJE PRINCIPAL -->
<tr>
<td style="background-color:#ffffff; padding:30px; border-radius:12px;">
<p style="font-size:16px; margin:0;">Hola <strong style="color:#703030;">${nombre}</strong>,</p>
<p style="font-size:16px; margin-top:12px;">
Gracias por suscribirte a nuestras novedades. Aquí tienes un cupón especial:
</p>
</td>
</tr>

<tr><td style="height:20px"></td></tr>

<!-- CUPÓN -->
<tr>
<td style="background-color:#ffffff; padding:30px; border-radius:12px; text-align:center;">
<h2 style="color:#703030; font-size:22px;">Tu cupón de bienvenida</h2>

<div style="
background-color:#ebe6db;
padding:15px 25px;
font-size:20px;
font-weight:700;
color:#703030;
border-radius:8px;
display:inline-block;
letter-spacing:2px;
margin-top:15px;
">
${codigoCupon}
</div>
</td>
</tr>

<tr><td style="height:20px"></td></tr>

<!-- MENSAJE SECUNDARIO -->
<tr>
<td style="background-color:#ffffff; padding:25px; border-radius:12px; border-left:4px solid #c77965;">
<p style="color:#737373; font-size:14px;">
Si tienes dudas sobre cómo utilizar tu cupón, estamos aquí para ayudarte.
</p>
</td>
</tr>

<tr><td style="height:20px"></td></tr>

<!-- FOOTER -->
<tr>
<td style="background-color:#a9806a; padding:30px; border-radius:12px; text-align:center;">
<p style="color:#fff; margin:0;">© 2025 DreamBooks. Todos los derechos reservados.</p>
<p style="color:#fff; opacity:0.9; margin-top:10px; font-size:12px;">Te suscribiste a novedades.</p>
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
`;

    const send = await enviarCorreo(
        contenidoHTML,
        "¡Bienvenido a DreamBooks! 🎉 Aquí está tu cupón de bienvenida",
        email
    );

    return send;
};

module.exports = enviarSubscripcionUsuario;
