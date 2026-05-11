import React from 'react';
import { creoveProducts, formatRupiah } from '../data';

const CartItemsList = ({ cart, clearCart }) => {
  let grandTotal = 0;

  return (
    <div className="cart-items-container">
      {Object.entries(cart).map(([id, qty]) => {
        const product = creoveProducts.find(p => p.id === id);
        let subtotal = 0; 
        let infoHargaTeks = '';

        if (id === "CRV-01" && qty >= 3) {
          const jumlahPaketPromo = Math.floor(qty / 3);
          const sisaNormal = qty % 3;
          subtotal = (jumlahPaketPromo * 25000) + (sisaNormal * product.price);
          infoHargaTeks = `Promo Paket 3pcs (x${jumlahPaketPromo})`;
          if (sisaNormal > 0) infoHargaTeks += ` + Harga Normal (x${sisaNormal})`;
        } else {
          subtotal = qty * product.price;
          infoHargaTeks = `${formatRupiah(product.price)} x ${qty}`;
        }
        
        grandTotal += subtotal;

        return (
          <div key={id} className="cart-item-row">
            <div>
              <strong>{product.name}</strong><br />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{infoHargaTeks}</span>
            </div>
            <div style={{ fontWeight: 'bold' }}>{formatRupiah(subtotal)}</div>
          </div>
        );
      })}
      
      <div className="cart-total-row">
        <span>Total Belanja:</span><span>{formatRupiah(grandTotal)}</span>
      </div>
      <button 
        onClick={clearCart} 
        style={{ background: 'none', border: 'none', color: '#CC0000', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', width: '100%', textAlign: 'right' }}
      >
        [ Kosongkan Keranjang ]
      </button>
    </div>
  );
};

export default CartItemsList;