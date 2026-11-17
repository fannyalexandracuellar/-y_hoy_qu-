
document.addEventListener("DOMContentLoaded", () => {


    const formulario = document.getElementById("formulario_experiencia");

    if (!formulario) {
        console.error("No se encontró el formulario de personalización.");
        return;
    }

    const campoDestinatario = document.getElementById("destinatario");
    const campoOcasion = document.getElementById("ocasion");
    const campoPresupuesto = document.getElementById("presupuesto");
    const campoDetalles = document.getElementById("detalles");

   

    const mensaje = document.createElement("p");

    mensaje.id = "mensaje_formulario";
    mensaje.setAttribute("aria-live", "polite");

    formulario.appendChild(mensaje);

    

    const parametros = new URLSearchParams(window.location.search);

    const destinatarioChat = parametros.get("destinatario");
    const tipoChat = parametros.get("tipo");
    const ocasionChat = parametros.get("ocasion");
    const presupuestoChat = parametros.get("presupuesto");
    const experienciaChat = parametros.get("experiencia");

    let respuestasRecibidas = false;

    

    const equivalenciasDestinatario = {
        mi: "personal",
        pareja: "pareja",
        amigo: "amigos",
        familia: "familia",
        especial: "otra_persona"
    };

    if (destinatarioChat && campoDestinatario) {

        const valor = equivalenciasDestinatario[destinatarioChat];

        if (valor) {
            campoDestinatario.value = valor;
            respuestasRecibidas = true;
        }

    }


    const equivalenciasTipo = {
        interiores: "interior_casa",
        exteriores: "exterior",
        cajas: "indiferente",
        diversion: "indiferente",
        cualquiera: "indiferente"
    };

    if (tipoChat) {

        const valor = equivalenciasTipo[tipoChat];

        if (valor) {

            const opcion = formulario.querySelector(
                `input[name="tipo_experiencia"][value="${valor}"]`
            );

            if (opcion) {
                opcion.checked = true;
                respuestasRecibidas = true;
            }

        }

    }



    const equivalenciasOcasion = {
        cumpleanos: "cumpleanos",
        aniversario: "aniversario",
        celebracion: "celebracion",
        sin_motivo: "sin_motivo"
    };

    if (ocasionChat && campoOcasion) {

        const valor = equivalenciasOcasion[ocasionChat];

        if (valor) {
            campoOcasion.value = valor;
            respuestasRecibidas = true;
        }

    }

 

    const equivalenciasPresupuesto = {
        bajo: "esencial",
        medio: "especial",
        alto: "premium",
        sin_definir: "por_definir"
    };

    if (presupuestoChat && campoPresupuesto) {

        const valor = equivalenciasPresupuesto[presupuestoChat];

        if (valor) {
            campoPresupuesto.value = valor;
            respuestasRecibidas = true;
        }

    }

  

    if (experienciaChat && campoDetalles) {

        const textoRecomendacion =
            "Experiencia recomendada por el chatbot: " +
            experienciaChat;

        campoDetalles.value = campoDetalles.value
            ? textoRecomendacion + "\n\n" + campoDetalles.value
            : textoRecomendacion;

        respuestasRecibidas = true;

    }

  

    if (respuestasRecibidas) {

        const aviso = document.createElement("div");

        aviso.id = "aviso_chatbot";

        aviso.textContent =
            "¡Listo! Hemos completado algunos campos con tus respuestas del asistente. Puedes revisarlos y modificar lo que necesites.";

        aviso.setAttribute("role", "status");

        formulario.insertBefore(aviso, formulario.firstChild);

    }

   

    formulario.addEventListener("submit", async (evento) => {

        evento.preventDefault();

        
        const token = sessionStorage.getItem("token");

        if (!token) {

            mensaje.textContent =
                "Debes iniciar sesión para enviar una solicitud.";

            mensaje.style.color = "red";

            return;

        }

       
        const campoFotografia = document.getElementById("fotografia");

        if (
            campoFotografia &&
            campoFotografia.files.length > 0 &&
            campoFotografia.files[0].size > 5 * 1024 * 1024
        ) {

            mensaje.textContent =
                "La fotografía no puede superar los 5 MB.";

            mensaje.style.color = "red";

            return;

        }

        
        const datosFormulario = new FormData(formulario);

      
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
                "https://y-hoy-qu.onrender.com/api/solicitudes/personalizar",
                {
                    method: "POST",

                    headers: {
                        "Authorization": `Bearer ${token}`
                    },

                    body: datosFormulario
                }
            );

            const resultado = await respuesta.json();

            if (!respuesta.ok) {

                const errorServidor =
                    resultado.errores || resultado.mensaje;

                throw new Error(
                    typeof errorServidor === "string"
                        ? errorServidor
                        : "No fue posible enviar la solicitud."
                );

            }

            mensaje.textContent =
                "¡Tu solicitud fue enviada correctamente! Pronto nos pondremos en contacto contigo.";

            mensaje.style.color = "green";

            
            formulario.reset();

            
            const aviso = document.getElementById("aviso_chatbot");

            if (aviso) {
                aviso.remove();
            }

            
            window.history.replaceState(
                {},
                document.title,
                window.location.pathname
            );

        } catch (error) {

            console.error(
                "Error al enviar el formulario:",
                error
            );

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
