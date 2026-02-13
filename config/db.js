const mysql = require('mysql2');
require('dotenv').config(); // Membaca file .env

// Membuat "Kolam" koneksi ke database
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Maksimal 10 koneksi berbarengan
    queueLimit: 0
});

// Kita gunakan versi Promise agar kodenya rapi (bisa pakai async/await)
module.exports = pool.promise();