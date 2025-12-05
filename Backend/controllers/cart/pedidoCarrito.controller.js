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

        // 3️⃣ Marcar cupón si existe
        if (cupon) {
            await marcarCuponDB(cupon);
        }

        // 4️⃣ 🆕 Vaciar carrito del usuario
        await vaciarCarritoDB(usuario_id);

        await connection.commit();

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