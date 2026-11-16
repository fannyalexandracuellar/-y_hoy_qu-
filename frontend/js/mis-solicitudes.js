
document.addEventListener("DOMContentLoaded", async () => {

    const token = sessionStorage.getItem("token");

    const mensaje = document.getElementById("mensaje_solicitudes");
    const lista = document.getElementById("lista_solicitudes");

    const totalSolicitudes = document.getElementById("total_solicitudes");
    const solicitudesRevision = document.getElementById("solicitudes_revision");
    const solicitudesAprobadas = document.getElementById("solicitudes_aprobadas");

    // Verificar que exista una sesión
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {

        mensaje.textContent = "Cargando tus solicitudes...";

        const respuesta = await fetch(
            "http://localhost:3001/api/solicitudes/mis-solicitudes",
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

        // Actualizar el resumen
        totalSolicitudes.textContent = solicitudes.length;

        solicitudesRevision.textContent = solicitudes.filter(
            solicitud => solicitud.estado === "en_revision"
        ).length;

        solicitudesAprobadas.textContent = solicitudes.filter(
            solicitud => solicitud.estado === "aprobada"
        ).length;

        // Comprobar si existen solicitudes
        if (solicitudes.length === 0) {

            mensaje.textContent =
                "Todavía no has enviado solicitudes. ¡Anímate a crear tu primera experiencia!";

            return;
        }

        mensaje.textContent = "";

        // Mostrar cada solicitud
        solicitudes.forEach(solicitud => {

            const tarjeta = document.createElement("article");
            tarjeta.classList.add("tarjeta_solicitud");

            const fecha = solicitud.createdAt
                ? new Date(solicitud.createdAt).toLocaleDateString("es-CO")
                : "Fecha no disponible";

            const estado = solicitud.estado || "pendiente";

            const estados = {
                pendiente: "Pendiente",
                en_revision: "En revisión",
                aprobada: "Aprobada",
                rechazada: "Rechazada"
            };

            const estadoTexto = estados[estado] || estado;

            tarjeta.innerHTML = `
                <div class="cabecera_solicitud">
                    <div>
                        <span class="fecha_solicitud">${fecha}</span>
                        <h3>${escaparHTML(solicitud.ocasion || "Experiencia personalizada")}</h3>
                    </div>

                    <span class="estado_solicitud estado_${escaparHTML(estado)}">
                        ${escaparHTML(estadoTexto)}
                    </span>
                </div>

                <div class="detalles_solicitud">
                    <p>
                        <strong>Destinatario:</strong>
                        ${escaparHTML(solicitud.destinatario || "No especificado")}
                    </p>

                    <p>
                        <strong>Tipo de experiencia:</strong>
                        ${escaparHTML(solicitud.tipo_experiencia || "No especificado")}
                    </p>

                    <p>
                        <strong>Ciudad:</strong>
                        ${escaparHTML(solicitud.ciudad || "No especificada")}
                    </p>

                    <p>
                        <strong>Personas:</strong>
                        ${escaparHTML(String(solicitud.cantidad_personas || "No especificado"))}
                    </p>
                </div>
            `;

            lista.appendChild(tarjeta);

        });

    } catch (error) {

        console.error("Error al consultar solicitudes:", error);

        mensaje.textContent = error.message;
        mensaje.style.color = "red";

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


// Evitar que los datos recibidos se interpreten como HTML
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
