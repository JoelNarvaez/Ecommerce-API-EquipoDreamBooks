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
        if (!res.ok || !data.ok) return;

        const categorias = data.categorias || {};

        // 🔥 TOTAL DE LIBROS DIFERENTES
        document.getElementById("total-libros").textContent = data.totalLibros || 0;

        const contenedor = document.getElementById("dashboard-report");

        contenedor.innerHTML = `
            <h2>Reporte de existencias por categoría</h2>
        `;

        Object.entries(categorias).forEach(([nombre, cantidad]) => {

            const slug = nombre.toLowerCase().replace(/\s+/g, "-");

            contenedor.innerHTML += `
                <div class="category-card">
                    <div class="category-icon category-${slug}">
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
// Ejecutar al cargar la página solo si necesitas la data desde inicio
document.addEventListener("DOMContentLoaded", () => {
    cargarLibrosTotales();
});
