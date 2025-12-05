const { GetItemCarrito, eliminarItemCarrito, obtenerCarritoUsuario } = require("../../models/modelCarrito");


exports.eliminarCarrito = async (req, res) => {
    try {

        const { id } = req.user;
        const { idItem } = req.body;
        const carritoUsuario = await obtenerCarritoUsuario(id);

        if (carritoUsuario.length === 0) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        const itemCarrito = await GetItemCarrito(idItem);
        if (!itemCarrito) {
            return res.status(404).json({ message: "Item no encontrado" });
        }

        const eliminar = await eliminarItemCarrito(itemCarrito.Id);

        if (!eliminar) {
            return res.status(500).json({ message: "Error al eliminar item del carrito" });
        }

        return res.status(200).json({ message: "Ítem eliminado del carrito exitosamente" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
