
document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("formulario_experiencia");

    if (!formulario) {
        console.error("No se encontró el formulario de personalización.");
        return;
    }

    // Crear espacio para mostrar mensajes
    const mensaje = document.createElement("p");
    mensaje.id = "mensaje_formulario";
    mensaje.setAttribute("aria-live", "polite");

    formulario.appendChild(mensaje);

    formulario.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        // Recoger todos los campos, incluidos intereses y fotografía
        const datosFormulario = new FormData(formulario);

        // Evitar envíos repetidos mientras se procesa la solicitud
        const botonEnviar = formulario.querySelector(
            'button[type="submit"], input[type="submit"]'
        );

        if (botonEnviar) {
            botonEnviar.disabled = true;
        }

        mensaje.textContent = "Enviando tu solicitud...";
        mensaje.style.color = "#0E1F31";

        try {

            const respuesta = await fetch(
                "http://localhost:3000/api/solicitudes",
                {
                    method: "POST",
                    body: datosFormulario
                }
            );

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    resultado.errores ||
                    resultado.mensaje ||
                    "No fue posible enviar la solicitud."
                );
            }

            mensaje.textContent =
                "¡Tu solicitud fue enviada correctamente! Pronto nos pondremos en contacto contigo.";

            mensaje.style.color = "green";

            // Limpiar el formulario después de guardar
            formulario.reset();

        } catch (error) {

            console.error("Error al enviar el formulario:", error);

            mensaje.textContent =
                "No pudimos enviar tu solicitud. " + error.message;

            mensaje.style.color = "red";

        } finally {

            if (botonEnviar) {
                botonEnviar.disabled = false;
            }

        }
    });

});
