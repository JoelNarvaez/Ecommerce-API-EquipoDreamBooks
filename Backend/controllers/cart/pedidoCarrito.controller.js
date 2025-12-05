const db = require("../../config/db");

// IMPORTAR TODAS LAS FUNCIONES DEL MODELO
const {
    crearPedidoDB,
    crearPedidoDetalleDB,
    descontarStockDB,
    marcarCuponDB,
    obtenerPedido
} = require("../../models/orderModel");

const { vaciarCarritoDB } = require("../../models/modelCarrito");
const enviarNotaDeCompra = require("../../services/email/enviarNotaCompra.service");
const { obtenerUserPorId } = require("../../models/usersModel");
const { obtenerCuponPorCodigo, obtenerCuponPorCodigoSinVeri } = require("../../models/modelCupon");
exports.crearPedidoDesdeCarrito = async (req, res) => {
    const connection = await db.getConnection();

    try {
        const usuario_id = req.user.id;

        const { items, subtotal, iva, descuento, totalFinal, cupon } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ ok: false, message: "El carrito está vacío." });
        }

        await connection.beginTransaction();

        // 1️⃣ Crear pedido
        const pedidoId = await crearPedidoDB(usuario_id, totalFinal);

        // 2️⃣ Crear detalles y descontar stock
        for (const item of items) {
            await crearPedidoDetalleDB(
                pedidoId,
                item.ProductoId || item.idProducto,
                item.Cantidad || item.cantidad,
                item.precioFinal
            );

            await descontarStockDB(
                item.ProductoId || item.idProducto,
                item.Cantidad || item.cantidad
            );
        }

        let cuponText = "Sin Cupón";
        let cuponDescuento = 0;

        // 3️⃣ Marcar cupón si existe
        if (cupon) {
            const infoCupon = await obtenerCuponPorCodigoSinVeri(cupon);

            if (infoCupon) {
                cuponText = infoCupon.Codigo;
                cuponDescuento = infoCupon.MontoDescuento;
                await marcarCuponDB(cupon);
            }
        }

        // 4️⃣ 🆕 Vaciar carrito del usuario
        await vaciarCarritoDB(usuario_id);

        await connection.commit();

        const pedidoD = await obtenerPedido(pedidoId);

        if (!pedidoD) res.status(400).json({ ok: false, message: "El pedido no existe" })


        const usuario = await obtenerUserPorId(pedidoD.usuario_id)
        if (!usuario) res.status(400).json({ ok: false, message: "No se encontró al usuario" })


        const envio = 50; // hardcode para precio de envio
        const enviado = await enviarNotaDeCompra(pedidoD.id, usuario.nombre, pedidoD.actualizado_en, 'PAYPAL', items, subtotal, envio, iva, totalFinal, cuponText, cuponDescuento, usuario.email);



        if (!enviado) res.status(500).json({ ok: false, message: "Error al enviar el correo de compra" })

        return res.status(200).json({
            ok: true,
            message: "Pedido creado exitosamente.",
            pedidoId
        });

    } catch (error) {
        console.error(error);
        await connection.rollback();
        return res.status(500).json({ ok: false, message: "Error al crear pedido." });
    } finally {
        connection.release();
    }
};