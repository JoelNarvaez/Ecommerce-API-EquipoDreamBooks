
const generarPDFNota = require('../generator/generarPdfNota.service');
const enviarCorreo = require('./enviarCorreo');
const path = require("path");


const enviarNotaDeCompra = async (idPedido, nombre, fecha, metodoPago, items, subtotal, envio, impuestos, total, couponCodigo, cuponDescuento, email) => {


    fechaFormato = new Date(fecha).toLocaleDateString("es-MX");
    subtotalFormato = Number(subtotal).toLocaleString("es-MX", {style: "currency",currency: "MXN"});
    envioFormato = Number(envio).toLocaleString("es-MX", {style: "currency",currency: "MXN"});
    impuestosFormato = Number(impuestos).toLocaleString("es-MX", {style: "currency",currency: "MXN"});
    totalFormato = Number(total+envio).toLocaleString("es-MX", {style: "currency",currency: "MXN"});
    cuponDescuentoFormato= Number(cuponDescuento).toLocaleString("es-MX", {style: "currency",currency: "MXN"});

    const stringItems = items.map(it=>{

        const precioSub = (it.Cantidad * Number(it.precioNormal)).toLocaleString("es-MX", {style: "currency",currency: "MXN"});
        const precioNormal = Number(it.precioNormal).toLocaleString("es-MX", {style: "currency",currency: "MXN"});

        return `<tr style="border-bottom:1px solid #f5f5f5;">
                   <td
                       style="padding:18px 0; color:#000; font-size:14px; font-weight:500;">
                       ${it.nombre}</td>
                   <td align="center"
                       style="padding:18px 0; color:#000; font-size:14px;">
                       ${it.Cantidad}</td>
                   <td align="right"
                       style="padding:18px 0; color:#000; font-size:14px;">
                       ${precioNormal}</td>
                   <td align="right"
                       style="padding:18px 0; color:#000; font-size:14px; font-weight:600;">
                       ${precioSub}</td>
               </tr>`
    }).join("");

    const archivosImg = [
        {
            filename: "logo-header.png",
            cid: "logoDreamBooks"
        }
    ]

    const contenidoHTML = `<body style="margin:0; padding:0; width:100%; background-color:#f5f5f5; font-family: Quicksand, Arial, sans-serif;">

                                    <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f5f5f5; padding:40px 0;">
                                        <tr>
                                            <td align="center">

                                                <!-- Contenedor principal -->
                                                <table width="672" cellspacing="0" cellpadding="0" border="0"
                                                    style="background-color:#f5f5f5; width:100%; max-width:672px;">

                                                    <tr>
                                                        <td>

                                                            <!-- Header -->
                                                            <table width="100%" cellpadding="0" cellspacing="0"
                                                                style="background-color:#ebe6db; padding:40px; border-radius:12px; text-align:center;">
                                                                <tr>
                                                                    <td>
                                                                        <div
                                                                            style="width:120px; height:120px; background-color:#703030; border-radius:50%; margin:0 auto 20px auto;">
                                                                            <img src="cid:logoDreamBooks"
                                                                                style="width: 100px; height: 35px; margin-top: 40px;" alt="">
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="text-align:center;">
                                                                        <h1 style="margin:0; color:#703030; font-size:32px; font-weight:700;">
                                                                            Nota de Compra
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


                                                    <!-- Greeting -->
                                                    <tr>
                                                        <td>
                                                            <table width="100%" cellpadding="0" cellspacing="0"
                                                                style="background-color:#ffffff; padding:30px; border-radius:12px; margin-top:30px;">
                                                                <tr>
                                                                    <td>

                                                                        <p style="margin:0; color:#000; font-size:16px; line-height:1.6;">
                                                                            Hola <strong style="color: #703030;">${nombre}</strong>,
                                                                        </p>

                                                                        <p style="margin:12px 0 0; color:#000; font-size:16px; line-height:1.6;">
                                                                            Gracias por tu compra. A continuación encontrarás los detalles de tu pedido (Transacción #${idPedido}).
                                                                        </p>

                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>


                                                    <!-- Order Info -->
                                                    <tr>
                                                        <td>
                                                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:30px;">

                                                                <tr>
                                                                    <td width="50%" style="padding-right:10px;">
                                                                        <table width="100%" cellpadding="0" cellspacing="0"
                                                                            style="background-color:#ffffff; padding:25px; border-radius:12px; border-left:4px solid #c77965;">
                                                                            <tr>
                                                                                <td>
                                                                                    <p
                                                                                        style="margin:0 0 8px; color:#737373; font-size:13px; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">
                                                                                        Fecha de Compra
                                                                                    </p>
                                                                                    <p style="margin:0; color:#000; font-size:16px; font-weight:600;">
                                                                                        ${fechaFormato}
                                                                                    </p>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>

                                                                    <td width="50%" style="padding-left:10px;">
                                                                        <table width="100%" cellpadding="0" cellspacing="0"
                                                                            style="background-color:#ffffff; padding:25px; border-radius:12px; border-left:4px solid #c77965;">
                                                                            <tr>
                                                                                <td>
                                                                                    <p
                                                                                        style="margin:0 0 8px; color:#737373; font-size:13px; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">
                                                                                        Método de Pago
                                                                                    </p>
                                                                                    <p style="margin:0; color:#000; font-size:16px; font-weight:600;">
                                                                                        ${metodoPago}
                                                                                    </p>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>

                                                            </table>
                                                        </td>
                                                    </tr>


                                                    <!-- Items -->
                                                    <tr>
                                                        <td>
                                                            <table width="100%" cellpadding="0" cellspacing="0"
                                                                style="background-color:#ffffff; padding:30px; border-radius:12px; margin-top:30px;">
                                                                <tr>
                                                                    <td>

                                                                        <h2 style="margin:0 0 20px; color:#703030; font-size:18px; font-weight:600;">
                                                                            Artículos Comprados
                                                                        </h2>

                                                                        <table width="100%" cellpadding="0" cellspacing="0"
                                                                            style="border-collapse:collapse;">

                                                                            <thead>
                                                                                <tr style="border-bottom:2px solid #ebe6db;">
                                                                                    <th align="left"
                                                                                        style="padding:12px 0; color:#703030; font-size:12px; text-transform:uppercase; font-weight:600;">
                                                                                        Artículo</th>
                                                                                    <th align="center"
                                                                                        style="padding:12px 0; color:#703030; font-size:12px; text-transform:uppercase; font-weight:600;">
                                                                                        Cantidad</th>
                                                                                    <th align="right"
                                                                                        style="padding:12px 0; color:#703030; font-size:12px; text-transform:uppercase; font-weight:600;">
                                                                                        Precio</th>
                                                                                    <th align="right"
                                                                                        style="padding:12px 0; color:#703030; font-size:12px; text-transform:uppercase; font-weight:600;">
                                                                                        Subtotal</th>
                                                                                </tr>
                                                                            </thead>

                                                                            <tbody>
                                                                                ${stringItems}
                                                                            </tbody>

                                                                        </table>

                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>


                                                    <!-- Summary -->
                                                    <tr>
                                                        <td>
                                                            <table width="100%" cellpadding="0" cellspacing="0"
                                                                style="background-color:#ffffff; padding:30px; border-radius:12px; margin-top:30px;">
                                                                <tr>
                                                                    <td>

                                                                        <h2 style="margin:0 0 20px; color:#703030; font-size:18px; font-weight:600;">
                                                                            Resumen de Compra
                                                                        </h2>

                                                                        <!-- Subtotal -->
                                                                        <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #f5f5f5; padding:12px 0;">
                                                                            <tr>
                                                                                <td style="color:#737373; font-size:15px; text-align:left;">
                                                                                    Subtotal
                                                                                </td>
                                                                                <td style="color:#000; font-size:15px; text-align:right;">
                                                                                    ${subtotalFormato}
                                                                                </td>
                                                                            </tr>
                                                                        </table>

                                                                        <!-- Envío -->
                                                                        <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #f5f5f5; padding:12px 0;">
                                                                            <tr>
                                                                                <td style="color:#737373; font-size:15px; text-align:left;">
                                                                                    Envío
                                                                                </td>
                                                                                <td style="color:#000; font-size:15px; text-align:right;">
                                                                                    ${envioFormato}
                                                                                </td>
                                                                            </tr>
                                                                        </table>

                                                                        <!-- Impuestos -->
                                                                        <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:2px solid #ebe6db; padding:12px 0;">
                                                                            <tr>
                                                                                <td style="color:#737373; font-size:15px; text-align:left;">
                                                                                    Impuestos
                                                                                </td>
                                                                                <td style="color:#000; font-size:15px; text-align:right;">
                                                                                    ${impuestosFormato}
                                                                                </td>
                                                                            </tr>
                                                                        </table>

                                                                        <!-- Cupón de Descuento -->
                                                                        <table width="100%" cellpadding="0" cellspacing="0"
                                                                            style="border-bottom:1px solid #f5f5f5; padding:12px 0;">
                                                                            <tr>
                                                                                <td style="color:#737373; font-size:15px; text-align:left;">
                                                                                    Cupón: <strong>${couponCodigo}</strong>
                                                                                </td>
                                                                                <td
                                                                                    style="color:#d9534f; font-size:15px; text-align:right; font-weight:600;">
                                                                                    ${couponCodigo == "Sin Cupón" ? "" : `- ${cuponDescuentoFormato}`}
                                                                                </td>
                                                                            </tr>
                                                                        </table>

                                                                        <!-- Total -->
                                                                        <table width="100%" cellpadding="0" cellspacing="0" style="padding:18px 0 0;">
                                                                            <tr>
                                                                                <td style="color:#703030; font-size:18px; font-weight:700; text-align:left;">
                                                                                    Total
                                                                                </td>
                                                                                <td style="color:#703030; font-size:18px; font-weight:700; text-align:right;">
                                                                                    ${totalFormato}
                                                                                </td>
                                                                            </tr>
                                                                        </table>

                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>



                                                    <!-- Support -->
                                                    <tr>
                                                        <td>
                                                            <table width="100%" cellpadding="0" cellspacing="0"
                                                                style="background-color:#ffffff; padding:25px; border-radius:12px; border-left:4px solid #c77965; margin-top:30px;">
                                                                <tr>
                                                                    <td>

                                                                        <p style="margin:0; color:#737373; font-size:14px; line-height:1.6;">
                                                                            Si tienes alguna pregunta o problema con tu pedido, no dudes en contactar a
                                                                            nuestro equipo de soporte.
                                                                            Estamos aquí para ayudarte.
                                                                        </p>

                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>


                                                    <!-- Footer -->
                                                    <tr>
                                                        <td>
                                                            <table width="100%" cellpadding="0" cellspacing="0"
                                                                style="background-color:#a9806a; padding:30px; border-radius:12px; text-align:center; margin-top:30px;">
                                                                <tr>
                                                                    <td>

                                                                        <p style="margin:0; color:#fff; font-size:14px; line-height:1.6;">
                                                                            © 2025 DreamBooks. Todos los derechos reservados.
                                                                        </p>

                                                                        <p style="margin:10px 0 0; color:#fff; font-size:12px; opacity:0.9;">
                                                                            Recibiste este documento porque realizaste una compra en nuestra tienda.
                                                                        </p>

                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>


                                                </table>

                                            </td>
                                        </tr>
                                    </table>

                                </body>`

    const rutaPdf = await generarPDFNota(idPedido, nombre, fecha, metodoPago, items, subtotal, envio, impuestos, total, couponCodigo, cuponDescuento, email);

    if(!rutaPdf){
        return false;
    }

    const nombreArchivo = path.basename(rutaPdf);

    const archivosPdf = [
        {
            filename: nombreArchivo,
            path: rutaPdf,
            contentType: "application/pdf"
        }
    ]

    const send = await enviarCorreo(contenidoHTML, "Gracias por tu compra en DreamBooks 📚", email, archivosImg,archivosPdf);

    if (send)
        return true;

    return false

}

module.exports = enviarNotaDeCompra;