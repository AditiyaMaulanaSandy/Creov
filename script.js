// --- 1. DATA PRODUK CREOVÉ ---
const creoveProducts = [
    {
        id: "CRV-01",
        name: "Signature Layered Oreo",
        price: 10000,
        image: "image.png", 
        promoText: "🔥 PROMO: Beli 3 Cuma Rp25.000!", // Tambahan teks promo
        description: "Nikmati harmoni sempurna dari oreo asli yang renyah, krim keju super lembut, dan lelehan cokelat premium dalam setiap suapannya. Dibuat fresh setiap hari untuk menemani waktu santaimu.",
        layersHTML: `
            <div class="layer-item"><span class="layer-color" style="background-color: #3B2F2F;"></span><span class="layer-text">Crunchy Oreo</span></div>
            <div class="layer-item"><span class="layer-color" style="background-color: #FFFDD0; border: 1px solid #eee;"></span><span class="layer-text">Cheese Cream</span></div>
            <div class="layer-item"><span class="layer-color" style="background-color: #4A2511;"></span><span class="layer-text">Melted Choco</span></div>`
    },
    {
        id: "CRV-02",
        name: "Dubai Chewy Cookie Mini",
        price: 20000,
        image: "dubai.png", 
        promoText: "", // Kosongkan jika tidak ada promo
        description: "Sensasi luar biasa dari chewy cookie yang dibalut cokelat premium dengan isian pistachio lumer di dalamnya. Ukuran mini yang pas untuk dinikmati kapan saja!",
        layersHTML: `
            <div class="layer-item"><span class="layer-color" style="background-color: #4A2511;"></span><span class="layer-text">Premium Chocolate</span></div>
            <div class="layer-item"><span class="layer-color" style="background-color: #8A9A5B;"></span><span class="layer-text">Melted Pistachio</span></div>
            <div class="layer-item"><span class="layer-color" style="background-color: #6B4423;"></span><span class="layer-text">Chewy Cookie</span></div>`
    }
];

// --- VARIABEL GLOBAL ---
let quantities = {}; 
let cart = {};       
let currentTotalHarga = 0;
let currentMessage = '';

creoveProducts.forEach(p => quantities[p.id] = 1);

// --- 2. RENDER MENU ---
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
}

function renderProducts() {
    const menuGrid = document.getElementById('menuGrid');
    if (!menuGrid) return;
    
    let htmlContent = '';
    creoveProducts.forEach(product => {
        // Tampilkan badge promo jika ada datanya
        const promoBadge = product.promoText ? `<div style="background-color: #CC0000; color: white; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; display: inline-block; margin-bottom: 8px; letter-spacing: 0.5px;">${product.promoText}</div>` : '';

        htmlContent += `
        <div class="menu-card">
            <div class="image-wrapper skeleton" id="wrapper-${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image" 
                onload="document.getElementById('wrapper-${product.id}').classList.remove('skeleton'); this.classList.add('loaded');" 
                onerror="this.src='https://via.placeholder.com/400x300?text=Creov%C3%A9'; document.getElementById('wrapper-${product.id}').classList.remove('skeleton'); this.classList.add('loaded');">
        </div>
            <div class="product-info">
                ${promoBadge}
                <div class="product-header">
                <h3 class="product-name">${product.name}</h3>
                <span class="product-price">${formatRupiah(product.price)}</span>
            </div>
            
            <div class="layer-visual">${product.layersHTML}</div>
            <p class="product-desc">${product.description}</p>
                
                <div style="display:flex; align-items:center; gap:10px; margin-bottom: 20px; margin-top: 15px;">
                    <label style="font-size:14px; font-weight:700;">Jumlah:</label>
                    <div style="display:flex; align-items:center; gap:12px; background:#f0f0f0; padding:5px 15px; border-radius:20px;">
                        <button type="button" onclick="updateQty('${product.id}', -1)" style="border:none; background:none; font-weight:bold; cursor:pointer; font-size:18px;">-</button>
                        <span id="qty-${product.id}" style="font-weight:700; min-width:20px; text-align:center;">${quantities[product.id]}</span>
                        <button type="button" onclick="updateQty('${product.id}', 1)" style="border:none; background:none; font-weight:bold; cursor:pointer; font-size:18px;">+</button>
                    </div>
                </div>

                <button id="btn-add-${product.id}" class="btn-order" onclick="addToCart('${product.id}')">Tambah ke Keranjang</button>
            </div>
        </div>`;
    });
    menuGrid.innerHTML = htmlContent;
}

function updateQty(productId, change) {
    quantities[productId] += change;
    if (quantities[productId] < 1) quantities[productId] = 1;
    document.getElementById(`qty-${productId}`).innerText = quantities[productId];
}

// --- 3. LOGIKA KERANJANG BELANJA ---
// --- 3. LOGIKA KERANJANG BELANJA ---

