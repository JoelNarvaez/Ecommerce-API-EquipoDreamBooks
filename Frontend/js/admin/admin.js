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

       if (sectionId === "products") {
    fetchBooks(1, 8);
}

if (sectionId === "dashboard") {
    refrescarDashboard();
}

// 💡 Al cambiar a la sección de gráficas, volver a dibujar las gráficas
if (sectionId === "analytics") {
    setTimeout(() => {
        generarGraficaPedidos();
        generarGraficaIngresos();
        generarGraficaExistencias();
    }, 100);
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

openAddBookBtn?.addEventListener('click', () => modalAddBook.classList.remove("hidden"));
closeAddBookBtn?.addEventListener('click', () => modalAddBook.classList.add("hidden"));

modalAddBook?.addEventListener('click', (e) => {
    if (e.target === modalAddBook) modalAddBook.classList.add("hidden");
});


// --------------------------------------------------------
// DESPLEGAR REPORTE (LIBROS)
// --------------------------------------------------------
const librosCard = document.getElementById('stat-libros');
const dashboardReport = document.getElementById('dashboard-report');
const arrowLibros = librosCard?.querySelector('.stat-arrow');

dashboardReport.classList.add('hidden');

librosCard.addEventListener('click', () => {
    const showing = dashboardReport.classList.contains('hidden');

    if (showing) {
        dashboardReport.classList.remove('hidden');
        dashboardReport.classList.add('show');
        arrowLibros.classList.add('rotate');
    } else {
        dashboardReport.classList.remove('show');
        arrowLibros.classList.remove('rotate');

        setTimeout(() => dashboardReport.classList.add('hidden'), 300);
    }
});


// --------------------------------------------------------
// DESPLEGAR REPORTE (INGRESOS)
// --------------------------------------------------------
const ingresosCard = document.getElementById("stat-ingresos");
const ingresosReport = document.getElementById("ingresos-report");
const arrowIngresos = ingresosCard?.querySelector(".stat-arrow");

ingresosReport.classList.add("hidden");

ingresosCard.addEventListener("click", () => {
    const showing = ingresosReport.classList.contains("hidden");

    if (showing) {
        ingresosReport.classList.remove("hidden");
        ingresosReport.classList.add("show");
        arrowIngresos.classList.add("rotate");
    } else {
        ingresosReport.classList.remove("show");
        arrowIngresos.classList.remove("rotate");

        setTimeout(() => ingresosReport.classList.add("hidden"), 300);
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
            document.getElementById("total-pedidos").textContent = data.pedidos.length;
        }
    } catch (error) {
        console.error("Error cargando pedidos:", error);
    }
}


// --------------------------------------------------------
// INGRESOS (TOTAL + DÍA + SEMANA + MES)
// --------------------------------------------------------
async function fetchIngresos() {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://localhost:3000/api/admin/ingresos", {
            headers: { "Authorization": "Bearer " + token }
        });

        const data = await res.json();
        if (!data.ok) return;

        const fmt = num =>
            Number(num).toLocaleString("es-MX", { style: "currency", currency: "MXN" });

        document.getElementById("total-ingresos").textContent = fmt(data.ingresos.total);
        document.getElementById("ingreso-dia").textContent = fmt(data.ingresos.dia);
        document.getElementById("ingreso-semana").textContent = fmt(data.ingresos.semana);
        document.getElementById("ingreso-mes").textContent = fmt(data.ingresos.mes);

    } catch (error) {
        console.error("Error obteniendo ingresos", error);
    }
}


// --------------------------------------------------------
// GRÁFICAS (pedidos / ingresos / existencias)
// --------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    cargarPedidosTotales();
    fetchIngresos();
    generarGraficaPedidos();
    generarGraficaIngresos();
    generarGraficaExistencias();
});

// ---- (Mismo código de gráficas que ya tenías sin cambios) ----


// --------------------------------------------------------
// ACTUALIZAR DASHBOARD COMPLETO
// --------------------------------------------------------
function refrescarDashboard() {
    cargarPedidosTotales();
    fetchIngresos();
    cargarLibrosTotales(); 
}

// Cargar al inicio
document.addEventListener("DOMContentLoaded", () => {
    refrescarDashboard();
    generarGraficaPedidos();
    generarGraficaIngresos();
    generarGraficaExistencias();
});
// Refrescar cada 4s
setInterval(refrescarDashboard, 4000);

if (sectionId === "analytics") {
    setTimeout(() => {
        generarGraficaPedidos();
        generarGraficaIngresos();
        generarGraficaExistencias();
    }, 150);
}