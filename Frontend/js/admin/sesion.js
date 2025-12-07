document.addEventListener("DOMContentLoaded", () => {

    const adminNameSpan = document.getElementById("adminName");
    const userBtn = document.querySelector(".user-btn");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    // ============================
    // DATOS DE SESIÓN
    // ============================
    const userName = localStorage.getItem("userName");
    const token = localStorage.getItem("token");

    // Si NO está logueado → Mandar al login
    if (!userName || !token) {
        window.location.href = "../pages/login.html";
        return;
    }

    // Mostrar nombre del usuario
    adminNameSpan.textContent = userName;


    // ============================
    // ABRIR / CERRAR DROPDOWN
    // ============================
    userBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Evita que se cierre al hacer click dentro
        dropdownMenu.classList.toggle("show");
    });

    // Cerrar dropdown si clic fuera
    document.addEventListener("click", () => {
        dropdownMenu.classList.remove("show");
    });


    // ============================
    // CERRAR SESIÓN
    // ============================
    const logoutBtn = dropdownMenu.querySelector("a");

    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userRole");
        localStorage.removeItem("usuarioActual");
        
        window.location.href = "../../pages/login.html";
    });

});
