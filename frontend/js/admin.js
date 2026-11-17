
const API_URL = "http://localhost:3001/api";

const ESTADOS = {
    pendiente: "Pendiente",
    en_revision: "En revisión",
    confirmada: "Confirmada",
    lista: "Lista",
    rechazada: "Rechazada"
};

const ESTADOS_CONTACTO = {
    nuevo: "Nuevo",
    leido: "Leído",
    atendido: "Atendido"
};

const MOTIVOS_CONTACTO = {
    catalogo: "Información del catálogo",
    cajas: "Cajas sorpresa",
    suscripcion: "Planes de suscripción",
    personalizacion: "Experiencia personalizada",
    pedido: "Consulta sobre un pedido",
    alianza: "Propuesta de alianza comercial",
    otro: "Otro motivo"
};


// ==========================================
// INICIAR PANEL
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {

    const token = sessionStorage.getItem("token");
    const usuarioGuardado = sessionStorage.getItem("usuario");

    if (!token || !usuarioGuardado) {
        alert("Debes iniciar sesión para acceder al panel.");
        window.location.href = "login.html";
        return;
    }

    const botonCerrarSesion = document.getElementById("btn_cerrar_sesion");

    if (botonCerrarSesion) {
        botonCerrarSesion.addEventListener("click", () => {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("usuario");
        });
    }

    try {
        const respuesta = await fetch(`${API_URL}/auth/perfil`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const datos = await respuesta.json();

        if (!respuesta.ok || !datos.usuario || datos.usuario.rol !== "administrador") {
            throw new Error("Acceso no autorizado.");
        }

        sessionStorage.setItem("usuario", JSON.stringify(datos.usuario));

        await cargarEstadisticas(token);
        await cargarSolicitudes(token);
        await cargarPedidos(token);
        await cargarClientes(token);
        await cargarMensajesContacto(token);

    } catch (error) {
        console.error("Error al iniciar el panel:", error);

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("usuario");

        alert("No se pudo verificar tu sesión. Inicia sesión nuevamente.");
        window.location.href = "login.html";
    }

});


// ==========================================
// FUNCIÓN GENERAL PARA CONSULTAR LA API
// ==========================================

async function consultarAPI(ruta, token, opciones = {}) {

    const respuesta = await fetch(`${API_URL}${ruta}`, {
        ...opciones,
        headers: {
            Authorization: `Bearer ${token}`,
            ...(opciones.headers || {})
        }
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || "Error al consultar el servidor.");
    }

    return datos;
}


// ==========================================
// CARGAR ESTADÍSTICAS
// ==========================================

async function cargarEstadisticas(token) {

    try {
        const resultado = await consultarAPI("/admin/estadisticas", token);

        const stats = resultado.estadisticas;

        document.getElementById("stat_clientes").textContent = stats.clientes;
        document.getElementById("stat_solicitudes").textContent = stats.solicitudes;
        document.getElementById("stat_pedidos").textContent = stats.pedidos;

    } catch (error) {
        console.error("Error al cargar estadísticas:", error);
    }

}


// ==========================================
// CARGAR SOLICITUDES
// ==========================================

