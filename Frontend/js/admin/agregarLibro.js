document.getElementById("modal-save").addEventListener("click", async () => {

    const form = new FormData();

    form.append("nombre", document.getElementById("modal-title").value);
    form.append("autor", document.getElementById("modal-author").value);
    form.append("precio", document.getElementById("modal-price").value);
    form.append("categoria", document.getElementById("modal-category").value);
    form.append("stock", document.getElementById("modal-stock").value);
    form.append("descripcion", document.getElementById("modal-desc").value);

    // 🔥 NUEVOS CAMPOS
    form.append("editorial", document.getElementById("modal-editorial").value);
    form.append("tipo_de_libro", document.getElementById("modal-tipo").value);
    form.append("paginas", document.getElementById("modal-paginas").value);

    const imagenArchivo = document.getElementById("modal-image").files[0];
    if (imagenArchivo) {
        form.append("imagen", imagenArchivo);
    }

    const token = localStorage.getItem("token");  

    try {
        const res = await fetch("http://localhost:3000/api/admin/agregar", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`  
            },
            body: form
        });

        const data = await res.json();

        if (data.ok) {
            alert("Libro agregado correctamente");

            fetchBooks(1, 8);

            if (typeof actualizarReporteExistencias === "function") {
                actualizarReporteExistencias();
            }

            document.getElementById("modal-add-book").classList.add("hidden");

        } else {
            alert("Error al guardar libro");
        }

    } catch (error) {
        console.error(error);
        alert("Fallo al guardar libro");
    }
});
