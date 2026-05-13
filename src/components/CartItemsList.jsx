import {
  OREO_PRODUCT_ID,
  OREO_PROMO_BUNDLE_QTY,
  formatRupiah,
  getCartItemPricing,
} from '../data';

const CartItemsList = ({ cart, clearCart, onAddPromo, onRemoveItem }) => {
  const cartItems = Object.entries(cart)
    .map(([id, qty]) => getCartItemPricing(id, qty))
    .filter(Boolean);

  const grandTotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const oreoQty = cart[OREO_PRODUCT_ID] || 0;
  const sisaUntukPromo = oreoQty % OREO_PROMO_BUNDLE_QTY;
  const butuhBerapaLagi =
    sisaUntukPromo > 0 ? OREO_PROMO_BUNDLE_QTY - sisaUntukPromo : 0;

  return (
    <div className="cart-items-container">
      <div className="cart-panel-header">
        <div>
          <p className="cart-panel-eyebrow">Pesanan Kamu</p>
          <h3>Ringkasan Belanja</h3>
        </div>
        <span className="cart-count-pill">{totalQty} item</span>
      </div>

      {butuhBerapaLagi > 0 && (
        <button className="promo-banner" type="button" onClick={onAddPromo}>
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
        </button>
      )}

      <div className="cart-list">
        {cartItems.length === 0 && (
          <div className="cart-empty-state">
            <i className="fas fa-shopping-bag"></i>
            <p>Keranjang masih kosong</p>
          </div>
        )}

        {cartItems.map((pricing) => {
          const { product, subtotal } = pricing;
          const infoHarga = pricing.isPromoApplied
            ? `Promo x${pricing.promoBundles}${
                pricing.normalQty > 0 ? ` + Normal x${pricing.normalQty}` : ''
              }`
            : `${pricing.qty} pcs`;

          return (
            <div key={product.id} className="cart-item-row">
              <img
                className="cart-item-image"
                src={product.image}
                alt={product.name}
              />

              <div className="cart-item-main">
                <div className="cart-item-topline">
                  <div className="cart-item-name">{product.name}</div>
                  <div className="cart-item-subtotal">
                    {formatRupiah(subtotal)}
                  </div>
                </div>

                <div className="cart-item-info">
                  <span className="cart-qty-badge">x{pricing.qty}</span>
                  <span>{infoHarga}</span>
                  {pricing.isPromoApplied && (
                    <span className="cart-promo-badge">Promo aktif</span>
                  )}
                </div>
              </div>

              <button
                className="cart-item-remove"
                type="button"
                onClick={() => onRemoveItem(product.id)}
                aria-label={`Hapus ${product.name} dari keranjang`}
              >
                <i className="far fa-trash-alt"></i>
              </button>
            </div>
          );
        })}
      </div>

      <div className="cart-summary">
        <div>
          <div className="cart-summary-label">Total Belanja</div>
        </div>
        <div className="cart-summary-total">{formatRupiah(grandTotal)}</div>
      </div>

      <button
        className="cart-clear-btn"
        type="button"
        onClick={clearCart}
        disabled={cartItems.length === 0}
      >
        <i className="far fa-trash-alt"></i>
        Kosongkan Keranjang
      </button>
    </div>
  );
};

export default CartItemsList;
