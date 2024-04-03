const db = require('../configs/db.config');

class ResenaModel {
    constructor({ id, idCliente, idPedido, calificacion, nombre, comentario, deleted, createdAt, updatedAt, deletedAt }) {
        this.id = id;
        this.idCliente = idCliente;
        this.idPedido = idPedido;
        this.calificacion = calificacion;
        this.nombre = nombre;
        this.comentario = comentario;
        this.deleted = deleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }

    static async getAll({ offset, limit }, { sort, order }) {
        const connection = await db.createConnection();

        let query = `SELECT id_resena, id_cliente, id_pedido, calificacion, nombre, comentario, deleted, created_at, updated_at, deleted_at FROM resena WHERE deleted = 0`;

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
        const [rows] = await connection.execute("SELECT id_resena, id_cliente, id_pedido, calificacion, nombre, comentario, deleted, created_at, updated_at, deleted_at FROM resena WHERE id_resena = ? AND deleted = 0", [id]);
        connection.end();

        if (rows.length > 0) {
            const row = rows[0];
            return new ResenaModel({ id: row.id, idCliente: row.id_cliente, idPedido: row.id_pedido, calificacion: row.calificacion, nombre: row.nombre, comentario: row.comentario, deleted: row.deleted, createdAt: row.created_at, updatedAt: row.updated_at, deletedAt: row.deleted_at });
        }

        return null;
    }

    static async deleteById(id){
        const connection = await db.createConnection();

        const deletedAt = new Date();
        const [result] = connection.execute("UPDATE resena SET deleted = 1, deletedAt = ? WHERE id = ?", [deletedAt, id]);
        connection.end();
        return result;
    }

    async save() {
        const connection = await db.createConnection();
        const [result] = await connection.execute("INSERT INTO resena (id_cliente, id_pedido, calificacion, nombre, comentario) VALUES (?, ?, ?, ?, ?)", [this.idCliente, this.idPedido, this.calificacion, this.nombre, this.comentario]);
        connection.end();
        return result;
    }

    static async count() {
        const connection = await db.createConnection();
        const [rows] = await connection.query("SELECT COUNT(*) AS total FROM resena WHERE deleted = 0");
        connection.end();
        return rows[0].total;
    }

    async updateById() {
        const connection = await db.createConnection();
        const updatedAt = new Date();
        const [result] = await connection.execute("UPDATE resena SET calificacion = ?, nombre = ?, comentario = ?, updated_at = ? WHERE id = ?", [ this.calificacion, this.nombre, this.comentario, updatedAt, this.id]);
        connection.end();
        return result;
    }
}

module.exports = ResenaModel;