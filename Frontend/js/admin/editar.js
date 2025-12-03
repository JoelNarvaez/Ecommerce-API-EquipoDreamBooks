let libroEditando = null;
let ofertaActual = null; // 🔥 Se usará para saber si ya tenía oferta

// ===========================================================
//   DETECTAR CLICK EN BOTÓN EDITAR
// ===========================================================
document.addEventListener("click", async (e) => {

    const btn = e.target.closest(".btn-action[title='Editar']");
    if (!btn) return;

    const card = btn.closest(".product-card");

    const id = card.querySelector(".btn-eliminar")?.dataset.id;

    if (!id) {
        alert("Error: No se pudo identificar el libro.");
        return;
    }

    libroEditando = id;

    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3000/api/admin/books/${id}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await res.json();

    if (!res.ok) {
        alert("Error al obtener datos del libro");
        return;
    }

    const libro = data.libro;
    const oferta = data.oferta || null;
    ofertaActual = oferta;

    // --------------------------
    // LLENAR FORMULARIO
    // --------------------------
    editInputs = {
        title: document.getElementById("edit-title"),
        author: document.getElementById("edit-author"),
        price: document.getElementById("edit-price"),
        stock: document.getElementById("edit-stock"),
        category: document.getElementById("edit-category"),
        editorial: document.getElementById("edit-editorial"),
        tipo: document.getElementById("edit-tipo"),
        paginas: document.getElementById("edit-paginas"),
        desc: document.getElementById("edit-desc"),
        image: document.getElementById("edit-image"),

        // 🔥 Nuevos campos de oferta
        hasOffer: document.getElementById("edit-has-offer"),
        offerType: document.getElementById("edit-offer-type"),
        offerValue: document.getElementById("edit-offer-value"),
        offerActive: document.getElementById("edit-offer-active")
    };

    editInputs.title.value = libro.nombre;
    editInputs.author.value = libro.autor;
    editInputs.price.value = libro.precio;
    editInputs.stock.value = libro.stock;
    editInputs.category.value = libro.categoria;
    editInputs.editorial.value = libro.editorial || "";
    editInputs.tipo.value = libro.tipo_de_libro || "";
    editInputs.paginas.value = libro.paginas || "";
    editInputs.desc.value = libro.descripcion || "";

    // =====================================================
    // 🔥 MOSTRAR U OCULTAR CAMPOS DE OFERTA SEGÚN EL LIBRO
    // =====================================================
    if (oferta) {
        editInputs.hasOffer.checked = true;
        document.getElementById("edit-offer-fields").classList.remove("hidden");

        editInputs.offerType.value = oferta.tipo;
        editInputs.offerValue.value = oferta.valor;
        editInputs.offerActive.checked = oferta.activa == 1;
    } else {
        editInputs.hasOffer.checked = false;
        document.getElementById("edit-offer-fields").classList.add("hidden");
    }

    // Evento para mostrar/ocultar campos cuando el usuario tilda
    editInputs.hasOffer.addEventListener("change", (ev) => {
        document.getElementById("edit-offer-fields")
            .classList.toggle("hidden", !ev.target.checked);
    });

    // --------------------------
    // PREVISUALIZACIÓN
    // --------------------------
    const preview = {
        title: document.getElementById("edit-preview-title"),
        author: document.getElementById("edit-preview-author"),
        category: document.getElementById("edit-preview-category"),
        price: document.getElementById("edit-preview-price"),
        stock: document.getElementById("edit-preview-stock"),
        editorial: document.getElementById("edit-preview-editorial"),
        tipo: document.getElementById("edit-preview-tipo"),
        paginas: document.getElementById("edit-preview-paginas"),
        desc: document.getElementById("edit-preview-desc"),
        image: document.getElementById("edit-preview-image")
    };

    let urlImg = libro.imagen
        ? `http://localhost:3000/uploads/${libro.imagen}`
        : "/Frontend/assets/no-image.png";

    preview.image.src = urlImg;
    preview.title.textContent = libro.nombre;
    preview.author.textContent = libro.autor;
    preview.category.textContent = libro.categoria;
    preview.price.textContent = "$" + libro.precio;
    preview.stock.textContent = `En existencia (${libro.stock})`;
    preview.editorial.textContent = libro.editorial || "Editorial";
    preview.tipo.textContent = libro.tipo_de_libro || "Tipo de libro";
    preview.paginas.textContent = libro.paginas ? `${libro.paginas} páginas` : "0 páginas";
    preview.desc.textContent = libro.descripcion || "Descripción del libro...";

    // Mostrar modal
    document.getElementById("modal-editar").classList.remove("hidden");
});

