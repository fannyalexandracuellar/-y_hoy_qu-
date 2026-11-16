
const mongoose = require("mongoose");

const solicitudSchema = new mongoose.Schema({

    // Datos del cliente
    nombre: {
        type: String,
        required: true,
        trim: true
    },

    correo: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },

    telefono: {
        type: String,
        trim: true
    },

    // Información de la experiencia
    ocasion: {
        type: String,
        required: true
    },

    ocasion_detalle: {
        type: String
    },

    destinatario: {
        type: String,
        required: true
    },

    cantidad_personas: {
        type: Number,
        required: true,
        min: 1,
        max: 50
    },

    tipo_experiencia: {
    type: String,
    enum: [
        "interior_casa",
        "interior_establecimiento",
        "exterior",
        "indiferente"
    ]},

    intereses: [{
        type: String
    }],

    presupuesto: {
        type: String,
        required: true,
        enum: ["esencial", "especial", "premium", "por_definir"]
    },

    // Ubicación
    ciudad: {
        type: String,
        required: true
    },

    ubicacion: {
        type: String
    },

    // Archivos y detalles adicionales
    fotografia: {
        type: String
    },

    detalles: {
        type: String
    },

    // Estado de la solicitud
    estado: {
        type: String,
        enum: ["pendiente", "en_revision", "aprobada", "rechazada"],
        default: "pendiente"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Solicitud", solicitudSchema);
