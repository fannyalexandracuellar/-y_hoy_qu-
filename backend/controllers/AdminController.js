
const Usuario = require("../models/Usuario");
const Solicitud = require("../models/Solicitud");

// Obtener estadísticas generales del panel
const obtenerEstadisticas = async (req, res) => {
    try {
        const [
            totalClientes,
            totalSolicitudes,
            totalPedidos
        ] = await Promise.all([
            Usuario.countDocuments({ rol: "cliente" }),
            Solicitud.countDocuments(),
            Solicitud.countDocuments({
                estado: { $in: ["confirmada", "lista"] }
            })
        ]);

        res.status(200).json({
            estadisticas: {
                clientes: totalClientes,
                solicitudes: totalSolicitudes,
                pedidos: totalPedidos
            }
        });

    } catch (error) {
        console.error(
            "Error al obtener estadísticas:",
            error.message
        );

        res.status(500).json({
            mensaje: "Error al consultar las estadísticas"
        });
    }
};

// Obtener clientes registrados
const obtenerClientes = async (req, res) => {
    try {
        const clientes = await Usuario.find({
            rol: "cliente"
        })
            .select("-contrasena")
            .sort({ createdAt: -1 });

        res.status(200).json({
            clientes
        });

    } catch (error) {
        console.error(
            "Error al obtener clientes:",
            error.message
        );

        res.status(500).json({
            mensaje: "Error al consultar los clientes"
        });
    }
};

module.exports = {
    obtenerEstadisticas,
    obtenerClientes
};
