
const formulario = document.getElementById("formulario_login");

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const datosFormulario = new FormData(formulario);

    const correo = datosFormulario.get("correo")?.trim();
    const contrasena = datosFormulario.get("contrasena");

    if (!correo || !contrasena) {
        alert("Debes ingresar tu correo y contraseña.");
        return;
    }

    const boton = formulario.querySelector("button[type='submit']");

    boton.disabled = true;
    boton.textContent = "Ingresando...";

    try {
        const respuesta = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                correo,
                contrasena
            })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            alert(datos.mensaje || "No se pudo iniciar sesión.");
            return;
        }

        sessionStorage.setItem("token", datos.token);
        sessionStorage.setItem("usuario", JSON.stringify(datos.usuario));

        alert(`¡Bienvenido/a, ${datos.usuario.nombre}!`);

        window.location.href = "index.html";

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("No se pudo conectar con el servidor.");
    } finally {
        boton.disabled = false;
        boton.textContent = "Iniciar sesión";
    }
});
