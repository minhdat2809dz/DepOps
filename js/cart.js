/**
 * cart.js - Quản lý giỏ hàng (thêm, sửa, xóa, lưu LocalStorage và cập nhật giao diện)
 */

const CART_STORAGE_KEY = 'techstore_cart_items';

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

// Thêm sản phẩm vào giỏ hàng
function addToCart(productId, quantity = 1) {
  const product = products.find(p => p.id === Number(productId));
  if (!product) return;

  const cart = getCart();
  const existingItemIndex = cart.findIndex(item => item.id === product.id);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += Number(quantity);
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: Number(quantity)
    });
  }

  saveCart(cart);
  showToast(`Đã thêm "${product.name}" vào giỏ hàng!`, 'success');
}

// Cập nhật số lượng sản phẩm
function updateCartQuantity(productId, newQuantity) {
  let cart = getCart();
  const index = cart.findIndex(item => item.id === Number(productId));

  if (index > -1) {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    } else {
      cart[index].quantity = newQuantity;
      saveCart(cart);
    }
  }
}

// Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(productId) {
  let cart = getCart();
  const itemToRemove = cart.find(item => item.id === Number(productId));
  cart = cart.filter(item => item.id !== Number(productId));
  saveCart(cart);

  if (itemToRemove) {
    showToast(`Đã xóa "${itemToRemove.name}" khỏi giỏ hàng`, 'info');
  }
}

// Xóa toàn bộ giỏ hàng
function clearCart() {
  saveCart([]);
}

// Tính tổng số lượng món đồ trong giỏ
function getCartCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

// Tính tổng tiền giỏ hàng
function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Cập nhật toàn bộ UI liên quan đến giỏ hàng
function updateCartUI() {
  const cart = getCart();
  const count = getCartCount();
  const total = getCartTotal();

  // Cập nhật badge số lượng ở header
  const badgeElement = document.getElementById('cart-badge');
  if (badgeElement) {
    badgeElement.textContent = count;
    badgeElement.style.display = count > 0 ? 'flex' : 'none';
  }

  // Cập nhật danh sách món hàng trong Drawer giỏ hàng
  const cartItemsContainer = document.getElementById('cart-items');
  const cartEmptyState = document.getElementById('cart-empty');
  const cartFooter = document.getElementById('cart-footer');
  const cartTotalAmount = document.getElementById('cart-total-amount');

  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '';
    if (cartEmptyState) cartEmptyState.style.display = 'block';
    if (cartFooter) cartFooter.style.display = 'none';
  } else {
    if (cartEmptyState) cartEmptyState.style.display = 'none';
    if (cartFooter) cartFooter.style.display = 'block';

    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.name}</h4>
          <div class="cart-item-price">${formatVND(item.price)}</div>
          <div class="cart-item-actions">
            <div class="qty-control">
              <button class="qty-btn minus" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
              <span class="qty-value">${item.quantity}</span>
              <button class="qty-btn plus" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Xóa món này">
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
    `).join('');

    if (cartTotalAmount) {
      cartTotalAmount.textContent = formatVND(total);
    }
  }
}
