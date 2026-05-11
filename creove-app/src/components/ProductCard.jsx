import React, { useState } from 'react';
import { formatRupiah } from '../data';

const ProductCard = ({ product, onAddToCart }) => {
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const updateQty = (change) => {
    setQty((prev) => Math.max(1, prev + change));
  };

  const handleAdd = () => {
    onAddToCart(product, qty);
    setQty(1); // Reset angka ke 1 setelah ditambah ke keranjang
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="menu-card">
      <div className="image-wrapper">
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-image loaded" 
          onError={(e) => e.target.src = 'https://via.placeholder.com/400x300?text=Creov%C3%A9'} 
        />
      </div>

      <div className="product-info">
        {product.promoText && (
          <div style={{ backgroundColor: '#CC0000', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', display: 'inline-block', marginBottom: '8px', letterSpacing: '0.5px' }}>
            {product.promoText}
          </div>
        )}

        <div className="product-header">
          <h3 className="product-name">{product.name}</h3>
          <span className="product-price">{formatRupiah(product.price)}</span>
        </div>

        <div className="layer-visual">
          {product.layers.map((layer, idx) => (
            <div key={idx} className="layer-item">
              <span className="layer-color" style={{ backgroundColor: layer.color, border: layer.border || 'none' }}></span>
              <span className="layer-text">{layer.text}</span>
            </div>
          ))}
        </div>

        <p className="product-desc">{product.description}</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', marginTop: '15px' }}>
          <label style={{ fontSize: '14px', fontWeight: 700 }}>Jumlah:</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f0f0f0', padding: '5px 15px', borderRadius: '20px' }}>
            <button type="button" onClick={() => updateQty(-1)} style={{ border: 'none', background: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '18px' }}>-</button>
            <span style={{ fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{qty}</span>
            <button type="button" onClick={() => updateQty(1)} style={{ border: 'none', background: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '18px' }}>+</button>
          </div>
        </div>

        <button 
          className="btn-order" 
          onClick={handleAdd}
          style={{ backgroundColor: isAdded ? '#25D366' : '', color: isAdded ? '#fff' : '' }}
        >
          {isAdded ? <><i className="fas fa-check"></i> Berhasil</> : 'Tambah ke Keranjang'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;