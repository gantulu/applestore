// API URL untuk mengambil data produk
const API_URL = 'https://opensheet.elk.sh/138LMOwLK7fTR4IBzaRglPkU-0bkrugUXW-7D4RNLJrA/iphone';

// DOM Elements
const productsGrid = document.querySelector('.products-grid');
const discountProducts = document.querySelector('.discount-products');
const productDetailModal = document.getElementById('productDetailModal');

// Data produk global
let products = [];
let allProducts = []; // Menyimpan semua produk sebelum dikelompokkan

// Fungsi untuk mengambil data dari API
async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        allProducts = await response.json();
        
        // Kelompokkan produk berdasarkan item_group_id dan ambil satu produk per grup
        const groupedProducts = {};
        allProducts.forEach(product => {
            if (!groupedProducts[product.item_group_id]) {
                groupedProducts[product.item_group_id] = product;
            }
        });
        
        // Konversi kembali ke array
        products = Object.values(groupedProducts);
        
        renderProducts();
        renderDiscountProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
        // Tampilkan pesan error ke pengguna
        productsGrid.innerHTML = `<div class="error-message">Gagal memuat produk. Silakan coba lagi nanti.</div>`;
    }
}

// Fungsi untuk menampilkan produk di grid
function renderProducts() {
    if (!products || products.length === 0) {
        productsGrid.innerHTML = '<div class="no-products">Tidak ada produk tersedia</div>';
        return;
    }

    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const discountBadge = product.diskon ? `<div class="discount-badge">Diskon ${product.diskon}</div>` : '';
        const priceDrop = !product.diskon && product.sale_price < product.price ? `<div class="price-drop-badge">Turun harga</div>` : '';
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image_link}" alt="${product.title}" class="product-image">
            ${discountBadge}
            ${priceDrop}
            <a href="#" class="bookmark-icon"><i class="far fa-bookmark"></i></a>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">
                    ${product.price !== product.sale_price ? `<span class="original-price">Rp${formatPrice(product.price)}</span>` : ''}
                    <span class="sale-price">Rp${formatPrice(product.sale_price)}</span>
                </div>
            </div>
        `;
        
        // Event listener untuk membuka modal detail produk
        productCard.addEventListener('click', () => openProductDetail(product));
        
        productsGrid.appendChild(productCard);
    });
}

// Fungsi untuk menampilkan produk diskon
function renderDiscountProducts() {
    if (!products || products.length === 0) {
        return;
    }

    // Filter produk yang memiliki diskon
    const discounted = products.filter(product => product.diskon);
    
    if (discounted.length === 0) {
        document.querySelector('.discount-section').style.display = 'none';
        return;
    }
    
    discountProducts.innerHTML = '';
    
    discounted.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image_link}" alt="${product.title}" class="product-image">
            <div class="discount-badge">Diskon ${product.diskon}</div>
            <a href="#" class="bookmark-icon"><i class="far fa-bookmark"></i></a>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">
                    <span class="original-price">Rp${formatPrice(product.price)}</span>
                    <span class="sale-price">Rp${formatPrice(product.sale_price)}</span>
                </div>
            </div>
        `;
        
        // Event listener untuk membuka modal detail produk
        productCard.addEventListener('click', () => openProductDetail(product));
        
        discountProducts.appendChild(productCard);
    });
}

