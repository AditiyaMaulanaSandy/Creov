import React, { useState, useEffect } from 'react';
import { creoveProducts, formatRupiah } from './data';
import ProductCard from './components/ProductCard';
import CartItemsList from './components/CartItemsList';
import './style.css';

const App = () => {
  const [cart, setCart] = useState({});
  const [toasts, setToasts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    custName: '',
    custPhone: '',
    deliverySelect: '',
    paymentSelect: '',
    addressInput: '',
  });
  const [errors, setErrors] = useState({});

  const SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycbyQJLmhvZl-k932BihUyOSi1hDgazskBQJAzi63TpgP5sjzbGebm-YQ08NEpENj978/exec';
  const WA_NUMBER = '6281345700451';

  useEffect(() => {
  if (isModalOpen) {
    document.body.style.overflow = 'hidden'; // Kunci scroll layar utama
  } else {
    document.body.style.overflow = 'unset';
  }
}, [isModalOpen]);

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const showToast = (productName, qty) => {
    const id = Date.now();
    setToasts((prev) => [
      ...prev,
      { id, message: `${qty} ${productName} masuk keranjang!` },
    ]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  };

  const addToCart = (product, qtyToAdd) => {
    setCart((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + qtyToAdd,
    }));
    showToast(product.name, qtyToAdd);
  };

  const handleAddPromoOreo = () => {
    const oreoProduct = creoveProducts.find((p) => p.id === 'CRV-01');
    addToCart(oreoProduct, 1);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const newCart = { ...prev };
      delete newCart[productId];
      return newCart;
    });
  };

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: null }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.custName.trim())
      newErrors.custName = 'Mohon isi Nama Pemesan.';
    if (!formData.custPhone.trim())
      newErrors.custPhone = 'Mohon isi No. WhatsApp.';
    if (!formData.deliverySelect)
      newErrors.deliverySelect = 'Pilih Metode Pengantaran.';
    if (!formData.paymentSelect)
      newErrors.paymentSelect = 'Pilih Metode Pembayaran.';

    const needsAddress =
      formData.deliverySelect === 'COD' || formData.deliverySelect === 'Kurir';
    if (needsAddress && !formData.addressInput.trim())
      newErrors.addressInput = 'Mohon isi Alamat lengkap.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildOrderMessage = () => {
    let grandTotal = 0;
    let waMessage = 'Halo! Saya ingin memesan:\n\n';

    Object.entries(cart).forEach(([id, qty]) => {
      const product = creoveProducts.find((p) => p.id === id);
      let subtotal = 0;
      let waNote = '';

      if (id === 'CRV-01' && qty >= 3) {
        const jumlahPaketPromo = Math.floor(qty / 3);
        const sisaNormal = qty % 3;
        subtotal = jumlahPaketPromo * 25000 + sisaNormal * product.price;
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

    return { grandTotal, waMessage };
  };

  const prosesPesanan = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    const { grandTotal, waMessage } = buildOrderMessage();
    const orderId = 'CRV-' + Date.now().toString().slice(-6);

    const alamatTambahan =
      formData.deliverySelect === 'COD' || formData.deliverySelect === 'Kurir'
        ? `\nAlamat: ${formData.addressInput.trim()}`
        : '';

    const pesananDetail =
      `*Order ID: ${orderId}*\n\n${waMessage}\n\n` +
      `Nama: ${formData.custName}\n` +
      `Pengantaran: ${formData.deliverySelect}${alamatTambahan}\n` +
      `Pembayaran: ${formData.paymentSelect}`;

    const waURL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesananDetail)}`;

    try {
      const payload = {
        orderId,
        nama: formData.custName,
        nomorHp: formData.custPhone,
        pesanan: pesananDetail,
        total: grandTotal,
      };

      await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
    } catch {
      alert('Koneksi lambat, mengarahkan langsung ke WhatsApp...');
    } finally {
      window.location.href = waURL;
      setCart({});
      setFormData({
        custName: '',
        custPhone: '',
        deliverySelect: '',
        paymentSelect: '',
        addressInput: '',
      });
      setIsModalOpen(false);
      setIsSubmitting(false);
    }
  };

  const needsAddress =
    formData.deliverySelect === 'COD' || formData.deliverySelect === 'Kurir';

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
          <h2>Our Signatures</h2>
          <div className="divider"></div>
        </div>

        <div className="menu-grid">
          {creoveProducts.map((product) => (
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
          <a
            href="https://www.instagram.com/creove.dessert/"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href={`https://wa.me/${WA_NUMBER}`}
            target="_blank"
            rel="noreferrer"
          >
            <i className="fab fa-whatsapp"></i>
          </a>
        </div>
      </footer>

      <button
        className={`floating-cart ${totalItems > 0 ? '' : 'hidden'}`}
        onClick={() => setIsModalOpen(true)}
      >
        <i className="fas fa-shopping-bag"></i> Checkout (
        <span>{totalItems}</span>)
      </button>

      <div className={`modal ${isModalOpen ? '' : 'hidden'}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>Keranjang Belanja</h2>
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>
              &times;
            </button>
          </div>

          <CartItemsList
            cart={cart}
            clearCart={() => setCart({})}
            onAddPromo={handleAddPromoOreo}
            onRemoveItem={removeFromCart}
          />

          <div className="form-group">
            <label htmlFor="custName">Nama Pemesan</label>
            <div className={`input-wrapper ${errors.custName ? 'error' : ''}`}>
              <i className="far fa-user"></i>
              <input
                id="custName"
                type="text"
                value={formData.custName}
                onChange={handleFormChange}
                placeholder="Masukkan nama kamu"
              />
            </div>
            {errors.custName && (
              <span className="input-error-msg">{errors.custName}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="custPhone">No. WhatsApp</label>
            <div className={`input-wrapper ${errors.custPhone ? 'error' : ''}`}>
              <i className="fab fa-whatsapp"></i>
              <input
                id="custPhone"
                type="tel"
                value={formData.custPhone}
                onChange={handleFormChange}
                placeholder="Contoh: 08123456789"
              />
            </div>
            {errors.custPhone && (
              <span className="input-error-msg">{errors.custPhone}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="deliverySelect">Metode Pengantaran</label>
            <div
              className={`input-wrapper ${errors.deliverySelect ? 'error' : ''}`}
            >
              <i className="fas fa-truck"></i>
              <select
                id="deliverySelect"
                value={formData.deliverySelect}
                onChange={handleFormChange}
              >
                <option value="">-- Pilih Pengantaran --</option>
                <option value="COD">COD (Area Sekitar)</option>
                <option value="Pick up">Pick up (Ambil Sendiri)</option>
                <option value="Kurir">Kurir (DiAntar)</option>
              </select>
            </div>
            {errors.deliverySelect && (
              <span className="input-error-msg">{errors.deliverySelect}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="paymentSelect">Metode Pembayaran</label>
            <div
              className={`input-wrapper ${errors.paymentSelect ? 'error' : ''}`}
            >
              <i className="far fa-credit-card"></i>
              <select
                id="paymentSelect"
                value={formData.paymentSelect}
                onChange={handleFormChange}
              >
                <option value="">-- Pilih Pembayaran --</option>
                <option value="Cash">Cash (Tunai)</option>
                <option value="QRIS">QRIS</option>
                <option value="Transfer">Transfer Bank</option>
              </select>
            </div>
            {errors.paymentSelect && (
              <span className="input-error-msg">{errors.paymentSelect}</span>
            )}
          </div>

          {needsAddress && (
            <div className="form-group">
              <label htmlFor="addressInput">Alamat COD / Patokan</label>
              <div
                className={`input-wrapper align-top ${errors.addressInput ? 'error' : ''}`}
              >
                <i
                  className="fas fa-map-marker-alt"
                  style={{ marginTop: '14px' }}
                ></i>
                <textarea
                  id="addressInput"
                  rows="3"
                  value={formData.addressInput}
                  onChange={handleFormChange}
                  placeholder="Tuliskan patokan lokasi sedetail mungkin..."
                ></textarea>
              </div>
              {errors.addressInput && (
                <span className="input-error-msg">{errors.addressInput}</span>
              )}
            </div>
          )}

          <div className="modal-actions">
            <p className="modal-actions-label">Kirim pesanan via:</p>
            <button
              className="action-btn wa-btn"
              onClick={prosesPesanan}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fab fa-whatsapp"></i>
              )}{' '}
              {isSubmitting ? 'Memproses...' : 'Proses Pembayaran'}
            </button>
          </div>
        </div>
      </div>

      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <i
              className="fas fa-check-circle"
              style={{ color: '#25D366', fontSize: '16px' }}
            ></i>{' '}
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;