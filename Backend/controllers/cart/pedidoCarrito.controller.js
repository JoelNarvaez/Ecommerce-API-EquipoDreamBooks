const db = require("../../config/db");

// IMPORTAR TODAS LAS FUNCIONES DEL MODELO
const {
    crearPedidoDB,
    crearPedidoDetalleDB,
    descontarStockDB,
    marcarCuponDB
} = require("../../models/orderModel");

const { vaciarCarritoDB } = require("../../models/modelCarrito");

exports.crearPedidoDesdeCarrito = async (req, res) => {
    const connection = await db.getConnection();

    try {
        const usuario_id = req.user.id;

        const { items, subtotal, iva, descuento, totalFinal, cupon, compraDirecta } = req.body;

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

        // Marcar cupón como usado si existe
        if (cupon) {
            await marcarCuponDB(cupon);
        }

        // Vaciar carrito solo si NO es compra directa
        if (!compraDirecta) {
            await vaciarCarritoDB(usuario_id);
        }

        await connection.commit();

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
