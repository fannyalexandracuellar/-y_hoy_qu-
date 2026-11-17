
const mongoose = require("mongoose");

const contactoSchema = new mongoose.Schema({

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

    motivo: {
        type: String,
        required: true,
        enum: [
            "catalogo",
            "cajas",
            "suscripcion",
            "personalizacion",
            "pedido",
            "alianza",
            "otro"
        ]
    },

    mensaje: {
        type: String,
        required: true,
        trim: true
    },

    estado: {
        type: String,
        enum: ["nuevo", "leido", "atendido"],
        default: "nuevo"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Contacto", contactoSchema);