// Fungsi untuk membuka modal detail produk
function openProductDetail(product) {
    // Ubah URL dengan menambahkan parameter itemgroupid
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('itemgroupid', product.item_group_id);
    window.history.pushState({}, '', currentUrl);
    
    // Populate modal dengan data produk
    const modalTitle = productDetailModal.querySelector('.product-title');
    const originalPrice = productDetailModal.querySelector('.original-price');
    const salePrice = productDetailModal.querySelector('.sale-price');
    const discountBadge = productDetailModal.querySelector('.discount-badge');
    const productDescription = productDetailModal.querySelector('.product-description');
    const sliderContainer = productDetailModal.querySelector('.slider-container');
    const sliderPagination = productDetailModal.querySelector('.slider-pagination');
    const colorOptions = productDetailModal.querySelector('.color-options');
    const viewWebsiteBtn = productDetailModal.querySelector('.view-website-btn');
    
    // Set judul produk
    modalTitle.textContent = product.title;
    
    // Set harga
    if (product.price !== product.sale_price) {
        originalPrice.textContent = `Rp${formatPrice(product.price)}`;
        originalPrice.style.display = 'block';
        
        if (product.diskon) {
            discountBadge.textContent = `(Diskon ${product.diskon})`;
            discountBadge.style.display = 'block';
        } else {
            discountBadge.style.display = 'none';
        }
    } else {
        originalPrice.style.display = 'none';
        discountBadge.style.display = 'none';
    }
    
    salePrice.textContent = `Rp${formatPrice(product.sale_price)}`;
    
    // Set deskripsi
    productDescription.textContent = product.description;
    
    // Set gambar slider
    sliderContainer.innerHTML = '';
    sliderPagination.innerHTML = '';
    
    // Tambahkan gambar utama
    const mainImage = document.createElement('img');
    mainImage.src = product.image_link;
    mainImage.alt = product.title;
    mainImage.className = 'slider-image';
    sliderContainer.appendChild(mainImage);
    
    // Tambahkan dot pagination untuk gambar utama
    const mainDot = document.createElement('div');
    mainDot.className = 'pagination-dot active';
    sliderPagination.appendChild(mainDot);
    
    // Tambahkan gambar tambahan jika ada
    if (product.additional_image_link) {
        const additionalImages = product.additional_image_link.split(',').map(url => url.trim());
        
        additionalImages.forEach((imageUrl, index) => {
            if (imageUrl) {
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = `${product.title} - Image ${index + 2}`;
                img.className = 'slider-image';
                sliderContainer.appendChild(img);
                
                const dot = document.createElement('div');
                dot.className = 'pagination-dot';
                sliderPagination.appendChild(dot);
            }
        });
    }
    
    // Set opsi varian (warna dan ukuran)
    // Cari semua produk dengan item_group_id yang sama
    const relatedProducts = allProducts.filter(p => p.item_group_id === product.item_group_id);
    
    // Dapatkan elemen select untuk warna dan ukuran
    const colorSelect = productDetailModal.querySelector('#color-select');
    const sizeSelect = productDetailModal.querySelector('#size-select');
    const variantPreview = productDetailModal.querySelector('.variant-preview');
    
    // Reset select options
    colorSelect.innerHTML = '';
    sizeSelect.innerHTML = '';
    
    // Kumpulkan warna dan ukuran unik
    const uniqueColors = new Set();
    const uniqueSizes = new Set();
    const variantMap = {}; // Map untuk menyimpan produk berdasarkan warna dan ukuran
    
    relatedProducts.forEach(variant => {
        if (variant.color) uniqueColors.add(variant.color);
        if (variant.size) uniqueSizes.add(variant.size);
        
        // Simpan produk dalam map dengan key warna_ukuran
        const key = `${variant.color || 'default'}_${variant.size || 'default'}`;
        variantMap[key] = variant;
    });
    
    // Tambahkan opsi warna ke select
    uniqueColors.forEach(color => {
        const option = document.createElement('option');
        option.value = color;
        option.textContent = color;
        if (product.color === color) option.selected = true;
        colorSelect.appendChild(option);
    });
    
    // Tambahkan opsi ukuran ke select
    uniqueSizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        if (product.size === size) option.selected = true;
        sizeSelect.appendChild(option);
    });
    
    // Tampilkan preview varian yang dipilih
    function updateVariantPreview() {
        const selectedColor = colorSelect.value;
        const selectedSize = sizeSelect.value;
        const key = `${selectedColor || 'default'}_${selectedSize || 'default'}`;
        
        const selectedVariant = variantMap[key] || product;
        
        variantPreview.innerHTML = `
            <div class="variant-preview-image">
                <img src="${selectedVariant.image_link}" alt="${selectedVariant.title}">
            </div>
            <div class="variant-preview-info">
                <span class="variant-name">${selectedVariant.color || ''} ${selectedVariant.size || ''}</span>
            </div>
        `;
    }
    
    // Event listeners untuk select
    colorSelect.addEventListener('change', () => {
        const selectedColor = colorSelect.value;
        const selectedSize = sizeSelect.value;
        const key = `${selectedColor || 'default'}_${selectedSize || 'default'}`;
        
        if (variantMap[key]) {
            switchProductVariant(variantMap[key]);
        } else {
            updateVariantPreview();
        }
    });
    
    sizeSelect.addEventListener('change', () => {
        const selectedColor = colorSelect.value;
        const selectedSize = sizeSelect.value;
        const key = `${selectedColor || 'default'}_${selectedSize || 'default'}`;
        
        if (variantMap[key]) {
            switchProductVariant(variantMap[key]);
        } else {
            updateVariantPreview();
        }
    });
    
    // Tampilkan preview awal
    updateVariantPreview();
    
    // Set link tombol "Lihat di Situs Web"
    viewWebsiteBtn.onclick = () => {
        window.open(product.link, '_blank');
    };
    
    // Tampilkan modal
    productDetailModal.classList.add('active');
    
    // Event listener untuk tombol kembali dan close di modal
    const backButton = productDetailModal.querySelector('.back-button');
    const closeButton = productDetailModal.querySelector('.close-button');
    
    backButton.addEventListener('click', (e) => {
        e.preventDefault();
        closeProductDetail();
    });
    
    closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        closeProductDetail();
    });
}

// Fungsi untuk menutup modal detail produk
function closeProductDetail() {
    productDetailModal.classList.remove('active');
    
    // Hapus parameter itemgroupid dari URL
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete('itemgroupid');
    window.history.pushState({}, '', currentUrl);
}

// Fungsi untuk beralih ke varian produk lain
function switchProductVariant(product) {
    // Tutup modal saat ini dan buka modal baru dengan produk yang dipilih
    closeProductDetail();
    openProductDetail(product);
}

// Fungsi untuk memformat harga
function formatPrice(price) {
    return parseInt(price).toLocaleString('id-ID');
}

// Event listener untuk kategori
const categoryButtons = document.querySelectorAll('.category-btn');
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Hapus kelas active dari semua tombol
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        // Tambahkan kelas active ke tombol yang diklik
        button.classList.add('active');
        
        // Di sini Anda bisa menambahkan logika untuk memfilter produk berdasarkan kategori
    });
});

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});