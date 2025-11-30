const db = require("../config/db");

async function getBooksPaginatedAdvanced({
    page = 1,
    limit = 8,
    search = "",
    categoria = "",
    min = "",
    max = "",
    stock = "",
    orden = ""
}) {

    const _limit = Number(limit);
    const _offset = (Number(page) - 1) * _limit;

    let filtros = [];
    let valores = [];

    // filtrado por categoría
    if (categoria) {
        const arr = categoria.split(",");
        const placeholders = arr.map(() => "p.categoria = ?").join(" OR ");
        filtros.push(`(${placeholders})`);
        valores.push(...arr);
    }

    // busqueda por nombre o autor
    if (search) {
        filtros.push("(p.nombre LIKE ? OR p.autor LIKE ?)");
        valores.push(`%${search}%`, `%${search}%`);
    }

    // filtrado por precio
    const precioFinalSQL = `
        (
            CASE 
                WHEN o.tipo = 'porcentaje' THEN p.precio - (p.precio * (o.valor / 100))
                WHEN o.tipo = 'monto' THEN p.precio - o.valor
                ELSE p.precio
            END
        )
    `;

    if (min !== "") {
        filtros.push(`${precioFinalSQL} >= ?`);
        valores.push(min);
    }

    if (max !== "") {
        filtros.push(`${precioFinalSQL} <= ?`);
        valores.push(max);
    }

    // stock
    if (stock === "disponible") {
        filtros.push("p.stock > 0");
    } else if (stock === "agotado") {
        filtros.push("(p.stock = 0 OR p.stock IS NULL)");
    }

    // ofertas
    if (orden === "ofertas") {
        filtros.push("o.id IS NOT NULL");
    }

    const whereSQL = filtros.length ? "WHERE " + filtros.join(" AND ") : "";

    // ordenamientos
    let ordenSQL = "";
    switch (orden) {
        case "precioAsc":
            ordenSQL = "ORDER BY precio_final ASC";
            break;
        case "precioDesc":
            ordenSQL = "ORDER BY precio_final DESC";
            break;
        case "vendidos":
            ordenSQL = "ORDER BY p.vendidos DESC";
            break;
        case "novedad":
            ordenSQL = "ORDER BY p.id DESC";
            break;
        case "ofertas":
            ordenSQL = "ORDER BY o.valor DESC";
            break;
        default:
            ordenSQL = "ORDER BY p.id DESC";
    }

    // consulta principal
    const [books] = await db.query(
        `
        SELECT
            p.*,
            o.tipo AS oferta_tipo,
            o.valor AS oferta_valor,

            CASE 
                WHEN o.tipo = 'porcentaje' THEN p.precio - (p.precio * (o.valor / 100))
                WHEN o.tipo = 'monto' THEN p.precio - o.valor
                ELSE p.precio
            END AS precio_final

        FROM productos p
        LEFT JOIN ofertas o
            ON o.product_id = p.id AND o.activa = 1

        ${whereSQL}
        ${ordenSQL}
        LIMIT ? OFFSET ?
        `,
        [...valores, _limit, _offset]
    );

    // conteo total
    const [count] = await db.query(
        `
        SELECT COUNT(*) AS total
        FROM productos p
        LEFT JOIN ofertas o
            ON o.product_id = p.id AND o.activa = 1
        ${whereSQL}
        `,
        valores
    );

    return {
        page,
        limit: _limit,
        totalBooks: count[0].total,
        totalPages: Math.ceil(count[0].total / _limit),
        books
    };
}


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
    getBooksPaginatedAdvanced
};
