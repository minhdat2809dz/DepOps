/**
 * cart.js - Quản lý giỏ hàng VIP PRO, Voucher giảm giá, Yêu thích (Wishlist) & So sánh (Compare)
 */

const CART_STORAGE_KEY = 'techstore_cart_items';
const WISHLIST_STORAGE_KEY = 'techstore_wishlist_items';
const COMPARE_STORAGE_KEY = 'techstore_compare_items';
const COUPON_STORAGE_KEY = 'techstore_applied_coupon';

// Ngưỡng miễn phí vận chuyển toàn quốc (5.000.000 đ)
const FREESHIP_THRESHOLD = 5000000;
const STANDARD_SHIPPING_FEE = 50000;

// Danh sách mã Voucher khuyến mãi hợp lệ
const VALID_COUPONS = {
  'TECHSALE10': { type: 'percent', value: 10, label: 'Giảm 10% tổng đơn' },
  'VIPPRO': { type: 'fixed', value: 1000000, label: 'Giảm trực tiếp 1.000.000 đ' },
  'FREESHIP': { type: 'shipping', value: STANDARD_SHIPPING_FEE, label: 'Miễn phí vận chuyển hỏa tốc' }
};

// ==================== GIỎ HÀNG (CART) ====================

// Lấy giỏ hàng từ LocalStorage
function getCart() {
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Lỗi khi đọc giỏ hàng từ localStorage:', e);
    return [];
  }
}

// Lưu giỏ hàng vào LocalStorage
function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartUI();
  } catch (e) {
    console.error('Lỗi khi lưu giỏ hàng vào localStorage:', e);
  }
}

// Thêm sản phẩm vào giỏ hàng (hỗ trợ màu sắc & dung lượng nếu có)
function addToCart(productId, quantity = 1, selectedColor = null, selectedStorage = null, customPrice = null) {
  const product = products.find(p => p.id === Number(productId));
  if (!product) return;

  const cart = getCart();
  const colorName = selectedColor || (product.colors && product.colors[0] ? product.colors[0].name : '');
  const storageLabel = selectedStorage || (product.storageOptions && product.storageOptions[0] ? product.storageOptions[0].label : '');
  const itemPrice = customPrice !== null ? customPrice : product.price;

  // Tạo ID duy nhất cho biến thể (variant key)
  const variantKey = `${product.id}-${colorName}-${storageLabel}`;

  const existingItemIndex = cart.findIndex(item => item.variantKey === variantKey || (!item.variantKey && item.id === product.id));

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += Number(quantity);
  } else {
    cart.push({
      id: product.id,
      variantKey: variantKey,
      name: product.name,
      price: itemPrice,
      originalPrice: product.oldPrice || product.price,
      image: product.image,
      color: colorName,
      storage: storageLabel,
      quantity: Number(quantity)
    });
  }

  saveCart(cart);

  // Hiệu ứng rung icon giỏ hàng
  triggerCartBadgeAnimation();

  showToast(`Đã thêm "${product.name}" (${colorName ? colorName + ' - ' : ''}${storageLabel || ''}) vào giỏ hàng!`, 'success');
}

// Cập nhật số lượng sản phẩm
function updateCartQuantity(variantKeyOrId, newQuantity) {
  let cart = getCart();
  const index = cart.findIndex(item => item.variantKey === variantKeyOrId || item.id === Number(variantKeyOrId));

  if (index > -1) {
    if (newQuantity <= 0) {
      removeFromCart(variantKeyOrId);
      return;
    } else {
      cart[index].quantity = newQuantity;
      saveCart(cart);
    }
  }
}

// Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(variantKeyOrId) {
  let cart = getCart();
  const itemToRemove = cart.find(item => item.variantKey === variantKeyOrId || item.id === Number(variantKeyOrId));
  cart = cart.filter(item => item.variantKey !== variantKeyOrId && item.id !== Number(variantKeyOrId));
  saveCart(cart);

  if (itemToRemove) {
    showToast(`Đã xóa "${itemToRemove.name}" khỏi giỏ hàng`, 'info');
  }
}

// Xóa toàn bộ giỏ hàng
function clearCart() {
  saveCart([]);
  removeCoupon();
}

// Tính tổng số lượng món đồ trong giỏ
function getCartCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

