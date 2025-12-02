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

async function cargarLibrosTotales() {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://localhost:3000/api/admin/books?page=1&limit=1", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await res.json();

        console.log("📚 Respuesta libros:", data);

        if (data.totalBooks !== undefined) {
            document.getElementById("total-libros").textContent = data.totalBooks;
        } 
        else if (Array.isArray(data.books)) { 
            // fallback por si cambia algo
            document.getElementById("total-libros").textContent = data.books.length;
        }
        else {
            document.getElementById("total-libros").textContent = 0;
        }

    } catch (error) {
        console.error("Error cargando libros totales:", error);
    }
}


// Ejecutar automáticamente al cargar la página
document.addEventListener("DOMContentLoaded", actualizarReporteExistencias);
