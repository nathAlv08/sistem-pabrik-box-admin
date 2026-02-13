const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// URL: POST http://localhost:3000/api/orders/
// Fungsi: Menerima data pesanan baru dari Customer/Sales
router.post('/', orderController.buatOrderBaru);

// URL: GET http://localhost:3000/api/orders/
// Fungsi: Menampilkan semua daftar pesanan (Untuk report/dashboard)
router.get('/', orderController.ambilSemuaOrder);

router.get('/report', orderController.tarikReportLengkap);

module.exports = router;