const formContacto = document.getElementById("contacto-form");

formContacto.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre-contacto").value.trim();
    const email = document.getElementById("email-contacto").value.trim();
    const mensaje = document.getElementById("mensaje-contacto").value.trim();


    // Validación de campos vacíos
    if (!nombre || !mensaje || !email) {
        Swal.fire({
            icon: "error",
            title: "Campos incompletos",
            text: "Por favor completa todos los campos."
        });
        return;
    }

    try {
        const respuesta = await fetch("http://localhost:3000/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nombre,
                email,
                mensaje
            })
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            Swal.fire({
                icon: "error",
                title: "Error al enviar tu duda",
                text: data.message || "Intenta nuevamente"
            });
            return;
        }

        Swal.fire({
            icon: "success",
            title: "Se envió tu mensaje",
            text: "Te contactaremos pronto."
        }).then(() => {
            window.location.href = "login.html";
        });

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error de conexión",
            text: "No se pudo conectar con el servidor."
        });
        console.log(error);
    }


})