// controllers/admin/booksAdmin.controller.js
const {
    getBooksPaginated,
    getBookById,
    addBook,
    updateBook,
    deleteBook,
    getReporteExistencias
} = require("../../models/modelLibros");

// ------------------------------------------------------------
// GET BOOKS (ADMIN)
// ------------------------------------------------------------
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

// ------------------------------------------------------------
// AGREGAR LIBRO
// ------------------------------------------------------------
exports.addBook = async (req, res) => {
    try {
        const data = {
            ...req.body,
            imagen: req.file ? req.file.filename : null
        };

        const nuevo = await addBook(data);

        res.json({
            ok: true,
            mensaje: "Libro agregado correctamente",
            libro: nuevo
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            mensaje: "Error al agregar libro"
        });
    }
};

// ------------------------------------------------------------
// OBTENER LIBRO POR ID
// ------------------------------------------------------------
exports.obtenerLibro = async (req, res) => {
    try {
        const libro = await getBookById(req.params.id);

        if (!libro) {
            return res.status(404).json({ ok: false, message: "Libro no encontrado" });
        }

        res.json({ ok: true, libro });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: "Error al obtener libro" });
    }
};

// ------------------------------------------------------------
// EDITAR LIBRO
// ------------------------------------------------------------
exports.editarLibro = async (req, res) => {
    try {
        const data = {
            ...req.body,
            imagen: req.file ? req.file.filename : undefined
        };

        await updateBook(req.params.id, data);

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

// ------------------------------------------------------------
// ELIMINAR STOCK
// ------------------------------------------------------------
exports.eliminarStock = async (req, res) => {
    try {
        const libro = await getBookById(req.params.id);

        if (!libro) {
            return res.status(404).json({ message: "Libro no encontrado" });
        }

        const cantidad = Number(req.body.cantidad);

        if (cantidad > libro.stock) {
            return res.status(400).json({
                message: `Solo hay ${libro.stock} unidades disponibles`
            });
        }

        await updateBook(req.params.id, { stock: libro.stock - cantidad });

        res.json({
            ok: true,
            message: "Stock actualizado correctamente",
            nuevoStock: libro.stock - cantidad
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar stock" });
    }
};

// ------------------------------------------------------------
// ELIMINAR LIBRO
// ------------------------------------------------------------
exports.eliminarLibro = async (req, res) => {
    try {
        const libro = await getBookById(req.params.id);

        if (!libro) {
            return res.status(404).json({ message: "Libro no encontrado" });
        }

        await deleteBook(req.params.id);

        res.json({
            ok: true,
            message: "Libro eliminado correctamente"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: "Error al eliminar libro"
        });
    }
};

// ------------------------------------------------------------
// REPORTE EXISTENCIAS
// ------------------------------------------------------------
exports.obtenerReporteExistencias = async (req, res) => {
    try {
        const reporte = await getReporteExistencias();
        res.json({ ok: true, categorias: reporte });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: "Error al obtener reporte" });
    }
};
