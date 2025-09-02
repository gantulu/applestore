# OnCloudStore.id - Toko Online

Proyek ini adalah implementasi toko online dengan tampilan mirip dengan OnCloudStore.id. Aplikasi ini mengambil data produk dari API eksternal dan menampilkannya dalam antarmuka yang responsif dan user-friendly.

## Fitur

- Tampilan produk dengan grid layout
- Tampilan diskon dan badge harga
- Detail produk dengan slider gambar
- Pemilihan varian warna produk
- Integrasi dengan API untuk data produk

## Teknologi yang Digunakan

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Fetch API untuk mengambil data

## Cara Penggunaan

1. Buka file `index.html` di browser web
2. Aplikasi akan secara otomatis mengambil data produk dari API
3. Klik pada produk untuk melihat detail lengkap
4. Gunakan tombol kategori untuk memfilter produk (fitur ini dapat dikembangkan lebih lanjut)

## Struktur Proyek

- `index.html` - File HTML utama
- `styles.css` - File CSS untuk styling
- `script.js` - File JavaScript untuk fungsionalitas

## API

Aplikasi ini menggunakan API dari:
`https://opensheet.elk.sh/138LMOwLK7fTR4IBzaRglPkU-0bkrugUXW-7D4RNLJrA/iphone`

Format data yang diharapkan:

```json
[
  {
    "id": "iphone15-128gb-black",
    "item_group_id": "iphone15",
    "title": "iPhone 15",
    "description": "Apple iPhone 15 dengan chip A16 Bionic layar Super Retina XDR 6.1 inci dan kamera ganda 48MP.",
    "availability": "in stock",
    "condition": "new",
    "size": "128GB",
    "price": "4399",
    "diskon": "15%",
    "sale_price": "3739",
    "color": "Black",
    "link": "https://applestoremalaysia.webflow.io",
    "image_link": "https://ibox.co.id/_next/image?url=https%3A%2F%2Fcdnpro.eraspace.com%2Fmedia%2Fcatalog%2Fproduct%2Fa%2Fp%2Fapple_iphone_15_black_1_1.jpg&w=1920&q=45",
    "additional_image_link": "https://ibox.co.id/_next/image?url=https%3A%2F%2Fcdnpro.eraspace.com%2Fmedia%2Fcatalog%2Fproduct%2Fa%2Fp%2Fapple_iphone_15_black_1_1.jpg&w=1920&q=45, https://ibox.co.id/_next/image?url=https%3A%2F%2Fcdnpro.eraspace.com%2Fmedia%2Fcatalog%2Fproduct%2Fa%2Fp%2Fapple_iphone_15_black_1a.jpg&w=1920&q=45, https://ibox.co.id/_next/image?url=https%3A%2F%2Fcdnpro.eraspace.com%2Fmedia%2Fcatalog%2Fproduct%2Fa%2Fp%2Fapple_iphone_15_black_2.jpg&w=1920&q=45",
    "brand": "Apple iPhone",
    "google_product_category": "267",
    "quantity_to_sell_on_facebook": "20"
  }
]
```

## Pengembangan Lebih Lanjut

- Implementasi fitur pencarian
- Filter produk berdasarkan kategori
- Implementasi keranjang belanja
- Sistem autentikasi pengguna
- Optimasi untuk perangkat mobile