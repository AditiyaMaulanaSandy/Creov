// --- 1. DATA PRODUK TUNGGAL CREOVÉ ---
const creoveProduct = {
    id: "CRV-01",
    name: "Signature Layered Oreo",
    price: 10000,
    image: "image.png", 
    description: "Nikmati harmoni sempurna dari oreo asli yang renyah, krim keju super lembut, dan lelehan cokelat premium dalam setiap suapannya. Dibuat fresh setiap hari untuk menemani waktu santaimu."
};

// Variabel Global
let currentTotalHarga = 0;
let currentMessage = '';
let tempQty = 1;

// --- 2. LOGIKA TAMPILAN (RENDER) ---
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
}

function renderProduct() {
    const menuGrid = document.getElementById('menuGrid');
    if (!menuGrid) return;
    
    menuGrid.innerHTML = `
        <div class="menu-card">
            <img src="${creoveProduct.image}" alt="${creoveProduct.name}" class="product-image" onerror="this.src='https://via.placeholder.com/400x300?text=Creov%C3%A9'">
            <div class="product-info">
                <div class="product-header">
                <h3 class="product-name">${creoveProduct.name}</h3>
                <span class="product-price">${formatRupiah(creoveProduct.price)}</span>
            </div>
            
            <div class="layer-visual">
                <div class="layer-item">
                    <span class="layer-color" style="background-color: #3B2F2F;"></span>
                    <span class="layer-text">Crunchy Oreo</span>
                </div>
                <div class="layer-item">
                    <span class="layer-color" style="background-color: #FFFDD0; border: 1px solid #eee;"></span>
                    <span class="layer-text">Cheese Cream</span>
                </div>
                <div class="layer-item">
                    <span class="layer-color" style="background-color: #4A2511;"></span>
                    <span class="layer-text">Melted Choco</span>
                </div>
            </div>
            
            <p class="product-desc">${creoveProduct.description}</p>
                
                <div style="display:flex; align-items:center; gap:10px; margin-bottom: 20px; margin-top: 15px;">
                    <label style="font-size:14px; font-weight:700;">Jumlah Pesanan:</label>
                    <div style="display:flex; align-items:center; gap:12px; background:#f0f0f0; padding:5px 15px; border-radius:20px;">
                        <button type="button" onclick="updateQty(-1)" style="border:none; background:none; font-weight:bold; cursor:pointer; font-size:18px;">-</button>
                        <span id="mainQtyDisplay" style="font-weight:700; min-width:20px; text-align:center;">1</span>
                        <button type="button" onclick="updateQty(1)" style="border:none; background:none; font-weight:bold; cursor:pointer; font-size:18px;">+</button>
                    </div>
                </div>

                <button class="btn-order" onclick="proceedToCheckout()">Pesan Sekarang</button>
            </div>
        </div>
    `;
}

function updateQty(change) {
    tempQty += change;
    if (tempQty < 1) tempQty = 1;
    document.getElementById('mainQtyDisplay').innerText = tempQty;
}

// --- 3. LOGIKA CHECKOUT ---
function proceedToCheckout() {
    const subtotal = tempQty * creoveProduct.price;
    currentTotalHarga = subtotal;
    
    currentMessage = `Halo! Saya ingin memesan:\n\n- ${creoveProduct.name} x${tempQty} = ${formatRupiah(subtotal)}\n\nTotal: ${formatRupiah(subtotal)}`;
    
    const modal = document.getElementById('contactModal');
    const productEl = document.getElementById('modalProduct');
    if (productEl) productEl.innerHTML = `<strong>${creoveProduct.name} (x${tempQty})</strong><br>Total: ${formatRupiah(subtotal)}`;
    
    if (modal) modal.classList.remove('hidden');
}

// --- 4. TAMPILAN ERROR MERAH ---
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
    if (errorMsg) {
        errorMsg.remove();
    }
}

// --- 5. VALIDASI & PENGIRIMAN DATA (SHEET + WA) ---
function validateContactForm() {
    let isValid = true;
    
    const nameEl = document.getElementById('custName');
    const phoneEl = document.getElementById('custPhone');
    const deliveryEl = document.getElementById('deliverySelect');
    const paymentEl = document.getElementById('paymentSelect');
    const addressEl = document.getElementById('addressInput');

    if (!nameEl.value.trim()) {
        showError('custName', 'Mohon isi Nama Pemesan.');
        isValid = false;
    } else { clearError('custName'); }

    if (!phoneEl.value.trim()) {
        showError('custPhone', 'Mohon isi No. WhatsApp.');
        isValid = false;
    } else { clearError('custPhone'); }

    if (!deliveryEl.value) {
        showError('deliverySelect', 'Mohon pilih Metode Pengantaran.');
        isValid = false;
    } else { clearError('deliverySelect'); }

    // Validasi khusus alamat jika pilih COD atau Kurir
    if ((deliveryEl.value === 'COD' || deliveryEl.value === 'Kurir') && !addressEl.value.trim()) {
        showError('addressInput', 'Mohon isi Alamat lengkap untuk pengantaran.');
        isValid = false;
    } else if (deliveryEl.value === 'COD' || deliveryEl.value === 'Kurir') { 
        clearError('addressInput'); 
    }

    if (!paymentEl.value) {
        showError('paymentSelect', 'Mohon pilih Metode Pembayaran.');
        isValid = false;
    } else { clearError('paymentSelect'); }

    return isValid;
}

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
        
        // Ambil alamat jika COD / Kurir
        let alamatTambahan = '';
        const deliveryMethod = document.getElementById('deliverySelect').value;
        if (deliveryMethod === 'COD' || deliveryMethod === 'Kurir') {
            alamatTambahan = `\nAlamat: ${document.getElementById('addressInput').value.trim()}`;
        }
        
        const pesananDetail = `*Order ID: ${orderId}*\n\n${currentMessage}\n\nNama: ${namaPembeli}\nMetode: ${deliveryMethod}${alamatTambahan}`;

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
        window.open(waUrl, '_blank'); 

        document.getElementById('contactModal').classList.add('hidden');

    } catch (error) {
        console.error('Error:', error);
        alert("Terjadi gangguan koneksi, namun kamu akan tetap diarahkan ke WhatsApp.");
        const fallbackUrl = `https://wa.me/6281345700451?text=${encodeURIComponent(currentMessage)}`;
        window.open(fallbackUrl, '_blank');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// --- 6. EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
    renderProduct();

    const modal = document.getElementById('contactModal');
    const modalClose = document.getElementById('modalClose');
    const btnWA = document.getElementById('btnWhatsApp');
    const deliverySelect = document.getElementById('deliverySelect');
    const addressWrap = document.getElementById('addressWrap');

    if (modalClose) modalClose.onclick = () => modal.classList.add('hidden');
    if (btnWA) btnWA.onclick = prosesPesanan;

    if (deliverySelect) {
        deliverySelect.onchange = () => {
            clearError('deliverySelect');
            // Munculkan kolom alamat jika milih COD atau Kurir
            if (deliverySelect.value === 'COD' || deliverySelect.value === 'Kurir') {
                addressWrap.style.display = 'block';
            } else {
                addressWrap.style.display = 'none';
                clearError('addressInput'); 
            }
        };
    }

    ['custName', 'custPhone', 'addressInput'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.addEventListener('input', () => clearError(id));
    });
    
    if(document.getElementById('paymentSelect')) {
        document.getElementById('paymentSelect').addEventListener('change', () => clearError('paymentSelect'));
    }
});