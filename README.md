# 📦 Sistem Manajemen Delivery Order (DO) & Kalkulasi Produksi Pabrik Box

Prototipe Sistem Informasi / Mini-ERP berbasis Web Service (REST API) yang dirancang khusus untuk memecahkan masalah operasional harian di pabrik pembuatan kardus (Corrugated Box). 

---

<details>
<summary><b>🌟 Fitur Utama (Business Logic)</b></summary>

<br>

- **Auto-Calculate Sheet Size:** Menggunakan algoritma perhitungan rumus pabrik secara presisi `((P + L) * 2 + Kupingan)`.
- **Rasio Out Management:** Menghitung total lembar bahan otomatis berdasarkan rasio potong mesin.
- **Multi-Item DO Grouping:** Mendukung input banyak barang ke dalam 1 Nomor PO/DO pelanggan.
- **Dynamic Print DO:** Menghasilkan cetak Surat Jalan yang formatnya persis dokumen fisik.
- **Relational Reporting (SQL JOIN):** Menghasilkan laporan dari tabel Master, Header, dan Detail.

</details>

<details>
<summary><b>🛠️ Tech Stack & Arsitektur</b></summary>

<br>

Sistem ini dibangun menggunakan arsitektur **MVC (Model-View-Controller)**.

* **Back-End:** Node.js, Express.js
* **Database:** MySQL (Relational Database)
* **Front-End:** HTML5, Vanilla JavaScript, Bootstrap 5

</details>

<details>
<summary><b>🚀 Cara Instalasi & Menjalankan (Localhost)</b></summary>

<br>

Ikuti langkah-langkah di bawah ini untuk menjalankan di komputer Anda:

**1. Clone Repository & Install Dependencies**
Pastikan Node.js sudah terinstal. Buka terminal dan jalankan:

```bash
git clone <LINK_GITHUB_KAMU_DISINI>
cd pabrik-box-api
npm install
```

**2. Setup Database (MySQL)**
Buat database baru bernama pabrik_box_db.
Jalankan perintah SQL berikut:

```bash
SQL

CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_perusahaan VARCHAR(255) NOT NULL,
    alamat_kirim TEXT
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    no_po_customer VARCHAR(50), 
    customer_id INT,
    tanggal_order DATE DEFAULT CURRENT_DATE,
    prioritas ENUM('Normal', 'High', 'Urgent') DEFAULT 'Normal',
    tipe_faktur ENUM('PN', 'SP') DEFAULT 'SP',
    status_order ENUM('Pending', 'Waiting Material', 'Produksi', 'Hold', 'Selesai'),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    nama_barang VARCHAR(200),
    qty_order INT,
    panjang_box INT, lebar_box INT, tinggi_box INT,
    ukuran_sheet_panjang INT,   
    ukuran_sheet_lebar INT,
    rasio_out INT DEFAULT 1,
    total_kebutuhan_sheet INT DEFAULT 0,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

```

***3. Konfigurasi Environment Variables***
Buat file .env di root directory, isi dengan:

Cuplikan kode

```bash
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=pabrik_box_db
```

***4. Jalankan Aplikasi***

``` bash

npm run dev
```

Aplikasi bisa diakses di browser pada: http://localhost:3000

</details>

<details>
<summary><b>📡 Dokumentasi REST API Pendek</b></summary>

* POST /api/orders : Menerima JSON payload untuk DO baru.

* GET /api/orders : Mengambil daftar seluruh pesanan aktif.

* GET /api/orders/report : Menarik laporan detail SQL JOIN.

</details>

Dibuat untuk keperluan demonstrasi dan technical test Web Developer.

**Tips Penting:** Pastikan saat mem- *paste* kode di atas, baris kosong sebelum tanda ```bash (di Langkah 1 dan seterusnya) tetap ada ya. Itu yang membuat GitHub bisa membaca format kodenya dengan benar dan tidak memotong teks di bawahnya.

Jangan lupa ganti tulisan `<LINK_GITHUB_KAMU_DISINI>` dengan link milikmu, lalu langsung *push* ke GitHub! Coba di- *refresh* halaman GitHub-nya, pasti sekarang semua langkahnya muncul sempurna saat di-klik *dropdown*-nya! 😎
