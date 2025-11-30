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
            fetchBooks(1, 8); // Cargar libros automáticamente
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
// DESPLEGAR REPORTE DENTRO DEL PANEL (Libros)
// --------------------------------------------------------
// --- Mostrar / ocultar el reporte SOLO desde el card de Libros ---
// --------------------------------------------------------
// DESPLEGAR REPORTE DENTRO DEL PANEL (Libros)
// --------------------------------------------------------
// --- Mostrar / ocultar el reporte SOLO desde el card de Libros ---
const librosCard = document.getElementById('stat-libros');
const dashboardReport = document.getElementById('dashboard-report');
const arrow = librosCard?.querySelector('.stat-arrow');

// Ocultar al inicio
dashboardReport.classList.add('hidden');

librosCard.addEventListener('click', () => {
    
    // Alternar mostrar/ocultar
    const showing = dashboardReport.classList.contains('hidden');

    if (showing) {
        dashboardReport.classList.remove('hidden');
        dashboardReport.classList.add('show');
        arrow.classList.add('rotate');  // gira flecha
    } else {
        dashboardReport.classList.remove('show');
        arrow.classList.remove('rotate');  // regresa flecha

        setTimeout(() => {
            dashboardReport.classList.add('hidden');
        }, 300);
    }
});
