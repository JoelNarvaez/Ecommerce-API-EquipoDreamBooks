const fs = require("fs");
const generarPDF = require('./generarPDF.service');
const path = require("path");

const generarPDFNota = async (
    idPedido, nombre, fecha, metodoPago,
    items, subtotal, envio, impuestos, total,
    couponCodigo, cuponDescuento, email
) => {

    // ---------- FORMATO DE FECHA PROFESIONAL ----------
    const fechaObj = new Date(fecha);

    const fechaProfesional = fechaObj.toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    const horaProfesional = fechaObj.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    const fechaCompleta = `${fechaProfesional} – ${horaProfesional} hrs`;

    // ---------- FORMATOS NUMÉRICOS ----------
    const formatoMX = v =>
        Number(v).toLocaleString("es-MX", { style: "currency", currency: "MXN" });

    const subtotalFormato = formatoMX(subtotal);
    const envioFormato = formatoMX(envio);
    const impuestosFormato = formatoMX(impuestos);
    const totalFormato = formatoMX(total);
    const cuponDescuentoFormato = formatoMX(cuponDescuento);

    // ---------- ITEMS ----------
    const stringItems = items.map(it => {
        const precioNormal = formatoMX(it.precioNormal);
        const precioSub = formatoMX(it.Cantidad * it.precioNormal);

        return `
            <tr style="border-bottom:1px solid #eaeaea;">
                <td style="padding:14px 0; font-size:14px;">${it.nombre}</td>
                <td align="center" style="padding:14px 0; font-size:14px;">${it.Cantidad}</td>
                <td align="right" style="padding:14px 0; font-size:14px;">${precioNormal}</td>
                <td align="right" style="padding:14px 0; font-size:14px; font-weight:600;">${precioSub}</td>
            </tr>
        `;
    }).join("");

    // ---------- LOGO ----------
    const logoPath = path.join(__dirname, "../../assets/public/logo-header.png");
    const logoBase64 = fs.readFileSync(logoPath).toString("base64");
    const imageLogo = `data:image/png;base64,${logoBase64}`;

    // ---------- HTML PROFESIONAL ----------
    const contenidoHTML = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8" />
        <style>
            body { font-family: Quicksand, Arial, sans-serif; background:#f4f4f4; margin:0; padding:0; }
            .card {
                background:#fff;
                border-radius:12px;
                padding:28px;
                margin-top:28px;
                box-shadow:0px 4px 12px rgba(0,0,0,0.08);
            }
            .title-section {
                font-size:20px;
                color:#703030;
                font-weight:700;
                margin-bottom:15px;
                text-transform:uppercase;
                letter-spacing:0.5px;
            }
            .line { border-bottom:1px solid #eaeaea; margin:14px 0; }
        </style>
    </head>

    <body>
        <table width="100%" cellspacing="0" cellpadding="0" style="padding:40px 0;">
            <tr><td align="center">

                <table width="700" style="max-width:700px;">

                    <!-- HEADER -->
                    <tr><td>
                        <div class="card" style="text-align:center; background:#ebe6db;">
                            <div style="width:120px; height:120px; background:#703030; border-radius:50%; margin:0 auto;">
                                <img src="${imageLogo}" style="width:100px; height:35px; margin-top:42px;">
                            </div>
                            <h1 style="color:#703030; margin-top:18px;">Nota de Compra</h1>
                            <p style="color:#737373; margin:0;">DreamBooks · Sueña despierto</p>
                        </div>
                    </td></tr>

                    <!-- SALUDO -->
                    <tr><td>
                        <div class="card">
                            <p style="font-size:16px;">Hola <strong style="color:#703030;">${nombre}</strong>,</p>
                            <p style="font-size:16px; margin-top:10px;">Gracias por tu compra. Aquí están los detalles de tu pedido:</p>
                            <p style="font-size:16px; margin-top:10px;"><strong>ID Pedido:</strong> ${idPedido}</p>
                        </div>
                    </td></tr>

                    <!-- INFO / FECHA -->
                    <tr><td>
                        <div class="card">
                            <div style="display:flex; justify-content:space-between; gap:20px;">
                                
                                <div style="width:50%; border-left:4px solid #c77965; padding-left:14px;">
                                    <p style="color:#737373; font-size:13px; margin:0;">Fecha y hora</p>
                                    <p style="font-size:16px; font-weight:600; margin:5px 0;">${fechaCompleta}</p>
                                </div>

                                <div style="width:50%; border-left:4px solid #c77965; padding-left:14px;">
                                    <p style="color:#737373; font-size:13px; margin:0;">Método de pago</p>
                                    <p style="font-size:16px; font-weight:600; margin:5px 0;">${metodoPago}</p>
                                </div>

                            </div>
                        </div>
                    </td></tr>

                    <!-- ITEMS -->
                    <tr><td>
                        <div class="card">
                            <div class="title-section">Artículos Comprados</div>

                            <table width="100%" style="border-collapse:collapse;">
                                <thead>
                                    <tr style="border-bottom:2px solid #ebe6db;">
                                        <th align="left" style="padding:12px 0; font-size:12px;">Artículo</th>
                                        <th align="center" style="padding:12px 0; font-size:12px;">Cantidad</th>
                                        <th align="right" style="padding:12px 0; font-size:12px;">Precio</th>
                                        <th align="right" style="padding:12px 0; font-size:12px;">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>${stringItems}</tbody>
                            </table>
                        </div>
                    </td></tr>

                    <!-- RESUMEN -->
                    <tr><td>
                        <div class="card">
                            <div class="title-section">Resumen de Compra</div>

                            <div style="display:flex; justify-content:space-between;">
                                <span>Subtotal</span> <strong>${subtotalFormato}</strong>
                            </div>
                            <div class="line"></div>

                            <div style="display:flex; justify-content:space-between;">
                                <span>Envío</span> <strong>${envioFormato}</strong>
                            </div>
                            <div class="line"></div>

                            <div style="display:flex; justify-content:space-between;">
                                <span>Impuestos</span> <strong>${impuestosFormato}</strong>
                            </div>
                            <div class="line"></div>

                            <div style="display:flex; justify-content:space-between;">
                                <span>Cupón: <strong>${couponCodigo}</strong></span>
                                <strong style="color:#d9534f;">${couponCodigo === "Sin Cupón" ? "" : `- ${cuponDescuentoFormato}`}</strong>
                            </div>
                            <div class="line"></div>

                            <div style="display:flex; justify-content:space-between; margin-top:12px;">
                                <span style="font-size:18px; font-weight:700; color:#703030;">TOTAL</span>
                                <span style="font-size:18px; font-weight:700; color:#703030;">${totalFormato}</span>
                            </div>
                        </div>
                    </td></tr>

                    <!-- FOOTER -->
                    <tr><td>
                        <div class="card" style="background:#a9806a; text-align:center;">
                            <p style="color:white; margin:0;">© 2025 DreamBooks</p>
                            <p style="color:white; opacity:0.85; margin:5px 0 0;">Documento generado automáticamente</p>
                        </div>
                    </td></tr>

                </table>

            </td></tr>
        </table>
    </body>
    </html>
    `;

    // ---------- GENERAR PDF ----------
    const nombrePdf = `NotaCompra${idPedido}.pdf`;
    const pathArchivo = await generarPDF(nombrePdf, contenidoHTML);

    return pathArchivo;
};

module.exports = generarPDFNota;