async function cargarSolicitudes(token) {

    const tabla = document.getElementById("tabla_solicitudes");

    try {
        const resultado = await consultarAPI("/solicitudes", token);

        const solicitudes = resultado.solicitudes || [];

        tabla.innerHTML = "";

        if (solicitudes.length === 0) {
            tabla.innerHTML = `
                <tr>
                    <td colspan="6">No hay solicitudes registradas.</td>
                </tr>
            `;
            return;
        }

        solicitudes.forEach(solicitud => {

            const fila = document.createElement("tr");

            const fecha = new Date(solicitud.createdAt).toLocaleDateString("es-CO");

            const experiencia = `${solicitud.ocasion || "Sin ocasión"} - ${solicitud.destinatario || "Sin destinatario"}`;

            const estadoActual = ESTADOS[solicitud.estado] ? solicitud.estado : "pendiente";

            fila.innerHTML = `
                <td>${escaparHTML(solicitud.nombre || "Cliente")}</td>
                <td>${escaparHTML(experiencia)}</td>
                <td>${fecha}</td>
                <td>${escaparHTML(solicitud.presupuesto || "No definido")}</td>

                <td>
                    <span class="estado-${estadoActual}">
                        ${ESTADOS[estadoActual]}
                    </span>
                </td>

                <td>
                    <select class="selector_estado" data-id="${solicitud._id}">
                        ${Object.entries(ESTADOS).map(([valor, texto]) => `
                            <option value="${valor}" ${valor === estadoActual ? "selected" : ""}>
                                ${texto}
                            </option>
                        `).join("")}
                    </select>
                </td>
            `;

            tabla.appendChild(fila);
        });

        tabla.querySelectorAll(".selector_estado").forEach(selector => {

            selector.addEventListener("change", async () => {

                const id = selector.dataset.id;
                const nuevoEstado = selector.value;

                selector.disabled = true;

                const actualizado = await cambiarEstadoSolicitud(
                    id,
                    nuevoEstado,
                    token
                );

                if (!actualizado) {
                    selector.disabled = false;
                }

            });

        });

    } catch (error) {
        console.error("Error al cargar solicitudes:", error);

        tabla.innerHTML = `
            <tr>
                <td colspan="6">No se pudieron cargar las solicitudes.</td>
            </tr>
        `;
    }

}


// ==========================================
// ACTUALIZAR ESTADO DE SOLICITUD
// ==========================================

async function cambiarEstadoSolicitud(id, nuevoEstado, token) {

    try {

        await consultarAPI(`/solicitudes/${id}/estado`, token, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                estado: nuevoEstado
            })
        });

        alert("El estado se actualizó correctamente.");

        await cargarSolicitudes(token);
        await cargarPedidos(token);
        await cargarEstadisticas(token);

        return true;

    } catch (error) {

        console.error("Error al actualizar el estado:", error);

        alert(error.message || "No se pudo actualizar el estado.");

        return false;
    }

}


// ==========================================
// CARGAR PEDIDOS
// ==========================================

async function cargarPedidos(token) {

    const tabla = document.getElementById("tabla_pedidos");

    try {

        const resultado = await consultarAPI("/solicitudes", token);

        const pedidos = (resultado.solicitudes || []).filter(solicitud =>
            ["confirmada", "lista"].includes(solicitud.estado)
        );

        tabla.innerHTML = "";

        if (pedidos.length === 0) {
            tabla.innerHTML = `
                <tr>
                    <td colspan="5">Todavía no hay pedidos confirmados.</td>
                </tr>
            `;
            return;
        }

        pedidos.forEach(pedido => {

            const fila = document.createElement("tr");

            const fecha = new Date(pedido.createdAt).toLocaleDateString("es-CO");

            fila.innerHTML = `
                <td>${escaparHTML(pedido._id.slice(-6).toUpperCase())}</td>
                <td>${escaparHTML(pedido.nombre || "Cliente")}</td>
                <td>${escaparHTML(pedido.tipo_experiencia || "Por definir")}</td>
                <td>${fecha}</td>
                <td>
                    <span class="estado-${pedido.estado}">
                        ${ESTADOS[pedido.estado]}
                    </span>
                </td>
            `;

            tabla.appendChild(fila);

        });

    } catch (error) {

        console.error("Error al cargar pedidos:", error);

        tabla.innerHTML = `
            <tr>
                <td colspan="5">No se pudieron cargar los pedidos.</td>
            </tr>
        `;
    }

}


// ==========================================
// CARGAR CLIENTES
// ==========================================

