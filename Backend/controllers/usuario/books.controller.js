const db = require("../../config/db");
const { getBooksPaginatedAdvanced } = require("../../models/modelLibros");

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
        res.status(500).json({ ok: false, message: "Error al obtener libros" });
    }
};

exports.getBookById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(
            `SELECT p.*, o.tipo AS oferta_tipo, o.valor AS oferta_valor
             FROM productos p
             LEFT JOIN ofertas o ON o.product_id = p.id AND o.activa = 1
             WHERE p.id = ?`,
            [id]
        );

        if (rows.length === 0)
            return res.json({ ok: false, msg: "Libro no encontrado" });

        res.json({ ok: true, book: rows[0] });

    } catch (error) {
        console.error("ERROR en getBookById:", error);
        res.status(500).json({ ok: false, error: "Error en el servidor" });
    }
};
