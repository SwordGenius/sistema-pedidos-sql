const db = require('../configs/db.config');


class ClienteModel {

    constructor({ id, nombre, apellido, correo, contrasena, deleted, createdAt, updatedAt, deletedAt}) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.contrasena = contrasena;
        this.deleted = deleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }

    static async getAll({ offset, limit }, { sort, order }) {
        const connection = await db.createConnection();

        let query = `SELECT id, nombre, apellido, correo, deleted, createdAt, updatedAt, deletedAt FROM cliente WHERE deleted = 0`;

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
        const [rows] = await connection.execute("SELECT id, nombre, apellido, correo, deleted, createdAt, updatedAt, deletedAt FROM cliente WHERE id = ? AND deleted = 0", [id]);
        connection.end();

        if (rows.length > 0) {
            const row = rows[0];
            return new ClienteModel({ id: row.id, nombre: row.nombre, apellido: row.apellido, correo: row.correo, deleted: row.deleted, createdAt: row.createdAt, updatedAt: row.updatedAt, deletedAt: row.deletedAt });
        }

        return null;
    }

    static async deleteById(id){
        const connection = await db.createConnection();

        const deletedAt = new Date();
        const [result] = connection.execute("UPDATE cliente SET deleted = 1, deletedAt = ? WHERE id = ?", [deletedAt, id]);
        connection.end();
        return result;
    }

    async save() {
        const connection = await db.createConnection();
        const [result] = await connection.execute("INSERT INTO cliente (nombre, apellido, correo, contrasena) VALUES (?, ?, ?, ?)", [this.nombre, this.apellido, this.correo, this.contrasena]);
        connection.end();
        return result;
    }

    async updateById() {
        const connection = await db.createConnection();
        const updatedAt = new Date();
        const [result] = await connection.execute("UPDATE cliente SET nombre = ?, apellido = ?, correo = ?, contrasena = ?, updated_at = ? WHERE id = ?", [this.nombre, this.apellido, this.correo, this.contrasena, updatedAt, this.id]);
        connection.end();
        return result;

    }

    static async count() {
        const connection = await db.createConnection();
        const [rows] = await connection.execute("SELECT COUNT(*) AS total FROM cliente WHERE deleted = 0");
        connection.end();
        return rows[0].total;
    }

    static async getByEmail(correo) {
        const connection = await db.createConnection();
        const [rows] = await connection.execute("SELECT id, nombre, apellido, correo, deleted, createdAt, updatedAt, deletedAt FROM cliente WHERE correo = ? AND deleted = 0", [correo]);
        connection.end();

        if (rows.length > 0) {
            const row = rows[0];
            return new ClienteModel({ id: row.id, nombre: row.nombre, apellido: row.apellido, correo: row.correo, deleted: row.deleted, createdAt: row.createdAt, updatedAt: row.updatedAt, deletedAt: row.deletedAt });
        }

        return null;
    }

}

module.exports = ClienteModel;