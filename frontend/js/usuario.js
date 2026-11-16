
document.addEventListener("DOMContentLoaded", () => {

    const enlaceLogin = document.getElementById("enlace_login");
    const menuUsuario = document.getElementById("menu_usuario");
    const botonPerfil = document.getElementById("boton_perfil");
    const nombreUsuario = document.getElementById("nombre_usuario");
    const opcionesPerfil = document.getElementById("opciones_perfil");
    const botonCerrarSesion = document.getElementById("cerrar_sesion");

    // Si esta página no tiene el menú de usuario, no hacemos nada.
    if (!enlaceLogin || !menuUsuario) return;

    let usuario = null;

    try {
        usuario = JSON.parse(sessionStorage.getItem("usuario"));
    } catch (error) {
        sessionStorage.removeItem("usuario");
        sessionStorage.removeItem("token");
    }

    // Mostrar el menú correspondiente según la sesión.
    if (usuario && sessionStorage.getItem("token")) {
        enlaceLogin.style.display = "none";
        menuUsuario.style.display = "block";
        nombreUsuario.textContent = usuario.nombre;
    } else {
        enlaceLogin.style.display = "list-item";
        menuUsuario.style.display = "none";
    }

    // Abrir y cerrar el menú de perfil.
    if (botonPerfil && opcionesPerfil) {
        botonPerfil.addEventListener("click", () => {
            opcionesPerfil.classList.toggle("activo");
        });

        document.addEventListener("click", (evento) => {
            if (
                !menuUsuario.contains(evento.target)
            ) {
                opcionesPerfil.classList.remove("activo");
            }
        });
    }

    // Cerrar sesión.
    if (botonCerrarSesion) {
        botonCerrarSesion.addEventListener("click", () => {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("usuario");

            window.location.href = "index.html";
        });
    }

});
