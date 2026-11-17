
document.addEventListener("DOMContentLoaded", () => {

    

    const botonFlotante = document.getElementById("boton_asistente");
    const botonSeccion = document.getElementById("abrir_asistente_seccion");
    const ventana = document.getElementById("ventana_asistente");
    const botonCerrar = document.getElementById("cerrar_asistente");
    const mensajes = document.getElementById("mensajes_asistente");
    const opciones = document.getElementById("opciones_asistente");

    if (
        !botonFlotante ||
        !botonSeccion ||
        !ventana ||
        !botonCerrar ||
        !mensajes ||
        !opciones
    ) {
        console.error("No se encontraron todos los elementos del chatbot.");
        return;
    }

    

    const experiencias = [

        {
            nombre: "Noche de películas",
            categoria: "interiores",
            descripcion: "Una noche cómoda con películas y detalles sorpresa.",
            palabras: ["tranquilo", "peliculas", "pareja", "casa", "relajacion"],
            ocasion: ["cumpleanos", "aniversario", "sin_motivo"]
        },

        {
            nombre: "Tarde de juegos",
            categoria: "interiores",
            descripcion: "Una actividad divertida para compartir y disfrutar.",
            palabras: ["diversion", "juegos", "amigos", "familia", "grupo"],
            ocasion: ["cumpleanos", "sin_motivo"]
        },

        {
            nombre: "Una cena especial",
            categoria: "interiores",
            descripcion: "Una comida diferente para compartir un buen momento.",
            palabras: ["comida", "tranquilo", "pareja", "familia"],
            ocasion: ["cumpleanos", "aniversario", "celebracion"]
        },

        {
            nombre: "Picnic sorpresa",
            categoria: "exteriores",
            descripcion: "Una tarde especial al aire libre.",
            palabras: ["naturaleza", "tranquilo", "aire_libre", "pareja", "amigos"],
            ocasion: ["cumpleanos", "aniversario", "sin_motivo"]
        },

        {
            nombre: "Plan de aventura",
            categoria: "exteriores",
            descripcion: "Una oportunidad para salir de la rutina y descubrir actividades.",
            palabras: ["aventura", "diversion", "aire_libre", "amigos"],
            ocasion: ["cumpleanos", "celebracion", "sin_motivo"]
        },

        {
            nombre: "Una salida diferente",
            categoria: "exteriores",
            descripcion: "Conoce nuevos lugares y disfruta de algo fuera de lo habitual.",
            palabras: ["aventura", "naturaleza", "aire_libre", "pareja", "amigos"],
            ocasion: ["cumpleanos", "aniversario", "sin_motivo"]
        },

        {
            nombre: "Caja sorpresa",
            categoria: "cajas",
            descripcion: "Una selección de detalles preparados para sorprender.",
            palabras: ["sorpresa", "regalos", "creatividad", "personalizado"],
            ocasion: ["cumpleanos", "aniversario", "celebracion", "sin_motivo"]
        },

        {
            nombre: "Caja para ocasiones especiales",
            categoria: "cajas",
            descripcion: "Una caja de detalles para cumpleaños y celebraciones.",
            palabras: ["sorpresa", "regalos", "personalizado"],
            ocasion: ["cumpleanos", "aniversario", "celebracion"]
        }

    ];

  

    let respuestas = {
        destinatario: "",
        tipo: "",
        ocasion: "",
        presupuesto: ""
    };

    let chatIniciado = false;

  

    function crearUrlPersonalizacion(experiencia = "") {

        const parametros = new URLSearchParams();

        parametros.set("destinatario", respuestas.destinatario);
        parametros.set("tipo", respuestas.tipo);
        parametros.set("ocasion", respuestas.ocasion);
        parametros.set("presupuesto", respuestas.presupuesto);

        if (experiencia) {
            parametros.set("experiencia", experiencia);
        }

        return "personalizar.html?" + parametros.toString();

    }

 

    function abrirChat() {

        ventana.hidden = false;
        botonFlotante.style.display = "none";

        if (!chatIniciado) {
            iniciarChat();
        }

    }

    function cerrarChat() {

        ventana.hidden = true;
        botonFlotante.style.display = "flex";

    }

    botonFlotante.addEventListener("click", abrirChat);
    botonSeccion.addEventListener("click", abrirChat);
    botonCerrar.addEventListener("click", cerrarChat);


    function agregarMensaje(texto, tipo) {

        const mensaje = document.createElement("div");

        mensaje.classList.add(
            "mensaje_asistente",
            tipo === "bot" ? "mensaje_bot" : "mensaje_usuario"
        );

        mensaje.textContent = texto;

        mensajes.appendChild(mensaje);

        mensajes.scrollTop = mensajes.scrollHeight;

    }



    function mostrarOpciones(lista) {

        opciones.innerHTML = "";

        lista.forEach(opcion => {

            const boton = document.createElement("button");

            boton.type = "button";
            boton.textContent = opcion.texto;

            boton.addEventListener("click", () => {

                agregarMensaje(opcion.texto, "usuario");

                opciones.innerHTML = "";

                opcion.accion();

            });

            opciones.appendChild(boton);

        });

    }

  

    function iniciarChat() {

        chatIniciado = true;

        respuestas = {
            destinatario: "",
            tipo: "",
            ocasion: "",
            presupuesto: ""
        };

        mensajes.innerHTML = "";
        opciones.innerHTML = "";

        agregarMensaje(
            "¡Hola! Bienvenido a ¿Y hoy qué?! ✨",
            "bot"
        );

        agregarMensaje(
            "Estoy aquí para ayudarte a encontrar una experiencia especial. Primero, ¿para quién estás buscando un plan?",
            "bot"
        );

        preguntarDestinatario();

    }

   

    function preguntarDestinatario() {

        mostrarOpciones([

            {
                texto: "Para mí",
                accion: () => {
                    respuestas.destinatario = "mi";
                    preguntarTipo();
                }
            },

            {
                texto: "Para mi pareja",
                accion: () => {
                    respuestas.destinatario = "pareja";
                    preguntarTipo();
                }
            },

            {
                texto: "Para un amigo",
                accion: () => {
                    respuestas.destinatario = "amigo";
                    preguntarTipo();
                }
            },

            {
                texto: "Para mi familia",
                accion: () => {
                    respuestas.destinatario = "familia";
                    preguntarTipo();
                }
            },

            {
                texto: "Para alguien especial",
                accion: () => {
                    respuestas.destinatario = "especial";
                    preguntarTipo();
                }
            }

        ]);

    }

    // =========================================
    // PREGUNTA 2: TIPO DE EXPERIENCIA
    // =========================================

    function preguntarTipo() {

        agregarMensaje(
            "¡Qué bien! ¿Qué tipo de experiencia te gustaría?",
            "bot"
        );

        mostrarOpciones([

            {
                texto: "Algo tranquilo en casa",
                accion: () => {
                    respuestas.tipo = "interiores";
                    preguntarOcasion();
                }
            },

            {
                texto: "Una salida al aire libre",
                accion: () => {
                    respuestas.tipo = "exteriores";
                    preguntarOcasion();
                }
            },

            {
                texto: "Una caja sorpresa",
                accion: () => {
                    respuestas.tipo = "cajas";
                    preguntarOcasion();
                }
            },

            {
                texto: "Algo divertido y diferente",
                accion: () => {
                    respuestas.tipo = "diversion";
                    preguntarOcasion();
                }
            },

            {
                texto: "Me da igual, sorpréndeme",
                accion: () => {
                    respuestas.tipo = "cualquiera";
                    preguntarOcasion();
                }
            }

        ]);

    }



    function preguntarOcasion() {

        agregarMensaje(
            "¿Hay alguna ocasión especial?",
            "bot"
        );

        mostrarOpciones([

            {
                texto: "Cumpleaños",
                accion: () => {
                    respuestas.ocasion = "cumpleanos";
                    preguntarPresupuesto();
                }
            },

            {
                texto: "Aniversario",
                accion: () => {
                    respuestas.ocasion = "aniversario";
                    preguntarPresupuesto();
                }
            },

            {
                texto: "Celebración",
                accion: () => {
                    respuestas.ocasion = "celebracion";
                    preguntarPresupuesto();
                }
            },

            {
                texto: "Solo quiero sorprender",
                accion: () => {
                    respuestas.ocasion = "sin_motivo";
                    preguntarPresupuesto();
                }
            }

        ]);

    }

 

    function preguntarPresupuesto() {

        agregarMensaje(
            "¡Ya casi terminamos! ¿Qué presupuesto tienes pensado?",
            "bot"
        );

        mostrarOpciones([

            {
                texto: "Menos de $100.000",
                accion: () => {
                    respuestas.presupuesto = "bajo";
                    recomendarExperiencias();
                }
            },

            {
                texto: "Entre $100.000 y $250.000",
                accion: () => {
                    respuestas.presupuesto = "medio";
                    recomendarExperiencias();
                }
            },

            {
                texto: "Más de $250.000",
                accion: () => {
                    respuestas.presupuesto = "alto";
                    recomendarExperiencias();
                }
            },

            {
                texto: "Todavía no lo sé",
                accion: () => {
                    respuestas.presupuesto = "sin_definir";
                    recomendarExperiencias();
                }
            }

        ]);

    }



    function recomendarExperiencias() {

        agregarMensaje(
            "¡Gracias por responder! Estoy buscando opciones para ti...",
            "bot"
        );

        const resultados = experiencias
            .map(experiencia => {

                let puntuacion = 0;

                // Coincidencia de categoría
                if (
                    respuestas.tipo === "cualquiera" ||
                    experiencia.categoria === respuestas.tipo
                ) {
                    puntuacion += 3;
                }

                // Coincidencia de ocasión
                if (experiencia.ocasion.includes(respuestas.ocasion)) {
                    puntuacion += 2;
                }

                // Coincidencia de destinatario
                if (experiencia.palabras.includes(respuestas.destinatario)) {
                    puntuacion += 1;
                }

                // Coincidencia con planes divertidos
                if (
                    respuestas.tipo === "diversion" &&
                    experiencia.palabras.includes("diversion")
                ) {
                    puntuacion += 3;
                }

                return {
                    ...experiencia,
                    puntuacion
                };

            })
            .filter(experiencia => experiencia.puntuacion > 0)
            .sort((a, b) => b.puntuacion - a.puntuacion)
            .slice(0, 3);

    


        if (resultados.length === 0) {

            agregarMensaje(
                "No encontré una coincidencia exacta, pero podemos ayudarte a crear una experiencia personalizada.",
                "bot"
            );

            mostrarOpciones([

                {
                    texto: "Personalizar mi experiencia",
                    accion: () => {
                        window.location.href = crearUrlPersonalizacion();
                    }
                },

                {
                    texto: "Volver a empezar",
                    accion: iniciarChat
                }

            ]);

            return;

        }

        agregarMensaje(
            "¡Encontré algunas opciones que podrían gustarte! Estas son mis recomendaciones:",
            "bot"
        );

     


        resultados.forEach(experiencia => {

            const tarjeta = document.createElement("article");

            tarjeta.classList.add("tarjeta_recomendacion");

            // Contenido
            const contenido = document.createElement("div");

            contenido.classList.add("contenido_recomendacion");

            // Categoría
            const categoria = document.createElement("span");

            categoria.classList.add("categoria_recomendacion");

            categoria.textContent =
                experiencia.categoria === "interiores"
                    ? "Experiencia en interiores"
                    : experiencia.categoria === "exteriores"
                        ? "Experiencia al aire libre"
                        : "Caja sorpresa";

           
            const titulo = document.createElement("h4");

            titulo.textContent = experiencia.nombre;

           
            const descripcion = document.createElement("p");

            descripcion.textContent = experiencia.descripcion;

            const enlace = document.createElement("a");

            enlace.href = crearUrlPersonalizacion(experiencia.nombre);

            enlace.textContent = "Personalizar esta experiencia";

            
            contenido.appendChild(categoria);
            contenido.appendChild(titulo);
            contenido.appendChild(descripcion);
            contenido.appendChild(enlace);

            tarjeta.appendChild(contenido);

            mensajes.appendChild(tarjeta);

        });

        agregarMensaje(
            "Estas son recomendaciones iniciales. Puedes elegir una opción o personalizar tu experiencia para contarnos más detalles.",
            "bot"
        );


        mostrarOpciones([

            {
                texto: "Volver a empezar",
                accion: iniciarChat
            },

            {
                texto: "Personalizar mi experiencia",
                accion: () => {
                    window.location.href = crearUrlPersonalizacion();
                }
            }

        ]);

        mensajes.scrollTop = mensajes.scrollHeight;

    }

});
