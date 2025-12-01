// models/modelLibros.js
const db = require("../config/db");

// ---------------------------------------------------
// LIMPIAR CAMPOS (solo para creación)
// ---------------------------------------------------
function limpiarCamposLibro(data) {
    return {
        nombre: data.nombre || "",
        autor: data.autor || "",
        precio: data.precio || 0,
        categoria: data.categoria || "",
        stock: data.stock || 0,
        descripcion: data.descripcion || "",
        imagen: data.imagen || null,
        editorial: data.editorial || "",
        tipo_de_libro: data.tipo_de_libro || "",
        paginas: data.paginas || 0
    };
}

// ---------------------------------------------------
// OBTENER LIBRO POR ID
// ---------------------------------------------------
async function getBookById(id) {
    const [rows] = await db.query("SELECT * FROM productos WHERE id = ?", [id]);
    return rows[0] || null;
}

// ---------------------------------------------------
// PAGINADO BÁSICO (ADMIN)
// ---------------------------------------------------
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
        valores.push(`%${search}%`, `%${search}%`);
    }

    const whereSQL = filtros.length ? "WHERE " + filtros.join(" AND ") : "";

    const [books] = await db.query(`
        SELECT p.*, o.tipo AS oferta_tipo, o.valor AS oferta_valor
        FROM productos p
        LEFT JOIN ofertas o ON o.product_id = p.id AND o.activa = 1
        ${whereSQL}
        LIMIT ? OFFSET ?
    `, [...valores, limit, offset]);

    const [count] = await db.query(`
        SELECT COUNT(*) AS total
        FROM productos p
        LEFT JOIN ofertas o ON o.product_id = p.id AND o.activa = 1
        ${whereSQL}
    `, valores);

    return {
        page,
        limit,
        totalBooks: count[0].total,
        totalPages: Math.ceil(count[0].total / limit),
        books
    };
}

// ---------------------------------------------------
// PAGINADO AVANZADO (TIENDA)
// ---------------------------------------------------
async function getBooksPaginatedAdvanced(params) {
    const {
        page = 1,
        limit = 8,
        search = "",
        categoria = "",
        min = "",
        max = "",
        stock = "",
        orden = ""
    } = params;

    const _limit = Number(limit);
    const _offset = (Number(page) - 1) * _limit;

    let filtros = [];
    let valores = [];

    if (categoria) {
        const arr = categoria.split(",");
        const placeholders = arr.map(() => "p.categoria = ?").join(" OR ");
        filtros.push(`(${placeholders})`);
        valores.push(...arr);
    }

    if (search) {
        filtros.push("(p.nombre LIKE ? OR p.autor LIKE ?)");
        valores.push(`%${search}%`, `%${search}%`);
    }

    // PRECIO FINAL SQL
    const precioFinalSQL = `
        (
            CASE 
                WHEN o.tipo = 'porcentaje' THEN p.precio - (p.precio * (o.valor / 100))
                WHEN o.tipo = 'monto' THEN p.precio - o.valor
                ELSE p.precio
            END
        )
    `;

    if (min !== "") { filtros.push(`${precioFinalSQL} >= ?`); valores.push(min); }
    if (max !== "") { filtros.push(`${precioFinalSQL} <= ?`); valores.push(max); }

    if (stock === "disponible") filtros.push("p.stock > 0");
    if (stock === "agotado") filtros.push("(p.stock = 0 OR p.stock IS NULL)");

    if (orden === "ofertas") filtros.push("o.id IS NOT NULL");

    const whereSQL = filtros.length ? "WHERE " + filtros.join(" AND ") : "";

    let ordenSQL = "";
    switch (orden) {
        case "precioAsc": ordenSQL = "ORDER BY precio_final ASC"; break;
        case "precioDesc": ordenSQL = "ORDER BY precio_final DESC"; break;
        case "vendidos": ordenSQL = "ORDER BY p.vendidos DESC"; break;
        case "novedad": ordenSQL = "ORDER BY p.id DESC"; break;
        case "ofertas": ordenSQL = "ORDER BY o.valor DESC"; break;
        default: ordenSQL = "ORDER BY p.id DESC";
    }

    const [books] = await db.query(`
        SELECT
            p.*,
            o.tipo AS oferta_tipo,
            o.valor AS oferta_valor,
            ${precioFinalSQL} AS precio_final
        FROM productos p
        LEFT JOIN ofertas o ON o.product_id = p.id AND o.activa = 1
        ${whereSQL}
        ${ordenSQL}
        LIMIT ? OFFSET ?
    `, [...valores, _limit, _offset]);

    const [count] = await db.query(`
        SELECT COUNT(*) AS total
        FROM productos p
        LEFT JOIN ofertas o ON o.product_id = p.id AND o.activa = 1
        ${whereSQL}
    `, valores);

    return {
        page,
        limit: _limit,
        totalBooks: count[0].total,
        totalPages: Math.ceil(count[0].total / _limit),
        books
    };
}

