console.log("modal-add-book.js cargado ✔");

const inputsPreview = {
    title: document.getElementById("modal-title"),
    author: document.getElementById("modal-author"),
    category: document.getElementById("modal-category"),
    price: document.getElementById("modal-price"),
    editorial: document.getElementById("modal-editorial"),
    tipo: document.getElementById("modal-tipo"),
    paginas: document.getElementById("modal-paginas"),
    stock: document.getElementById("modal-stock"),
    desc: document.getElementById("modal-desc"),
    image: document.getElementById("modal-image"),

    // NUEVOS CAMPOS (solo preview, no afectan vista)
    hasOffer: document.getElementById("modal-has-offer"),
    offerType: document.getElementById("modal-offer-type"),
    offerValue: document.getElementById("modal-offer-value")
};

// ELEMENTOS DE PREVIEW
const preview = {
    title: document.getElementById("preview-title"),
    author: document.getElementById("preview-author"),
    category: document.getElementById("preview-category"),
    price: document.getElementById("preview-price"),
    editorial: document.getElementById("preview-editorial"),
    tipo: document.getElementById("preview-tipo"),
    paginas: document.getElementById("preview-paginas"),
    stock: document.getElementById("preview-stock"),
    desc: document.getElementById("preview-desc"),
    image: document.getElementById("preview-image")
};


// 🟦 ACTUALIZAR PREVIEW AUTOMÁTICO
function actualizarPreview() {
    preview.title.textContent = inputsPreview.title.value || "Título del libro";
    preview.author.textContent = inputsPreview.author.value || "Autor";
    preview.category.textContent = inputsPreview.category.value || "Categoría";
    preview.price.textContent = inputsPreview.price.value ? `$${inputsPreview.price.value}` : "$0.00";
    preview.editorial.textContent = inputsPreview.editorial.value || "Editorial";
    preview.tipo.textContent = inputsPreview.tipo.value || "Tipo de libro";
    preview.paginas.textContent = inputsPreview.paginas.value ? `${inputsPreview.paginas.value} páginas` : "0 páginas";
    preview.stock.textContent = inputsPreview.stock.value ? `En existencia (${inputsPreview.stock.value})` : "En existencia (0)";
    preview.desc.textContent = inputsPreview.desc.value || "Descripción del libro...";
}


// 🖼️ Vista previa de imagen
inputsPreview.image.addEventListener("change", () => {
    const file = inputsPreview.image.files[0];
    if (file) preview.image.src = URL.createObjectURL(file);
});


// Escuchar cambios automáticos en todos los inputs
Object.values(inputsPreview).forEach(input => {
    if (!input) return;
    if (input.id !== "modal-image") {
        input.addEventListener("input", actualizarPreview);
    }
});


// ===========================================================
// 🔥 NUEVA LÓGICA — MOSTRAR / OCULTAR CAMPOS DE OFERTA
// ===========================================================
document.getElementById("modal-has-offer").addEventListener("change", (e) => {
    document.getElementById("modal-offer-fields").classList.toggle("hidden", !e.target.checked);
});


// 🟩 GUARDAR LIBRO
document.getElementById("modal-save").addEventListener("click", async () => {

    const form = new FormData();

    form.append("nombre", inputsPreview.title.value);
    form.append("autor", inputsPreview.author.value);
    form.append("precio", inputsPreview.price.value);
    form.append("categoria", inputsPreview.category.value);
    form.append("stock", inputsPreview.stock.value);
    form.append("descripcion", inputsPreview.desc.value);

    // Nuevos campos
    form.append("editorial", inputsPreview.editorial.value);
    form.append("tipo_de_libro", inputsPreview.tipo.value);
    form.append("paginas", inputsPreview.paginas.value);

    const imagenArchivo = inputsPreview.image.files[0];
    if (imagenArchivo) form.append("imagen", imagenArchivo);


    // ===========================================================
    // 🔥 OFERTA (ENVÍO AL BACKEND)
    // ===========================================================
    const hasOffer = document.getElementById("modal-has-offer").checked;

    form.append("hasOffer", hasOffer ? 1 : 0);

    if (hasOffer) {
        form.append("offer_type", document.getElementById("modal-offer-type").value);
        form.append("offer_value", document.getElementById("modal-offer-value").value);
    }


    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://localhost:3000/api/admin/agregar", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: form
        });

        const data = await res.json();

        if (data.ok) {
            Swal.fire("Libro agregado", "", "success");
            /*Swal.fire({
                title: "Libro agregado",
                icon: "success",
                showConfirmButton: false,
                timer: 5000,     
                timerProgressBar: true
            });*/

            fetchBooks(1, 8); // recargar lista
            document.getElementById("modal-add-book").classList.add("hidden");

        } else {
            Swal.fire("Error", data.message || "No se pudo guardar", "error");
        }

    } catch (error) {
        console.error(error);
        Swal.fire("Error del servidor", "No se pudo conectar con el backend", "error");
    }
});