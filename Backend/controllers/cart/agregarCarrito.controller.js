// ===============================================
// IMPORTS NECESARIOS
// ===============================================
const { 
    obtenerCarritoUsuario,
    crearItemCarrito,
    obtenerItemsCarrito
} = require("../../models/modelCarrito");

const { getBookById } = require("../../models/modelLibros");


// ===============================================
//   AGREGAR AL CARRITO (COMPATIBLE idLibro/productoId)
// ===============================================
exports.agregarCarrito = async (req, res) => {
    try {
        const { id: usuarioId } = req.user;

        // ✔ Acepta ambos nombres: idLibro y productoId
        const productoId = req.body.productoId || req.body.idLibro;
        const cantidad = Number(req.body.cantidad) || 1;

        if (!productoId) {
            return res.status(400).json({
                ok: false,
                message: "Producto inválido. Falta productoId o idLibro."
            });
        }

        // ==========================
        // OBTENER CARRITO DEL USUARIO
        // ==========================
        const carritoUsuario = await obtenerCarritoUsuario(usuarioId);

        if (!carritoUsuario || carritoUsuario.length === 0) {
            return res.status(404).json({
                ok: false,
                message: "Carrito no encontrado."
            });
        }

        const carritoActual = carritoUsuario[0];

        // ==========================
        // VALIDAR LIBRO
        // ==========================
        const libro = await getBookById(productoId);

        if (!libro) {
            return res.status(404).json({
                ok: false,
                message: "Libro no encontrado."
            });
        }

        if (libro.stock < cantidad) {
            return res.status(400).json({
                ok: false,
                message: "Cantidad solicitada excede el stock disponible."
            });
        }

        // ==========================
        // CREAR ITEM
        // ==========================
        const crearItem = await crearItemCarrito(
            carritoActual.Id,
            libro.id,
            cantidad,
            libro.precio
        );

        if (!crearItem) {
            return res.status(500).json({
                ok: false,
                message: "Error al agregar el ítem al carrito."
            });
        }

        // ==========================
        // OBTENER ITEMS ACTUALIZADOS
        // ==========================
        const itemsCarrito = await obtenerItemsCarrito(carritoActual.Id);

        for (let item of itemsCarrito) {
            item.detalleProducto = await getBookById(item.ProductoId);
        }

        return res.status(200).json({
            ok: true,
            message: "Ítem agregado al carrito exitosamente.",
            carrito: itemsCarrito
        });

    } catch (error) {
        console.error("❌ ERROR agregarCarrito:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor."
        });
    }
};
