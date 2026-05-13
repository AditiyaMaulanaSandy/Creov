import {
  OREO_PRODUCT_ID,
  OREO_PROMO_BUNDLE_QTY,
  formatRupiah,
  getCartItemPricing,
} from '../data';

const CartItemsList = ({ cart, clearCart, onAddPromo, onRemoveItem }) => {
  let grandTotal = 0;

  const oreoQty = cart[OREO_PRODUCT_ID] || 0;
  const sisaUntukPromo = oreoQty % OREO_PROMO_BUNDLE_QTY;
  const butuhBerapaLagi =
    sisaUntukPromo > 0 ? OREO_PROMO_BUNDLE_QTY - sisaUntukPromo : 0;

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
        const pricing = getCartItemPricing(id, qty);

        if (!pricing) return null;

        const { product, subtotal } = pricing;
        const infoHarga = pricing.isPromoApplied
          ? `Promo x${pricing.promoBundles}${
              pricing.normalQty > 0 ? ` + Normal x${pricing.normalQty}` : ''
            }`
          : `${pricing.qty} pcs`;

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
