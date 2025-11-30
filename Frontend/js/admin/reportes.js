// ===============================================================
// FUNCIONES PARA ACTUALIZAR REPORTE DE EXISTENCIAS SIN RECARGAR
// ===============================================================

// Función global reutilizable
async function actualizarReporteExistencias() {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/api/admin/reporte-existencias", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      console.error("Error en reporte:", data.message || "Token inválido");
      return;
    }

    const categorias = data.categorias || {};

    // Actualizar indicadores del dashboard
    document.getElementById("stock-romance").textContent =
      categorias["Romance"] ?? 0;

    document.getElementById("stock-scifi").textContent =
      categorias["Ciencia ficción"] ?? 0;

    document.getElementById("stock-infantil").textContent =
      categorias["Infantil"] ?? 0;

  } catch (err) {
    console.error("Error cargando reporte:", err);
  }
}

// Ejecutar automáticamente al cargar la página
document.addEventListener("DOMContentLoaded", actualizarReporteExistencias);
