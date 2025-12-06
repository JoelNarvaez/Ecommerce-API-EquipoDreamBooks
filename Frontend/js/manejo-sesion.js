

// manejo-sesion.js
document.addEventListener("DOMContentLoaded", () => {

  // ============================
  // Determinar la "base" según la ubicación del HTML
  // ============================
  const base = window.location.pathname.includes("/pages/") ? "../" : "";

  // ============================
  // Elementos del DOM
  // ============================
  const userInfo = document.getElementById("userInfo");
  const userNameSpan = document.getElementById("userName");
  const btnAcceder = document.getElementById("btnAcceder");
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");

  // ============================
  // Mostrar usuario logueado
  // ============================
  const userName = localStorage.getItem("userName");
  const token = localStorage.getItem("token");

  if (userName && token) {
    // Mostrar info del usuario
    if (userInfo) userInfo.style.display = "flex";
    if (userNameSpan) userNameSpan.textContent = userName;

    if (btnAcceder) btnAcceder.style.display = "none";
    if (btnCerrarSesion) btnCerrarSesion.style.display = "inline-block";

    // Ajustar imagen del usuario si existe
    if (userInfo) {
      const img = userInfo.querySelector("img");
      if (img) img.src = base + "imagenes/usuario-icono.png";
    }
  } else {
    // Usuario NO logueado
    if (userInfo) userInfo.style.display = "none";
    if (btnAcceder) btnAcceder.style.display = "inline-block";
    if (btnCerrarSesion) btnCerrarSesion.style.display = "none";
  }

  // ============================
  // Cerrar sesión
  // ============================
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("userRole");
      localStorage.removeItem("usuarioActual");

      // Redirigir al login
      window.location.href = base + "pages/login.html";
    });
  }
});


