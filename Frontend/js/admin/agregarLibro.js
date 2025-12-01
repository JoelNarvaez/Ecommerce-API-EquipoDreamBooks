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


// ACTUALIZAR PREVIEW AUTOMÁTICO
function actualizarPreview() {
    preview.title.textContent = inputsPreview.title.value || "Título del libro";

    preview.author.textContent =
        "Autor: " + (inputsPreview.author.value || "Autor");

    preview.category.textContent =
        "Categoría: " + (inputsPreview.category.value || "Categoría");

    preview.price.textContent =
        inputsPreview.price.value ? `$${inputsPreview.price.value}` : "$0.00";

    preview.editorial.textContent =
        "Editorial: " + (inputsPreview.editorial.value || "Editorial");

    preview.tipo.textContent =
        "Tipo: " + (inputsPreview.tipo.value || "Tipo de libro");

    preview.paginas.textContent =
        "Páginas: " + (inputsPreview.paginas.value ? `${inputsPreview.paginas.value}` : "0");

    preview.stock.textContent =
        "Existencia: " + (inputsPreview.stock.value ? `${inputsPreview.stock.value}` : "0");

    preview.desc.textContent = inputsPreview.desc.value || "Descripción del libro...";
}


// Vista previa de imagen
inputsPreview.image.addEventListener("change", () => {
    const file = inputsPreview.image.files[0];
    if (file) preview.image.src = URL.createObjectURL(file);
});


// Escuchar cambios automáticos en todos los inputs
Object.values(inputsPreview).forEach(input => {
    if (input.id !== "modal-image") {
        input.addEventListener("input", actualizarPreview);
    }
});

// GUARDAR LIBRO
document.getElementById("modal-save").addEventListener("click", async () => {

    function capitalizar(texto) {
        if (!texto) return "";
        return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
    }

    const form = new FormData();

    form.append("nombre", inputsPreview.title.value);
    form.append("autor", inputsPreview.author.value);
    form.append("precio", inputsPreview.price.value);

    // Normalización automática de categoría
    const categoriaNormalizada = capitalizar(inputsPreview.category.value);
    form.append("categoria", categoriaNormalizada);

    form.append("stock", inputsPreview.stock.value);
    form.append("descripcion", inputsPreview.desc.value);

    // Nuevos campos
    form.append("editorial", inputsPreview.editorial.value);
    form.append("tipo_de_libro", capitalizar(inputsPreview.tipo.value));
    form.append("paginas", inputsPreview.paginas.value);

    // Imagen
    const imagenArchivo = inputsPreview.image.files[0];
    if (imagenArchivo) form.append("imagen", imagenArchivo);

    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://localhost:3000/api/admin/agregar", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: form
        });

        const data = await res.json();

        if (data.ok) {

            alert(`Libro agregado correctamente:${inputsPreview.title.value}`);

            fetchBooks(1, 10); // recargar lista
            document.getElementById("modal-add-book").classList.add("hidden");

        } else {

            alert(`Error al guardar:${data.message || "No se pudo guardar"}`);

        }

    } catch (error) {
        console.error(error);
        alert("Error del servidor: No se pudo conectar con el backend");
    }
});