// Fungsi baru untuk memunculkan Toast
function showToast(productName, qty) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    // Menampilkan ikon centang hijau, jumlah, dan nama produk
    toast.innerHTML = `<i class="fas fa-check-circle" style="color:#25D366; font-size:16px;"></i> ${qty} ${productName} masuk keranjang!`;

    container.appendChild(toast);

    // Hapus toast secara otomatis setelah 2.5 detik
    setTimeout(() => {
        toast.classList.add('hide');
        toast.addEventListener('animationend', () => toast.remove());
    }, 2500);
}

function addToCart(productId) {
    const qtyToAdd = quantities[productId];
    const product = creoveProducts.find(p => p.id === productId); // Cari data produk
    
    if (cart[productId]) {
        cart[productId] += qtyToAdd;
    } else {
        cart[productId] = qtyToAdd;
    }

    quantities[productId] = 1;
    document.getElementById(`qty-${productId}`).innerText = 1;

    // --- Panggil Toast Pop-up di sini ---
    showToast(product.name, qtyToAdd);

    const btn = document.getElementById(`btn-add-${productId}`);
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Berhasil';
    btn.style.backgroundColor = '#25D366'; 
    btn.style.color = '#fff';

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.backgroundColor = ''; 
        btn.style.color = '';
    }, 1500);

    updateCartBadge();
}

function updateCartBadge() {
    let totalItems = 0;
    for (let id in cart) { totalItems += cart[id]; }
    
    const cartBtn = document.getElementById('cartBtn');
    document.getElementById('cartCount').innerText = totalItems;
    
    if (totalItems > 0) {
        cartBtn.classList.remove('hidden');
    } else {
        cartBtn.classList.add('hidden');
    }
}

// Buka Modal & Tampilkan Isi Keranjang (DENGAN LOGIKA PROMO)
function openCheckoutModal() {
    const listEl = document.getElementById('cartItemsList');
    let html = '';
    let grandTotal = 0;
    
    currentMessage = `Halo! Saya ingin memesan:\n\n`;

    for (let id in cart) {
        const product = creoveProducts.find(p => p.id === id);
        const qty = cart[id];
        
        let subtotal = 0;
        let infoHargaTeks = '';
        let waNote = '';

        // --- MESIN PENGHITUNG PROMO KHUSUS OREO ---
        if (id === "CRV-01" && qty >= 3) {
            const jumlahPaketPromo = Math.floor(qty / 3);
            const sisaNormal = qty % 3;
            
            subtotal = (jumlahPaketPromo * 25000) + (sisaNormal * product.price);
            
            infoHargaTeks = `Promo Paket 3pcs (x${jumlahPaketPromo})`;
            waNote = `(Promo Paket 3pcs x${jumlahPaketPromo})`;
            
            if (sisaNormal > 0) {
                infoHargaTeks += `<br>+ Harga Normal (x${sisaNormal})`;
                waNote += ` + (Normal x${sisaNormal})`;
            }
        } 
        // --- JIKA BUKAN PROMO (ATAU BELI OREO DI BAWAH 3) ---
        else {
            subtotal = qty * product.price;
            infoHargaTeks = `${formatRupiah(product.price)} x ${qty}`;
        }

        grandTotal += subtotal;

        html += `
            <div class="cart-item-row">
                <div>
                    <strong>${product.name}</strong><br>
                    <span style="font-size:12px; color:var(--text-muted);">${infoHargaTeks}</span>
                </div>
                <div style="font-weight:bold;">${formatRupiah(subtotal)}</div>
            </div>`;
        
        // Format teks WA agar admin gampang bacanya
        if (waNote !== '') {
            currentMessage += `- ${product.name} (x${qty}) = ${formatRupiah(subtotal)}\n  ${waNote}\n`;
        } else {
            currentMessage += `- ${product.name} (x${qty}) = ${formatRupiah(subtotal)}\n`;
        }
    }

    html += `
        <div class="cart-total-row">
            <span>Total Belanja:</span>
            <span>${formatRupiah(grandTotal)}</span>
        </div>
        <button onclick="clearCart()" style="background:none; border:none; color:#CC0000; font-size:12px; font-weight:bold; cursor:pointer; margin-top:10px; width:100%; text-align:right;">[ Kosongkan Keranjang ]</button>
    `;

    currentTotalHarga = grandTotal;
    currentMessage += `\n*Total Akhir: ${formatRupiah(grandTotal)}*`;
    
    listEl.innerHTML = html;
    document.getElementById('contactModal').classList.remove('hidden');
}

function clearCart() {
    cart = {}; 
    updateCartBadge();
    document.getElementById('contactModal').classList.add('hidden');
}

function resetForm() {
    document.getElementById('custName').value = '';
    document.getElementById('custPhone').value = '';
    document.getElementById('deliverySelect').value = '';
    document.getElementById('paymentSelect').value = '';
    document.getElementById('addressInput').value = '';
    document.getElementById('addressWrap').style.display = 'none';

    clearError('custName'); clearError('custPhone'); clearError('deliverySelect');
    clearError('paymentSelect'); clearError('addressInput');
    
    clearCart(); 
}

