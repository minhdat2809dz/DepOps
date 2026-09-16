/**
 * app.js - Logic điều khiển giao diện chính của cửa hàng
 */

// Trạng thái bộ lọc hiện tại
let currentCategory = 'all';
let currentSearchQuery = '';
let currentSort = 'default';

document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  renderProducts();
  updateCartUI();
  updateHeaderUserUI();
});

// Khởi tạo các sự kiện giao diện
function initEventListeners() {
  // 0. Xử lý Form Đăng Nhập Người Dùng
  const loginForm = document.getElementById('user-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const acc = document.getElementById('user-login-acc').value;
      const pass = document.getElementById('user-login-pass').value;
      const rem = document.getElementById('user-remember-me').checked;
      const errBox = document.getElementById('user-login-error');

      const res = loginUser(acc, pass, rem);
      if (res.success) {
        errBox.style.display = 'none';
        closeModal('user-auth-modal');
        updateHeaderUserUI();
        showToast(res.message, 'success');
        loginForm.reset();
      } else {
        errBox.textContent = res.message;
        errBox.style.display = 'block';
      }
    });
  }

  // 0.1 Xử lý Form Đăng Ký Người Dùng
  const regForm = document.getElementById('user-register-form');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('user-reg-name').value;
      const email = document.getElementById('user-reg-email').value;
      const phone = document.getElementById('user-reg-phone').value;
      const pass = document.getElementById('user-reg-pass').value;
      const confirm = document.getElementById('user-reg-confirm').value;
      const errBox = document.getElementById('user-reg-error');

      if (pass !== confirm) {
        errBox.textContent = 'Mật khẩu xác nhận không trùng khớp!';
        errBox.style.display = 'block';
        return;
      }

      const res = registerUser(name, email, phone, pass);
      if (res.success) {
        errBox.style.display = 'none';
        closeModal('user-auth-modal');
        updateHeaderUserUI();
        showToast(res.message, 'success');
        regForm.reset();
      } else {
        errBox.textContent = res.message;
        errBox.style.display = 'block';
      }
    });
  }

  // 1. Bộ lọc danh mục
  const categoryButtons = document.querySelectorAll('.category-btn');
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      categoryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      renderProducts();
    });
  });

  // 2. Tìm kiếm sản phẩm (debounce nhẹ)
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.trim().toLowerCase();
      renderProducts();
    });
  }

  // 3. Sắp xếp giá / đánh giá
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderProducts();
    });
  }

  // 4. Mở / đóng giỏ hàng Drawer
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartCloseBtn = document.getElementById('cart-close-btn');

  if (cartToggleBtn && cartDrawer && cartOverlay) {
    cartToggleBtn.addEventListener('click', () => openCart());
    cartCloseBtn.addEventListener('click', () => closeCart());
    cartOverlay.addEventListener('click', () => closeCart());
  }

  // 5. Đóng modal khi nhấn phím Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCart();
      closeModal('product-modal');
      closeModal('checkout-modal');
      closeModal('success-modal');
    }
  });

  // 6. Form thanh toán
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
  }

  // 7. Lắng nghe cập nhật sản phẩm từ trang Admin ở tab khác
  window.addEventListener('storage', (e) => {
    if (e.key === 'techstore_products_data') {
      products = getStoredProducts();
      renderProducts();
    }
  });
}

// Lọc và sắp xếp sản phẩm
function getFilteredProducts() {
  products = getStoredProducts();
  return products
    .filter(product => {
      const matchCategory = currentCategory === 'all' || product.category === currentCategory;
      const matchSearch = product.name.toLowerCase().includes(currentSearchQuery) ||
                          product.categoryName.toLowerCase().includes(currentSearchQuery);
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      if (currentSort === 'price-asc') return a.price - b.price;
      if (currentSort === 'price-desc') return b.price - a.price;
      if (currentSort === 'rating-desc') return b.rating - a.rating;
      return a.id - b.id;
    });
}

