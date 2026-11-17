
document.addEventListener("DOMContentLoaded", async () => {

    const token = sessionStorage.getItem("token");

    const mensaje = document.getElementById("mensaje_solicitudes");
    const lista = document.getElementById("lista_solicitudes");

    const totalSolicitudes = document.getElementById("total_solicitudes");
    const solicitudesRevision = document.getElementById("solicitudes_revision");
    const solicitudesAprobadas = document.getElementById("solicitudes_aprobadas");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {

        mensaje.textContent = "Cargando tus solicitudes...";

        const respuesta = await fetch(
            "https://y-hoy-qu.onrender.com/api/solicitudes/mis-solicitudes",
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
                resultado.mensaje || "No fue posible consultar tus solicitudes."
            );
        }

        const solicitudes = resultado.solicitudes || [];

      
        totalSolicitudes.textContent = solicitudes.length;

        solicitudesRevision.textContent = solicitudes.filter(
            solicitud =>
                solicitud.estado === "pendiente" ||
                solicitud.estado === "en_revision"
        ).length;

        solicitudesAprobadas.textContent = solicitudes.filter(
            solicitud =>
                solicitud.estado === "confirmada" ||
                solicitud.estado === "lista"
        ).length;

        lista.innerHTML = "";

        
        if (solicitudes.length === 0) {

            mensaje.textContent =
                "Todavía no tienes experiencias solicitadas. ¡Anímate a crear la primera!";

            return;
        }

        mensaje.textContent = "";

       
        const estados = {
            pendiente: "Pendiente",
            en_revision: "En revisión",
            confirmada: "Confirmada",
            lista: "Lista para disfrutar",
            rechazada: "Rechazada"
        };

        
        const tiposExperiencia = {
            interior_casa: "Interior de una casa",
            interior_establecimiento: "Interior de un establecimiento",
            exterior: "Al aire libre",
            indiferente: "Sin preferencia"
        };

       
        const presupuestos = {
            esencial: "Esencial",
            especial: "Especial",
            premium: "Premium",
            por_definir: "Por definir"
        };

       
        solicitudes.forEach(solicitud => {

            const tarjeta = document.createElement("article");
            tarjeta.classList.add("tarjeta_solicitud");

            const fecha = solicitud.createdAt
                ? new Date(solicitud.createdAt).toLocaleDateString("es-CO", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                })
                : "Fecha no disponible";

            const estado = estados[solicitud.estado] || "Sin estado";

            const tipo = tiposExperiencia[solicitud.tipo_experiencia]
                || "No especificado";

            const presupuesto = presupuestos[solicitud.presupuesto]
                || "No especificado";

            const intereses = Array.isArray(solicitud.intereses)
                && solicitud.intereses.length > 0
                ? solicitud.intereses.map(escaparHTML).join(", ")
                : "No especificados";

            tarjeta.innerHTML = `
                <div class="cabecera_solicitud">

                    <div class="titulo_solicitud">
                        <span class="fecha_solicitud">
                            ${escaparHTML(fecha)}
                        </span>

                        <h3>
                            ${escaparHTML(solicitud.ocasion || "Experiencia personalizada")}
                        </h3>

                        <p class="destinatario_solicitud">
                            Para: ${escaparHTML(solicitud.destinatario || "No especificado")}
                        </p>
                    </div>

                    <span class="estado_solicitud estado_${escaparHTML(solicitud.estado || "pendiente")}">
                        ${escaparHTML(estado)}
                    </span>

                </div>

                <div class="resumen_datos_solicitud">

                    <div>
                        <span>PERSONAS</span>
                        <strong>
                            ${escaparHTML(String(solicitud.cantidad_personas ?? "No especificado"))}
                        </strong>
                    </div>

                    <div>
                        <span>PRESUPUESTO</span>
                        <strong>${escaparHTML(presupuesto)}</strong>
                    </div>

                    <div>
                        <span>TIPO</span>
                        <strong>${escaparHTML(tipo)}</strong>
                    </div>

                </div>

                <div class="detalles_solicitud">

                    <h4>Detalles de tu experiencia</h4>

                    <p>
                        <strong>Ocasión:</strong>
                        ${escaparHTML(solicitud.ocasion_detalle || "No especificada")}
                    </p>

                    <p>
                        <strong>Intereses:</strong>
                        ${intereses}
                    </p>

                    <p>
                        <strong>Ciudad:</strong>
                        ${escaparHTML(solicitud.ciudad || "No especificada")}
                    </p>

                    <p>
                        <strong>Ubicación:</strong>
                        ${escaparHTML(solicitud.ubicacion || "No especificada")}
                    </p>

                    <p>
                        <strong>Detalles adicionales:</strong>
                        ${escaparHTML(solicitud.detalles || "Sin detalles adicionales")}
                    </p>

                </div>
            `;

            lista.appendChild(tarjeta);

        });

    } catch (error) {

        console.error("Error al consultar solicitudes:", error);

        mensaje.textContent = error.message;
        mensaje.classList.add("error_solicitudes");

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



function escaparHTML(valor) {

    return String(valor).replace(/[&<>"']/g, caracter => {

        const caracteres = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return caracteres[caracter];

    });

}
