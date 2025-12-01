// controllers/usuario/books.controller.js

const {
    getBooksPaginatedAdvanced,
    getBookById
} = require("../../models/modelLibros");

// =============================================================
// OBTENER LIBROS (TIENDA)
// =============================================================
exports.getBooks = async (req, res) => {
    try {
        const result = await getBooksPaginatedAdvanced({
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 8,
            categoria: req.query.categoria || "",
            search: req.query.search || "",
            min: req.query.min || "",
            max: req.query.max || "",
            stock: req.query.stock || "",
            orden: req.query.orden || "",
        });

        res.json(result);

    } catch (error) {
        console.error("❌ ERROR EN getBooks:", error);
        res.status(500).json({
            ok: false,
            message: "Error al obtener libros"
        });
    }
};

// =============================================================
// OBTENER LIBRO POR ID
// =============================================================
exports.getBook = async (req, res) => {
    try {
        const libro = await getBookById(req.params.id);

        if (!libro) {
            return res.status(404).json({
                ok: false,
                message: "Libro no encontrado"
            });
        }

        res.json({
            ok: true,
            libro
        });

    } catch (error) {
        console.error("ERROR obtenerLibro:", error);
        res.status(500).json({
            ok: false,
            message: "Error al obtener libro"
        });
    }
};
