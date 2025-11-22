document.getElementById("formLogin").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const captchaToken = document.querySelector("[name='cf-turnstile-response']").value;

    const data = {
        email: email,
        password: password,
        captchaToken: captchaToken
    };

    try {
        const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            Swal.fire({
                icon: "success",
                title: "Bienvenido",
                text: result.user.nombre
            });

            console.log("Token recibido:", result.user);
            localStorage.setItem("token", result.token);

            // window.location.href = "index.html";

        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: result.message
            });
        }

    } catch (error) {
        console.error("Error en login:", error);
        Swal.fire({
            icon: "error",
            title: "Error de conexión",
            text: "No se pudo conectar con el servidor"
        });
    }
});


// <script>
//     const form = document.getElementById("formulario");
//     const resultado = document.getElementById("resultado");

//     form.addEventListener("submit", async (e) => {
//       e.preventDefault();

//       // Obtener token automáticamente del widget
//       const token = document.querySelector("[name='cf-turnstile-response']").value;

//       const data = {
//         nombre: form.nombre.value,
//         token
//       };

//       const res = await fetch("http://localhost:3000/validate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data)
//       });

//       const json = await res.json();

//       resultado.innerText = JSON.stringify(json, null, 2);
//     });
//   </script>