const db = require("../config/db");

// OBTENER LIBROS CON PAGINACIÓN + FILTROS + OFERTAS
async function getBooksPaginated(page = 1, limit = 10, categoria = "", search = "") {
    const offset = (page - 1) * limit;

    // --- 1. Construcción dinámica de filtros ---
    let filtros = [];
    let valores = [];

    // FILTRO DE CATEGORÍA + OFERTA
    if (categoria) {
        if (categoria === "oferta") {
            // Mostrar solo libros con oferta activa
            filtros.push("o.tipo IS NOT NULL");
        } else {
            filtros.push("p.categoria = ?");
            valores.push(categoria);
        }
    }

    // FILTRO DE BÚSQUEDA
    if (search) {
        filtros.push("(p.nombre LIKE ? OR p.autor LIKE ?)");
        valores.push(`%${search}%`);
        valores.push(`%${search}%`);
    }

    const whereSQL = filtros.length > 0 ? "WHERE " + filtros.join(" AND ") : "";

    // --- 2. Consulta principal con JOIN a ofertas ---
    const [books] = await db.query(
        `SELECT 
            p.*,
            o.tipo AS oferta_tipo,
            o.valor AS oferta_valor
        FROM productos p
        LEFT JOIN ofertas o 
            ON o.product_id = p.id 
            AND o.activa = 1
        ${whereSQL}
        LIMIT ? OFFSET ?`,
        [...valores, limit, offset]
    );

    // --- 3. Conteo total con los mismos filtros ---
    const [count] = await db.query(
        `SELECT COUNT(*) AS total
         FROM productos p
         LEFT JOIN ofertas o 
            ON o.product_id = p.id 
            AND o.activa = 1
         ${whereSQL}`,
        valores
    );

    return {
        page,
        limit,
        totalBooks: count[0].total,
        totalPages: Math.ceil(count[0].total / limit),
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
