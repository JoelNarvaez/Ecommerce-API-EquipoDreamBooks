const fs = require("fs");
const generarPDF = require('./generarPDF.service');
const path = require("path");

const generarPDFNota = async (
    idPedido, nombre, fecha, metodoPago,
    items, subtotal, envio, impuestos, total,
    couponCodigo, cuponDescuento, email
) => {

    // ---------- FORMATOS ----------
    const fechaFormato = new Date(fecha).toLocaleDateString("es-MX");
    const subtotalFormato = Number(subtotal).toLocaleString("es-MX", { style: "currency", currency: "MXN" });
    const envioFormato = Number(envio).toLocaleString("es-MX", { style: "currency", currency: "MXN" });
    const impuestosFormato = Number(impuestos).toLocaleString("es-MX", { style: "currency", currency: "MXN" });

    // ❌ ANTES: totalFormato = Number(total + envio)
    // ✔️ AHORA: EL TOTAL YA VIENE CALCULADO DESDE EL CHECKOUT/BACKEND
    const totalFormato = Number(total).toLocaleString("es-MX", { style: "currency", currency: "MXN" });

    const cuponDescuentoFormato = Number(cuponDescuento).toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN"
    });

    // ---------- ITEMS ----------
    const stringItems = items.map(it => {
        const precioNormal = Number(it.precioNormal).toLocaleString("es-MX", {
            style: "currency",
            currency: "MXN"
        });

        const precioSub = (it.Cantidad * Number(it.precioNormal)).toLocaleString("es-MX", {
            style: "currency",
            currency: "MXN"
        });

        return `
            <tr style="border-bottom:1px solid #f5f5f5;">
                <td style="padding:18px 0; color:#000; font-size:14px; font-weight:500;">
                    ${it.nombre}
                </td>
                <td align="center" style="padding:18px 0; color:#000; font-size:14px;">
                    ${it.Cantidad}
                </td>
                <td align="right" style="padding:18px 0; color:#000; font-size:14px;">
                    ${precioNormal}
                </td>
                <td align="right" style="padding:18px 0; color:#000; font-size:14px; font-weight:600;">
                    ${precioSub}
                </td>
            </tr>
        `;
    }).join("");

    // ---------- LOGO ----------
    const logoPath = path.join(__dirname, "../../assets/public/logo-header.png");
    const logoBase64 = fs.readFileSync(logoPath).toString("base64");
    const imageLogo = `data:image/png;base64,${logoBase64}`;

    // ---------- CONTENIDO HTML ----------
    const contenidoHTML = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8" />
    </head>

    <body style="margin:0; padding:0; background-color:#f5f5f5; font-family: Quicksand, Arial, sans-serif;">
        <table width="100%" cellspacing="0" cellpadding="0" style="padding:40px 0;">
            <tr><td align="center">

                <table width="672" style="max-width:672px;">

                    <!-- Encabezado -->
                    <tr><td>
                        <table width="100%" style="background-color:#ebe6db; padding:40px; border-radius:12px; text-align:center;">
                            <tr><td>
                                <div style="width:120px; height:120px; background-color:#703030; border-radius:50%; margin:0 auto 20px;">
                                    <img src="${imageLogo}" style="width: 100px; height: 35px; margin-top: 40px;">
                                </div>
                                <h1 style="color:#703030; margin:0; font-size:32px; font-weight:700;">Nota de Compra</h1>
                                <p style="color:#703030; font-size:18px; margin:10px 0 0; font-weight:600;">DreamBooks</p>
                                <p style="color:#737373; font-size:14px; margin:0;">Sueña despierto</p>
                            </td></tr>
                        </table>
                    </td></tr>

                    <!-- Saludo -->
                    <tr><td>
                        <table width="100%" style="background:#fff; padding:30px; border-radius:12px; margin-top:30px;">
                            <tr><td>
                                <p style="font-size:16px; margin:0;">Hola <strong style="color:#703030;">${nombre}</strong>,</p>
                                <p style="font-size:16px; margin-top:12px;">
                                    Gracias por tu compra. Aquí tienes los detalles de tu pedido (Transacción #${idPedido}).
                                </p>
                            </td></tr>
                        </table>
                    </td></tr>

                    <!-- Información del pedido -->
                    <tr><td>
                        <table width="100%" style="margin-top:30px;">
                            <tr>
                                <td width="50%" style="padding-right:10px;">
                                    <table width="100%" style="background:#fff; padding:25px; border-radius:12px; border-left:4px solid #c77965;">
                                        <tr><td>
                                            <p style="color:#737373; font-size:13px; font-weight:600;">Fecha de Compra</p>
                                            <p style="font-size:16px; font-weight:600;">${fechaFormato}</p>
                                        </td></tr>
                                    </table>
                                </td>

                                <td width="50%" style="padding-left:10px;">
                                    <table width="100%" style="background:#fff; padding:25px; border-radius:12px; border-left:4px solid #c77965;">
                                        <tr><td>
                                            <p style="color:#737373; font-size:13px; font-weight:600;">Método de Pago</p>
                                            <p style="font-size:16px; font-weight:600;">${metodoPago}</p>
                                        </td></tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td></tr>

                    <!-- Artículos -->
                    <tr><td>
                        <table width="100%" style="background:#fff; padding:30px; border-radius:12px; margin-top:30px;">
                            <tr><td>
                                <h2 style="color:#703030; font-size:18px; margin:0 0 20px;">Artículos Comprados</h2>

                                <table width="100%" style="border-collapse:collapse;">
                                    <thead>
                                        <tr style="border-bottom:2px solid #ebe6db;">
                                            <th style="padding:12px 0; font-size:12px; color:#703030;">Artículo</th>
                                            <th style="padding:12px 0; font-size:12px; color:#703030;" align="center">Cantidad</th>
                                            <th style="padding:12px 0; font-size:12px; color:#703030;" align="right">Precio</th>
                                            <th style="padding:12px 0; font-size:12px; color:#703030;" align="right">Subtotal</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        ${stringItems}
                                    </tbody>
                                </table>

                            </td></tr>
                        </table>
                    </td></tr>

                    <!-- Resumen -->
                    <tr><td>
                        <table width="100%" style="background:#fff; padding:30px; border-radius:12px; margin-top:30px;">
                            <tr><td>

                                <h2 style="color:#703030; font-size:18px; margin:0 0 20px;">Resumen de Compra</h2>

                                <!-- Subtotal -->
                                <table width="100%" style="padding:12px 0; border-bottom:1px solid #f5f5f5;">
                                    <tr>
                                        <td style="color:#737373;">Subtotal</td>
                                        <td align="right">${subtotalFormato}</td>
                                    </tr>
                                </table>

                                <!-- Envío -->
                                <table width="100%" style="padding:12px 0; border-bottom:1px solid #f5f5f5;">
                                    <tr>
                                        <td style="color:#737373;">Envío</td>
                                        <td align="right">${envioFormato}</td>
                                    </tr>
                                </table>

                                <!-- Impuestos -->
                                <table width="100%" style="padding:12px 0; border-bottom:2px solid #ebe6db;">
                                    <tr>
                                        <td style="color:#737373;">Impuestos</td>
                                        <td align="right">${impuestosFormato}</td>
                                    </tr>
                                </table>

                                <!-- Cupón -->
                                <table width="100%" style="padding:12px 0; border-bottom:1px solid #f5f5f5;">
                                    <tr>
                                        <td style="color:#737373;">Cupón: <strong>${couponCodigo}</strong></td>
                                        <td align="right" style="color:#d9534f;">
                                            ${couponCodigo === "Sin Cupón" ? "" : `- ${cuponDescuentoFormato}`}
                                        </td>
                                    </tr>
                                </table>

                                <!-- Total -->
                                <table width="100%" style="padding:18px 0 0;">
                                    <tr>
                                        <td style="color:#703030; font-size:18px; font-weight:700;">Total</td>
                                        <td align="right" style="color:#703030; font-size:18px; font-weight:700;">
                                            ${totalFormato}
                                        </td>
                                    </tr>
                                </table>

                            </td></tr>
                        </table>
                    </td></tr>

                    <!-- Footer -->
                    <tr><td>
                        <table width="100%" style="background-color:#a9806a; padding:30px; border-radius:12px; text-align:center; margin-top:30px;">
                            <tr><td>
                                <p style="color:#fff; margin:0;">© 2025 DreamBooks. Todos los derechos reservados.</p>
                                <p style="color:#fff; font-size:12px; opacity:0.9;">Recibiste este documento porque realizaste una compra.</p>
                            </td></tr>
                        </table>
                    </td></tr>

                </table>

            </td></tr>
        </table>
    </body>
    </html>
    `;

    const nombrePdf = `NotaCompra${idPedido}.pdf`;
    const pathArchivo = await generarPDF(nombrePdf, contenidoHTML);

    return pathArchivo;
};

module.exports = generarPDFNota;
