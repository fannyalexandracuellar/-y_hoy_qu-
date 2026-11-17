
const mongoose = require("mongoose");
const Solicitud = require("../models/Solicitud");

// Crear una nueva solicitud
const crearSolicitud = async (req, res) => {
    try {
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

        let intereses =
            req.body["intereses[]"] ||
            req.body.intereses ||
            [];

        if (!Array.isArray(intereses)) {
            intereses = [intereses];
        }

        const fotografia = req.file
            ? req.file.filename
            : null;

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
            detalles,
            usuario: req.usuario.id
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

// Consultar solicitudes del usuario autenticado
const obtenerMisSolicitudes = async (req, res) => {
    try {
        const solicitudes = await Solicitud.find({
            usuario: req.usuario.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            mensaje: "Solicitudes consultadas correctamente",
            solicitudes
        });

    } catch (error) {
        console.error("Error al consultar solicitudes:", error.message);

        res.status(500).json({
            mensaje: "Error al consultar tus solicitudes"
        });
    }
};

// Consultar todas las solicitudes (Administrador)
const obtenerTodasLasSolicitudes = async (req, res) => {
    try {
        const solicitudes = await Solicitud.find()
            .populate("usuario", "nombre correo telefono")
            .sort({ createdAt: -1 });

        res.status(200).json({
            mensaje: "Todas las solicitudes consultadas correctamente",
            solicitudes
        });

    } catch (error) {
        console.error("Error al consultar todas las solicitudes:", error.message);

        res.status(500).json({
            mensaje: "Error al consultar las solicitudes"
        });
    }
};

// Actualizar estado de una solicitud (Administrador)
const actualizarEstadoSolicitud = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                mensaje: "El identificador de la solicitud no es válido."
            });
        }

        const estadosPermitidos = [
            "pendiente",
            "en_revision",
            "confirmada",
            "lista",
            "rechazada"
        ];

        if (!estadosPermitidos.includes(estado)) {
            return res.status(400).json({
                mensaje: "El estado enviado no es válido."
            });
        }

        const solicitud = await Solicitud.findByIdAndUpdate(
            id,
            { $set: { estado: estado } },
            {
                new: true,
                runValidators: false
            }
        );

        if (!solicitud) {
            return res.status(404).json({
                mensaje: "Solicitud no encontrada."
            });
        }

        res.status(200).json({
            mensaje: "Estado actualizado correctamente.",
            solicitud
        });

    } catch (error) {
        console.error("Error al actualizar estado:", error);

        res.status(500).json({
            mensaje: "Error al actualizar el estado de la solicitud."
        });
    }
};

module.exports = {
    crearSolicitud,
    obtenerMisSolicitudes,
    obtenerTodasLasSolicitudes,
    actualizarEstadoSolicitud
};
