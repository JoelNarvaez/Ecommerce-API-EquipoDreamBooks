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

        if (sectionId === "products") fetchBooks(1, 8);
        if (sectionId === "dashboard") refrescarDashboard();

        if (sectionId === "analytics") {
            setTimeout(() => {
                generarGraficaPedidos();
                generarGraficaIngresos();
                generarGraficaExistencias();
            }, 150);
        }
    });
});

// Estado inicial
document.querySelector('.nav-item')?.classList.add('active');

// --------------------------------------------------------
// MENÚ DE USUARIO
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
// CATEGORÍAS PARA FILTRO DE LIBROS
// --------------------------------------------------------
async function cargarCategoriasSelect() {
    try {
        const res = await fetch("http://localhost:3000/api/products/categorias");
        const data = await res.json();

        if (!data.ok) return;

        const select = document.getElementById("filter-category");
        if (!select) return;

        select.innerHTML = `<option value="">Todas</option>`;

        data.categorias.forEach(cat => {
            select.innerHTML += `<option value="${cat}">${cat}</option>`;
        });

    } catch (error) {
        console.error("Error cargando categorías:", error);
    }
}

// ===============================================================
// FUNCIONES AUXILIARES PARA COLORES DINÁMICOS
// ===============================================================
function generarColorDesdeTexto(texto) {
    let hash = 0;

    for (let i = 0; i < texto.length; i++) {
        hash = texto.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (let i = 0; i < 3; i++) {
        let value = (hash >> (i * 8)) & 0xFF;
        color += ("00" + value.toString(16)).substr(-2);
    }

    return color;
}

function generarDegradado(colorBase) {
    return `linear-gradient(135deg, ${colorBase}, ${colorBase}dd)`;
}

// ===============================================================
// REPORTE DE LIBROS — TARJETAS
// ===============================================================
async function cargarLibrosTotales() {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:3000/api/admin/reporte-existencias", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await res.json();

        if (!data.ok || !data.categorias) {
            console.error("Error en reporte:", data.message);
            return;
        }

        let categorias = data.categorias;

        if (Array.isArray(categorias)) {
            categorias = Object.fromEntries(
                categorias.map(c => [c.nombre, c.cantidad])
            );
        }

        const totalLibros = Object.values(categorias)
            .reduce((acc, cant) => acc + Number(cant || 0), 0);

        const totalLibrosEl = document.getElementById("total-libros");
        if (totalLibrosEl) totalLibrosEl.textContent = totalLibros;

        const contenedor = document.getElementById("dashboard-report");
        if (!contenedor) return;

        contenedor.innerHTML = `
            <h2 class="titulo-reporte">📊 Existencias por Categoría</h2>
            <div class="categorias-grid"></div>
        `;

        const grid = contenedor.querySelector(".categorias-grid");

        let delay = 0;

        Object.entries(categorias).forEach(([nombre, cantidad]) => {

            cantidad = Number(cantidad) || 0;

            const porcentaje = totalLibros > 0
                ? ((cantidad / totalLibros) * 100).toFixed(1)
                : 0;

            const colorBase = generarColorDesdeTexto(nombre);
            const gradiente = generarDegradado(colorBase);

            const card = document.createElement("div");
            card.className = "categoria-card fadeInCard";
            card.style.animationDelay = `${delay}s`;

            card.innerHTML = `
                <div class="categoria-color" style="background:${gradiente};"></div>

                <div class="categoria-info">
                    <h3>${nombre}</h3>
                    <p>${cantidad} libros • <strong>${porcentaje}%</strong></p>

                    <div class="progress-bar">
                        <div class="progress-fill"
                             style="width: ${porcentaje}%; background:${colorBase};"></div>
                    </div>
                </div>

                <div class="categoria-icon">
                    <i class="bi bi-book-half"></i>
                </div>
            `;

            grid.appendChild(card);
            delay += 0.06;
        });

    } catch (err) {
        console.error("Error en reporte dinámico:", err);
    }
}

// --------------------------------------------------------
// REPORTE DE LIBROS — DESPLEGABLE
// --------------------------------------------------------
const librosCard = document.getElementById('stat-libros');
const dashboardReport = document.getElementById('dashboard-report');
const arrowLibros = librosCard?.querySelector('.stat-arrow');

if (dashboardReport) dashboardReport.classList.add('hidden');

if (librosCard && dashboardReport && arrowLibros) {
    librosCard.addEventListener('click', async () => {
        const showing = dashboardReport.classList.contains('hidden');

        if (showing) {
            await cargarLibrosTotales();
            dashboardReport.classList.remove('hidden');
            dashboardReport.classList.add('show');
            arrowLibros.classList.add('rotate');
        } else {
            dashboardReport.classList.remove('show');
            arrowLibros.classList.remove('rotate');
            setTimeout(() => dashboardReport.classList.add('hidden'), 300);
        }
    });
}

// --------------------------------------------------------
// PEDIDOS TOTALES + DESGLOSE
// --------------------------------------------------------
async function cargarPedidosTotales() {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:3000/api/admin/pedidos", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await res.json();
        if (!data.ok) return;

        const pedidos = data.pedidos || [];

        const totalPedidosEl = document.getElementById("total-pedidos");
        if (totalPedidosEl) totalPedidosEl.textContent = pedidos.length;

        renderDesglosePedidos(pedidos);

    } catch (error) {
        console.error("Error cargando pedidos:", error);
    }
}

