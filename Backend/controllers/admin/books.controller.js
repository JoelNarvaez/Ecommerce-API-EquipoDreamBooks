const { getBooksPaginated, addBook } = require("../../models/modelLibros");

exports.getBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        console.log("Página solicitada:", page, "Límite:", limit);
        const data = await getBooksPaginated(page, limit);
        

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener libros paginados" });
    }
};

exports.addBook = async (req, res) => {
    try {
        const data = req.body;

        const nuevoLibro = await addBook(data);

        res.json({
            ok: true,
            mensaje: "Libro agregado correctamente",
            libro: nuevoLibro
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, mensaje: "Error al agregar libro" });
    }
};
