const db = require("../config/db");

// OBTENER LIBROS CON PAGINACIÓN + OFERTAS
async function getBooksPaginated(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    // 1. Libros con JOIN de ofertas activas
    const [books] = await db.query(
        `SELECT 
            p.*, 
            o.tipo AS oferta_tipo, 
            o.valor AS oferta_valor
        FROM productos p
        LEFT JOIN ofertas o 
            ON o.product_id = p.id
            AND o.activa = 1
        LIMIT ? OFFSET ?`,
        [limit, offset]
    );

    // 2. Total de libros (sin JOIN)
    const [count] = await db.query(
        "SELECT COUNT(*) AS total FROM productos"
    );

    const totalBooks = count[0].total;
    const totalPages = Math.ceil(totalBooks / limit);

    return {
        page,
        limit,
        totalBooks,
        totalPages,
        books,
    };
}

// OBTENER TODOS LOS LIBROS
async function getAllBooks() {
    const [results] = await db.query("SELECT * FROM productos");
    return results;
}

// AGREGAR UN LIBRO
async function addBook(data) {
    const [result] = await db.query("INSERT INTO productos SET ?", data);
    return { id: result.insertId, ...data };
}

// ACTUALIZAR UN LIBRO
async function updateBook(id, data) {
    await db.query("UPDATE productos SET ? WHERE id = ?", [data, id]);
    return true;
}

// ELIMINAR UN LIBRO
async function deleteBook(id) {
    await db.query("DELETE FROM productos WHERE id = ?", [id]);
    return true;
}

module.exports = {
    getAllBooks,
    addBook,
    updateBook,
    deleteBook,
    getBooksPaginated,
};
