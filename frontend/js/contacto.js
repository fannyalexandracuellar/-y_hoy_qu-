
const formulario = document.getElementById("formulario_mensaje");

// ==========================================
// ENVIAR MENSAJE DE CONTACTO
// ==========================================

formulario.addEventListener("submit", async (event) => {

    event.preventDefault();

    const botonEnviar = formulario.querySelector(
        'button[type="submit"]'
    );

    const datos = {
        nombre: document.getElementById("nombre_contacto").value.trim(),
        correo: document.getElementById("correo_contacto").value.trim(),
        telefono: document.getElementById("telefono_contacto").value.trim(),
        motivo: document.getElementById("motivo").value,
        mensaje: document.getElementById("mensaje").value.trim()
    };

    // Evitar mensajes vacíos
    if (
        !datos.nombre ||
        !datos.correo ||
        !datos.motivo ||
        !datos.mensaje
    ) {
        alert("Completa todos los campos obligatorios.");
        return;
    }

    try {

        botonEnviar.disabled = true;
        botonEnviar.textContent = "Enviando...";

        const respuesta = await fetch(
            "http://localhost:3001/api/contacto",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            }
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                resultado.mensaje || "No fue posible enviar el mensaje."
            );
        }

        alert(resultado.mensaje);

        formulario.reset();

    } catch (error) {

        console.error("Error al enviar el mensaje:", error);

        alert(
            error.message ||
            "No se pudo conectar con el servidor. Inténtalo nuevamente."
        );

    } finally {

        botonEnviar.disabled = false;
        botonEnviar.textContent = "Enviar mensaje";

    }

});