function renderDesglosePedidos(pedidos) {
    const resumenDiv = document.getElementById("pedidos-resumen");
    const tbody = document.getElementById("pedidos-body");

    if (!resumenDiv || !tbody) return;

    const totalMonto = pedidos.reduce((acc, p) => acc + Number(p.total || 0), 0);

    const porEstado = pedidos.reduce((acc, p) => {
        const estado = p.estado || "Sin estado";
        acc[estado] = (acc[estado] || 0) + 1;
        return acc;
    }, {});

    resumenDiv.innerHTML = `
        <div class="resumen-box">
            <h4>Total de pedidos</h4>
            <p>${pedidos.length}</p>
        </div>
        <div class="resumen-box">
            <h4>Ventas totales</h4>
            <p>$${totalMonto.toFixed(2)}</p>
        </div>
        <div class="resumen-box">
            <h4>Por estado</h4>
            ${Object.entries(porEstado).map(([e, c]) => `<p>${e}: ${c}</p>`).join("")}
        </div>
    `;

    tbody.innerHTML = "";

    pedidos.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${p.id}</td>
            <td>${p.usuario || "—"}</td>
            <td>$${Number(p.total).toFixed(2)}</td>
            <td>${p.estado || "—"}</td>
            <td>${new Date(p.creado_en).toLocaleString()}</td>
        `;
        tbody.appendChild(tr);

        if (p.productos && p.productos.length > 0) {
            p.productos.forEach(prod => {
                const trProd = document.createElement("tr");
                trProd.classList.add("pedido-producto-row");

                trProd.innerHTML = `
                    <td></td>
                    <td class="prod-info">
                        <i class="bi bi-book-half prod-icon"></i>
                        <span class="prod-name">${prod.nombre}</span>
                    </td>
                    <td class="prod-cant">x${prod.cantidad}</td>
                    <td class="prod-precio">$${Number(prod.precio_unitario).toFixed(2)}</td>
                    <td></td>
                `;
                tbody.appendChild(trProd);
            });
        }
    });
}

// --------------------------------------------------------
// PANEL DESPLEGABLE: PEDIDOS 👇 (MEJORADO)
// --------------------------------------------------------
const statPedidosCard = document.getElementById("stat-pedidos");
const panelPedidos = document.getElementById("panel-pedidos");
const arrowPedidos = statPedidosCard?.querySelector(".stat-arrow");

if (panelPedidos) panelPedidos.classList.add("hidden");

if (statPedidosCard && panelPedidos && arrowPedidos) {
    statPedidosCard.addEventListener("click", () => {
        const showing = panelPedidos.classList.contains("hidden");

        if (showing) {
            panelPedidos.classList.remove("hidden");
            panelPedidos.classList.add("show");
            arrowPedidos.classList.add("rotate");
        } else {
            panelPedidos.classList.remove("show");
            arrowPedidos.classList.remove("rotate");
            setTimeout(() => panelPedidos.classList.add("hidden"), 250);
        }
    });
}

// --------------------------------------------------------
// INGRESOS (tarjeta y mini-cards)
// --------------------------------------------------------
async function fetchIngresos() {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://localhost:3000/api/admin/ingresos", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await res.json();
        if (!data.ok) return;

        const fmt =
            num => Number(num).toLocaleString("es-MX", { style: "currency", currency: "MXN" });

        const info = data.ingresos || {};

        const totalEl = document.getElementById("total-ingresos");
        const diaEl = document.getElementById("ingreso-dia");
        const semanaEl = document.getElementById("ingreso-semana");
        const mesEl = document.getElementById("ingreso-mes");

        if (totalEl) totalEl.textContent = fmt(info.total || 0);
        if (diaEl) diaEl.textContent = fmt(info.dia || 0);
        if (semanaEl) semanaEl.textContent = fmt(info.semana || 0);
        if (mesEl) mesEl.textContent = fmt(info.mes || 0);

    } catch (error) {
        console.error("Error obteniendo ingresos", error);
    }
}

// --------------------------------------------------------
// PANEL INGRESOS DESPLEGABLE
// --------------------------------------------------------
const ingresosCard = document.getElementById("stat-ingresos");
const ingresosReport = document.getElementById("ingresos-report");
const arrowIngresos = ingresosCard?.querySelector(".stat-arrow");

if (ingresosReport) ingresosReport.classList.add("hidden");

if (ingresosCard && ingresosReport && arrowIngresos) {
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
}

// --------------------------------------------------------
// ACTUALIZACIÓN PERIÓDICA DEL DASHBOARD
// --------------------------------------------------------
function refrescarDashboard() {
    cargarPedidosTotales();
    fetchIngresos();
    cargarLibrosTotales();
}

// --------------------------------------------------------
// INICIALIZACIÓN GENERAL
// --------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    cargarCategoriasSelect();
    fetchBooks(1, 10);
    refrescarDashboard();
});

setInterval(refrescarDashboard, 4000);
