document.getElementById("modal-save").addEventListener("click", async () => {

    const titulo = document.getElementById("modal-title").value.trim();
    const autor = document.getElementById("modal-author").value.trim();
    const precio = parseFloat(document.getElementById("modal-price").value);
    const categoria = document.getElementById("modal-category").value.trim();
    const stock = parseInt(document.getElementById("modal-stock").value);
    const descripcion = document.getElementById("modal-desc").value.trim();
    const imagenInput = document.getElementById("modal-image");

    if (!titulo || !autor || !precio || !categoria || isNaN(stock)) {
        alert("Por favor completa todos los campos obligatorios");
        return;
    }

    let imagenBase64 = null;

    // Convertir imagen a BASE64 (para guardarla en DB)
    if (imagenInput.files.length > 0) {
        const file = imagenInput.files[0];
        imagenBase64 = await toBase64(file);
    }

    const nuevoLibro = {
        nombre: titulo,
        autor,
        precio,
        categoria,
        stock,
        descripcion,
        imagen: imagenBase64
    };

    try {
        const res = await fetch("http://localhost:3000/api/admin/agregar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoLibro)
        });

        const data = await res.json();

        if (!data.ok) {
            alert("Error al guardar libro");
            return;
        }

        alert("Libro agregado correctamente");

        // Cerrar modal
        document.getElementById("modal-add-book").classList.add("hidden");

        // Limpiar formulario
        limpiarFormulario();

        // Recargar libros
        fetchBooks(1, 8);

    } catch (error) {
        console.error("Error:", error);
        alert("Fallo al guardar libro");
    }
});

// Convertir imagen a Base64
function toBase64(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });
}

function limpiarFormulario() {
    document.getElementById("modal-title").value = "";
    document.getElementById("modal-author").value = "";
    document.getElementById("modal-price").value = "";
    document.getElementById("modal-category").value = "";
    document.getElementById("modal-stock").value = "";
    document.getElementById("modal-desc").value = "";
    document.getElementById("modal-image").value = "";
}
