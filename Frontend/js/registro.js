const formRegistro = document.getElementById("form-registro");

formRegistro.addEventListener("submit", async function(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre-registro").value.trim();
    const apellidos = document.getElementById("apellidos-registro").value.trim();
    const nombreCompleto = `${nombre} ${apellidos}`.trim();

    const email = document.getElementById("email-registro").value.trim();
    const password = document.getElementById("password-registro").value.trim();
    const password2 = document.getElementById("password2-registro").value.trim(); // ← NUEVO
    const telefono = document.getElementById("telefono").value.trim();
    const pais = document.getElementById("pais").value.trim();

    // Validación de campos vacíos
    if (!nombre || !apellidos || !email || !password || !password2 || !telefono) {
        Swal.fire({
            icon: "error",
            title: "Campos incompletos",
            text: "Por favor completa todos los campos."
        });
        return;
    }

    // Validación de contraseñas iguales
    if (password !== password2) {
        Swal.fire({
            icon: "error",
            title: "Las contraseñas no coinciden",
            text: "Asegúrate de escribirlas igual."
        });
        return;
    }

    try {
        const respuesta = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nombreCompleto,
                email,
                password,
                telefono,
                pais
            })
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            Swal.fire({
                icon: "error",
                title: "Error en el registro",
                text: data.message || "Intenta nuevamente"
            });
            return;
        }

        Swal.fire({
            icon: "success",
            title: "Registro exitoso",
            text: "Tu cuenta se ha creado correctamente."
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
});
