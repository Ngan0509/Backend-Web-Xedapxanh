require('dotenv').config();

// // get the client
// import mysql from 'mysql2/promise';

// // create the connection to database
// console.log("Creating connection pool...");

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'ecobike'
// });


const Pool = require('pg').Pool
const pool = new Pool({
    // connectionString: process.env.DATABASE_CONNECTION,
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    }
})

console.log("Creating connection pool...");
export default pool