// ===========================================================
//   CERRAR MODAL
// ===========================================================
document.getElementById("close-edit-modal").addEventListener("click", () => {
    document.getElementById("modal-editar").classList.add("hidden");
});

// ===========================================================
//   PREVIEW EN TIEMPO REAL
// ===========================================================
function actualizarPreviewEditar() {
    document.getElementById("edit-preview-title").textContent = editInputs.title.value;
    document.getElementById("edit-preview-author").textContent = editInputs.author.value;
    document.getElementById("edit-preview-category").textContent = editInputs.category.value;
    document.getElementById("edit-preview-price").textContent = "$" + editInputs.price.value;
    document.getElementById("edit-preview-stock").textContent = `En existencia (${editInputs.stock.value})`;
    document.getElementById("edit-preview-desc").textContent = editInputs.desc.value || "Descripción del libro...";
}

["title","author","category","price","stock","desc"].forEach(key => {
    document.getElementById("edit-" + key)?.addEventListener("input", actualizarPreviewEditar);
});

// Nuevos campos
document.getElementById("edit-editorial").addEventListener("input", () => {
    document.getElementById("edit-preview-editorial").textContent =
        editInputs.editorial.value || "Editorial";
});

document.getElementById("edit-tipo").addEventListener("input", () => {
    document.getElementById("edit-preview-tipo").textContent =
        editInputs.tipo.value || "Tipo de libro";
});

document.getElementById("edit-paginas").addEventListener("input", () => {
    let val = editInputs.paginas.value;
    document.getElementById("edit-preview-paginas").textContent =
        val ? `${val} páginas` : "0 páginas";
});

// ===========================================================
//   CAMBIAR IMAGEN - PREVIEW
// ===========================================================
document.getElementById("edit-image").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        document.getElementById("edit-preview-image").src = URL.createObjectURL(file);
    }
});

// ===========================================================
//   GUARDAR CAMBIOS
// ===========================================================
document.getElementById("btn-save-edit").addEventListener("click", async () => {

    const token = localStorage.getItem("token");

    const form = new FormData();

    // Datos del libro
    form.append("nombre", editInputs.title.value);
    form.append("autor", editInputs.author.value);
    form.append("precio", editInputs.price.value);
    form.append("categoria", editInputs.category.value);
    form.append("stock", editInputs.stock.value);
    form.append("descripcion", editInputs.desc.value);
    form.append("editorial", editInputs.editorial.value);
    form.append("tipo_de_libro", editInputs.tipo.value);
    form.append("paginas", editInputs.paginas.value);

    const imagenFile = editInputs.image.files[0];
    if (imagenFile) form.append("imagen", imagenFile);


    // =====================================================
    //   🔥 ENVIAR INFORMACIÓN DE LA OFERTA
    // =====================================================
    const hasOffer = editInputs.hasOffer.checked;
    form.append("hasOffer", hasOffer ? 1 : 0);

    if (hasOffer) {
        form.append("offer_type", editInputs.offerType.value);
        form.append("offer_value", editInputs.offerValue.value);
        form.append("offer_active", editInputs.offerActive.checked ? 1 : 0);
    }


    const res = await fetch(`http://localhost:3000/api/admin/books/${libroEditando}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` },
        body: form
    });

    if (res.ok) {
        alert("Libro actualizado correctamente");

        if (typeof actualizarReporteExistencias === "function") {
            actualizarReporteExistencias();
        }

        fetchBooks(1, 10);

        document.getElementById("modal-editar").classList.add("hidden");
    } else {
        alert("Error al actualizar libro");
    }
});