// Tính tạm tính giỏ hàng (chưa trừ voucher và phí ship)
function getCartSubtotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Quản lý Voucher
function getAppliedCoupon() {
  try {
    const raw = sessionStorage.getItem(COUPON_STORAGE_KEY) || localStorage.getItem(COUPON_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function applyCoupon(code) {
  const cleanCode = (code || '').trim().toUpperCase();
  const coupon = VALID_COUPONS[cleanCode];

  if (!coupon) {
    return { success: false, message: 'Mã giảm giá không hợp lệ hoặc đã hết lượt!' };
  }

  const couponData = { code: cleanCode, ...coupon };
  sessionStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(couponData));
  localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(couponData));
  updateCartUI();
  return { success: true, coupon: couponData, message: `Áp dụng thành công mã ${cleanCode}: ${coupon.label}!` };
}

function removeCoupon() {
  sessionStorage.removeItem(COUPON_STORAGE_KEY);
  localStorage.removeItem(COUPON_STORAGE_KEY);
  updateCartUI();
}

// Tính toán toàn diện đơn hàng (Tạm tính, Khuyến mãi, Phí vận chuyển, Tổng thanh toán)
function calculateOrderBreakdown() {
  const subtotal = getCartSubtotal();
  const coupon = getAppliedCoupon();

  let discount = 0;
  let shipping = subtotal > 0 ? (subtotal >= FREESHIP_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE) : 0;

  if (coupon && subtotal > 0) {
    if (coupon.type === 'percent') {
      discount = Math.round((subtotal * coupon.value) / 100);
    } else if (coupon.type === 'fixed') {
      discount = Math.min(coupon.value, subtotal);
    } else if (coupon.type === 'shipping') {
      shipping = 0;
    }
  }

  const total = Math.max(0, subtotal - discount + shipping);

  return {
    subtotal,
    discount,
    shipping,
    total,
    coupon,
    isFreeship: shipping === 0 && subtotal > 0
  };
}

// Tính tổng tiền giỏ hàng cuối cùng
function getCartTotal() {
  return calculateOrderBreakdown().total;
}

// Hiệu ứng rung chuông giỏ hàng
function triggerCartBadgeAnimation() {
  const badge = document.getElementById('cart-badge');
  const btn = document.getElementById('cart-toggle-btn');
  if (btn) {
    btn.classList.add('cart-bounce');
    setTimeout(() => btn.classList.remove('cart-bounce'), 600);
  }
}

// Cập nhật toàn bộ giao diện Cart Drawer
function updateCartUI() {
  const cart = getCart();
  const count = getCartCount();
  const breakdown = calculateOrderBreakdown();

  // Cập nhật badge số lượng ở header
  const badgeElement = document.getElementById('cart-badge');
  if (badgeElement) {
    badgeElement.textContent = count;
    badgeElement.style.display = count > 0 ? 'flex' : 'none';
  }

  // Cập nhật Drawer giỏ hàng
  const cartItemsContainer = document.getElementById('cart-items');
  const cartEmptyState = document.getElementById('cart-empty');
  const cartFooter = document.getElementById('cart-footer');
  const cartSubtotalEl = document.getElementById('cart-subtotal-amount');
  const cartDiscountRow = document.getElementById('cart-discount-row');
  const cartDiscountAmount = document.getElementById('cart-discount-amount');
  const cartShippingAmount = document.getElementById('cart-shipping-amount');
  const cartTotalAmount = document.getElementById('cart-total-amount');

  // Thanh tiến trình Freeship
  const freeshipProgress = document.getElementById('freeship-progress-bar');
  const freeshipText = document.getElementById('freeship-text-desc');

  if (freeshipProgress && freeshipText) {
    if (breakdown.subtotal >= FREESHIP_THRESHOLD) {
      freeshipProgress.style.width = '100%';
      freeshipText.innerHTML = '🎉 <strong>Tuyệt vời!</strong> Đơn hàng của bạn được <strong>Miễn phí giao hàng VIP</strong>!';
    } else if (breakdown.subtotal > 0) {
      const remaining = FREESHIP_THRESHOLD - breakdown.subtotal;
      const pct = Math.min(100, Math.round((breakdown.subtotal / FREESHIP_THRESHOLD) * 100));
      freeshipProgress.style.width = `${pct}%`;
      freeshipText.innerHTML = `Mua thêm <strong>${formatVND(remaining)}</strong> để nhận <strong>Freeship Toàn Quốc</strong>!`;
    } else {
      freeshipProgress.style.width = '0%';
      freeshipText.innerHTML = `Đơn hàng từ <strong>${formatVND(FREESHIP_THRESHOLD)}</strong> được <strong>Freeship Hỏa Tốc</strong>!`;
    }
  }

  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '';
    if (cartEmptyState) cartEmptyState.style.display = 'block';
    if (cartFooter) cartFooter.style.display = 'none';
  } else {
    if (cartEmptyState) cartEmptyState.style.display = 'none';
    if (cartFooter) cartFooter.style.display = 'block';

    cartItemsContainer.innerHTML = cart.map(item => {
      const itemKey = item.variantKey || item.id;
      return `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-variant">
              ${item.color ? `<span class="cart-item-tag">${item.color}</span>` : ''}
              ${item.storage ? `<span class="cart-item-tag">${item.storage}</span>` : ''}
            </div>
            <div class="cart-item-price-row">
              <span class="cart-item-price">${formatVND(item.price)}</span>
            </div>
            <div class="cart-item-actions">
              <div class="qty-control">
                <button class="qty-btn minus" onclick="updateCartQuantity('${itemKey}', ${item.quantity - 1})">-</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn plus" onclick="updateCartQuantity('${itemKey}', ${item.quantity + 1})">+</button>
              </div>
              <button class="cart-item-remove" onclick="removeFromCart('${itemKey}')" title="Xóa món này">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (cartSubtotalEl) cartSubtotalEl.textContent = formatVND(breakdown.subtotal);
    if (cartTotalAmount) cartTotalAmount.textContent = formatVND(breakdown.total);
    if (cartShippingAmount) {
      cartShippingAmount.textContent = breakdown.shipping === 0 ? 'Miễn phí' : formatVND(breakdown.shipping);
      if (breakdown.shipping === 0) {
        cartShippingAmount.classList.add('text-success');
      } else {
        cartShippingAmount.classList.remove('text-success');
      }
    }

    if (cartDiscountRow && cartDiscountAmount) {
      if (breakdown.discount > 0) {
        cartDiscountRow.style.display = 'flex';
        cartDiscountAmount.textContent = `-${formatVND(breakdown.discount)}`;
      } else {
        cartDiscountRow.style.display = 'none';
      }
    }

    // Hiển thị badge coupon đang áp dụng
    const activeCouponBox = document.getElementById('active-coupon-box');
    if (activeCouponBox) {
      if (breakdown.coupon) {
        activeCouponBox.innerHTML = `
          <div class="applied-coupon-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>${breakdown.coupon.code}</span>
            <button onclick="removeCoupon()" title="Xóa mã">&times;</button>
          </div>
        `;
        activeCouponBox.style.display = 'block';
      } else {
        activeCouponBox.style.display = 'none';
      }
    }
  }
}

// ==================== DANH SÁCH YÊU THÍCH (WISHLIST) ====================

function getWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveWishlist(list) {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(list));
    updateWishlistUI();
  } catch (e) {
    console.error('Lỗi khi lưu wishlist:', e);
  }
}

function isInWishlist(productId) {
  const list = getWishlist();
  return list.some(id => Number(id) === Number(productId));
}

function toggleWishlist(productId) {
  let list = getWishlist();
  const idNum = Number(productId);
  const product = products.find(p => p.id === idNum);

  if (isInWishlist(idNum)) {
    list = list.filter(id => Number(id) !== idNum);
    saveWishlist(list);
    showToast(`Đã bỏ "${product ? product.name : 'sản phẩm'}" khỏi danh sách yêu thích`, 'info');
  } else {
    list.push(idNum);
    saveWishlist(list);
    showToast(`Đã thêm "${product ? product.name : 'sản phẩm'}" vào danh sách yêu thích! ❤️`, 'success');
  }

  // Cập nhật lại các nút tim trên trang
  updateHeartButtons();
}

function updateWishlistUI() {
  const list = getWishlist();
  const badge = document.getElementById('wishlist-badge');
  if (badge) {
    badge.textContent = list.length;
    badge.style.display = list.length > 0 ? 'flex' : 'none';
  }
}

function updateHeartButtons() {
  document.querySelectorAll('.btn-wishlist-heart').forEach(btn => {
    const pid = Number(btn.dataset.id);
    if (isInWishlist(pid)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// ==================== SO SÁNH SẢN PHẨM (COMPARE) ====================

function getCompareList() {
  try {
    const raw = localStorage.getItem(COMPARE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCompareList(list) {
  try {
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(list));
    updateCompareUI();
  } catch (e) {
    console.error('Lỗi khi lưu compare list:', e);
  }
}

function isInCompare(productId) {
  const list = getCompareList();
  return list.some(id => Number(id) === Number(productId));
}

function toggleCompare(productId) {
  let list = getCompareList();
  const idNum = Number(productId);
  const product = products.find(p => p.id === idNum);

  if (isInCompare(idNum)) {
    list = list.filter(id => Number(id) !== idNum);
    saveCompareList(list);
    showToast(`Đã gỡ "${product ? product.name : 'sản phẩm'}" khỏi bảng so sánh`, 'info');
  } else {
    if (list.length >= 3) {
      showToast('Bạn chỉ có thể so sánh tối đa 3 sản phẩm cùng lúc!', 'warning');
      return;
    }
    list.push(idNum);
    saveCompareList(list);
    showToast(`Đã thêm "${product ? product.name : 'sản phẩm'}" vào bảng so sánh ⚖️`, 'success');
  }

  updateCompareButtons();
}

function clearCompareList() {
  saveCompareList([]);
  updateCompareButtons();
  closeModal('compare-modal');
  showToast('Đã dọn sạch bảng so sánh', 'info');
}

function updateCompareUI() {
  const list = getCompareList();
  const badge = document.getElementById('compare-badge');
  if (badge) {
    badge.textContent = list.length;
    badge.style.display = list.length > 0 ? 'flex' : 'none';
  }
}

function updateCompareButtons() {
  document.querySelectorAll('.btn-compare-action').forEach(btn => {
    const pid = Number(btn.dataset.id);
    if (isInCompare(pid)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}
