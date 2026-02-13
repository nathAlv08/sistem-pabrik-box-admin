const express = require('express');
const path = require('path');
require('dotenv').config();

// Panggil file routes yang nanti kita buat
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Middleware agar Express bisa membaca data JSON yang dikirim (misal dari Postman)
app.use(express.json()); 

app.use(express.static(path.join(__dirname, 'public')));

// Daftarkan jalur URL (Endpoint API)
// Semua request yang berawalan /api/orders akan diarahkan ke orderRoutes
app.use('/api/orders', orderRoutes);

// Jalankan Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server Pabrik Box jalan ngebut di port ${PORT}`);
});