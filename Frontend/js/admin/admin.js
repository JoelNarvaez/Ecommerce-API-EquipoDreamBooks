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

