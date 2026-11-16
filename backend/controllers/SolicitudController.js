const Solicitud = require("../models/Solicitud");

// Crear una nueva solicitud
const crearSolicitud = async (req, res) => {
    try {

        // Obtener los datos enviados por el formulario
        const {
            nombre,
            correo,
            telefono,
            ocasion,
            ocasion_detalle,
            destinatario,
            cantidad_personas,
            tipo_experiencia,
            presupuesto,
            ciudad,
            ubicacion,
            detalles
        } = req.body;

        // Procesar los intereses seleccionados
        let intereses = req.body["intereses[]"] || req.body.intereses || [];

        if (!Array.isArray(intereses)) {
            intereses = [intereses];
        }

        // Obtener el nombre de la fotografía
        const fotografia = req.file ? req.file.filename : null;

        // Crear el documento en MongoDB
        const nuevaSolicitud = await Solicitud.create({
            nombre,
            correo,
            telefono,
            ocasion,
            ocasion_detalle,
            destinatario,
            cantidad_personas,
            tipo_experiencia,
            intereses,
            presupuesto,
            ciudad,
            ubicacion,
            fotografia,
            detalles
        });

        res.status(201).json({
            mensaje: "Solicitud creada correctamente",
            solicitud: nuevaSolicitud
        });

    } catch (error) {

        console.error("Error al crear solicitud:", error.message);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                mensaje: "Los datos enviados no son válidos",
                errores: error.message
            });
        }

        res.status(500).json({
            mensaje: "Error interno al guardar la solicitud"
        });
    }
};

module.exports = { crearSolicitud };