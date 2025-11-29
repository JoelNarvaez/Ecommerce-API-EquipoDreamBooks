// ===============================================================
// FUNCIONES PARA ACTUALIZAR REPORTE DE EXISTENCIAS SIN RECARGAR
// ===============================================================

// Función global reutilizable
async function actualizarReporteExistencias() {
  try {
    const res = await fetch("http://localhost:3000/api/admin/reporte-existencias");
    const data = await res.json();

    if (!data.ok) {
      console.error("Error en reporte:", data.message);
      return;
    }

    const categorias = data.categorias || {};

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
