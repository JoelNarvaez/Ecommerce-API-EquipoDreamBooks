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
// REPORTE DINÁMICO DE EXISTENCIAS POR CATEGORÍA
// ===============================================================
async function cargarLibrosTotales() {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:3000/api/admin/reporte-existencias", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await res.json();

        // Validar respuesta
        if (!data.ok) {
            console.error("Error en reporte:", data.message);
            return;
        }

        // Datos del backend
        const categorias = data.categorias || {};
        const totalLibros = data.totalLibros || 0;

        // 🔥 Mostrar total de libros diferentes
        const totalLibrosEl = document.getElementById("total-libros");
        if (totalLibrosEl) {
            totalLibrosEl.textContent = totalLibros;
        }

        const contenedor = document.getElementById("dashboard-report");
        if (!contenedor) return;

        contenedor.innerHTML = `
            <h2>Reporte de existencias por categoría</h2>
        `;

        // Crear cards dinámicamente
        Object.entries(categorias).forEach(([nombre, cantidad]) => {
            const colorBase = generarColorDesdeTexto(nombre);
            const gradiente = generarDegradado(colorBase);

            contenedor.innerHTML += `
                <div class="category-card">
                    <div class="category-icon" style="background: ${gradiente}">
                        <i class="bi bi-collection-fill"></i>
                    </div>
                    <div class="category-label">${nombre}:</div>
                    <span>${cantidad}</span>
                </div>
            `;
        });

    } catch (err) {
        console.error("Error en reporte dinámico:", err);
    }
}


// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarLibrosTotales();
});
