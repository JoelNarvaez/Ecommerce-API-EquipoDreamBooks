// models/orderModel.js
const db = require("../config/db");

/* ============================================================
    🟦 1. CREAR PEDIDO PRINCIPAL (NUEVA LÓGICA)
   ============================================================ */
async function crearPedidoDB(usuarioId, total) {
    const [pedido] = await db.query(`
        INSERT INTO pedidos (usuario_id, total, estado)
        VALUES (?, ?, 'completado')
    `, [usuarioId, total]);

    return pedido.insertId;
}

/* ============================================================
    🟦 2. CREAR DETALLE DE PEDIDO
   ============================================================ */
async function crearPedidoDetalleDB(pedidoId, productoId, cantidad, precioUnitario) {
    await db.query(`
        INSERT INTO pedido_detalles (pedido_id, producto_id, cantidad, precio_unitario)
        VALUES (?, ?, ?, ?)
    `, [pedidoId, productoId, cantidad, precioUnitario]);
}

/* ============================================================
    🟦 3. DESCONTAR STOCK DESPUÉS DE UNA COMPRA
   ============================================================ */
async function descontarStockDB(productoId, cantidad) {
    await db.query(`
        UPDATE productos
        SET stock = stock - ?
        WHERE id = ?
    `, [cantidad, productoId]);
}

/* ============================================================
    🟦 4. MARCAR CUPÓN COMO USADO
   ============================================================ */
async function marcarCuponDB(codigo) {
    await db.query(`
        UPDATE cupones
        SET Activo = 0
        WHERE Codigo = ?
    `, [codigo]);
}

/* ============================================================
    🟦 5. FUNCIONES ANTIGUAS (NO SE ELIMINAN PARA NO ROMPER RUTAS)
       - crearPedido
       - agregarDetalle
   ============================================================ */
async function crearPedido(usuarioId, total) {
    const [result] = await db.query(
        `INSERT INTO pedidos (usuario_id, total) VALUES (?, ?)`,
        [usuarioId, total]
    );
    return result.insertId;
}

async function agregarDetalle(pedidoId, productoId, cantidad, precio) {
    await db.query(`
        INSERT INTO pedido_detalles (pedido_id, producto_id, cantidad, precio_unitario)
        VALUES (?, ?, ?, ?)
    `, [pedidoId, productoId, cantidad, precio]);
}

/* ============================================================
    🟦 6. OBTENER LISTA COMPLETA DE PEDIDOS
   ============================================================ */
async function obtenerPedidos() {
    const [rows] = await db.query(`
        SELECT 
            p.id              AS pedido_id,
            u.nombre          AS usuario,
            p.total           AS total,
            p.estado          AS estado,
            p.creado_en       AS creado_en,

            d.producto_id     AS producto_id,
            d.cantidad        AS cantidad,
            d.precio_unitario AS precio_unitario,

            pr.nombre         AS producto_nombre
        FROM pedidos p
        LEFT JOIN usuarios u        ON u.id = p.usuario_id
        LEFT JOIN pedido_detalles d ON d.pedido_id = p.id
        LEFT JOIN productos pr      ON pr.id = d.producto_id
        ORDER BY p.id DESC
    `);

    // Convertir filas planas → pedidos agrupados
    const pedidosMap = {};

    rows.forEach(r => {
        if (!pedidosMap[r.pedido_id]) {
            pedidosMap[r.pedido_id] = {
                id: r.pedido_id,
                usuario: r.usuario,
                total: r.total,
                estado: r.estado,
                creado_en: r.creado_en,
                productos: []
            };
        }

        if (r.producto_id) {
            pedidosMap[r.pedido_id].productos.push({
                producto_id: r.producto_id,
                nombre: r.producto_nombre,
                cantidad: r.cantidad,
                precio_unitario: r.precio_unitario
            });
        }
    });

    return Object.values(pedidosMap);
}

/* ============================================================
    🟦 7. OBTENER DETALLES DE UN PEDIDO POR ID
   ============================================================ */
async function obtenerPedidoDetalles(id) {
    const [rows] = await db.query(`
        SELECT d.*, pr.nombre
        FROM pedido_detalles d
        LEFT JOIN productos pr ON pr.id = d.producto_id
        WHERE d.pedido_id = ?
    `, [id]);

    return rows;
}

async function obtenerPedido(id) {
    const [rows] = await db.query(`
        SELECT *
        FROM pedidos where Id = ?
    `, [id]);

    return rows[0];
}

/* ============================================================
    🟦 8. MÉTRICAS DE INGRESOS
   ============================================================ */

// Total acumulado
async function obtenerIngresosTotales() {
    const [rows] = await db.query(`
        SELECT IFNULL(SUM(total), 0) AS total
        FROM pedidos
    `);
    return Number(rows[0].total);
}

// Ingresos de hoy
async function obtenerIngresosDia() {
    const [rows] = await db.query(`
        SELECT IFNULL(SUM(total), 0) AS dia
        FROM pedidos
        WHERE DATE(creado_en) = CURDATE()
    `);
    return Number(rows[0].dia);
}

// Ingresos de la semana
async function obtenerIngresosSemana() {
    const [rows] = await db.query(`
        SELECT IFNULL(SUM(total), 0) AS semana
        FROM pedidos
        WHERE YEARWEEK(creado_en, 1) = YEARWEEK(CURDATE(), 1)
    `);
    return Number(rows[0].semana);
}

// Ingresos del mes
async function obtenerIngresosMes() {
    const [rows] = await db.query(`
        SELECT IFNULL(SUM(total), 0) AS mes
        FROM pedidos
        WHERE YEAR(creado_en) = YEAR(CURDATE())
        AND MONTH(creado_en) = MONTH(CURDATE())
    `);
    return Number(rows[0].mes);
}

// Historial diario del mes
async function obtenerHistorialDiarioMes() {
    const [rows] = await db.query(`
        SELECT 
            DAY(creado_en) AS dia,
            SUM(total)     AS total
        FROM pedidos
        WHERE creado_en >= DATE_FORMAT(NOW(), '%Y-%m-01')
        AND creado_en < DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 1 MONTH), '%Y-%m-01')
        GROUP BY dia
        ORDER BY dia ASC
    `);

    return rows;
}

/* ============================================================
    🟦 EXPORTAR TODAS LAS FUNCIONES
   ============================================================ */
module.exports = {
    // NUEVA LÓGICA
    crearPedidoDB,
    crearPedidoDetalleDB,
    descontarStockDB,
    marcarCuponDB,

    // LÓGICA ANTIGUA (NO BORRAR)
    crearPedido,
    agregarDetalle,

    // CONSULTAS DE PEDIDOS
    obtenerPedidos,
    obtenerPedidoDetalles,
    obtenerPedido,

    // MÉTRICAS
    obtenerIngresosTotales,
    obtenerIngresosDia,
    obtenerIngresosSemana,
    obtenerIngresosMes,
    obtenerHistorialDiarioMes
};
