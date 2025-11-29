const { 
    getBooksPaginated, 
    addBook,
    deleteBook 
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
// AGREGAR LIBRO
// =============================================================
exports.addBook = async (req, res) => {
    try {
        const data = req.body;
        data.imagen = req.file ? req.file.filename : null;

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


// =============================================================
// EDITAR LIBRO
// =============================================================
exports.editarLibro = async (req, res) => {
    const { id } = req.params;

    const { 
        nombre, 
        autor, 
        precio, 
        categoria, 
        stock, 
        descripcion 
    } = req.body;

    try {
        let campos = {
            nombre,
            autor,
            precio,
            categoria,
            stock,
            descripcion
        };

        // Si el usuario envió una nueva imagen
        if (req.file) {
            campos.imagen = req.file.filename;
        }

        await pool.query("UPDATE productos SET ? WHERE id = ?", [campos, id]);

        res.json({
            ok: true,
            message: "Libro actualizado correctamente"
        });

    } catch (error) {
        console.error("Error al editar libro:", error);
        res.status(500).json({
            ok: false,
            message: "Error al editar libro"
        });
    }
};


// =============================================================
// ELIMINAR STOCK DE UN LIBRO
// =============================================================
exports.eliminarStock = async (req, res) => {
    const { id } = req.params;
    const { cantidad } = req.body;

    try {
        const [rows] = await pool.query(
            "SELECT stock FROM productos WHERE id = ?", 
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Libro no encontrado" });
        }

        const stockActual = rows[0].stock;

        if (cantidad > stockActual) {
            return res.status(400).json({
                message: `Solo hay ${stockActual} unidades disponibles`
            });
        }

        const nuevoStock = stockActual - cantidad;

        await pool.query(
            "UPDATE productos SET stock = ? WHERE id = ?",
            [nuevoStock, id]
        );

        res.json({
            ok: true,
            message: "Stock actualizado correctamente",
            nuevoStock
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar stock" });
    }
};


// =============================================================
// ELIMINAR LIBRO COMPLETO
// =============================================================
exports.eliminarLibro = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(
            "SELECT id FROM productos WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Libro no encontrado" });
        }

        await deleteBook(id);

        return res.json({
            ok: true,
            message: "Libro eliminado correctamente"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Error al eliminar libro"
        });
    }
};
