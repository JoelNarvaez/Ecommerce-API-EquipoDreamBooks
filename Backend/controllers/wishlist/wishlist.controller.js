const {
    agregarWishlistDB,
    obtenerWishlistDB,
    eliminarWishlistDB
} = require("../../models/wishlistModel");


// ======================================================
// ➤ AGREGAR A WISHLIST (ACEPTA idLibro o productoId)
// ======================================================
exports.agregarWishlist = async (req, res) => {
    const usuarioId = req.user.id;

    // 🔥 Compatibilidad total: acepta idLibro O productoId
    const productoId = req.body.productoId || req.body.idLibro;

    if (!productoId)
        return res.status(400).json({
            ok: false,
            message: "Producto inválido (faltó idLibro o productoId)."
        });

    try {
        const añadido = await agregarWishlistDB(usuarioId, productoId);

        if (!añadido)
            return res.json({
                ok: false,
                message: "Este libro ya está en tu lista."
            });

        return res.json({
            ok: true,
            message: "Agregado a tu lista de deseos."
        });

    } catch (error) {
        console.error("❌ Error agregarWishlist:", error);
        res.status(500).json({
            ok: false,
            message: "Error interno al agregar a wishlist."
        });
    }
};


// ======================================================
// ➤ OBTENER WISHLIST DEL USUARIO
// ======================================================
exports.obtenerWishlist = async (req, res) => {
    const usuarioId = req.user.id;

    try {
        const lista = await obtenerWishlistDB(usuarioId);

        console.log("WISHLIST BACKEND:", lista);

        res.json({
            ok: true,
            wishlist: lista
        });

    } catch (error) {
        console.error("❌ Error obtenerWishlist:", error);
        res.status(500).json({
            ok: false,
            message: "Error al obtener wishlist."
        });
    }
};


// ======================================================
// ➤ ELIMINAR PRODUCTO DE WISHLIST
// ======================================================
exports.eliminarWishlist = async (req, res) => {
    const usuarioId = req.user.id;
    const { idProducto } = req.params;

    if (!idProducto)
        return res.status(400).json({
            ok: false,
            message: "ID de producto inválido."
        });

    try {
        await eliminarWishlistDB(usuarioId, idProducto);

        res.json({
            ok: true,
            message: "Eliminado de wishlist."
        });

    } catch (error) {
        console.error("❌ Error eliminarWishlist:", error);
        res.status(500).json({
            ok: false,
            message: "Error al eliminar de wishlist."
        });
    }
};