// ---------------------------------------------------
// CREAR
// ---------------------------------------------------
async function addBook(data) {
    const clean = limpiarCamposLibro(data);
    const [result] = await db.query("INSERT INTO productos SET ?", clean);
    return { id: result.insertId, ...clean };
}

// ---------------------------------------------------
// ACTUALIZAR SIN BORRAR CAMPOS
// ---------------------------------------------------
async function updateBook(id, data) {
    const [rows] = await db.query("SELECT * FROM productos WHERE id = ?", [id]);
    if (!rows.length) return false;

    const actual = rows[0];

    const actualizado = {
        nombre: data.nombre ?? actual.nombre,
        autor: data.autor ?? actual.autor,
        precio: data.precio ?? actual.precio,
        categoria: data.categoria ?? actual.categoria,
        stock: data.stock ?? actual.stock,
        descripcion: data.descripcion ?? actual.descripcion,
        imagen: data.imagen !== undefined ? data.imagen : actual.imagen,
        editorial: data.editorial ?? actual.editorial,
        tipo_de_libro: data.tipo_de_libro ?? actual.tipo_de_libro,
        paginas: data.paginas ?? actual.paginas
    };

    await db.query("UPDATE productos SET ? WHERE id = ?", [actualizado, id]);
    return true;
}

// ---------------------------------------------------
// ELIMINAR LIBRO
// ---------------------------------------------------
async function deleteBook(id) {
    await db.query("DELETE FROM productos WHERE id = ?", [id]);
    return true;
}

// ---------------------------------------------------
// REPORTE EXISTENCIAS
// ---------------------------------------------------
async function getReporteExistencias() {
    const [rows] = await db.query(`
        SELECT categoria, SUM(stock) AS total_stock
        FROM productos GROUP BY categoria
    `);

    const reporte = {};
    rows.forEach(r => reporte[r.categoria] = r.total_stock);

    return reporte;
}

// =============================================================
// OBTENER NOVEDADES (Libros más recientes)
// =============================================================
async function getNovedades(limit = 20) {
    const [rows] = await db.query(`
        SELECT 
            p.*,
            o.tipo AS oferta_tipo,
            o.valor AS oferta_valor,
            (
                CASE 
                    WHEN o.tipo = 'porcentaje' THEN p.precio - (p.precio * (o.valor / 100))
                    WHEN o.tipo = 'monto' THEN p.precio - o.valor
                    ELSE p.precio
                END
            ) AS precio_final
        FROM productos p
        LEFT JOIN ofertas o ON o.product_id = p.id AND o.activa = 1
        ORDER BY p.fecha_creacion DESC
        LIMIT ?
    `, [limit]);

    return rows;
}


// =============================================================
// OBTENER OFERTAS (Libros que tienen descuento activo)
// =============================================================
async function getOfertas(limit = 30) {
    const [rows] = await db.query(`
        SELECT 
            p.*,
            o.tipo AS oferta_tipo,
            o.valor AS oferta_valor,
            (
                CASE 
                    WHEN o.tipo = 'porcentaje' THEN p.precio - (p.precio * (o.valor / 100))
                    WHEN o.tipo = 'monto' THEN p.precio - o.valor
                    ELSE p.precio
                END
            ) AS precio_final
        FROM productos p
        INNER JOIN ofertas o 
            ON o.product_id = p.id 
            AND o.activa = 1
        ORDER BY o.valor DESC
        LIMIT ?
    `, [limit]);

    return rows;
}

async function getCategoriasDB() {
    const [rows] = await db.query(`
        SELECT DISTINCT categoria
        FROM productos
        WHERE categoria IS NOT NULL AND categoria <> ''
        ORDER BY categoria ASC
    `);

    return rows.map(r => r.categoria);
}


module.exports = {
    getBookById,
    getBooksPaginated,
    getBooksPaginatedAdvanced,
    addBook,
    updateBook,
    deleteBook,
    getReporteExistencias,
    getNovedades,
    getOfertas,
    getCategoriasDB
};
