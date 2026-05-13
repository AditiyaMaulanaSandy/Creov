export const OREO_PRODUCT_ID = 'CRV-01';
export const OREO_PROMO_BUNDLE_QTY = 3;
export const OREO_PROMO_PRICE = 25000;

export const creoveProducts = [
  {
    id: "CRV-01",
    name: "Signature Layered Oreo",
    price: 10000,
    image: "oreo.webp",
    promoText: "🔥 PROMO: Beli 3 Cuma Rp25.000!",
    description: "Nikmati harmoni sempurna dari oreo asli yang renyah, krim keju super lembut, dan lelehan cokelat premium dalam setiap suapannya. Dibuat fresh setiap hari untuk menemani waktu santaimu.",
    layers: [
      { color: "#3B2F2F", text: "Crunchy Oreo" },
      { color: "#FFFDD0", text: "Cheese Cream", border: "1px solid #eee" },
      { color: "#4A2511", text: "Melted Choco" }
    ]
  },
  {
    id: "CRV-02",
    name: "Dubai Chewy Cookie Mini",
    price: 17000,
    image: "dubai.webp",
    promoText: "",
    description: "Sensasi luar biasa dari chewy cookie yang dibalut cokelat premium dengan isian pistachio lumer di dalamnya. Ukuran mini yang pas untuk dinikmati kapan saja!",
    layers: [
      { color: "#4A2511", text: "Dark Chocolate" },
      { color: "#8A9A5B", text: "Kunafa Pistachio" },
      { color: "#6B4423", text: "Chewy Cookie" }
    ]
  }
];

export const getProductById = (id) => {
  return creoveProducts.find((product) => product.id === id);
};

export const getCartItemPricing = (id, qty) => {
  const product = getProductById(id);
  const quantity = Math.floor(Number(qty));

  if (!product || !Number.isFinite(quantity) || quantity <= 0) {
    return null;
  }

  if (id === OREO_PRODUCT_ID && quantity >= OREO_PROMO_BUNDLE_QTY) {
    const promoBundles = Math.floor(quantity / OREO_PROMO_BUNDLE_QTY);
    const normalQty = quantity % OREO_PROMO_BUNDLE_QTY;

    return {
      product,
      qty: quantity,
      subtotal: promoBundles * OREO_PROMO_PRICE + normalQty * product.price,
      promoBundles,
      normalQty,
      isPromoApplied: true,
    };
  }

  return {
    product,
    qty: quantity,
    subtotal: quantity * product.price,
    promoBundles: 0,
    normalQty: quantity,
    isPromoApplied: false,
  };
};

export const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number);
};
