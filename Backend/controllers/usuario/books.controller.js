const { 
    getBooksPaginated, 
} = require("../../models/modelLibros");

const pool = require("../../config/db");

// =============================================================
// OBTENER LIBROS PAGINADOS
// =============================================================
exports.getBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const categoria = req.query.categoria || "";
        const search = req.query.search || "";

        const result = await getBooksPaginated(page, limit, categoria, search);

        res.json(result);

    } catch (error) {
        console.error("ERROR GET BOOKS:", error);
        res.status(500).json({ ok: false, error: "Error al obtener libros" });
    }
};

// =============================================================
// OBTENER LIBRO POR ID (para editar)
// =============================================================
exports.obtenerLibro = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(
            "SELECT * FROM productos WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ ok: false, message: "Libro no encontrado" });
        }

        res.json({ ok: true, libro: rows[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: "Error al obtener libro" });
    }
};