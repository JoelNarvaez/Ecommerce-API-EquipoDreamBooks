document.addEventListener("DOMContentLoaded", () => {
    const userInfo = document.getElementById("userInfo");
    const userNameSpan = document.getElementById("userName");
    const btnAcceder = document.getElementById("btnAcceder");
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");

    const userName = localStorage.getItem("userName");
    const token = localStorage.getItem("token");

    // Usuario logueado
    if (userName && token) {
        userInfo.style.display = "flex";       // mostrar ícono + nombre
        userNameSpan.textContent = userName;

        btnAcceder.style.display = "none";
        btnCerrarSesion.style.display = "inline-block";
    }
    // Usuario NO logueado
    else {
        userInfo.style.display = "none";

        btnAcceder.style.display = "inline-block";
        btnCerrarSesion.style.display = "none";
    }

    // Cerrar sesión
    btnCerrarSesion.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("usuarioActual");

   
    window.location.reload();
});

});
