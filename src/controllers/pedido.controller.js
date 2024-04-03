const pedidoModel = require('../models/pedido.model');

const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const offset = (page - 1) * limit;
        const {sort, order} = req.query;

        const pedidos = await pedidoModel.getAll({offset, limit}, {sort, order});

        let response = {
            message: "pedidos obtenidos exitosamente",
            data: pedidos
        };

        if (page && limit) {
            const totalPedidos = await pedidoModel.count();
            response = {
                ...response,
                total: totalPedidos,
                totalPages: Math.ceil(totalPedidos / limit),
                currentPage: page
            };
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener los pedidos",
            error: error.message
        });
    }
}

const getById = async (req, res) => {
    try {
        const idPedido = req.params.id;
        const pedido = await pedidoModel.getById(idPedido);

        if (!pedido) {
            return res.status(404).json({
                message: `no se encontró el pedido con id ${idPedido}`
            });
        }

        return res.status(200).json({
            message: "pedido encontrado exitosamente",
            pedido
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener el pedido",
            error: error.message
        });
    }
}

const create = async (req, res) => {
    try {
        const {idCliente, tipo_pedido, cantidad, fecha_pedido, ubicacion_entrega} = req.body;
        const pedido = new pedidoModel({idCliente, tipo_pedido, cantidad, fecha_pedido, ubicacion_entrega});
        await pedido.save();

        return res.status(201).json({
            message: "pedido creado exitosamente",
            pedido
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al crear el pedido",
            error: error.message
        });
    }

}

const updateById = async (req, res) => {
    try {
        const idPedido = req.params.id;
        const { tipo_pedido, cantidad, fecha_pedido, ubicacion_entrega} = req.body;
        const pedidoUpdated = pedidoModel.getById(idPedido);
        if (!pedidoUpdated) {
            return res.status(404).json({
                message: `no se encontró el pedido con id ${idPedido}`
            });
        }
        if (tipo_pedido) pedidoUpdated.tipo_pedido = tipo_pedido;
        if (cantidad) pedidoUpdated.cantidad = cantidad;
        if (fecha_pedido) pedidoUpdated.fecha_pedido = fecha_pedido;
        if (ubicacion_entrega) pedidoUpdated.ubicacion_entrega = ubicacion_entrega;

        await pedidoUpdated.updateById();

        return res.status(200).json({
            message: "pedido actualizado exitosamente",
            pedidoUpdated
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al actualizar el pedido",
            error: error.message
        });
    }
}

const deleteById = async (req, res) => {
    try {
        const idPedido = req.params.id;

        await pedidoModel.deleteById(idPedido);

        return res.status(200).json({
            message: "se eliminó el pedido correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al eliminar el pedido",
            error: error.message
        });
    }

}

const putById = async (req, res) => {
    try {
        const idPedido = req.params.id;
        const { tipo_pedido, cantidad, fecha_pedido, ubicacion_entrega} = req.body;
        const pedidoUpdated = pedidoModel.getById(idPedido);
        if (!pedidoUpdated) {
            return res.status(404).json({
                message: `no se encontró el pedido con id ${idPedido}`
            });
        }
        if (tipo_pedido) pedidoUpdated.tipo_pedido = tipo_pedido;
        else pedidoUpdated.tipo_pedido = null;
        if (cantidad) pedidoUpdated.cantidad = cantidad;
        else pedidoUpdated.cantidad = null;
        if (fecha_pedido) pedidoUpdated.fecha_pedido = fecha_pedido;
        else pedidoUpdated.fecha_pedido = null;
        if (ubicacion_entrega) pedidoUpdated.ubicacion_entrega = ubicacion_entrega;
        else pedidoUpdated.ubicacion_entrega = null;

        await pedidoUpdated.updateById();

        return res.status(200).json({
            message: "pedido actualizado exitosamente",
            pedidoUpdated
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al actualizar el pedido",
            error: error.message
        });
    }

}

const getAllByCliente = async (req, res) => {
    try {
        const idCliente = req.params.id;
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const offset = (page - 1) * limit;
        const {sort, order} = req.query;

        const pedidos = await pedidoModel.getAllByCliente({offset, limit}, {sort, order}, idCliente);

        let response = {
            message: "pedidos obtenidos exitosamente",
            data: pedidos
        };

        if (page && limit) {
            const totalPedidos = await pedidoModel.count();
            response = {
                ...response,
                total: totalPedidos,
                totalPages: Math.ceil(totalPedidos / limit),
                currentPage: page
            };
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener los pedidos",
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
    putById,
    getAllByCliente
}