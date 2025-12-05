const {
    agregarWishlistDB,
    obtenerWishlistDB,
    eliminarWishlistDB
} = require("../../models/wishlistModel");

// ➤ Agregar un libro
exports.agregarWishlist = async (req, res) => {
    const usuarioId = req.user.id;
    const { productoId } = req.body;

    if (!productoId)
        return res.status(400).json({ ok: false, message: "Producto inválido." });

    try {
        const añadido = await agregarWishlistDB(usuarioId, productoId);

        if (!añadido)
            return res.json({ ok: false, message: "Este libro ya está en tu lista." });

        return res.json({ ok: true, message: "Agregado a tu lista de deseos." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: "Error interno." });
    }
};

exports.obtenerWishlist = async (req, res) => {
    const usuarioId = req.user.id;

    try {
        const lista = await obtenerWishlistDB(usuarioId);

        console.log("WISHLIST BACKEND:", lista); // 👈 AGREGA ESTO

        res.json({ ok: true, wishlist: lista });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false });
    }
};

// ➤ Eliminar un libro
exports.eliminarWishlist = async (req, res) => {
    const usuarioId = req.user.id;
    const { idProducto } = req.params;

    try {
        await eliminarWishlistDB(usuarioId, idProducto);
        res.json({ ok: true, message: "Eliminado de wishlist." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false });
    }
};
