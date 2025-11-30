const db = require("../config/db");

function limpiarCamposLibro(data) {
    return {
        nombre: data.nombre || null,
        autor: data.autor || null,
        precio: data.precio || null,
        categoria: data.categoria || null,
        stock: data.stock || 0,
        descripcion: data.descripcion || null,
        imagen: data.imagen || null,

        // 🔥 Nuevos campos
        editorial: data.editorial || null,
        tipo_de_libro: data.tipo_de_libro || null,
        paginas: data.paginas || null
    };
}

// OBTENER LIBROS CON PAGINACIÓN + FILTROS + OFERTAS
async function getBooksPaginated(page = 1, limit = 10, categoria = "", search = "") {
    const offset = (page - 1) * limit;

    let filtros = [];
    let valores = [];

    if (categoria) {
        if (categoria === "oferta") {
            filtros.push("o.tipo IS NOT NULL");
        } else {
            filtros.push("p.categoria = ?");
            valores.push(categoria);
        }
    }

    if (search) {
        filtros.push("(p.nombre LIKE ? OR p.autor LIKE ?)");
        valores.push(`%${search}%`);
        valores.push(`%${search}%`);
    }

    const whereSQL = filtros.length > 0 ? "WHERE " + filtros.join(" AND ") : "";

    const [books] = await db.query(
        `SELECT 
            p.*,
            o.tipo AS oferta_tipo,
            o.valor AS oferta_valor
        FROM productos p
        LEFT JOIN ofertas o 
            ON o.product_id = p.id AND o.activa = 1
        ${whereSQL}
        LIMIT ? OFFSET ?`,
        [...valores, limit, offset]
    );

    const [count] = await db.query(
        `SELECT COUNT(*) AS total
         FROM productos p
         LEFT JOIN ofertas o 
            ON o.product_id = p.id AND o.activa = 1
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
    const cleanData = limpiarCamposLibro(data);

    const [result] = await db.query("INSERT INTO productos SET ?", cleanData);
    return { id: result.insertId, ...cleanData };
}

// ACTUALIZAR UN LIBRO
async function updateBook(id, data) {
    const cleanData = limpiarCamposLibro(data);

    await db.query("UPDATE productos SET ? WHERE id = ?", [cleanData, id]);
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
