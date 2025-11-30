let libroEditando = null;

// ===========================================================
//   DETECTAR CLICK EN BOTÓN EDITAR
// ===========================================================
document.addEventListener("click", async (e) => {

    const btn = e.target.closest(".btn-action[title='Editar']");
    if (!btn) return;

    // Encontrar la tarjeta completa
    const card = btn.closest(".product-card");

    // Obtener el ID REAL del libro (viene en el botón eliminar)
    const id = card.querySelector(".btn-eliminar")?.dataset.id;

    if (!id) {
        alert("Error: No se pudo identificar el libro.");
        return;
    }

    libroEditando = id;

    // Solicitar datos al backend
    const res = await fetch(`http://localhost:3000/api/admin/books/${id}`);
    const data = await res.json();

    if (!res.ok) {
        alert("Error al obtener datos del libro");
        return;
    }

    const libro = data.libro;

    // Llenar campos del modal
    document.getElementById("edit-title").value = libro.nombre;
    document.getElementById("edit-author").value = libro.autor;
    document.getElementById("edit-price").value = libro.precio;
    document.getElementById("edit-category").value = libro.categoria;
    document.getElementById("edit-stock").value = libro.stock;
    document.getElementById("edit-desc").value = libro.descripcion;

    // Previsualización
    let urlImg = libro.imagen
        ? `http://localhost:3000/uploads/${libro.imagen}`
        : "/Frontend/assets/no-image.png";

    document.getElementById("edit-preview-image").src = urlImg;
    document.getElementById("edit-preview-title").textContent = libro.nombre;
    document.getElementById("edit-preview-author").textContent = libro.autor;
    document.getElementById("edit-preview-category").textContent = libro.categoria;
    document.getElementById("edit-preview-price").textContent = "$" + libro.precio;
    document.getElementById("edit-preview-stock").textContent = "En existencia (" + libro.stock + ")";

    // Mostrar modal
    document.getElementById("modal-editar").classList.remove("hidden");
});

// ===========================================================
//   CERRAR MODAL
// ===========================================================
document.getElementById("close-edit-modal")?.addEventListener("click", () => {
    document.getElementById("modal-editar").classList.add("hidden");
});

// ===========================================================
//   PREVIEW EN TIEMPO REAL
// ===========================================================
function actualizarPreviewEditar() {
    document.getElementById("edit-preview-title").textContent =
        document.getElementById("edit-title").value;

    document.getElementById("edit-preview-author").textContent =
        document.getElementById("edit-author").value;

    document.getElementById("edit-preview-category").textContent =
        document.getElementById("edit-category").value;

    document.getElementById("edit-preview-price").textContent =
        "$" + document.getElementById("edit-price").value;

    document.getElementById("edit-preview-stock").textContent =
        "En existencia (" + document.getElementById("edit-stock").value + ")";
}

["edit-title", "edit-author", "edit-category", "edit-price", "edit-stock"].forEach(id => {
    document.getElementById(id)?.addEventListener("input", actualizarPreviewEditar);
});

// CAMBIAR IMAGEN
document.getElementById("edit-image")?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        document.getElementById("edit-preview-image").src = URL.createObjectURL(file);
    }
});

// ===========================================================
//   GUARDAR CAMBIOS
// ===========================================================
document.getElementById("btn-save-edit")?.addEventListener("click", async () => {

    const form = new FormData();
    form.append("nombre", document.getElementById("edit-title").value);
    form.append("autor", document.getElementById("edit-author").value);
    form.append("precio", document.getElementById("edit-price").value);
    form.append("categoria", document.getElementById("edit-category").value);
    form.append("stock", document.getElementById("edit-stock").value);
    form.append("descripcion", document.getElementById("edit-desc").value);

    const imagenFile = document.getElementById("edit-image").files[0];
    if (imagenFile) {
        form.append("imagen", imagenFile);
    }

    const res = await fetch(`http://localhost:3000/api/admin/books/${libroEditando}`, {
        method: "PUT",
        body: form
    });

    const data = await res.json();

    if (res.ok) {
        alert("Libro actualizado correctamente");

        // Cerrar modal
        document.getElementById("modal-editar").classList.add("hidden");

        // 🔥 Recargar lista de libros
        fetchBooks(1, 8);

        // 🔥 Actualizar reporte sin recargar página
        if (typeof actualizarReporteExistencias === "function") {
            actualizarReporteExistencias();
        }

    } else {
        alert("Error al actualizar libro");
    }
});
