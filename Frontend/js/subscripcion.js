const formSubscripcion = document.getElementById("form-suscripcion-footer");

formSubscripcion.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("correo-suscripcion").value.trim();


    // Validación de campos vacíos
    if (!email) {
        Swal.fire({
            icon: "error",
            title: "Correo vacío",
            text: "Por favor completa el campo de correo electrónico."
        });
        return;
    }

    try {
        const respuesta = await fetch("http://localhost:3000/api/contact/subscribir", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email
            })
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            Swal.fire({
                icon: "error",
                title: "Error al suscribirse",
                text: data.message || "Intenta nuevamente"
            });
            return;
        }

        Swal.fire({
            icon: "success",
            title: "Ahora eres parte de DreamBooks",
            text: "Gracias por suscribirte. Revisa tu correo para un cupón de descuento."
        })

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error de conexión",
            text: "No se pudo conectar con el servidor."
        });
        console.log(error);
    }


})