

const mongoose = require("mongoose");

const solicitudSchema = new mongoose.Schema({

    
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
        ]
    },

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

    
    fotografia: {
        type: String
    },

    detalles: {
        type: String
    },

   
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },

   
    estado: {
        type: String,
        enum: [
            "pendiente",
            "en_revision",
            "confirmada",
            "lista",
            "rechazada"
        ],
        default: "pendiente"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Solicitud", solicitudSchema);
