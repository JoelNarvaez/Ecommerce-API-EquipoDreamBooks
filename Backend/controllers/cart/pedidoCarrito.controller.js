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

        const { items, subtotal, iva, descuento, totalFinal, cupon, compraDirecta, envio, metodoPago } = req.body;

        // Validación de items
        if (!items || items.length === 0) {
            return res.status(400).json({ ok: false, message: "No hay productos para procesar el pedido." });
        }

        await connection.beginTransaction();

        // Crear pedido principal
        const pedidoId = await crearPedidoDB(usuario_id, totalFinal);

        // Recorrer detalles del pedido
        for (const item of items) {
            const productoId = item.ProductoId || item.idProducto;
            const cantidad = item.Cantidad || item.cantidad;

            await crearPedidoDetalleDB(
                pedidoId,
                productoId,
                cantidad,
                item.precioFinal
            );

            await descontarStockDB(productoId, cantidad);
        }

        let cuponText = "Sin Cupón";
        let cuponDescuento = 0;

        // Marcar cupón como usado si existe
        if (cupon) {
            const infoCupon = await obtenerCuponPorCodigoSinVeri(cupon);

            if (infoCupon) {
                cuponText = infoCupon.Codigo;
                cuponDescuento = infoCupon.MontoDescuento;
                await marcarCuponDB(cupon);
            }
        }

        // Vaciar carrito solo si NO es compra directa
        if (!compraDirecta) {
            await vaciarCarritoDB(usuario_id);
        }

        await connection.commit();

        const pedidoD = await obtenerPedido(pedidoId);

        if (!pedidoD) return res.status(400).json({ ok: false, message: "El pedido no existe" })


        const usuario = await obtenerUserPorId(pedidoD.usuario_id)
        if (!usuario) return res.status(400).json({ ok: false, message: "No se encontró al usuario" })


        enviarNotaDeCompra(pedidoD.id, usuario.nombre, pedidoD.actualizado_en, metodoPago, items, subtotal, envio, iva, totalFinal, cuponText, cuponDescuento, usuario.email);


        return res.status(200).json({
            ok: true,
            message: "Pedido creado exitosamente.",
            pedidoId
        });

    } catch (error) {
        console.error("❌ ERROR EN CREAR PEDIDO:", error);
        await connection.rollback();
        return res.status(500).json({
            ok: false,
            message: "Error al crear el pedido."
        });
    } finally {
        connection.release();
    }
};
