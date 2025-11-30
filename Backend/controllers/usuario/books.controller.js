const pool = require("../../config/db");

const {
    getBooksPaginatedAdvanced
} = require("../../models/modelLibros");

 // obtenemos todos los libros con paginacion avanzada
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


// obtenemos un libro por su id
exports.obtenerLibro = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(
            "SELECT * FROM productos WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                ok: false,
                message: "Libro no encontrado"
            });
        }

        res.json({
            ok: true,
            libro: rows[0]
        });

    } catch (error) {
        console.error("❌ ERROR obtenerLibro:", error);
        res.status(500).json({
            ok: false,
            message: "Error al obtener libro"
        });
    }
};
