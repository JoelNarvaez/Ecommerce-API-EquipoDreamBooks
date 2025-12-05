// ===========================================================
//   MANEJO DE ELIMINACIÓN — STOCK Y LIBRO COMPLETO
// ===========================================================
let libroSeleccionado = null;
let libroPreview = null;

document.addEventListener("click", async (e) => {

    const btn = e.target.closest(".btn-eliminar");
    if (!btn) return;

    libroSeleccionado = btn.dataset.id;

    // Card completa
    libroPreview = btn.closest(".product-card");

    // -----------------------------
    // Datos principales visibles
    // -----------------------------
    const img = libroPreview.querySelector(".product-image img")?.src;
    const title = libroPreview.querySelector("h3")?.textContent;
    const author = libroPreview.querySelector(".product-desc")?.textContent;
    const category = libroPreview.querySelector(".product-category")?.textContent;
    const stock = libroPreview.querySelector(".stock-status")?.textContent;
    const price = libroPreview.querySelector(".new-price")?.textContent;

    // Obtener token
    const token = localStorage.getItem("token");

    // -----------------------------
    // NUEVOS CAMPOS DESDE BACKEND
    // -----------------------------
    const res = await fetch(`http://localhost:3000/api/admin/books/${libroSeleccionado}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await res.json();

    if (!res.ok) {
        alert("Error al cargar datos del libro");
        return;
    }

    const libro = data.libro;

    // -----------------------------
    // RELLENAR PREVIEW DEL MODAL
    // -----------------------------
    document.getElementById("delete-book-image").src = img;
    document.getElementById("delete-book-title").textContent = title;
    document.getElementById("delete-book-author").textContent = author;
    document.getElementById("delete-book-category").textContent = category;
    document.getElementById("delete-book-stock").textContent = stock;
    document.getElementById("delete-book-price").textContent = price;

    // 🔥 Nuevos campos
    document.getElementById("delete-book-editorial").textContent =
        libro.editorial ? `Editorial: ${libro.editorial}` : "Editorial: -";

    document.getElementById("delete-book-tipo").textContent =
        libro.tipo_de_libro ? `Tipo: ${libro.tipo_de_libro}` : "Tipo: -";

    document.getElementById("delete-book-paginas").textContent =
        libro.paginas ? `Páginas: ${libro.paginas}` : "Páginas: -";

    // Limpiar input
    document.getElementById("cantidad-eliminar").value = "";

    // Abrir modal
    document.getElementById("modal-eliminar").classList.remove("hidden");
});

// ----------------------------------------------------------
// CERRAR MODAL
// ----------------------------------------------------------
document.getElementById("close-delete-modal")?.addEventListener("click", () => {
    document.getElementById("modal-eliminar").classList.add("hidden");
});

// ----------------------------------------------------------
// ELIMINAR STOCK
// ----------------------------------------------------------
document.getElementById("btn-confirm-delete")?.addEventListener("click", async () => {

    const cantidad = parseInt(document.getElementById("cantidad-eliminar").value);

    if (!cantidad || cantidad <= 0) {
        alert("Ingresa una cantidad válida.");
        return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3000/api/admin/eliminar-stock/${libroSeleccionado}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ cantidad })
    });

    const data = await res.json();

    if (res.ok) {
        alert("Stock actualizado correctamente");
        fetchBooks(1, 8);

        if (typeof actualizarReporteExistencias === "function") {
            actualizarReporteExistencias();
        }

    } else {
        alert(data.message || "Error al actualizar stock");
    }

    document.getElementById("modal-eliminar").classList.add("hidden");
});

// ----------------------------------------------------------
// ELIMINAR LIBRO COMPLETO
// ----------------------------------------------------------
document.getElementById("btn-delete-total")?.addEventListener("click", async () => {

    if (!confirm("¿Seguro que deseas eliminar este libro permanentemente?")) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3000/api/admin/books/${libroSeleccionado}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await res.json();

    if (res.ok) {
        alert("Libro eliminado correctamente");
        fetchBooks(1, 8);

        if (typeof actualizarReporteExistencias === "function") {
            actualizarReporteExistencias();
        }

    } else {
        alert(data.message || "Error al eliminar libro");
    }

    document.getElementById("modal-eliminar").classList.add("hidden");
});