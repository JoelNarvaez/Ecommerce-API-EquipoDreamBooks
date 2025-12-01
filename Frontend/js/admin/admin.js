// --------------------------------------------------------
// ELEMENTOS GENERALES
// --------------------------------------------------------
const sidebar = document.querySelector('.sidebar');
const toggleBtn = document.getElementById('toggleBtn');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const pageTitle = document.getElementById('pageTitle');


// --------------------------------------------------------
// TOGGLE SIDEBAR
// --------------------------------------------------------
toggleBtn?.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
});


// --------------------------------------------------------
// NAVEGACIÓN ENTRE SECCIONES
// --------------------------------------------------------
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        const sectionId = link.dataset.section;

        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        sections.forEach(sec => sec.classList.remove('active'));

        link.closest('.nav-item')?.classList.add('active');
        document.getElementById(sectionId)?.classList.add('active');

        pageTitle.textContent = link.textContent.trim();

        // Cargar libros automáticamente cuando entras a Libros
        if (sectionId === "products") {
            fetchBooks(1, 8);
        }

        // Refrescar dashboard al entrar
        if (sectionId === "dashboard") {
            refrescarDashboard();
        }
    });
});

// Estado inicial
document.querySelector('.nav-item')?.classList.add('active');


// --------------------------------------------------------
// MENÚ DEL USUARIO
// --------------------------------------------------------
const userBtn = document.querySelector('.user-btn');
const dropdownMenu = document.querySelector('.dropdown-menu');

userBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
});

document.addEventListener('click', () => dropdownMenu.style.display = "none");


// --------------------------------------------------------
// MODAL DE AGREGAR LIBRO
// --------------------------------------------------------
const modalAddBook = document.getElementById("modal-add-book");
const openAddBookBtn = document.getElementById("open-add-book");
const closeAddBookBtn = document.getElementById("close-add-book");

openAddBookBtn?.addEventListener('click', () => {
    modalAddBook.classList.remove("hidden");
});

closeAddBookBtn?.addEventListener('click', () => {
    modalAddBook.classList.add("hidden");
});

modalAddBook?.addEventListener('click', (e) => {
    if (e.target === modalAddBook) {
        modalAddBook.classList.add("hidden");
    }
});


// --------------------------------------------------------
// DESPLEGAR REPORTE (LIBROS)
// --------------------------------------------------------
const librosCard = document.getElementById('stat-libros');
const dashboardReport = document.getElementById('dashboard-report');
const arrow = librosCard?.querySelector('.stat-arrow');

dashboardReport.classList.add('hidden');

librosCard.addEventListener('click', () => {
    const showing = dashboardReport.classList.contains('hidden');

    if (showing) {
        dashboardReport.classList.remove('hidden');
        dashboardReport.classList.add('show');
        arrow.classList.add('rotate');
    } else {
        dashboardReport.classList.remove('show');
        arrow.classList.remove('rotate');

        setTimeout(() => {
            dashboardReport.classList.add('hidden');
        }, 300);
    }
});


// --------------------------------------------------------
// CARGAR PEDIDOS TOTALES
// --------------------------------------------------------
async function cargarPedidosTotales() {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:3000/api/admin/pedidos", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await res.json();

        if (data.ok) {
            const total = data.pedidos.length;
            document.getElementById("total-pedidos").textContent = total;
        }
    } catch (error) {
        console.error("Error cargando pedidos:", error);
    }
}


// --------------------------------------------------------
// INGRESOS
// --------------------------------------------------------
async function fetchIngresos() {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://localhost:3000/api/admin/ingresos", {
            headers: { "Authorization": "Bearer " + token }
        });

        const data = await res.json();

        if (data.ok) {
            const ingresoFormato = Number(data.ingresos).toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN"
            });

            document.getElementById("total-ingresos").textContent = ingresoFormato;
        }
    } catch (error) {
        console.error("Error obteniendo ingresos:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    cargarPedidosTotales();
    fetchIngresos();
    generarGraficaPedidos();
    generarGraficaIngresos();
    generarGraficaExistencias();
});

// ===============================
//   GRÁFICA 1 — Pedidos Totales
// ===============================
async function generarGraficaPedidos() {
    const token = localStorage.getItem("token");
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
        colors: ["#000000ff"]
    };

    const chart = new ApexCharts(document.querySelector("#chart-pedidos"), opciones);
    chart.render();
}


// ===============================
//   GRÁFICA 2 — Ingresos Totales
// ===============================
async function generarGraficaIngresos() {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/admin/ingresos", {
        headers: { "Authorization": "Bearer " + token }
    });

    const data = await res.json();
    if (!data.ok) return;

    const ingresos = Number(data.ingresos);

    const opciones = {
        chart: { type: "area", height: 300 },
        series: [{
            name: "Ingresos",
            data: [ingresos]
        }],
        xaxis: { categories: ["Hoy"] },
        colors: ["#198754"]
    };

    const chart = new ApexCharts(document.querySelector("#chart-ingresos"), opciones);
    chart.render();
}


// =======================================
//   GRÁFICA 3 — Existencias por categoría
// =======================================
async function generarGraficaExistencias() {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/admin/reporte-existencias", {
        headers: { "Authorization": "Bearer " + token }
    });

    const data = await res.json();
    if (!data.ok) return;

    const categorias = data.categorias;

    const opciones = {
        chart: { type: "bar", height: 300 },
        series: [{
            name: "Existencias",
            data: [
                categorias["Romance"] || 0,
                categorias["Ciencia ficción"] || 0,
                categorias["Infantil"] || 0
            ]
        }],
        xaxis: {
            categories: ["Romance", "Ciencia Ficción", "Infantil"]
        },
        colors: ["#0d6efd", "#0d6efd", "#555"]
    };

    const chart = new ApexCharts(document.querySelector("#chart-existencias"), opciones);
    chart.render();
}


// --------------------------------------------------------
// ACTUALIZAR DASHBOARD COMPLETO
// --------------------------------------------------------
function refrescarDashboard() {
    cargarPedidosTotales();
    fetchIngresos();
}

// Cargar al inicio
document.addEventListener("DOMContentLoaded", () => {
    refrescarDashboard();
});

// Refrescar cada 4 segundos
setInterval(refrescarDashboard, 4000);
