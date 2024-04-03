const db = require('../configs/db.config');

class PedidoModel {

    constructor({ id, idCliente, tipo_pedido, cantidad, fecha_pedido, ubicacion_entrega, deleted, createdAt, updatedAt, deletedAt }) {
        this.id = id;
        this.idCliente = idCliente;
        this.tipo_pedido = tipo_pedido;
        this.cantidad = cantidad;
        this.fecha_pedido = fecha_pedido;
        this.ubicacion_entrega = ubicacion_entrega;
        this.deleted = deleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;

    }

    static async getAll({ offset, limit }, { sort, order }) {
        const connection = await db.createConnection();

        let query = `SELECT id_pedido, id_cliente, tipo_pedido, cantidad, fecha_pedido, ubicacion_entrega, deleted, created_at, updated_at, deleted_at FROM pedido WHERE deleted = 0`;

        if (sort && order) {
            query += ` ORDER BY ${sort} ${order}`
        }
        if (offset >= 0 && limit) {
            query += ` LIMIT ${offset}, ${limit}`;
        }
        const [rows] = await connection.query(query)
        connection.end();

        return rows;
    }

    static async getById(id) {
        const connection = await db.createConnection();
        const [rows] = await connection.execute("SELECT id_pedido, id_cliente, tipo_pedido, cantidad, fecha_pedido, ubicacion_entrega, deleted, created_at, updated_at, deleted_at FROM pedido WHERE id_pedido = ? AND deleted = 0", [id]);
        connection.end();

        if (rows.length > 0) {
            const row = rows[0];
            return new PedidoModel({ id: row.id, idCliente: row.id_cliente, tipo_pedido: row.tipo_pedido, cantidad: row.cantidad, fecha_pedido: row.fecha_pedido, ubicacion_entrega: row.ubicacion_entrega, deleted: row.deleted, createdAt: row.created_at, updatedAt: row.updated_at, deletedAt: row.deleted_at });
        }

        return null;
    }

    static async deleteById(id){
        const connection = await db.createConnection();

        const deletedAt = new Date();
        const [result] = connection.execute("UPDATE pedido SET deleted = 1, deletedAt = ? WHERE id = ?", [deletedAt, id]);
        connection.end();
        return result;
    }

    static async count() {
        const connection = await db.createConnection();
        const [rows] = await connection.query("SELECT COUNT(*) as count FROM pedido WHERE deleted = 0");
        connection.end();
        return rows[0].count;
    }

    async save() {
        const connection = await db.createConnection();
        const [result] = await connection.execute("INSERT INTO pedido (id_cliente, tipo_pedido, cantidad, fecha_pedido, ubicacion_entrega) VALUES (?, ?, ?, ?, ?)", [this.idCliente, this.tipo_pedido, this.cantidad, this.fecha_pedido, this.ubicacion_entrega]);
        connection.end();
        return result;
    }

    async updateById() {
        const connection = await db.createConnection();
        const updatedAt = new Date();
        const [result] = await connection.execute("UPDATE pedido SET id_cliente = ?, tipo_pedido = ?, cantidad = ?, fecha_pedido = ?, ubicacion_entrega = ?, updated_at = ? WHERE id = ?", [this.idCliente, this.tipo_pedido, this.cantidad, this.fecha_pedido, this.ubicacion_entrega, updatedAt, this.id]);
        connection.end();
        return result;
    }

    static async getAllByCliente({ offset, limit }, { sort, order }, id) {
        const connection = await db.createConnection();

        let query = `SELECT id_pedido, id_cliente, tipo_pedido, cantidad, fecha_pedido, ubicacion_entrega, deleted, created_at, updated_at, deleted_at FROM pedido WHERE deleted = 0 AND id_cliente = ${id}`;

        if (sort && order) {
            query += ` ORDER BY ${sort} ${order}`
        }
        if (offset >= 0 && limit) {
            query += ` LIMIT ${offset}, ${limit}`;
        }
        const [rows] = await connection.query(query)
        connection.end();

        return rows;
    }


}

module.exports = PedidoModel;