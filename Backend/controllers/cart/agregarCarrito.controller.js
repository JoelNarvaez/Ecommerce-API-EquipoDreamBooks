const { obtenerCarritoUsuario, crearItemCarrito, obtenerItemsCarrito } = require("../../models/modelCarrito");
const { getBookById } = require("../../models/modelLibros");


exports.agregarCarrito = async (req, res) => {
    try {
        const { id } = req.user;
        const { idLibro, cantidad } = req.body;
        const carritoUsuario = await obtenerCarritoUsuario(id);

        const carritoActual = carritoUsuario[0];


        if (carritoUsuario.length === 0) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        const libro = await getBookById(idLibro);
        if (!libro) {
            return res.status(404).json({ message: "Libro no encontrado" });
        }

        if(libro.stock < cantidad) {
            return res.status(400).json({ message: "Cantidad solicitada excede el stock disponible" });
        }

        const crearItem = await crearItemCarrito(carritoActual.Id, libro.id, cantidad, libro.precio);

        if (!crearItem) {
            return res.status(500).json({ message: "Error al agregar el ítem al carrito" });
        }

        const itemsCarrito = await obtenerItemsCarrito(carritoActual.Id);


        for (let i = 0; i < itemsCarrito.length; i++) {
            const productoId = itemsCarrito[i].ProductoId;
            const producto = await getBookById(productoId);
            itemsCarrito[i].detalleProducto = producto;
        }

        return res.status(200).json({ message: "Ítem agregado al carrito exitosamente", carrito: itemsCarrito });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
