
const Contacto = require("../models/Contacto");

const crearMensaje = async (req, res) => {

    try {

        const {
            nombre,
            correo,
            telefono,
            motivo,
            mensaje
        } = req.body;

    
        if (!nombre || !correo || !motivo || !mensaje) {
            return res.status(400).json({
                mensaje: "Completa todos los campos obligatorios."
            });
        }

      
        const nuevoMensaje = new Contacto({
            nombre,
            correo,
            telefono,
            motivo,
            mensaje
        });

        await nuevoMensaje.save();

        return res.status(201).json({
            mensaje: "Tu mensaje fue enviado correctamente."
        });

    } catch (error) {

        console.error("Error al guardar el mensaje:", error);

        return res.status(500).json({
            mensaje: "No fue posible enviar tu mensaje."
        });

    }
};




const obtenerMensajes = async (req, res) => {

    try {

        const mensajes = await Contacto.find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            mensajes
        });

    } catch (error) {

        console.error("Error al consultar los mensajes:", error);

        return res.status(500).json({
            mensaje: "No fue posible consultar los mensajes."
        });

    }
};




const actualizarEstadoMensaje = async (req, res) => {

    try {

        const { id } = req.params;
        const { estado } = req.body;

        const estadosPermitidos = [
            "nuevo",
            "leido",
            "atendido"
        ];

        if (!estadosPermitidos.includes(estado)) {
            return res.status(400).json({
                mensaje: "El estado indicado no es válido."
            });
        }

        const mensajeActualizado = await Contacto.findByIdAndUpdate(
            id,
            { estado },
            { new: true, runValidators: true }
        );

        if (!mensajeActualizado) {
            return res.status(404).json({
                mensaje: "No se encontró el mensaje."
            });
        }

        return res.status(200).json({
            mensaje: "Estado actualizado correctamente.",
            contacto: mensajeActualizado
        });

    } catch (error) {

        console.error("Error al actualizar el mensaje:", error);

        return res.status(500).json({
            mensaje: "No fue posible actualizar el estado."
        });

    }
};


module.exports = {
    crearMensaje,
    obtenerMensajes,
    actualizarEstadoMensaje
};
