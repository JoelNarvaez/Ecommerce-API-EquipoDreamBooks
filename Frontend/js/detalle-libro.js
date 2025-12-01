console.log("detalle-libro.js cargado ✔");

async function cargarLibro() {

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        document.body.innerHTML = "<h2>Error: No se recibió ID del libro.</h2>";
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/api/products/book/${id}`);
        const data = await res.json();

        console.log("📚 Datos recibidos:", data);

        if (!data.ok || !data.book) {
            document.body.innerHTML = "<h2>Libro no encontrado</h2>";
            return;
        }

        const libro = data.book;

        // ======================
        // IMAGEN
        // ======================
        const imagenURL = libro.imagen
            ? `http://localhost:3000/uploads/${libro.imagen}`
            : "/Frontend/assets/no-image.png";

        document.getElementById("img-libro").src = imagenURL;

        // ======================
        // TEXTO PRINCIPAL
        // ======================
        document.getElementById("titulo").textContent = libro.nombre;
        document.getElementById("autor").textContent = libro.autor;
        document.getElementById("editorial").textContent = libro.editorial;

        // ======================
        // PRECIO / OFERTA
        // ======================
        const contPrecio = document.getElementById("precioBox");
        const tieneOferta = libro.oferta_tipo && libro.oferta_valor;

        const precio = Number(libro.precio);

        const precioFinal = tieneOferta
            ? (libro.oferta_tipo === "porcentaje"
                ? precio - precio * (libro.oferta_valor / 100)
                : precio - libro.oferta_valor)
            : precio;

        contPrecio.innerHTML = tieneOferta
            ? `
                <span class="precio-original">$${precio.toFixed(2)}</span>
                <span class="precio-oferta">$${precioFinal.toFixed(2)}</span>
            `
            : `
                <span class="precio-normal">$${precio.toFixed(2)}</span>
            `;

        // ======================
        // STOCK
        // ======================
        document.getElementById("stock").innerHTML =
            libro.stock > 0
                ? `<span class="stock-disponible">Disponible (${libro.stock})</span>`
                : `<span class="stock-agotado">Agotado</span>`;

        // ======================
        // DESCRIPCIÓN
        // ======================
        document.getElementById("descripcion").textContent = libro.descripcion;

        // ======================
        // EXTRA INFO
        // ======================
        document.getElementById("categoria").textContent = libro.categoria;
        document.getElementById("tipo").textContent = libro.tipo_de_libro;
        document.getElementById("paginas").textContent = libro.paginas;

    } catch (error) {
        console.error("Error cargando libro:", error);
    }
}

document.addEventListener("DOMContentLoaded", cargarLibro);
