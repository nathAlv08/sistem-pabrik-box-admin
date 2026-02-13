const db = require('../config/db');

exports.buatOrderBaru = async (req, res) => {
    const { nama_perusahaan, alamat_kirim, no_po_customer, prioritas, tipe_faktur, items } = req.body;
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // 1. CEK ATAU BUAT CUSTOMER BARU
        let customerId;
        const [existingCust] = await connection.query(
            `SELECT id FROM customers WHERE nama_perusahaan = ? LIMIT 1`, 
            [nama_perusahaan]
        );

        if (existingCust.length > 0) {
            customerId = existingCust[0].id; // Kalau PT sudah ada, pakai ID lama
        } else {
            const [newCust] = await connection.query(
                `INSERT INTO customers (nama_perusahaan, alamat_kirim) VALUES (?, ?)`, 
                [nama_perusahaan, alamat_kirim]
            );
            customerId = newCust.insertId; // Kalau PT baru, buat ID baru
        }

        // 2. SIMPAN ORDER
        const [orderResult] = await connection.query(
            `INSERT INTO orders (no_po_customer, customer_id, prioritas, tipe_faktur, status_order) VALUES (?, ?, ?, ?, 'Pending')`,
            [no_po_customer, customerId, prioritas, tipe_faktur]
        );
        const orderId = orderResult.insertId;

        // 3. SIMPAN SEMUA BARANG
        for (const item of items) {
            const kupingan = 30; 
            const sisiran = 45;
            
            const panjangSheet = (item.panjang_box + item.lebar_box) * 2 + kupingan;
            const lebarSheet = item.tinggi_box + item.lebar_box + sisiran;

            let rasioOut = item.rasio_out || 1; 
            let totalLembarDibutuhkan = Math.ceil(item.qty_order / rasioOut);

            await connection.query(
                `INSERT INTO order_items 
                (order_id, nama_barang, qty_order, panjang_box, lebar_box, tinggi_box, ukuran_sheet_panjang, ukuran_sheet_lebar, rasio_out, total_kebutuhan_sheet) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [orderId, item.nama_barang, item.qty_order, item.panjang_box, item.lebar_box, item.tinggi_box, panjangSheet, lebarSheet, rasioOut, totalLembarDibutuhkan]
            );
        }

        await connection.commit();
        res.status(201).json({ status: "success", message: "DO dan Customer berhasil dicatat!" });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ status: "error", message: "Terjadi kesalahan server" });
    } finally {
        connection.release();
    }
};

exports.ambilSemuaOrder = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                o.id AS order_id, o.no_po_customer, o.prioritas, o.tanggal_order, o.tipe_faktur,
                c.nama_perusahaan, c.alamat_kirim,
                i.nama_barang, i.qty_order, i.ukuran_sheet_panjang, i.ukuran_sheet_lebar, i.rasio_out, i.total_kebutuhan_sheet,
                -- INI TAMBAHANNYA AGAR UKURAN BISA TAMPIL DI DO
                i.panjang_box, i.lebar_box, i.tinggi_box 
            FROM orders o
            JOIN customers c ON o.customer_id = c.id
            JOIN order_items i ON o.id = i.order_id
            ORDER BY o.id DESC
        `);
        res.status(200).json({ status: "success", data: rows });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Gagal mengambil data dashboard" });
    }
};

exports.tarikReportLengkap = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT c.nama_perusahaan, o.no_po_customer, o.tanggal_order, i.nama_barang, i.qty_order, i.total_kebutuhan_sheet
            FROM orders o JOIN customers c ON o.customer_id = c.id JOIN order_items i ON o.id = i.order_id
        `);
        res.status(200).json({ status: "success", data: rows });
    } catch (error) {
        res.status(500).json({ status: "error" });
    }
};