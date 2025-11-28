const form = document.getElementById("emailResetForm");
const button = document.getElementById("sendResetLinkBtn");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    // Validación básica
    if (!email) {
        return Swal.fire({
            icon: "warning",
            title: "Campo vacío",
            text: "Por favor, ingresa tu correo electrónico."
        });
    }

    try {
        button.disabled = true;
        button.innerText = "Enviando...";

        const response = await fetch("http://localhost:3000/api/auth/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (!response.ok) {
            Swal.fire({
                icon: "error",
                title: "Ocurrió un error",
                text: "Ocurrió un error al enviar el correo. " + (data.message || "Intenta nuevamente.")
            });
            return;
        }

        Swal.fire({
            icon: "success",
            title: "Enlace enviado",
            text: "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña."
        });

        form.reset();

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message || "No se pudo completar la solicitud."
        });

    } finally {
        button.disabled = false;
        button.innerText = "Enviar enlace de restablecimiento";
    }

});