// Hiển thị danh sách sản phẩm lên giao diện
function renderProducts() {
  const container = document.getElementById('products-grid');
  const emptyMessage = document.getElementById('no-products-message');
  if (!container) return;

  const filtered = getFilteredProducts();

  if (filtered.length === 0) {
    container.innerHTML = '';
    if (emptyMessage) emptyMessage.style.display = 'block';
    return;
  }

  if (emptyMessage) emptyMessage.style.display = 'none';

  container.innerHTML = filtered.map(product => `
    <div class="product-card" data-id="${product.id}">
      <div class="product-badge-wrap">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
      </div>
      <div class="product-img-wrap" onclick="openProductDetail(${product.id})">
        <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
        <button class="quick-view-btn" onclick="event.stopPropagation(); openProductDetail(${product.id})">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          Xem chi tiết
        </button>
      </div>
      <div class="product-body">
        <div class="product-category">${product.categoryName}</div>
        <h3 class="product-title" onclick="openProductDetail(${product.id})">${product.name}</h3>
        <div class="product-rating">
          <span class="stars">★</span>
          <span class="score">${product.rating}</span>
          <span class="count">(${product.reviewsCount} đánh giá)</span>
        </div>
        <div class="product-price-wrap">
          <div class="current-price">${formatVND(product.price)}</div>
          ${product.oldPrice ? `<div class="old-price">${formatVND(product.oldPrice)}</div>` : ''}
        </div>
      </div>
      <div class="product-footer">
        <button class="btn btn-primary add-to-cart-btn" onclick="addToCart(${product.id}, 1)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          Thêm vào giỏ
        </button>
      </div>
    </div>
  `).join('');
}

// Mở modal chi tiết sản phẩm
function openProductDetail(productId) {
  const product = products.find(p => p.id === Number(productId));
  if (!product) return;

  const modalBody = document.getElementById('product-modal-body');
  if (!modalBody) return;

  modalBody.innerHTML = `
    <div class="modal-product-layout">
      <div class="modal-product-img-col">
        <img src="${product.image}" alt="${product.name}" class="modal-product-img">
      </div>
      <div class="modal-product-info-col">
        <span class="modal-category">${product.categoryName}</span>
        <h2 class="modal-title">${product.name}</h2>
        <div class="product-rating">
          <span class="stars">★</span>
          <span class="score">${product.rating}</span>
          <span class="count">(${product.reviewsCount} khách hàng tin dùng)</span>
        </div>
        <div class="modal-price-wrap">
          <span class="modal-price">${formatVND(product.price)}</span>
          ${product.oldPrice ? `<span class="modal-old-price">${formatVND(product.oldPrice)}</span>` : ''}
        </div>
        <p class="modal-description">${product.description}</p>
        
        <div class="modal-actions">
          <div class="modal-qty">
            <button class="qty-btn" onclick="changeModalQty(-1)">-</button>
            <input type="number" id="modal-qty-input" value="1" min="1" max="99" readonly>
            <button class="qty-btn" onclick="changeModalQty(1)">+</button>
          </div>
          <button class="btn btn-primary btn-lg" onclick="addFromModal(${product.id})">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  `;

  openModal('product-modal');
}

// Thay đổi số lượng trong modal chi tiết
function changeModalQty(delta) {
  const input = document.getElementById('modal-qty-input');
  if (!input) return;
  let val = parseInt(input.value) || 1;
  val += delta;
  if (val < 1) val = 1;
  if (val > 99) val = 99;
  input.value = val;
}

// Thêm sản phẩm từ modal chi tiết vào giỏ
function addFromModal(productId) {
  const input = document.getElementById('modal-qty-input');
  const qty = input ? parseInt(input.value) || 1 : 1;
  addToCart(productId, qty);
  closeModal('product-modal');
}

