const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const createConnection = () => {
    return mysql.createConnection({
        host: process.env.DBHOST,
        user: process.env.DBUSER,
        password: process.env.DBPASS,
        database: process.env.DBNAME
    });
}

module.exports = {createConnection};