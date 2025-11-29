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
        // Datos del formulario
        const data = req.body;

        // Imagen subida por multer
        if (req.file) {
            data.imagen = req.file.filename;
        } else {
            data.imagen = null;
        }

        const nuevoLibro = await addBook(data);

        res.json({
            ok: true,
            mensaje: "Libro agregado correctamente",
            libro: nuevoLibro
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            mensaje: "Error al agregar libro"
        });
    }
};

