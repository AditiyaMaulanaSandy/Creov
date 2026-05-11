import React, { useState, useEffect } from 'react';
import { creoveProducts, formatRupiah } from './data';
import ProductCard from './components/ProductCard'; // Import komponen
import CartItemsList from './components/CartItemsList'; // Import komponen
import './style.css'; 

const App = () => {
  const [cart, setCart] = useState({});
  const [toasts, setToasts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    custName: '', custPhone: '', deliverySelect: '', paymentSelect: '', addressInput: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isModalOpen) document.body.classList.add('no-scroll');
    else document.body.classList.remove('no-scroll');
  }, [isModalOpen]);

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const showToast = (productName, qty) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message: `${qty} ${productName} masuk keranjang!` }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2500);
  };

  // Fungsi ini sekarang menerima qty langsung dari ProductCard
  const addToCart = (product, qtyToAdd) => {
    setCart(prev => ({ ...prev, [product.id]: (prev[product.id] || 0) + qtyToAdd }));
    showToast(product.name, qtyToAdd);
  };

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: null }));
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;
    if (!formData.custName.trim()) { newErrors.custName = 'Mohon isi Nama Pemesan.'; isValid = false; }
    if (!formData.custPhone.trim()) { newErrors.custPhone = 'Mohon isi No. WhatsApp.'; isValid = false; }
    if (!formData.deliverySelect) { newErrors.deliverySelect = 'Pilih Metode Pengantaran.'; isValid = false; }
    if (!formData.paymentSelect) { newErrors.paymentSelect = 'Pilih Metode Pembayaran.'; isValid = false; }
    
    const needsAddress = formData.deliverySelect === 'COD' || formData.deliverySelect === 'Kurir';
    if (needsAddress && !formData.addressInput.trim()) {
      newErrors.addressInput = 'Mohon isi Alamat lengkap.'; isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const prosesPesanan = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    let grandTotal = 0;
    let waMessage = `Halo! Saya ingin memesan:\n\n`;

    Object.entries(cart).forEach(([id, qty]) => {
      const product = creoveProducts.find(p => p.id === id);
      let subtotal = 0; let waNote = '';

      if (id === "CRV-01" && qty >= 3) {
        const jumlahPaketPromo = Math.floor(qty / 3);
        const sisaNormal = qty % 3;
        subtotal = (jumlahPaketPromo * 25000) + (sisaNormal * product.price);
        waNote = `(Promo Paket 3pcs x${jumlahPaketPromo})`;
        if (sisaNormal > 0) waNote += ` + (Normal x${sisaNormal})`;
      } else {
        subtotal = qty * product.price;
      }

      grandTotal += subtotal;
      waMessage += `- ${product.name} (x${qty}) = ${formatRupiah(subtotal)}\n`;
      if (waNote) waMessage += `  ${waNote}\n`;
    });

    waMessage += `\n*Total Akhir: ${formatRupiah(grandTotal)}*`;

    const orderId = 'CRV-' + Date.now().toString().slice(-6);
    let alamatTambahan = '';
    if (formData.deliverySelect === 'COD' || formData.deliverySelect === 'Kurir') {
      alamatTambahan = `\nAlamat: ${formData.addressInput.trim()}`;
    }

    const pesananDetail = `*Order ID: ${orderId}*\n\n${waMessage}\n\nNama: ${formData.custName}\nPengantaran: ${formData.deliverySelect}${alamatTambahan}\nPembayaran: ${formData.paymentSelect}`;

    try {
      const payload = { orderId, nama: formData.custName, nomorHp: formData.custPhone, pesanan: pesananDetail, total: grandTotal };
      const scriptURL = 'https://script.google.com/macros/s/AKfycbxNbpGuXkRaOO1BuRNAl3CvUZYydwueGlzhvuc5ZJLKv3WY3G1QWdQx2EZ5_NSNH3o/exec';
      await fetch(scriptURL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
      window.location.href = `https://wa.me/6281345700451?text=${encodeURIComponent(pesananDetail)}`;
      setCart({}); setFormData({ custName: '', custPhone: '', deliverySelect: '', paymentSelect: '', addressInput: '' });
      setIsModalOpen(false);
    } catch (error) {
      alert("Koneksi lambat, mengarahkan langsung ke WhatsApp...");
      window.location.href = `https://wa.me/6281345700451?text=${encodeURIComponent(waMessage)}`;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <header className="hero">
        <div className="hero-content">
          <h1 className="brand-name">Creové</h1>
          <p className="brand-tagline">Taste It · Snap It · Love It</p>
        </div>
      </header>

      <main className="menu-container">
        <div className="section-heading">
          <h2>Our Signatures</h2><div className="divider"></div>
        </div>

        <div className="menu-grid">
          {/* Menggunakan komponen ProductCard di sini */}
          {creoveProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={addToCart} 
            />
          ))}
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2026 Creové. All rights reserved.</p>
        <div className="socials">
          <a href="https://www.instagram.com/creove.id" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
          <a href="https://wa.me/6281345700451" target="_blank" rel="noreferrer"><i className="fab fa-whatsapp"></i></a>
        </div>
      </footer>

      <button className={`floating-cart ${totalItems > 0 ? '' : 'hidden'}`} onClick={() => setIsModalOpen(true)}>
        <i className="fas fa-shopping-bag"></i> Checkout (<span>{totalItems}</span>)
      </button>

      <div className={`modal ${isModalOpen ? '' : 'hidden'}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>Keranjang Belanja</h2><button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
          </div>
          
          {/* Menggunakan komponen CartItemsList di sini */}
          <CartItemsList cart={cart} clearCart={() => setCart({})} />

          <div className="form-group">
            <label htmlFor="custName">Nama Pemesan</label>
            <input id="custName" type="text" value={formData.custName} onChange={handleFormChange} className={errors.custName ? 'input-error-border' : ''} placeholder="Masukkan nama kamu" />
            {errors.custName && <span className="input-error-msg">{errors.custName}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="custPhone">No. WhatsApp</label>
            <input id="custPhone" type="tel" value={formData.custPhone} onChange={handleFormChange} className={errors.custPhone ? 'input-error-border' : ''} placeholder="Contoh: 08123456789" />
            {errors.custPhone && <span className="input-error-msg">{errors.custPhone}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="deliverySelect">Metode Pengantaran</label>
            <select id="deliverySelect" value={formData.deliverySelect} onChange={handleFormChange} className={errors.deliverySelect ? 'input-error-border' : ''}>
              <option value="">-- Pilih Pengantaran --</option>
              <option value="COD">COD (Area Sekitar)</option>
              <option value="Pick up">Pick up (Ambil Sendiri)</option>
              <option value="Kurir">Kurir (DiAntar)</option>
            </select>
            {errors.deliverySelect && <span className="input-error-msg">{errors.deliverySelect}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="paymentSelect">Metode Pembayaran</label>
            <select id="paymentSelect" value={formData.paymentSelect} onChange={handleFormChange} className={errors.paymentSelect ? 'input-error-border' : ''}>
              <option value="">-- Pilih Pembayaran --</option>
              <option value="Cash">Cash (Tunai)</option>
              <option value="QRIS">QRIS</option>
              <option value="Transfer">Transfer Bank</option>
            </select>
            {errors.paymentSelect && <span className="input-error-msg">{errors.paymentSelect}</span>}
          </div>
          {(formData.deliverySelect === 'COD' || formData.deliverySelect === 'Kurir') && (
            <div className="form-group">
              <label htmlFor="addressInput">Alamat COD / Patokan</label>
              <textarea id="addressInput" rows="3" value={formData.addressInput} onChange={handleFormChange} className={errors.addressInput ? 'input-error-border' : ''} placeholder="Tuliskan patokan lokasi sedetail mungkin..."></textarea>
              {errors.addressInput && <span className="input-error-msg">{errors.addressInput}</span>}
            </div>
          )}
          <div className="modal-actions">
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', textAlign: 'center' }}>Kirim pesanan via:</p>
            <button className="action-btn wa-btn" onClick={prosesPesanan} disabled={isSubmitting}>
              {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : <i className="fab fa-whatsapp"></i>} {isSubmitting ? ' Memproses...' : ' Proses Pembayaran'}
            </button>
          </div>
        </div>
      </div>

      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className="toast" style={{ opacity: 1, animation: 'none', transform: 'none' }}>
            <i className="fas fa-check-circle" style={{ color: '#25D366', fontSize: '16px' }}></i> {t.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;