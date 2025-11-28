const { getBooksPaginated } = require("../../models/modelLibros");

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