async function cargarClientes(token) {

    const tabla = document.getElementById("tabla_clientes");

    try {

        const resultado = await consultarAPI("/admin/clientes", token);

        const clientes = resultado.clientes || [];

        tabla.innerHTML = "";

        if (clientes.length === 0) {
            tabla.innerHTML = `
                <tr>
                    <td colspan="4">No hay clientes registrados.</td>
                </tr>
            `;
            return;
        }

        clientes.forEach(cliente => {

            const fila = document.createElement("tr");

            const fecha = new Date(cliente.createdAt).toLocaleDateString("es-CO");

            fila.innerHTML = `
                <td>${escaparHTML(cliente.nombre || "Sin nombre")}</td>
                <td>${escaparHTML(cliente.correo || "Sin correo")}</td>
                <td>${escaparHTML(cliente.telefono || "No registrado")}</td>
                <td>${fecha}</td>
            `;

            tabla.appendChild(fila);

        });

    } catch (error) {

        console.error("Error al cargar clientes:", error);

        tabla.innerHTML = `
            <tr>
                <td colspan="4">No se pudieron cargar los clientes.</td>
            </tr>
        `;
    }

}


// ==========================================
// CARGAR MENSAJES DE CONTACTO
// ==========================================

async function cargarMensajesContacto(token) {

    const tabla = document.getElementById("tabla_contactos");

    try {

        const resultado = await consultarAPI("/contacto", token);

        const mensajes = resultado.mensajes || [];

        tabla.innerHTML = "";

        if (mensajes.length === 0) {

            tabla.innerHTML = `
                <tr>
                    <td colspan="8">No hay mensajes de contacto registrados.</td>
                </tr>
            `;

            return;
        }

        mensajes.forEach(contacto => {

            const fila = document.createElement("tr");

            const fecha = new Date(contacto.createdAt).toLocaleDateString("es-CO");

            const estadoActual = ESTADOS_CONTACTO[contacto.estado]
                ? contacto.estado
                : "nuevo";

            const motivo = MOTIVOS_CONTACTO[contacto.motivo] || contacto.motivo;

            fila.innerHTML = `
                <td>${escaparHTML(contacto.nombre || "Sin nombre")}</td>

                <td>${escaparHTML(contacto.correo || "Sin correo")}</td>

                <td>${escaparHTML(contacto.telefono || "No registrado")}</td>

                <td>${escaparHTML(motivo || "Sin motivo")}</td>

                <td>${escaparHTML(contacto.mensaje || "Sin mensaje")}</td>

                <td>${fecha}</td>

                <td>
                    <span class="estado-${estadoActual}">
                        ${ESTADOS_CONTACTO[estadoActual]}
                    </span>
                </td>

                <td>
                    <select
                        class="selector_estado_contacto"
                        data-id="${escaparHTML(contacto._id)}"
                    >
                        ${Object.entries(ESTADOS_CONTACTO).map(([valor, texto]) => `
                            <option value="${valor}" ${valor === estadoActual ? "selected" : ""}>
                                ${texto}
                            </option>
                        `).join("")}
                    </select>
                </td>
            `;

            tabla.appendChild(fila);

        });

        // Escuchar cambios de estado
        tabla.querySelectorAll(".selector_estado_contacto").forEach(selector => {

            selector.addEventListener("change", async () => {

                const id = selector.dataset.id;
                const nuevoEstado = selector.value;

                selector.disabled = true;

                const actualizado = await cambiarEstadoContacto(
                    id,
                    nuevoEstado,
                    token
                );

                if (!actualizado) {
                    selector.disabled = false;
                }

            });

        });

    } catch (error) {

        console.error("Error al cargar mensajes de contacto:", error);

        tabla.innerHTML = `
            <tr>
                <td colspan="8">No se pudieron cargar los mensajes de contacto.</td>
            </tr>
        `;
    }

}


// ==========================================
// ACTUALIZAR ESTADO DE MENSAJE DE CONTACTO
// ==========================================

async function cambiarEstadoContacto(id, nuevoEstado, token) {

    try {

        await consultarAPI(`/contacto/${id}/estado`, token, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                estado: nuevoEstado
            })
        });

        alert("El estado del mensaje se actualizó correctamente.");

        await cargarMensajesContacto(token);

        return true;

    } catch (error) {

        console.error("Error al actualizar el mensaje:", error);

        alert(error.message || "No se pudo actualizar el estado del mensaje.");

        return false;
    }

}


// ==========================================
// EVITAR INSERTAR TEXTO HTML NO CONFIABLE
// ==========================================

function escaparHTML(texto) {

    return String(texto).replace(/[&<>"']/g, caracter => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[caracter]);

}