// Điều khiển Cart Drawer
function openCart() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  if (drawer && overlay) {
    drawer.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

function closeCart() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  if (drawer && overlay) {
    drawer.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }
}

// Điều khiển Modal chung
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
}

// Mở modal thanh toán từ giỏ hàng
function openCheckout() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast('Giỏ hàng của bạn đang trống!', 'warning');
    return;
  }
  closeCart();
  
  // Tự động điền thông tin nếu người dùng đã đăng nhập
  const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  if (currentUser) {
    const nameInput = document.getElementById('customer-name');
    const phoneInput = document.getElementById('customer-phone');
    if (nameInput && !nameInput.value) nameInput.value = currentUser.fullname;
    if (phoneInput && !phoneInput.value) phoneInput.value = currentUser.phone;
  }

  // Hiển thị tổng tiền lên modal thanh toán
  const checkoutTotal = document.getElementById('checkout-summary-total');
  if (checkoutTotal) {
    checkoutTotal.textContent = formatVND(getCartTotal());
  }

  openModal('checkout-modal');
}

// Xử lý gửi đơn hàng
function handleCheckoutSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('customer-name').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();
  const address = document.getElementById('customer-address').value.trim();
  const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'COD';

  if (!name || !phone || !address) {
    showToast('Vui lòng điền đầy đủ các thông tin giao hàng!', 'warning');
    return;
  }

  // Đóng modal thanh toán
  closeModal('checkout-modal');

  const orderCode = 'DH' + Math.floor(100000 + Math.random() * 900000);
  const currentCartItems = [...getCart()];
  const currentTotal = getCartTotal();

  // Lưu đơn hàng vào lịch sử người dùng
  if (typeof saveUserOrder === 'function') {
    saveUserOrder({
      orderCode,
      date: new Date().toLocaleString('vi-VN'),
      customerName: name,
      phone,
      address,
      paymentMethod: paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng',
      total: currentTotal,
      items: currentCartItems,
      status: 'Đang xử lý'
    });
  }

  // Cập nhật thông tin modal thành công
  const successOrderInfo = document.getElementById('success-order-info');
  if (successOrderInfo) {
    successOrderInfo.innerHTML = `
      <p><strong>Mã đơn hàng:</strong> <span class="text-primary">${orderCode}</span></p>
      <p><strong>Người nhận:</strong> ${name} (${phone})</p>
      <p><strong>Địa chỉ giao:</strong> ${address}</p>
      <p><strong>Tổng thanh toán:</strong> ${formatVND(currentTotal)}</p>
      <p><strong>Phương thức:</strong> ${paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}</p>
    `;
  }

  // Reset giỏ hàng và form
  clearCart();
  document.getElementById('checkout-form').reset();

  // Mở modal cảm ơn
  openModal('success-modal');
}

