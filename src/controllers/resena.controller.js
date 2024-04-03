const resenaModel = require('../models/resena.model');
const clienteModel = require('../models/cliente.model');

const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const offset = (page - 1) * limit;
        const {sort, order} = req.query;

        const resenas = await resenaModel.getAll({offset, limit}, {sort, order});

        let response = {
            message: "resenas obtenidas exitosamente",
            data: resenas
        };

        if (page && limit) {
            const totalResenas = await resenaModel.count();
            response = {
                ...response,
                total: totalResenas,
                totalPages: Math.ceil(totalResenas / limit),
                currentPage: page
            };
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener las resenas",
            error: error.message
        });
    }
}

const getById = async (req, res) => {
    try {
        const idResena = req.params.id;
        const resena = await resenaModel.getById(idResena);

        if (!resena) {
            return res.status(404).json({
                message: `no se encontró la resena con id ${idResena}`
            });
        }

        return res.status(200).json({
            message: "resena encontrada exitosamente",
            resena
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener la resena",
            error: error.message
        });
    }
}

const create = async (req, res) => {
    try {
        const {idCliente, idProducto, calificacion, comentario} = req.body;
        const cliente = clienteModel.getById(idCliente);
        const nombreCompleto = cliente.nombre + " " + cliente.apellido;
        const resena = new resenaModel({
            idCliente,
            idProducto,
            calificacion,
            nombre: nombreCompleto,
            comentario,

        });
        return res.status(201).json({
            message: "resena creada exitosamente",
            resena
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al crear la resena",
            error: error.message
        });
    }
}

const updateById = async (req, res) => {
    try {
        const idResena = req.params.id;
        const {calificacion, nombre, comentario} = req.body;
        const resenaUpdated = resenaModel.getById(idResena);
        if (!resenaUpdated) {
            return res.status(404).json({
                message: `no se encontró la resena con id ${idResena}`
            });
        }
        if (calificacion) resenaUpdated.calificacion = calificacion;
        if (nombre) resenaUpdated.nombre = nombre;
        if (comentario) resenaUpdated.comentario = comentario;
        await resenaUpdated.save();
        return res.status(200).json({
            message: "resena actualizada exitosamente",
            resena: resenaUpdated
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al actualizar la resena",
            error: error.message
        });
    }
}

const deleteById = async (req, res) => {
    try {
        const idResena = req.params.id;
        await resenaModel.deleteById(idResena);
        return res.status(200).json({
            message: "se eliminó la resena correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al eliminar la resena",
            error: error.message
        });
    }
}

const putById = async (req, res) => {
    try {
        const idResena = req.params.id;
        const {calificacion, nombre, comentario} = req.body;
        const resenaUpdated = resenaModel.getById(idResena);
        if (!resenaUpdated) {
            return res.status(404).json({
                message: `no se encontró la resena con id ${idResena}`
            });
        }
        if (calificacion) resenaUpdated.calificacion = calificacion;
        else resenaUpdated.calificacion = null;
        if (nombre) resenaUpdated.nombre = nombre;
        else resenaUpdated.nombre = null;
        if (comentario) resenaUpdated.comentario = comentario;
        else resenaUpdated.comentario = null;
        await resenaUpdated.save();
        return res.status(200).json({
            message: "resena actualizada exitosamente",
            resena: resenaUpdated
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al actualizar la resena",
            error: error.message
        });
    }
}

module.exports = {
    index,
    getById,
    create,
    updateById,
    deleteById,
    putById
}