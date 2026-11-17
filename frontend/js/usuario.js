
document.addEventListener("DOMContentLoaded", () => {

    const enlaceLogin = document.getElementById("enlace_login");
    const menuUsuario = document.getElementById("menu_usuario");
    const botonPerfil = document.getElementById("boton_perfil");
    const nombreUsuario = document.getElementById("nombre_usuario");
    const opcionesPerfil = document.getElementById("opciones_perfil");
    const botonCerrarSesion = document.getElementById("cerrar_sesion");
    const enlaceSolicitudes = document.getElementById("enlace_solicitudes");

 
    if (!enlaceLogin || !menuUsuario) return;

    let usuario = null;

    try {
        usuario = JSON.parse(sessionStorage.getItem("usuario"));
    } catch (error) {
        sessionStorage.removeItem("usuario");
        sessionStorage.removeItem("token");
    }

    const token = sessionStorage.getItem("token");

   
    if (usuario && token) {

        enlaceLogin.style.display = "none";
        menuUsuario.style.display = "block";

        nombreUsuario.textContent = usuario.nombre || "Mi cuenta";

        // Cambiar las opciones según el rol.
        if (usuario.rol === "administrador" && enlaceSolicitudes) {

            enlaceSolicitudes.textContent = "Perfil administrador";
            enlaceSolicitudes.href = "admin.html";

        } else if (enlaceSolicitudes) {

            enlaceSolicitudes.textContent = "Mis solicitudes";
            enlaceSolicitudes.href = "mis-solicitudes.html";

        }

    } else {

        enlaceLogin.style.display = "list-item";
        menuUsuario.style.display = "none";

    }

    
    if (botonPerfil && opcionesPerfil) {

        botonPerfil.addEventListener("click", () => {
            opcionesPerfil.classList.toggle("activo");
        });

        document.addEventListener("click", (evento) => {

            if (!menuUsuario.contains(evento.target)) {
                opcionesPerfil.classList.remove("activo");
            }

        });

    }

  
    if (botonCerrarSesion) {

        botonCerrarSesion.addEventListener("click", () => {

            sessionStorage.removeItem("token");
            sessionStorage.removeItem("usuario");

            window.location.href = "index.html";

        });

    }

});