// --- 4. TAMPILAN ERROR & VALIDASI ---
function showError(elementId, message) {
    const el = document.getElementById(elementId);
    el.classList.add('input-error-border'); 
    let errorMsg = el.parentElement.querySelector('.input-error-msg');
    if (!errorMsg) {
        errorMsg = document.createElement('span');
        errorMsg.className = 'input-error-msg';
        el.parentElement.appendChild(errorMsg);
    }
    errorMsg.innerText = message; 
}

function clearError(elementId) {
    const el = document.getElementById(elementId);
    el.classList.remove('input-error-border'); 
    const errorMsg = el.parentElement.querySelector('.input-error-msg');
    if (errorMsg) errorMsg.remove();
}

function validateContactForm() {
    let isValid = true;
    const ids = ['custName', 'custPhone', 'deliverySelect', 'paymentSelect'];
    const msgs = ['Mohon isi Nama Pemesan.', 'Mohon isi No. WhatsApp.', 'Pilih Metode Pengantaran.', 'Pilih Metode Pembayaran.'];
    
    ids.forEach((id, index) => {
        if (!document.getElementById(id).value.trim()) {
            showError(id, msgs[index]); isValid = false;
        } else { clearError(id); }
    });

    const deliveryVal = document.getElementById('deliverySelect').value;
    const addressEl = document.getElementById('addressInput');
    if ((deliveryVal === 'COD' || deliveryVal === 'Kurir') && !addressEl.value.trim()) {
        showError('addressInput', 'Mohon isi Alamat lengkap.'); isValid = false;
    } else if (deliveryVal === 'COD' || deliveryVal === 'Kurir') { clearError('addressInput'); }

    return isValid;
}

// --- 5. KIRIM DATA ---
async function prosesPesanan() {
    if (!validateContactForm()) return; 

    const btn = document.getElementById('btnWhatsApp');
    const originalText = btn.innerHTML;
    
    try {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
        btn.disabled = true;

        const orderId = 'CRV-' + Date.now().toString().slice(-6);
        const namaPembeli = document.getElementById('custName').value.trim();
        const noHPPembeli = document.getElementById('custPhone').value.trim();
        
        let alamatTambahan = '';
        const deliveryMethod = document.getElementById('deliverySelect').value;
        if (deliveryMethod === 'COD' || deliveryMethod === 'Kurir') {
            alamatTambahan = `\nAlamat: ${document.getElementById('addressInput').value.trim()}`;
        }
        const paymentMethod = document.getElementById('paymentSelect').value;
        
        const pesananDetail = `*Order ID: ${orderId}*\n\n${currentMessage}\n\nNama: ${namaPembeli}\nPengantaran: ${deliveryMethod}${alamatTambahan}\nPembayaran: ${paymentMethod}`;

        const payload = {
            orderId: orderId,
            nama: namaPembeli,
            nomorHp: noHPPembeli,
            pesanan: pesananDetail,
            total: currentTotalHarga
        };

        const scriptURL = 'https://script.google.com/macros/s/AKfycbxNbpGuXkRaOO1BuRNAl3CvUZYydwueGlzhvuc5ZJLKv3WY3G1QWdQx2EZ5_NSNH3o/exec'; 

        await fetch(scriptURL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
        });

        const sellerNumber = '6281345700451'; 
        const waUrl = `https://wa.me/${sellerNumber}?text=${encodeURIComponent(pesananDetail)}`;
        
        window.location.href = waUrl; 
        resetForm();

    } catch (error) {
        alert("Koneksi lambat, mengarahkan langsung ke WhatsApp...");
        window.location.href = `https://wa.me/6281345700451?text=${encodeURIComponent(currentMessage)}`;
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// --- 6. EVENT LISTENERS UTAMA ---
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();

    document.getElementById('cartBtn').onclick = openCheckoutModal;
    document.getElementById('modalClose').onclick = () => document.getElementById('contactModal').classList.add('hidden');
    document.getElementById('btnWhatsApp').onclick = prosesPesanan;

    const deliverySelect = document.getElementById('deliverySelect');
    if (deliverySelect) {
        deliverySelect.onchange = () => {
            clearError('deliverySelect');
            document.getElementById('addressWrap').style.display = (deliverySelect.value === 'COD' || deliverySelect.value === 'Kurir') ? 'block' : 'none';
            if(deliverySelect.value !== 'COD' && deliverySelect.value !== 'Kurir') clearError('addressInput');
        };
    }

    ['custName', 'custPhone', 'addressInput'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.addEventListener('input', () => clearError(id));
    });
    
    const paymentSel = document.getElementById('paymentSelect');
    if(paymentSel) paymentSel.addEventListener('change', () => clearError('paymentSelect'));
});