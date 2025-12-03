/* ========================================================================
   GRAFICA 1 — PEDIDOS TOTALES
======================================================================== */
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

        if (chartPedidos) chartPedidos.destroy();

        chartPedidos = new ApexCharts(
            document.querySelector("#chart-pedidos"),
            opciones
        );

        chartPedidos.render();

        actualizarKpiPedidos(totalPedidos);

    } catch (error) {
        console.error("Error generando gráfica de pedidos:", error);
    }
}

function actualizarKpiPedidos(total) {
    document.getElementById("kpi-ped-prom").textContent =
        Math.max(1, Math.round(total / 7)) + " por día";

    const trendEl = document.getElementById("kpi-ped-trend");
    trendEl.textContent = total >= 15 ? "↑ Subiendo" : "↓ Estable";
    trendEl.className = total >= 15 ? "kpi-up" : "kpi-down";
}


/* ========================================================================
   GRAFICA 2 — INGRESOS (REAL CON PROMEDIO Y TENDENCIA)
======================================================================== */
let chartIngresos = null;

async function generarGraficaIngresos() {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://localhost:3000/api/admin/ingresos", {
            headers: { "Authorization": "Bearer " + token }
        });

        const data = await res.json();
        if (!data.ok) return;

        const info = data.ingresos || {};

        // Historial REAL del backend
        const historial = Array.isArray(info.historial)
            ? info.historial
            : [];

        // Construir series correctamente
        const serie = historial.length
            ? historial.map(r => Number(r.total))
            : [0];

        const categorias = historial.length
            ? historial.map(r => `Día ${r.dia}`)
            : ["Sin datos"];

        const promedio = info.promedio || 0;
        const tendencia = info.tendencia || 0;

        const opciones = {
            chart: { type: "area", height: 300 },
            series: [{
                name: "Ingresos del mes",
                data: serie
            }],
            xaxis: { categories },
            colors: ["#0f9d58"],
            stroke: { width: 3 },
            fill: {
                type: "gradient",
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.4,
                    opacityTo: 0.1
                }
            }
        };

        if (chartIngresos) chartIngresos.destroy();

        chartIngresos = new ApexCharts(
            document.querySelector("#chart-ingresos"),
            opciones
        );

        chartIngresos.render();

        actualizarKpiIngresos(promedio, tendencia);

    } catch (error) {
        console.error("Error generando gráfica de ingresos:", error);
    }
}

function actualizarKpiIngresos(promedio, tendencia) {
    const promEl = document.getElementById("kpi-ing-prom");
    const trendEl = document.getElementById("kpi-ing-trend");

    promEl.textContent = "$" + promedio.toFixed(2);

    if (tendencia >= 0) {
        trendEl.textContent = `↑ +$${tendencia.toFixed(2)}`;
        trendEl.className = "kpi-up";
    } else {
        trendEl.textContent = `↓ $${tendencia.toFixed(2)}`;
        trendEl.className = "kpi-down";
    }
}



/* ========================================================================
   GRAFICA 3 — EXISTENCIAS POR CATEGORÍA (DINÁMICA)
======================================================================== */
let chartExistencias = null;

async function generarGraficaExistencias() {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://localhost:3000/api/admin/reporte-existencias", {
            headers: { "Authorization": "Bearer " + token }
        });

        const data = await res.json();
        if (!data.ok) return;

        const categoriasObj = data.categorias || {};

        const categorias = Object.keys(categoriasObj);
        const valores = Object.values(categoriasObj).map(v => Number(v));

        // Si no hay categorías, mostrar mensaje y limpiar KPIs
        if (!categorias.length) {
            if (chartExistencias) chartExistencias.destroy();
            document.getElementById("kpi-stock-max").textContent = "—";
            document.getElementById("kpi-stock-total").textContent = "—";
            return;
        }

        const opciones = {
            chart: { type: "bar", height: 320 },
            series: [{ name: "Stock", data: valores }],
            xaxis: { categories: categorias },
            colors: ["#4a90e2"],
            plotOptions: {
                bar: {
                    borderRadius: 6,
                    distributed: true
                }
            },
            dataLabels: { enabled: true }
        };

        if (chartExistencias) chartExistencias.destroy();

        chartExistencias = new ApexCharts(
            document.querySelector("#chart-existencias"),
            opciones
        );

        chartExistencias.render();

        actualizarKpiExistencias(categoriasObj);

    } catch (error) {
        console.error("Error generando gráfica de existencias:", error);
    }
}

/* ========================================================================
   KPI — EXISTENCIAS (SEGURO, SIN CRASHEAR)
======================================================================== */
function actualizarKpiExistencias(categoriasObj) {
    const entries = Object.entries(categoriasObj);

    if (!entries.length) {
        document.getElementById("kpi-stock-max").textContent = "—";
        document.getElementById("kpi-stock-total").textContent = "—";
        return;
    }

    const ordenadas = entries
        .slice() // copia
        .sort((a, b) => Number(b[1]) - Number(a[1]));

    const mayor = ordenadas[0];

    document.getElementById("kpi-stock-max").textContent =
        `${mayor[0]} (${mayor[1]})`;

    const total = entries.reduce((sum, [, val]) => sum + Number(val), 0);

    document.getElementById("kpi-stock-total").textContent = total;
}



/* ========================================================================
   INICIALIZAR TODO
======================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    generarGraficaPedidos();
    generarGraficaIngresos();
    generarGraficaExistencias();
});
