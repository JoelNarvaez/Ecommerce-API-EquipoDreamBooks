const { obtenerCarritoUsuario, crearCarrito, obtenerItemsCarrito } = require("../../models/modelCarrito");
const { getBookById } = require("../../models/modelLibros");


exports.obtenerCarrito = async (req, res) => {
    try {
        
        const {id} = req.user;
        const carritoUsuario = await obtenerCarritoUsuario(id);

        if(carritoUsuario.length === 0) {
            await crearCarrito(id);
        }

        const carritoActual = await obtenerCarritoUsuario(id);


        if(carritoActual.length > 0) {
            const carrito = carritoActual[0];
            const itemsCarrito = await obtenerItemsCarrito(carrito.Id);

            for(let i = 0; i < itemsCarrito.length; i++) {
                const productoId = itemsCarrito[i].ProductoId;
                const producto = await getBookById(productoId);
                itemsCarrito[i].detalleProducto = producto;
            }
            
            return res.status(200).json({ message: "Carrito obtenido exitosamente", itemsCarrito: itemsCarrito, carrito:carrito });
        }

        return res.status(404).json({ message: "Carrito no encontrado" });


    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
