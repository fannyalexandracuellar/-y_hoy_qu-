
document.addEventListener("DOMContentLoaded", async () => {

    const token = sessionStorage.getItem("token");

    const mensaje = document.getElementById("mensaje_perfil");

    // Verificar que exista una sesión
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {

        mensaje.textContent = "Cargando información del perfil...";

        const respuesta = await fetch(
            "http://localhost:3001/api/auth/perfil",
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                resultado.mensaje || "No fue posible consultar el perfil."
            );
        }

        const usuario = resultado.usuario;

        // Mostrar información del usuario
        document.getElementById("perfil_nombre").textContent =
            usuario.nombre;

        document.getElementById("dato_nombre").textContent =
            usuario.nombre;

        document.getElementById("dato_correo").textContent =
            usuario.correo;

        document.getElementById("dato_telefono").textContent =
            usuario.telefono;

        document.getElementById("dato_rol").textContent =
            usuario.rol === "administrador" ? "Administrador" : "Cliente";

        mensaje.textContent = "";

        // Actualizar los datos guardados en la sesión
        sessionStorage.setItem("usuario", JSON.stringify({
            id: usuario._id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            telefono: usuario.telefono,
            rol: usuario.rol
        }));

    } catch (error) {

        console.error("Error al cargar el perfil:", error);

        mensaje.textContent = error.message;
        mensaje.style.color = "red";

        // Si la sesión expiró, regresar al inicio de sesión
        if (
            error.message.includes("Sesión inválida") ||
            error.message.includes("Acceso denegado")
        ) {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("usuario");

            window.location.href = "login.html";
        }

    }

});
