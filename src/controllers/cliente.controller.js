const clienteModel = require('../models/cliente.model');
const bcrypt = require('bcrypt');
const saltosBcrypt = parseInt(process.env.BCRYPT);

const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const offset = (page - 1) * limit;
        const {sort, order} = req.query;

        const clientes = await clienteModel.getAll({offset, limit}, {sort, order});

        let response = {
            message: "clientes obtenidos exitosamente",
            data: clientes
        };

        if (page && limit) {
            const totalClientes = await clienteModel.count();
            response = {
                ...response,
                total: totalClientes,
                totalPages: Math.ceil(totalClientes / limit),
                currentPage: page
            };
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener los clientes",
            error: error.message
        });
    }
}

const getById = async (req, res) => {
    try {
        const idCliente = req.params.id;
        const cliente = await clienteModel.getById(idCliente);

        if (!cliente) {
            return res.status(404).json({
                message: `no se encontró el cliente con id ${idCliente}`
            });
        }

        return res.status(200).json({
            message: "cliente encontrado exitosamente",
            cliente
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener el cliente",
            error: error.message
        });
    }
}

const create = async (req, res) => {
    try {
        const {nombre, apellido, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, saltosBcrypt);
        const cliente = new clienteModel({nombre, apellido, email, password: hashedPassword});
        await cliente.save();

        return res.status(201).json({
            message: "cliente creado exitosamente",
            cliente
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al crear el cliente",
            error: error.message
        });
    }
}

const deleteById = async (req, res) => {
    try {
        const idCliente = req.params.id;

        await clienteModel.deleteById(idCliente);

        return res.status(200).json({
            message: "se eliminó el cliente correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al eliminar el cliente",
            error: error.message
        });
    }
}

const updateById = async (req, res) => {
    try {
        const idCliente = req.params.id;
        const {nombre, apellido, email, password} = req.body;
        let hashedPassword;
        if (password)
            hashedPassword = await bcrypt.hash(password, saltosBcrypt);
        const clienteUpdated = await clienteModel.getById(idCliente);

        if (!clienteUpdated) {
            return res.status(404).json({
                message: `no se encontró el cliente con id ${idCliente}`
            });
        }

        if (nombre)
            clienteUpdated.nombre = nombre;
        if (apellido)
            clienteUpdated.apellido = apellido;
        if (email)
            clienteUpdated.email = email;
        if (password)
            clienteUpdated.password = hashedPassword;

        await clienteUpdated.updateById();

        return res.status(200).json({
            message: "se actualizó el cliente correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al actualizar el cliente",
            error: error.message
        });
    }
}

const putById = async (req, res) => {
    try {
        const idCliente = req.params.id;
        const {nombre, apellido, email, password} = req.body;
        let hashedPassword;
        if (password)
            hashedPassword = await bcrypt.hash(password, saltosBcrypt);
        const clienteUpdated = await clienteModel.getById(idCliente);

        if (!clienteUpdated) {
            return res.status(404).json({
                message: `no se encontró el cliente con id ${idCliente}`
            });
        }

        if (nombre)
            clienteUpdated.nombre = nombre;
        else
            clienteUpdated.nombre = null;
        if (apellido)
            clienteUpdated.apellido = apellido;
        else
            clienteUpdated.apellido = null;
        if (email)
            clienteUpdated.email = email;
        else
            clienteUpdated.email = null;
        if (password)
            clienteUpdated.password = hashedPassword;
        else
            clienteUpdated.password = null;

        await clienteUpdated.updateById();
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al actualizar el cliente",
            error: error.message
        });
    }

}

module.exports = {
    index,
    getById,
    create,
    deleteById,
    updateById,
    putById
}