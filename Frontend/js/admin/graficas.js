/* ============================================================
   GRÁFICA 1 — Pedidos Totales
============================================================ */
let chartPedidos = null;

async function generarGraficaPedidos() {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://localhost:3000/api/admin/pedidos", {
            headers: { "Authorization": "Bearer " + token }
        });

        const data = await res.json();
        if (!data.ok) return;

        const totalPedidos = data.pedidos.length;

        const opciones = {
            chart: { type: "radialBar", height: 300 },
            series: [totalPedidos],
            labels: ["Pedidos Totales"],
            colors: ["#000"],
        };

        // 🔥 eliminar gráfica anterior SIN bug de duplicado
        if (chartPedidos) chartPedidos.destroy();

        chartPedidos = new ApexCharts(
            document.querySelector("#chart-pedidos"),
            opciones
        );

        chartPedidos.render();

    } catch (error) {
        console.error("Error generando gráfica de pedidos:", error);
    }
}


/* ============================================================
   GRÁFICA 2 — Ingresos Totales
============================================================ */
let chartIngresos = null;

async function generarGraficaIngresos() {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://localhost:3000/api/admin/ingresos", {
            headers: { "Authorization": "Bearer " + token }
        });

        const data = await res.json();
        if (!data.ok) return;

        const ingresos = Number(data.ingresos.total);

        const opciones = {
            chart: { type: "area", height: 300 },
            series: [
                { name: "Ingresos", data: [ingresos] }
            ],
            xaxis: { categories: ["Hoy"] },
            colors: ["#0f9d58"]
        };

        if (chartIngresos) chartIngresos.destroy();

        chartIngresos = new ApexCharts(
            document.querySelector("#chart-ingresos"),
            opciones
        );

        chartIngresos.render();

    } catch (error) {
        console.error("Error generando gráfica de ingresos:", error);
    }
}


/* ============================================================
   GRÁFICA 3 — Existencias por categoría
============================================================ */
let chartExistencias = null;

async function generarGraficaExistencias() {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://localhost:3000/api/admin/reporte-existencias", {
            headers: { "Authorization": "Bearer " + token }
        });

        const data = await res.json();
        if (!data.ok) return;

        const categorias = data.categorias;

        const opciones = {
            chart: { type: "bar", height: 300 },
            series: [
                {
                    name: "Stock",
                    data: [
                        categorias["Romance"] || 0,
                        categorias["Ciencia ficción"] || 0,
                        categorias["Infantil"] || 0
                    ]
                }
            ],
            xaxis: {
                categories: ["Romance", "Ciencia Ficción", "Infantil"]
            },
            colors: ["#0d6efd", "#0d6efd", "#ffc107"]
        };

        if (chartExistencias) chartExistencias.destroy();

        chartExistencias = new ApexCharts(
            document.querySelector("#chart-existencias"),
            opciones
        );

        chartExistencias.render();

    } catch (error) {
        console.error("Error generando gráfica de existencias:", error);
    }
}
