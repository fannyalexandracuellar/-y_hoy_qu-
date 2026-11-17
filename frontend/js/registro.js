
const formulario = document.getElementById("formulario_registro");


const mensaje = document.createElement("p");
mensaje.id = "mensaje_registro";
mensaje.setAttribute("aria-live", "polite");
formulario.appendChild(mensaje);

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const nombre = document.getElementById("nombre_registro").value.trim();
    const correo = document.getElementById("correo_registro").value.trim();
    const telefono = document.getElementById("telefono_registro").value.trim();
    const contrasena = document.getElementById("contrasena_registro").value;
    const confirmarContrasena = document.getElementById("confirmar_contrasena").value;

   
    if (contrasena !== confirmarContrasena) {
        mensaje.textContent = "Las contraseñas no coinciden.";
        return;
    }

    if (contrasena.length < 8) {
        mensaje.textContent = "La contraseña debe tener al menos 8 caracteres.";
        return;
    }

    const boton = formulario.querySelector('button[type="submit"]');
    boton.disabled = true;
    mensaje.textContent = "Creando tu cuenta...";

    try {
        const respuesta = await fetch("http://localhost:3001/api/auth/registro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre,
                correo,
                telefono,
                contrasena
            })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.mensaje || "No se pudo crear la cuenta.");
        }

        mensaje.textContent = "¡Tu cuenta fue creada correctamente!";
        formulario.reset();

    } catch (error) {
        mensaje.textContent = error.message || "No fue posible conectar con el servidor.";
    } finally {
        boton.disabled = false;
    }
});