// Điều khiển Modal Đăng Nhập / Đăng Ký
function openAuthModal(tab = 'login') {
  switchAuthTab(tab);
  ['user-login-acc', 'user-login-pass', 'user-reg-name', 'user-reg-email', 'user-reg-phone', 'user-reg-pass', 'user-reg-confirm'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  openModal('user-auth-modal');
}

function switchAuthTab(tab) {
  const btnLogin = document.getElementById('tab-btn-login');
  const btnRegister = document.getElementById('tab-btn-register');
  const paneLogin = document.getElementById('pane-login');
  const paneRegister = document.getElementById('pane-register');
  const loginErr = document.getElementById('user-login-error');
  const regErr = document.getElementById('user-reg-error');

  if (loginErr) loginErr.style.display = 'none';
  if (regErr) regErr.style.display = 'none';

  if (tab === 'login') {
    btnLogin.classList.add('active');
    btnRegister.classList.remove('active');
    paneLogin.classList.add('active');
    paneRegister.classList.remove('active');
  } else {
    btnLogin.classList.remove('active');
    btnRegister.classList.add('active');
    paneLogin.classList.remove('active');
    paneRegister.classList.add('active');
  }

  ['user-login-acc', 'user-login-pass', 'user-reg-name', 'user-reg-email', 'user-reg-phone', 'user-reg-pass', 'user-reg-confirm'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

function fillUserDemo() {
  const accInput = document.getElementById('user-login-acc');
  const passInput = document.getElementById('user-login-pass');
  if (accInput) accInput.value = 'khachhang@gmail.com';
  if (passInput) passInput.value = '123456';
  const loginErr = document.getElementById('user-login-error');
  if (loginErr) loginErr.style.display = 'none';
}

function openOrderHistoryModal(e) {
  if (e) e.preventDefault();
  const menu = document.getElementById('user-dropdown-menu');
  if (menu) menu.classList.remove('show');

  const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const container = document.getElementById('user-orders-list');
  if (!container) return;

  if (!currentUser) {
    container.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 20px;">Vui lòng đăng nhập để xem lịch sử đơn hàng.</p>`;
  } else {
    const orders = getUserOrders(currentUser.id);
    if (orders.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 30px 10px;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--text-light); margin-bottom: 10px;">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <p style="color: var(--text-muted);">Bạn chưa có đơn hàng nào.</p>
        </div>
      `;
    } else {
      container.innerHTML = orders.map(ord => `
        <div class="order-card">
          <div class="order-header-row">
            <div>
              <span class="order-code">${ord.orderCode}</span>
              <span class="order-date"> • ${ord.date}</span>
            </div>
            <span class="order-status-badge">${ord.status}</span>
          </div>
          <div class="order-items-summary">
            ${(ord.items || []).map(it => `<div>• ${it.name} <strong>x${it.quantity}</strong></div>`).join('')}
          </div>
          <div class="order-total-row">
            <span style="font-size: 0.88rem; color: var(--text-muted);">Phương thức: ${ord.paymentMethod}</span>
            <span class="order-total-price">${formatVND(ord.total)}</span>
          </div>
        </div>
      `).join('');
    }
  }

  openModal('order-history-modal');
}

function openProfileModal(e) {
  if (e) e.preventDefault();
  const menu = document.getElementById('user-dropdown-menu');
  if (menu) menu.classList.remove('show');

  const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const body = document.getElementById('profile-info-body');
  if (!body || !currentUser) return;

  const firstLetter = currentUser.fullname ? currentUser.fullname.charAt(0).toUpperCase() : 'U';

  body.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <div style="width: 64px; height: 64px; border-radius: 50%; background-color: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 800; margin: 0 auto 12px;">
        ${firstLetter}
      </div>
      <h3 style="font-size: 1.25rem; font-weight: 800;">${currentUser.fullname}</h3>
      <span style="display: inline-block; padding: 2px 10px; border-radius: 9999px; background-color: #eff6ff; color: var(--primary); font-size: 0.8rem; font-weight: 700; margin-top: 4px;">Khách Hàng Thành Viên</span>
    </div>
    <div class="success-info-box" style="margin-bottom: 20px;">
      <p><strong>Họ và tên:</strong> ${currentUser.fullname}</p>
      <p><strong>Email:</strong> ${currentUser.email}</p>
      <p><strong>Số điện thoại:</strong> ${currentUser.phone || 'Chưa cập nhật'}</p>
      <p><strong>Mã thành viên:</strong> #${currentUser.id}</p>
    </div>
    <button class="btn btn-secondary btn-block" onclick="closeModal('profile-modal')">Đóng</button>
  `;

  openModal('profile-modal');
}

// Hiển thị thông báo Toast
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  } else if (type === 'warning') {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  } else {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }

  toast.innerHTML = `
    <div class="toast-icon">${iconSvg}</div>
    <div class="toast-msg">${message}</div>
  `;

  container.appendChild(toast);

  // Tự động ẩn sau 3 giây
  setTimeout(() => {
    toast.classList.add('fade-out');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 3000);
}
