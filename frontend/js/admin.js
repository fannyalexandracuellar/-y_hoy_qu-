
document.addEventListener("DOMContentLoaded", async () => {

    const token = sessionStorage.getItem("token");
    const usuarioGuardado = sessionStorage.getItem("usuario");

    // Comprobar que exista una sesión
    if (!token || !usuarioGuardado) {
        alert("Debes iniciar sesión para acceder al panel.");
        window.location.href = "login.html";
        return;
    }

    try {

        // Verificar la sesión con el backend
        const respuesta = await fetch(
            "http://localhost:3001/api/auth/perfil",
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error("Sesión inválida.");
        }

        // Verificar el rol del usuario
        if (datos.usuario.rol !== "administrador") {
            alert("No tienes permisos para acceder al panel.");
            window.location.href = "index.html";
            return;
        }

        // Actualizar los datos de sesión
        sessionStorage.setItem(
            "usuario",
            JSON.stringify(datos.usuario)
        );

    } catch (error) {

        console.error("Error al verificar el acceso:", error);

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("usuario");

        alert("Tu sesión no es válida. Inicia sesión nuevamente.");
        window.location.href = "login.html";

        return;
    }

    // Cerrar sesión
    const enlaceCerrarSesion = document.querySelector(
        '.menu_admin a[href="login.html"]'
    );

    if (enlaceCerrarSesion) {
        enlaceCerrarSesion.addEventListener("click", () => {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("usuario");
        });
    }

});
