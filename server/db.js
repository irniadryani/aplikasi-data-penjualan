const Pool = require("pg").Pool;

const pool = new Pool ({
    user: "postgres",
    password: "irinn1601",
    host: "localhost",
    port: "5432",
    database: "data_penjualan"
})

module.exports = pool;