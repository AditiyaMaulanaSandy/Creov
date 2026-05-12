import React from 'react';
import { creoveProducts, formatRupiah } from '../data';

const CartItemsList = ({ cart, clearCart, onAddPromo, onRemoveItem }) => {
  let grandTotal = 0;

  const oreoQty = cart['CRV-01'] || 0;
  const sisaUntukPromo = oreoQty % 3;
  const butuhBerapaLagi = sisaUntukPromo > 0 ? 3 - sisaUntukPromo : 0;

  return (
    <div className="cart-items-container">
      {butuhBerapaLagi > 0 && (
        <div className="promo-banner" onClick={onAddPromo}>
          <div className="promo-icon">
            <i className="fas fa-gift"></i>
          </div>
          <div className="promo-text">
            Tambah {butuhBerapaLagi} cup <strong>Signature Oreo</strong> lagi
            untuk harga promo!
          </div>
          <div className="promo-arrow">
            <i className="fas fa-chevron-right"></i>
          </div>
        </div>
      )}

      {Object.entries(cart).map(([id, qty]) => {
        const product = creoveProducts.find((p) => p.id === id);
        let subtotal = 0;
        let infoHarga = '';

        if (id === 'CRV-01' && qty >= 3) {
          const paket = Math.floor(qty / 3);
          const sisa = qty % 3;
          subtotal = paket * 25000 + sisa * product.price;
          infoHarga = `Promo x${paket}${sisa > 0 ? ` + Normal x${sisa}` : ''}`;
        } else {
          subtotal = qty * product.price;
          infoHarga = `${qty} pcs`;
        }

        grandTotal += subtotal;

        return (
          <div key={id} className="cart-item-row">
            <div>
              <div className="cart-item-name">{product.name}</div>
              <div className="cart-item-info">{infoHarga}</div>
            </div>

            <div className="cart-item-right">
              <div className="cart-item-subtotal">{formatRupiah(subtotal)}</div>
              <button
                className="cart-item-remove"
                onClick={() => onRemoveItem(id)}
                onMouseOver={(e) =>
                  (e.currentTarget.style.color = '#CC0000')
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.color = '#A67C52')
                }
              >
                <i className="far fa-trash-alt"></i>
              </button>
            </div>
          </div>
        );
      })}

      <div className="cart-summary">
        <div className="cart-summary-label">Total Belanja:</div>
        <div className="cart-summary-total">{formatRupiah(grandTotal)}</div>
        <button className="cart-clear-btn" onClick={clearCart}>
          Kosongkan Keranjang
        </button>
      </div>
    </div>
  );
};

export default CartItemsList;