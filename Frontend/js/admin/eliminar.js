
// ===========================================================
//   MANEJO DE ELIMINACIÓN — STOCK Y LIBRO COMPLETO
// ===========================================================
let libroSeleccionado = null;
let libroPreview = null;

document.addEventListener("click", (e) => {
    if (e.target.closest(".btn-eliminar")) {

        const btn = e.target.closest(".btn-eliminar");
        libroSeleccionado = btn.dataset.id;

        libroPreview = btn.closest(".product-card");

        // Obtener datos del libro desde la tarjeta
        const img = libroPreview.querySelector(".product-image img")?.src;
        const title = libroPreview.querySelector("h3")?.textContent;
        const author = libroPreview.querySelector(".product-desc")?.textContent;
        const category = libroPreview.querySelector(".product-category")?.textContent;
        const stock = libroPreview.querySelector(".stock-status")?.textContent;
        const price = libroPreview.querySelector(".new-price")?.textContent;

        // Insertar datos en el modal
        document.getElementById("delete-book-image").src = img;
        document.getElementById("delete-book-title").textContent = title;
        document.getElementById("delete-book-author").textContent = author;
        document.getElementById("delete-book-category").textContent = category;
        document.getElementById("delete-book-stock").textContent = stock;
        document.getElementById("delete-book-price").textContent = price;

        document.getElementById("cantidad-eliminar").value = "";

        // Mostrar modal
        document.getElementById("modal-eliminar").classList.remove("hidden");
    }
});


// Cerrar modal con la X
const closeDeleteModalBtn = document.getElementById("close-delete-modal");
closeDeleteModalBtn?.addEventListener("click", () => {
    document.getElementById("modal-eliminar").classList.add("hidden");
});


// --------------------------------------------------------
// ELIMINAR STOCK
// --------------------------------------------------------
document.getElementById("btn-confirm-delete")?.addEventListener("click", async () => {

    const cantidad = parseInt(document.getElementById("cantidad-eliminar").value);

    if (!cantidad || cantidad <= 0) {
        alert("Ingresa una cantidad válida.");
        return;
    }

    const res = await fetch(`http://localhost:3000/api/admin/eliminar-stock/${libroSeleccionado}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cantidad })
    });

    const data = await res.json();

    if (res.ok) {
        alert("Stock actualizado correctamente");
        fetchBooks(1, 8);
    } else {
        alert(data.message);
    }

    document.getElementById("modal-eliminar").classList.add("hidden");
});


// --------------------------------------------------------
// ELIMINAR LIBRO COMPLETO
// --------------------------------------------------------
document.getElementById("btn-delete-total")?.addEventListener("click", async () => {

    if (!confirm("¿Seguro que deseas eliminar este libro permanentemente?")) return;

    const res = await fetch(`http://localhost:3000/api/admin/books/${libroSeleccionado}`, {
        method: "DELETE"
    });

    const data = await res.json();

    if (res.ok) {
        alert("Libro eliminado correctamente");
        fetchBooks(1, 8);
    } else {
        alert(data.message);
    }

    document.getElementById("modal-eliminar").classList.add("hidden");
});
