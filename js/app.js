/**
 * app.js - Logic điều khiển giao diện chính của cửa hàng VIP PRO TechStore
 * Đầy đủ tính năng: Live Search gợi ý, Dark Mode, Flash Sale countdown, Hero Slider,
 * So sánh sản phẩm, Danh sách yêu thích, Gallery & biến thể chi tiết, VietQR Checkout,
 * Trợ lý ảo AI Assistant thông minh.
 */

// Trạng thái bộ lọc hiện tại
let currentCategory = 'all';
let currentBrand = 'all';
let currentPriceRange = 'all';
let currentSearchQuery = '';
let currentSort = 'default';

// Trạng thái biến thể trong modal chi tiết sản phẩm
let modalSelectedColor = null;
let modalSelectedStorage = null;
let modalCurrentPrice = 0;
let modalActiveProduct = null;

// Khởi chạy khi tài liệu HTML đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initEventListeners();
  initHeroSlider();
  initFlashSaleCountdown();
  renderProducts();
  renderFlashSaleProducts();
  updateCartUI();
  updateWishlistUI();
  updateCompareUI();
  updateHeaderUserUI();
  renderBrandPills();
});

// ==================== THEME DARK / LIGHT MODE ====================

function initTheme() {
  const savedTheme = localStorage.getItem('techstore_theme') || 'dark'; // Mặc định Dark mode cực ngầu
  setTheme(savedTheme);
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('techstore_theme', theme);
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.setAttribute('title', theme === 'dark' ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối');
    themeBtn.innerHTML = theme === 'dark' 
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const target = current === 'dark' ? 'light' : 'dark';
  setTheme(target);
  showToast(`Đã chuyển sang giao diện ${target === 'dark' ? 'Ban đêm (Dark Mode) VIP' : 'Ban ngày (Light Mode)'}`, 'info');
}

// ==================== KHỞI TẠO CÁC SỰ KIỆN GIAO DIỆN ====================

function initEventListeners() {
  // 1. Live Search với Autocomplete Gợi Ý
  const searchInput = document.getElementById('search-input');
  const searchClearBtn = document.getElementById('search-clear-btn');
  const suggestionsBox = document.getElementById('search-suggestions');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.trim().toLowerCase();
      if (searchClearBtn) {
        searchClearBtn.style.display = currentSearchQuery.length > 0 ? 'flex' : 'none';
      }
      renderSearchSuggestions(currentSearchQuery);
      renderProducts();
    });

    searchInput.addEventListener('focus', () => {
      if (currentSearchQuery.length > 0) {
        renderSearchSuggestions(currentSearchQuery);
      }
    });

    // Đóng dropdown gợi ý khi click ra ngoài
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && (!suggestionsBox || !suggestionsBox.contains(e.target))) {
        if (suggestionsBox) suggestionsBox.style.display = 'none';
      }
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        currentSearchQuery = '';
        searchClearBtn.style.display = 'none';
        if (suggestionsBox) suggestionsBox.style.display = 'none';
        renderProducts();
      }
    });
  }

  // 2. Bộ lọc danh mục
  const categoryButtons = document.querySelectorAll('.category-btn');
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      renderProducts();
    });
  });

  // 3. Bộ lọc mức giá
  const priceFilterPills = document.querySelectorAll('.price-filter-pill');
  priceFilterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      priceFilterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentPriceRange = pill.dataset.price;
      renderProducts();
    });
  });

  // 4. Sắp xếp giá / đánh giá
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderProducts();
    });
  }

  // 5. Drawer Giỏ Hàng
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartCloseBtn = document.getElementById('cart-close-btn');

  if (cartToggleBtn && cartDrawer && cartOverlay) {
    cartToggleBtn.addEventListener('click', () => openCart());
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', () => closeCart());
    cartOverlay.addEventListener('click', () => closeCart());
  }

  // 6. Áp dụng Voucher trong Giỏ Hàng
  const applyCouponBtn = document.getElementById('btn-apply-coupon');
  const couponInput = document.getElementById('coupon-code-input');
  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', () => {
      const code = couponInput.value.trim();
      if (!code) {
        showToast('Vui lòng nhập mã ưu đãi!', 'warning');
        return;
      }
      const res = applyCoupon(code);
      if (res.success) {
        showToast(res.message, 'success');
        couponInput.value = '';
      } else {
        showToast(res.message, 'warning');
      }
    });
  }

  // 7. Form thanh toán Checkout
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
  }

  // Lắng nghe thay đổi hình thức thanh toán trong Checkout để hiện VietQR
  const paymentInputs = document.querySelectorAll('input[name="payment"]');
  paymentInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      updateCheckoutPaymentUI(e.target.value);
    });
  });

  // 8. Đăng Nhập / Đăng Ký
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
        if (errBox) errBox.style.display = 'none';
        closeModal('user-auth-modal');
        updateHeaderUserUI();
        showToast(res.message, 'success');
        loginForm.reset();
      } else {
        if (errBox) {
          errBox.textContent = res.message;
          errBox.style.display = 'block';
        }
      }
    });
  }

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
        if (errBox) {
          errBox.textContent = 'Mật khẩu xác nhận không trùng khớp!';
          errBox.style.display = 'block';
        }
        return;
      }

      const res = registerUser(name, email, phone, pass);
      if (res.success) {
        if (errBox) errBox.style.display = 'none';
        closeModal('user-auth-modal');
        updateHeaderUserUI();
        showToast(res.message, 'success');
        regForm.reset();
      } else {
        if (errBox) {
          errBox.textContent = res.message;
          errBox.style.display = 'block';
        }
      }
    });
  }

  // 9. Đóng modal khi nhấn Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCart();
      ['product-modal', 'checkout-modal', 'success-modal', 'compare-modal', 'wishlist-modal', 'user-auth-modal', 'order-history-modal', 'profile-modal'].forEach(closeModal);
    }
  });

  // 10. Đồng bộ hai chiều với Admin
  window.addEventListener('storage', (e) => {
    if (e.key === 'techstore_products_data') {
      products = getStoredProducts();
      renderProducts();
      renderFlashSaleProducts();
      renderBrandPills();
    }
  });
}

// ==================== LIVE SEARCH AUTOCOMPLETE GỢI Ý ====================

function renderSearchSuggestions(query) {
  const box = document.getElementById('search-suggestions');
  if (!box) return;

  if (!query || query.length === 0) {
    box.style.display = 'none';
    box.innerHTML = '';
    return;
  }

  const all = getStoredProducts();
  const matches = all.filter(p => 
    p.name.toLowerCase().includes(query) ||
    (p.categoryName && p.categoryName.toLowerCase().includes(query)) ||
    (p.brand && p.brand.toLowerCase().includes(query))
  ).slice(0, 5);

  if (matches.length === 0) {
    box.innerHTML = `
      <div class="search-suggestion-empty">
        Không tìm thấy sản phẩm nào khớp với "<strong>${escapeHtml(query)}</strong>"
      </div>
    `;
    box.style.display = 'block';
    return;
  }

  box.innerHTML = `
    <div class="search-suggestion-header">Gợi ý sản phẩm phù hợp</div>
    <div class="search-suggestion-list">
      ${matches.map(p => `
        <div class="search-suggestion-item" onclick="openProductDetail(${p.id}); closeSuggestions();">
          <img src="${p.image}" alt="${p.name}" class="search-suggestion-img">
          <div class="search-suggestion-info">
            <div class="search-suggestion-title">${p.name}</div>
            <div class="search-suggestion-price">${formatVND(p.price)}</div>
          </div>
          <span class="search-suggestion-badge">${p.categoryName}</span>
        </div>
      `).join('')}
    </div>
    <div class="search-suggestion-footer" onclick="closeSuggestions();">
      Xem tất cả kết quả (${matches.length}+ sản phẩm) &rarr;
    </div>
  `;
  box.style.display = 'block';
}

function closeSuggestions() {
  const box = document.getElementById('search-suggestions');
  if (box) box.style.display = 'none';
}

// ==================== HERO SLIDER VIP ====================

let currentHeroSlide = 0;
let heroSliderInterval = null;

function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-slider-dot');
  if (slides.length <= 1) return;

  const showSlide = (index) => {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    currentHeroSlide = index;
  };

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      resetHeroInterval();
    });
  });

  const nextBtn = document.getElementById('hero-slider-next');
  const prevBtn = document.getElementById('hero-slider-prev');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide((currentHeroSlide + 1) % slides.length);
      resetHeroInterval();
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide((currentHeroSlide - 1 + slides.length) % slides.length);
      resetHeroInterval();
    });
  }

  function resetHeroInterval() {
    clearInterval(heroSliderInterval);
    heroSliderInterval = setInterval(() => {
      showSlide((currentHeroSlide + 1) % slides.length);
    }, 6000);
  }

  resetHeroInterval();
}

// ==================== FLASH SALE VIP COUNTDOWN ====================

function initFlashSaleCountdown() {
  const hoursEl = document.getElementById('fs-hours');
  const minsEl = document.getElementById('fs-mins');
  const secsEl = document.getElementById('fs-secs');

  if (!hoursEl || !minsEl || !secsEl) return;

  function updateTimer() {
    const now = new Date();
    // Đếm ngược đến cuối ngày hôm nay
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    let diff = Math.max(0, Math.floor((endOfDay - now) / 1000));

    const hours = Math.floor(diff / 3600);
    diff %= 3600;
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;

    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// Hiển thị các sản phẩm trong mục Flash Sale VIP
function renderFlashSaleProducts() {
  const container = document.getElementById('flash-sale-grid');
  if (!container) return;

  const all = getStoredProducts();
  const flashItems = all.filter(p => p.flashSale || p.badge === 'Hot Deal').slice(0, 4);

  container.innerHTML = flashItems.map(p => {
    const discountPct = p.flashDiscount || (p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 10);
    const sold = p.soldCount || 85;
    const isFav = isInWishlist(p.id);

    return `
      <div class="flash-sale-card">
        <div class="fs-discount-tag">-${discountPct}%</div>
        <button class="btn-wishlist-heart ${isFav ? 'active' : ''}" data-id="${p.id}" onclick="toggleWishlist(${p.id})" title="Yêu thích">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
        <div class="fs-img-wrap" onclick="openProductDetail(${p.id})">
          <img src="${p.image}" alt="${p.name}" class="fs-img" loading="lazy">
        </div>
        <div class="fs-body">
          <div class="fs-brand">${p.brand || 'TechStore'}</div>
          <h4 class="fs-title" onclick="openProductDetail(${p.id})">${p.name}</h4>
          <div class="fs-price-row">
            <span class="fs-price">${formatVND(p.price)}</span>
            ${p.oldPrice ? `<span class="fs-old-price">${formatVND(p.oldPrice)}</span>` : ''}
          </div>
          <div class="fs-progress-wrap">
            <div class="fs-progress-bar" style="width: ${Math.min(100, sold)}%;"></div>
            <span class="fs-progress-text">🔥 Đã bán ${sold} món</span>
          </div>
          <button class="btn btn-primary btn-block btn-sm" onclick="addToCart(${p.id}, 1)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            Săn Ngay
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// ==================== BRAND PILLS ====================

function renderBrandPills() {
  const container = document.getElementById('brand-filter-container');
  if (!container) return;

  const all = getStoredProducts();
  const brands = Array.from(new Set(all.map(p => p.brand).filter(Boolean)));

  container.innerHTML = `
    <button class="brand-pill active" data-brand="all">Tất cả hãng</button>
    ${brands.map(b => `<button class="brand-pill" data-brand="${b}">${b}</button>`).join('')}
  `;

  container.querySelectorAll('.brand-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      container.querySelectorAll('.brand-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentBrand = pill.dataset.brand;
      renderProducts();
    });
  });
}

// ==================== LỌC VÀ HIỂN THỊ SẢN PHẨM ====================

function getFilteredProducts() {
  products = getStoredProducts();
  return products
    .filter(product => {
      // 1. Lọc theo Danh mục
      const matchCategory = currentCategory === 'all' || product.category === currentCategory;

      // 2. Lọc theo Thương hiệu
      const matchBrand = currentBrand === 'all' || product.brand === currentBrand;

      // 3. Lọc theo Từ khóa
      const matchSearch = !currentSearchQuery || 
                          product.name.toLowerCase().includes(currentSearchQuery) ||
                          (product.categoryName && product.categoryName.toLowerCase().includes(currentSearchQuery)) ||
                          (product.brand && product.brand.toLowerCase().includes(currentSearchQuery));

      // 4. Lọc theo Mức giá
      let matchPrice = true;
      if (currentPriceRange === 'under-10m') {
        matchPrice = product.price < 10000000;
      } else if (currentPriceRange === '10m-25m') {
        matchPrice = product.price >= 10000000 && product.price <= 25000000;
      } else if (currentPriceRange === '25m-50m') {
        matchPrice = product.price > 25000000 && product.price <= 50000000;
      } else if (currentPriceRange === 'above-50m') {
        matchPrice = product.price > 50000000;
      }

      return matchCategory && matchBrand && matchSearch && matchPrice;
    })
    .sort((a, b) => {
      if (currentSort === 'price-asc') return a.price - b.price;
      if (currentSort === 'price-desc') return b.price - a.price;
      if (currentSort === 'rating-desc') return b.rating - a.rating;
      if (currentSort === 'discount-desc') {
        const discA = a.oldPrice ? (a.oldPrice - a.price) : 0;
        const discB = b.oldPrice ? (b.oldPrice - b.price) : 0;
        return discB - discA;
      }
      return a.id - b.id;
    });
}

function renderProducts() {
  const container = document.getElementById('products-grid');
  const emptyMessage = document.getElementById('no-products-message');
  const productsCountEl = document.getElementById('catalog-products-count');

  if (!container) return;

  const filtered = getFilteredProducts();

  if (productsCountEl) {
    productsCountEl.textContent = `(${filtered.length} thiết bị)`;
  }

  if (filtered.length === 0) {
    container.innerHTML = '';
    if (emptyMessage) emptyMessage.style.display = 'block';
    return;
  }

  if (emptyMessage) emptyMessage.style.display = 'none';

  container.innerHTML = filtered.map(product => {
    const isFav = isInWishlist(product.id);
    const isComp = isInCompare(product.id);
    const hasDiscount = product.oldPrice && product.oldPrice > product.price;
    const discountPercent = hasDiscount ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

    return `
      <div class="product-card" data-id="${product.id}">
        <!-- Huy hiệu và nút yêu thích -->
        <div class="product-card-topbar">
          <div class="product-badges-group">
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            ${hasDiscount ? `<span class="product-badge badge-discount">-${discountPercent}%</span>` : ''}
          </div>
          <div class="product-card-actions-top">
            <button class="btn-compare-action ${isComp ? 'active' : ''}" data-id="${product.id}" onclick="toggleCompare(${product.id})" title="So sánh cấu hình">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"></path></svg>
            </button>
            <button class="btn-wishlist-heart ${isFav ? 'active' : ''}" data-id="${product.id}" onclick="toggleWishlist(${product.id})" title="Lưu vào danh sách yêu thích">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
          </div>
        </div>

        <!-- Ảnh sản phẩm -->
        <div class="product-img-wrap" onclick="openProductDetail(${product.id})">
          <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
          <div class="quick-view-overlay">
            <button class="quick-view-btn" onclick="event.stopPropagation(); openProductDetail(${product.id})">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Chi tiết VIP
            </button>
          </div>
        </div>

        <!-- Thân sản phẩm -->
        <div class="product-body">
          <div class="product-meta-row">
            <span class="product-brand-tag">${product.brand || 'Chính hãng'}</span>
            <span class="product-stock-tag"><span class="pulse-dot"></span>${product.stock ? product.stock.split(' ')[0] : 'Sẵn hàng'}</span>
          </div>

          <h3 class="product-title" onclick="openProductDetail(${product.id})">${product.name}</h3>

          <div class="product-rating">
            <span class="stars">★★★★★</span>
            <span class="score">${product.rating}</span>
            <span class="count">(${product.reviewsCount} review)</span>
          </div>

          ${product.gift ? `
            <div class="product-gift-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
              <span>${product.gift}</span>
            </div>
          ` : ''}

          <div class="product-price-wrap">
            <div class="current-price">${formatVND(product.price)}</div>
            ${product.oldPrice ? `<div class="old-price">${formatVND(product.oldPrice)}</div>` : ''}
          </div>
        </div>

        <!-- Nút thêm giỏ -->
        <div class="product-footer">
          <button class="btn btn-primary add-to-cart-btn btn-block" onclick="addToCart(${product.id}, 1)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Thêm Vào Giỏ
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// ==================== MODAL XEM CHI TIẾT SẢN PHẨM VIP ====================

function openProductDetail(productId) {
  const product = products.find(p => p.id === Number(productId));
  if (!product) return;

  modalActiveProduct = product;
  modalSelectedColor = product.colors && product.colors[0] ? product.colors[0].name : null;
  modalSelectedStorage = product.storageOptions && product.storageOptions[0] ? product.storageOptions[0].label : null;
  modalCurrentPrice = product.price;

  const modalBody = document.getElementById('product-modal-body');
  if (!modalBody) return;

  const galleryImages = (product.gallery && product.gallery.length > 0) ? product.gallery : [product.image];

  modalBody.innerHTML = `
    <div class="modal-product-layout">
      <!-- Cột ảnh Gallery -->
      <div class="modal-product-img-col">
        <div class="modal-main-img-wrap">
          <img id="modal-main-image" src="${galleryImages[0]}" alt="${product.name}" class="modal-product-img">
          ${product.badge ? `<span class="modal-img-badge">${product.badge}</span>` : ''}
        </div>
        ${galleryImages.length > 1 ? `
          <div class="modal-gallery-thumbs">
            ${galleryImages.map((img, i) => `
              <img src="${img}" alt="${product.name}" class="gallery-thumb ${i === 0 ? 'active' : ''}" onclick="switchModalGalleryImage(this, '${img}')">
            `).join('')}
          </div>
        ` : ''}
      </div>

      <!-- Cột thông tin chi tiết -->
      <div class="modal-product-info-col">
        <div class="modal-meta-top">
          <span class="modal-brand-badge">${product.brand || 'Flagship'}</span>
          <span class="modal-category">${product.categoryName}</span>
        </div>

        <h2 class="modal-title">${product.name}</h2>

        <div class="product-rating">
          <span class="stars">★★★★★</span>
          <span class="score">${product.rating}</span>
          <span class="count">(${product.reviewsCount} khách hàng VIP tin dùng)</span>
        </div>

        <div class="modal-price-wrap">
          <span id="modal-dynamic-price" class="modal-price">${formatVND(product.price)}</span>
          ${product.oldPrice ? `<span class="modal-old-price">${formatVND(product.oldPrice)}</span>` : ''}
        </div>

        <!-- Chọn màu sắc -->
        ${product.colors && product.colors.length > 0 ? `
          <div class="modal-option-section">
            <label class="modal-option-label">Màu sắc: <strong id="modal-color-label">${product.colors[0].name}</strong></label>
            <div class="color-options-group">
              ${product.colors.map((c, i) => `
                <button class="color-pill ${i === 0 ? 'active' : ''}" onclick="selectModalColor(this, '${c.name}')" title="${c.name}">
                  <span class="color-swatch" style="background-color: ${c.hex};"></span>
                  <span>${c.name}</span>
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Chọn cấu hình / bộ nhớ -->
        ${product.storageOptions && product.storageOptions.length > 0 ? `
          <div class="modal-option-section">
            <label class="modal-option-label">Phiên bản dung lượng:</label>
            <div class="storage-options-group">
              ${product.storageOptions.map((opt, i) => `
                <button class="storage-pill ${i === 0 ? 'active' : ''}" onclick="selectModalStorage(this, '${opt.label}', ${opt.priceDelta || 0})">
                  ${opt.label}
                  ${opt.priceDelta ? `<small class="storage-delta">+${formatVND(opt.priceDelta)}</small>` : ''}
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <p class="modal-description">${product.description}</p>

        <!-- Ưu đãi đặc quyền VIP đi kèm -->
        <div class="modal-vip-perks-box">
          <div class="vip-perk-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            <span>${product.specs && product.specs.warranty ? product.specs.warranty : 'Bảo hành 24 tháng VIP 1 đổi 1'}</span>
          </div>
          <div class="vip-perk-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            <span>${product.stock || 'Giao hàng hỏa tốc trong 1-2 giờ'}</span>
          </div>
          ${product.gift ? `
            <div class="vip-perk-item highlight">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
              <span><strong>Quà tặng VIP:</strong> ${product.gift}</span>
            </div>
          ` : ''}
        </div>

        <!-- Bảng thông số kỹ thuật dạng accordion -->
        ${product.specs ? `
          <details class="modal-specs-details">
            <summary class="modal-specs-summary">
              <span>Bảng Thông Số Kỹ Thuật Chi Tiết</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </summary>
            <div class="modal-specs-table-wrap">
              <table class="specs-table">
                <tbody>
                  ${product.specs.screen ? `<tr><th>Màn hình</th><td>${product.specs.screen}</td></tr>` : ''}
                  ${product.specs.cpu ? `<tr><th>Vi xử lý / Chip</th><td>${product.specs.cpu}</td></tr>` : ''}
                  ${product.specs.ram ? `<tr><th>Bộ nhớ RAM</th><td>${product.specs.ram}</td></tr>` : ''}
                  ${product.specs.storage ? `<tr><th>Lưu trữ</th><td>${product.specs.storage}</td></tr>` : ''}
                  ${product.specs.battery ? `<tr><th>Pin & Sạc</th><td>${product.specs.battery}</td></tr>` : ''}
                  ${product.specs.os ? `<tr><th>Hệ điều hành</th><td>${product.specs.os}</td></tr>` : ''}
                  ${product.specs.weight ? `<tr><th>Trọng lượng</th><td>${product.specs.weight}</td></tr>` : ''}
                </tbody>
              </table>
            </div>
          </details>
        ` : ''}

        <!-- Nút thao tác thêm giỏ & mua ngay -->
        <div class="modal-actions-bar">
          <div class="modal-qty">
            <button class="qty-btn" onclick="changeModalQty(-1)">-</button>
            <input type="number" id="modal-qty-input" value="1" min="1" max="99" readonly>
            <button class="qty-btn" onclick="changeModalQty(1)">+</button>
          </div>
          <button class="btn btn-secondary btn-lg" onclick="addFromModal(${product.id}, false)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            Thêm Vào Giỏ
          </button>
          <button class="btn btn-primary btn-lg" onclick="addFromModal(${product.id}, true)">
            Mua Ngay
          </button>
        </div>

        <!-- Đánh giá khách hàng -->
        ${renderModalReviewsSection(product)}
      </div>
    </div>
  `;

  openModal('product-modal');
}

function switchModalGalleryImage(thumbEl, newUrl) {
  const mainImg = document.getElementById('modal-main-image');
  if (mainImg) mainImg.src = newUrl;
  document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
  if (thumbEl) thumbEl.classList.add('active');
}

function selectModalColor(btnEl, colorName) {
  document.querySelectorAll('.color-pill').forEach(b => b.classList.remove('active'));
  btnEl.classList.add('active');
  modalSelectedColor = colorName;
  const label = document.getElementById('modal-color-label');
  if (label) label.textContent = colorName;
}

function selectModalStorage(btnEl, storageLabel, priceDelta) {
  document.querySelectorAll('.storage-pill').forEach(b => b.classList.remove('active'));
  btnEl.classList.add('active');
  modalSelectedStorage = storageLabel;

  if (modalActiveProduct) {
    modalCurrentPrice = modalActiveProduct.price + priceDelta;
    const priceEl = document.getElementById('modal-dynamic-price');
    if (priceEl) priceEl.textContent = formatVND(modalCurrentPrice);
  }
}

function renderModalReviewsSection(product) {
  const reviews = product.reviews || [];
  return `
    <div class="modal-reviews-block">
      <div class="reviews-header">
        <h4>Khách hàng đánh giá (${reviews.length})</h4>
        <button class="btn btn-secondary btn-sm" onclick="toggleReviewForm()">Viết nhận xét</button>
      </div>

      <!-- Form gửi đánh giá -->
      <form id="write-review-form" class="write-review-form" style="display: none;" onsubmit="handleReviewSubmit(event, ${product.id})">
        <div class="form-group">
          <label>Đánh giá sao:</label>
          <select id="review-stars-input" class="form-control">
            <option value="5">★★★★★ (5 sao - Xuất sắc)</option>
            <option value="4">★★★★☆ (4 sao - Rất tốt)</option>
            <option value="3">★★★☆☆ (3 sao - Tạm được)</option>
          </select>
        </div>
        <div class="form-group">
          <label>Nội dung nhận xét:</label>
          <textarea id="review-comment-input" class="form-control" rows="2" placeholder="Chia sẻ cảm nhận thực tế về thiết bị này..." required></textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-sm">Gửi Nhận Xét</button>
      </form>

      <!-- Danh sách nhận xét -->
      <div class="reviews-list">
        ${reviews.map(r => `
          <div class="review-item">
            <div class="review-top">
              <strong class="review-author">${escapeHtml(r.author)}</strong>
              <span class="review-date">${r.date}</span>
            </div>
            <div class="review-stars">${'★'.repeat(r.rating || 5)}</div>
            <p class="review-comment">${escapeHtml(r.comment)}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function toggleReviewForm() {
  const form = document.getElementById('write-review-form');
  if (form) form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function handleReviewSubmit(e, productId) {
  e.preventDefault();
  const stars = Number(document.getElementById('review-stars-input').value) || 5;
  const comment = document.getElementById('review-comment-input').value.trim();
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const authorName = user ? `${user.fullname} (Thành viên VIP)` : 'Khách hàng ẩn danh';

  if (!comment) return;

  const product = products.find(p => p.id === Number(productId));
  if (product) {
    if (!product.reviews) product.reviews = [];
    product.reviews.unshift({
      author: authorName,
      rating: stars,
      date: new Date().toLocaleDateString('vi-VN'),
      comment: comment
    });
    product.reviewsCount = (product.reviewsCount || 0) + 1;
    saveStoredProducts(products);
    showToast('Cảm ơn bạn đã gửi đánh giá trải nghiệm!', 'success');
    openProductDetail(productId); // Reload modal
  }
}

function changeModalQty(delta) {
  const input = document.getElementById('modal-qty-input');
  if (!input) return;
  let val = parseInt(input.value) || 1;
  val += delta;
  if (val < 1) val = 1;
  if (val > 99) val = 99;
  input.value = val;
}

function addFromModal(productId, buyNow = false) {
  const input = document.getElementById('modal-qty-input');
  const qty = input ? parseInt(input.value) || 1 : 1;
  addToCart(productId, qty, modalSelectedColor, modalSelectedStorage, modalCurrentPrice);
  closeModal('product-modal');

  if (buyNow) {
    openCheckout();
  }
}

// ==================== BẢNG SO SÁNH SẢN PHẨM MODAL ====================

function openCompareModal() {
  const compareIds = getCompareList();
  const modalContainer = document.getElementById('compare-modal-content');
  if (!modalContainer) return;

  if (compareIds.length === 0) {
    modalContainer.innerHTML = `
      <div class="empty-compare-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"></path></svg>
        <h3>Chưa có sản phẩm nào trong bảng so sánh</h3>
        <p>Hãy nhấn vào biểu tượng ⚖️ trên thẻ sản phẩm để so sánh thông số chi tiết đối đầu.</p>
      </div>
    `;
  } else {
    const compareProducts = compareIds.map(id => products.find(p => p.id === id)).filter(Boolean);

    modalContainer.innerHTML = `
      <div class="compare-table-responsive">
        <table class="compare-table">
          <thead>
            <tr>
              <th style="min-width: 140px;">Thông số đối đầu</th>
              ${compareProducts.map(p => `
                <th style="min-width: 220px; text-align: center;">
                  <button class="compare-remove-btn" onclick="toggleCompare(${p.id}); openCompareModal();" title="Gỡ khỏi so sánh">&times;</button>
                  <img src="${p.image}" alt="${p.name}" class="compare-col-img">
                  <div class="compare-col-title">${p.name}</div>
                  <div class="compare-col-price">${formatVND(p.price)}</div>
                  <button class="btn btn-primary btn-sm btn-block" onclick="addToCart(${p.id}, 1); closeModal('compare-modal');">Thêm Giỏ</button>
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            <tr><th>Thương hiệu</th>${compareProducts.map(p => `<td><strong>${p.brand || '---'}</strong></td>`).join('')}</tr>
            <tr><th>Danh mục</th>${compareProducts.map(p => `<td>${p.categoryName}</td>`).join('')}</tr>
            <tr><th>Màn hình</th>${compareProducts.map(p => `<td>${p.specs && p.specs.screen ? p.specs.screen : '---'}</td>`).join('')}</tr>
            <tr><th>Vi xử lý / Chip</th>${compareProducts.map(p => `<td>${p.specs && p.specs.cpu ? p.specs.cpu : '---'}</td>`).join('')}</tr>
            <tr><th>RAM</th>${compareProducts.map(p => `<td>${p.specs && p.specs.ram ? p.specs.ram : '---'}</td>`).join('')}</tr>
            <tr><th>Bộ nhớ</th>${compareProducts.map(p => `<td>${p.specs && p.specs.storage ? p.specs.storage : '---'}</td>`).join('')}</tr>
            <tr><th>Pin / Sạc</th>${compareProducts.map(p => `<td>${p.specs && p.specs.battery ? p.specs.battery : '---'}</td>`).join('')}</tr>
            <tr><th>Trọng lượng</th>${compareProducts.map(p => `<td>${p.specs && p.specs.weight ? p.specs.weight : '---'}</td>`).join('')}</tr>
            <tr><th>Bảo hành</th>${compareProducts.map(p => `<td>${p.specs && p.specs.warranty ? p.specs.warranty : '24 tháng VIP'}</td>`).join('')}</tr>
            <tr><th>Đánh giá</th>${compareProducts.map(p => `<td>★ ${p.rating} (${p.reviewsCount} review)</td>`).join('')}</tr>
          </tbody>
        </table>
      </div>
      <div class="compare-modal-footer">
        <button class="btn btn-secondary" onclick="clearCompareList()">Xóa Bảng So Sánh</button>
        <button class="btn btn-primary" onclick="closeModal('compare-modal')">Đóng Bảng So Sánh</button>
      </div>
    `;
  }

  openModal('compare-modal');
}

// ==================== DANH SÁCH YÊU THÍCH (WISHLIST) MODAL ====================

function openWishlistModal() {
  const wishIds = getWishlist();
  const container = document.getElementById('wishlist-modal-body');
  if (!container) return;

  if (wishIds.length === 0) {
    container.innerHTML = `
      <div class="empty-compare-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        <h3>Danh sách yêu thích đang trống</h3>
        <p>Bấm nút hình trái tim ❤️ trên sản phẩm để lưu lại những món đồ công nghệ bạn quan tâm.</p>
      </div>
    `;
  } else {
    const wishProducts = wishIds.map(id => products.find(p => p.id === id)).filter(Boolean);

    container.innerHTML = `
      <div class="wishlist-grid">
        ${wishProducts.map(p => `
          <div class="wishlist-item-card">
            <img src="${p.image}" alt="${p.name}" class="wishlist-item-img">
            <div class="wishlist-item-info">
              <h4 class="wishlist-item-title">${p.name}</h4>
              <div class="wishlist-item-price">${formatVND(p.price)}</div>
            </div>
            <div class="wishlist-item-actions">
              <button class="btn btn-primary btn-sm" onclick="addToCart(${p.id}, 1); showToast('Đã chuyển vào giỏ hàng!', 'success');">
                Thêm Giỏ
              </button>
              <button class="btn btn-secondary btn-sm" onclick="toggleWishlist(${p.id}); openWishlistModal();" title="Gỡ khỏi yêu thích">
                Xóa
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  openModal('wishlist-modal');
}

// ==================== THANH TOÁN CHECKOUT & VIETQR ====================

function openCheckout() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast('Giỏ hàng của bạn đang trống!', 'warning');
    return;
  }
  closeCart();

  const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  if (currentUser) {
    const nameInput = document.getElementById('customer-name');
    const phoneInput = document.getElementById('customer-phone');
    if (nameInput && !nameInput.value) nameInput.value = currentUser.fullname;
    if (phoneInput && !phoneInput.value) phoneInput.value = currentUser.phone;
  }

  const breakdown = calculateOrderBreakdown();
  const summarySubtotal = document.getElementById('checkout-summary-subtotal');
  const summaryDiscount = document.getElementById('checkout-summary-discount');
  const summaryShipping = document.getElementById('checkout-summary-shipping');
  const summaryTotal = document.getElementById('checkout-summary-total');

  if (summarySubtotal) summarySubtotal.textContent = formatVND(breakdown.subtotal);
  if (summaryDiscount) summaryDiscount.textContent = `-${formatVND(breakdown.discount)}`;
  if (summaryShipping) summaryShipping.textContent = breakdown.shipping === 0 ? 'Miễn phí' : formatVND(breakdown.shipping);
  if (summaryTotal) summaryTotal.textContent = formatVND(breakdown.total);

  // Mặc định chọn phương thức thanh toán
  const checkedPayment = document.querySelector('input[name="payment"]:checked')?.value || 'COD';
  updateCheckoutPaymentUI(checkedPayment);

  openModal('checkout-modal');
}

function updateCheckoutPaymentUI(method) {
  const vietQrBox = document.getElementById('vietqr-transfer-box');
  if (!vietQrBox) return;

  if (method === 'BANK') {
    const breakdown = calculateOrderBreakdown();
    const tempOrderCode = 'TECH' + Math.floor(100000 + Math.random() * 900000);
    const amount = breakdown.total;

    // Tạo mã VietQR sinh động qua chuẩn MBBank
    const qrUrl = `https://img.vietqr.io/image/MB-0988889999-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(tempOrderCode)}&accountName=${encodeURIComponent('TECHSTORE VIETNAM')}`;

    vietQrBox.innerHTML = `
      <div class="vietqr-card">
        <div class="vietqr-header">
          <span class="vietqr-badge">Quét mã VietQR 24/7 Napas</span>
          <small>Tự động xác nhận giao dịch trong 30 giây</small>
        </div>
        <div class="vietqr-body">
          <div class="vietqr-img-wrap">
            <img src="${qrUrl}" alt="VietQR TechStore" class="vietqr-img" onerror="this.src='https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TECHSTORE'">
          </div>
          <div class="vietqr-info">
            <div class="qr-info-row">
              <span>Ngân hàng:</span>
              <strong>MBBank (Quân Đội)</strong>
            </div>
            <div class="qr-info-row">
              <span>Số tài khoản:</span>
              <strong class="copyable-text" onclick="copyToClipboard('0988889999', 'Đã sao chép số tài khoản!')">
                0988889999
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              </strong>
            </div>
            <div class="qr-info-row">
              <span>Chủ tài khoản:</span>
              <strong>CONG TY CO PHAN TECHSTORE VIET NAM</strong>
            </div>
            <div class="qr-info-row">
              <span>Số tiền:</span>
              <strong class="text-primary copyable-text" onclick="copyToClipboard('${amount}', 'Đã sao chép số tiền!')">
                ${formatVND(amount)}
              </strong>
            </div>
            <div class="qr-info-row">
              <span>Nội dung CK:</span>
              <strong class="text-warning copyable-text" onclick="copyToClipboard('${tempOrderCode}', 'Đã sao chép nội dung!')">
                ${tempOrderCode}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              </strong>
            </div>
          </div>
        </div>
      </div>
    `;
    vietQrBox.style.display = 'block';
  } else {
    vietQrBox.style.display = 'none';
  }
}

function handleCheckoutSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('customer-name').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();
  const address = document.getElementById('customer-address').value.trim();
  const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'COD';
  const notes = document.getElementById('customer-note')?.value?.trim() || '';

  if (!name || !phone || !address) {
    showToast('Vui lòng điền đầy đủ các thông tin giao hàng bắt buộc!', 'warning');
    return;
  }

  closeModal('checkout-modal');

  const orderCode = 'TECH' + Math.floor(100000 + Math.random() * 900000);
  const currentCartItems = [...getCart()];
  const breakdown = calculateOrderBreakdown();

  const paymentNames = {
    'COD': 'Thanh toán tiền mặt khi nhận hàng (COD)',
    'BANK': 'Chuyển khoản VietQR Napas 24/7',
    'CARD': 'Thẻ Quốc Tế Visa / MasterCard / JCB',
    'MOMO': 'Ví Điện Tử MoMo / VNPay'
  };

  const newOrder = {
    orderCode,
    date: new Date().toLocaleString('vi-VN'),
    customerName: name,
    phone,
    address,
    notes,
    paymentMethod: paymentNames[paymentMethod] || 'COD',
    subtotal: breakdown.subtotal,
    discount: breakdown.discount,
    shipping: breakdown.shipping,
    total: breakdown.total,
    items: currentCartItems,
    coupon: breakdown.coupon ? breakdown.coupon.code : null,
    status: 'Đang xử lý (Chờ xác nhận)'
  };

  if (typeof saveUserOrder === 'function') {
    saveUserOrder(newOrder);
  }

  // Cập nhật thông tin thành công
  const successOrderInfo = document.getElementById('success-order-info');
  if (successOrderInfo) {
    successOrderInfo.innerHTML = `
      <div class="success-order-card">
        <div class="success-row"><span>Mã đơn hàng:</span><strong class="text-primary">${orderCode}</strong></div>
        <div class="success-row"><span>Người nhận:</span><strong>${escapeHtml(name)} (${phone})</strong></div>
        <div class="success-row"><span>Địa chỉ giao hàng:</span><strong>${escapeHtml(address)}</strong></div>
        <div class="success-row"><span>Phương thức:</span><strong>${newOrder.paymentMethod}</strong></div>
        <div class="success-row"><span>Tổng thanh toán:</span><strong class="text-success" style="font-size: 1.15rem;">${formatVND(breakdown.total)}</strong></div>
      </div>
      <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 12px; text-align: center;">
        Chuyên viên tư vấn TechStore sẽ liên hệ xác nhận trong vòng 15 phút.
      </p>
    `;
  }

  // Dọn giỏ hàng
  clearCart();
  document.getElementById('checkout-form').reset();

  openModal('success-modal');
  showToast('Đặt hàng thành công! Cảm ơn bạn.', 'success');
}

// ==================== LỊCH SỬ ĐƠN HÀNG & THÔNG TIN CÁ NHÂN ====================

function openOrderHistoryModal(e) {
  if (e) e.preventDefault();
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const targetId = user ? user.id : 'guest';
  const orders = typeof getUserOrders === 'function' ? getUserOrders(targetId) : [];

  const listContainer = document.getElementById('user-orders-list');
  if (!listContainer) return;

  if (orders.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-compare-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
        <h3>Bạn chưa có đơn hàng nào</h3>
        <p>Các đơn hàng mua sắm tại TechStore sẽ được lưu vết và cập nhật lộ trình tại đây.</p>
      </div>
    `;
  } else {
    listContainer.innerHTML = orders.map(order => `
      <div class="order-history-card">
        <div class="order-history-header">
          <div>
            <strong>Mã: ${order.orderCode}</strong>
            <span class="order-date">${order.date}</span>
          </div>
          <span class="order-status-badge">${order.status || 'Đang xử lý'}</span>
        </div>
        <div class="order-history-items">
          ${(order.items || []).map(item => `
            <div class="order-history-item-row">
              <span>${item.name} ${item.color ? `(${item.color})` : ''} x <strong>${item.quantity}</strong></span>
              <span>${formatVND(item.price * item.quantity)}</span>
            </div>
          `).join('')}
        </div>
        <div class="order-history-footer">
          <span>Phương thức: <em>${order.paymentMethod}</em></span>
          <span class="order-total-highlight">Tổng: ${formatVND(order.total)}</span>
        </div>
      </div>
    `).join('');
  }

  openModal('order-history-modal');
}

function openProfileModal(e) {
  if (e) e.preventDefault();
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const body = document.getElementById('profile-info-body');
  if (!body) return;

  if (!user) {
    openAuthModal('login');
    return;
  }

  const tier = typeof calculateVIPTier === 'function' ? calculateVIPTier(user.totalSpent || 0) : { name: "VIP", color: "#f59e0b", icon: "👑", perk: "Ưu đãi khách hàng thân thiết" };

  body.innerHTML = `
    <div class="profile-card">
      <div class="profile-avatar-wrap">
        <div class="profile-avatar">${user.fullname.charAt(0).toUpperCase()}</div>
        <div class="profile-title-block">
          <h3>${escapeHtml(user.fullname)}</h3>
          <span class="profile-vip-tier" style="background-color: ${tier.color}22; color: ${tier.color}; border: 1px solid ${tier.color};">
            ${tier.icon} ${user.vipTier || tier.name}
          </span>
        </div>
      </div>

      <div class="profile-stats-grid">
        <div class="profile-stat-box">
          <span class="stat-number text-warning">${user.vipPoints || 0}</span>
          <span class="stat-name">Điểm VIP Points</span>
        </div>
        <div class="profile-stat-box">
          <span class="stat-number text-primary">${formatVND(user.totalSpent || 0)}</span>
          <span class="stat-name">Tổng chi tiêu</span>
        </div>
      </div>

      <div class="profile-details-list">
        <div class="profile-row"><span>Email:</span><strong>${escapeHtml(user.email)}</strong></div>
        <div class="profile-row"><span>Số điện thoại:</span><strong>${escapeHtml(user.phone)}</strong></div>
        <div class="profile-row"><span>Đặc quyền hiện tại:</span><strong class="text-success">${tier.perk}</strong></div>
      </div>

      <button class="btn btn-secondary btn-block" style="margin-top: 20px;" onclick="closeModal('profile-modal'); openOrderHistoryModal();">
        Xem lịch sử đơn hàng của tôi
      </button>
    </div>
  `;

  openModal('profile-modal');
}

// ==================== TRỢ LÝ ẢO AI TECHSTORE (SMART CHATBOT) ====================

function toggleAIChat() {
  const chatDrawer = document.getElementById('ai-chat-drawer');
  if (chatDrawer) {
    chatDrawer.classList.toggle('open');
    if (chatDrawer.classList.contains('open')) {
      const input = document.getElementById('ai-chat-input');
      if (input) setTimeout(() => input.focus(), 200);
    }
  }
}

function handleAIChatSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('ai-chat-input');
  if (!input) return;

  const userMsg = input.value.trim();
  if (!userMsg) return;

  appendAIChatMessage(userMsg, 'user');
  input.value = '';

  // Giả lập bot đang suy nghĩ
  const typingIndicator = appendAITypingIndicator();

  setTimeout(() => {
    removeAITypingIndicator(typingIndicator);
    const reply = generateAIResponse(userMsg);
    appendAIChatMessage(reply, 'bot');
  }, 700);
}

function appendAIChatMessage(htmlContent, sender = 'bot') {
  const container = document.getElementById('ai-chat-messages');
  if (!container) return;

  const msgEl = document.createElement('div');
  msgEl.className = `ai-msg ${sender === 'user' ? 'ai-msg-user' : 'ai-msg-bot'}`;
  msgEl.innerHTML = htmlContent;
  container.appendChild(msgEl);
  container.scrollTop = container.scrollHeight;
}

function appendAITypingIndicator() {
  const container = document.getElementById('ai-chat-messages');
  if (!container) return null;

  const typingEl = document.createElement('div');
  typingEl.className = 'ai-msg ai-msg-bot ai-typing';
  typingEl.innerHTML = `<span></span><span></span><span></span>`;
  container.appendChild(typingEl);
  container.scrollTop = container.scrollHeight;
  return typingEl;
}

function removeAITypingIndicator(el) {
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
  }
}

function generateAIResponse(query) {
  const q = query.toLowerCase();
  const all = getStoredProducts();

  if (q.includes('iphone') || q.includes('apple') || q.includes('điện thoại')) {
    const phones = all.filter(p => p.category === 'phone').slice(0, 2);
    return `
      Dạ chào bạn! Hiện tại các mẫu smartphone Flagship được ưa chuộng nhất tại TechStore là:
      <div class="ai-recommend-list">
        ${phones.map(p => `
          <div class="ai-rec-card" onclick="openProductDetail(${p.id})">
            <img src="${p.image}">
            <div>
              <strong>${p.name}</strong>
              <div class="text-primary">${formatVND(p.price)}</div>
            </div>
          </div>
        `).join('')}
      </div>
      Bạn có muốn xem chi tiết thông số hoặc săn giá khuyến mãi không ạ?
    `;
  }

  if (q.includes('laptop') || q.includes('gaming') || q.includes('macbook')) {
    const laptops = all.filter(p => p.category === 'laptop').slice(0, 2);
    return `
      Dạ đây là những cỗ máy Laptop & Gaming đỉnh cao nhất hiện có:
      <div class="ai-recommend-list">
        ${laptops.map(p => `
          <div class="ai-rec-card" onclick="openProductDetail(${p.id})">
            <img src="${p.image}">
            <div>
              <strong>${p.name}</strong>
              <div class="text-primary">${formatVND(p.price)}</div>
            </div>
          </div>
        `).join('')}
      </div>
      Mọi dòng laptop đều được hỗ trợ trả góp 0% và bảo hành 24 tháng VIP tận nơi!
    `;
  }

  if (q.includes('loa') || q.includes('tai nghe') || q.includes('âm thanh') || q.includes('marshall') || q.includes('sony')) {
    const audios = all.filter(p => p.category === 'audio').slice(0, 2);
    return `
      Nếu bạn đam mê âm thanh đỉnh cao, hãy trải nghiệm ngay:
      <div class="ai-recommend-list">
        ${audios.map(p => `
          <div class="ai-rec-card" onclick="openProductDetail(${p.id})">
            <img src="${p.image}">
            <div>
              <strong>${p.name}</strong>
              <div class="text-primary">${formatVND(p.price)}</div>
            </div>
          </div>
        `).join('')}
      </div>
      Cam kết chuẩn chính hãng 100%, chất âm Hi-Res và chống ồn chủ động đỉnh cao!
    `;
  }

  if (q.includes('mã') || q.includes('giảm giá') || q.includes('voucher') || q.includes('khuyến mãi')) {
    return `
      🎁 <strong>Mã giảm giá VIP đang hoạt động:</strong><br>
      • <code class="copyable-code" onclick="applyAndNotify('TECHSALE10')">TECHSALE10</code>: Giảm 10% tổng đơn hàng.<br>
      • <code class="copyable-code" onclick="applyAndNotify('VIPPRO')">VIPPRO</code>: Giảm ngay 1.000.000 đ.<br>
      • <code class="copyable-code" onclick="applyAndNotify('FREESHIP')">FREESHIP</code>: Miễn phí giao hàng hỏa tốc toàn quốc!<br>
      <em>(Nhấp vào mã bất kỳ để áp dụng ngay)</em>
    `;
  }

  if (q.includes('bảo hành') || q.includes('đổi trả')) {
    return `
      🛡️ <strong>Chính sách bảo hành VIP TechStore:</strong><br>
      • 100% sản phẩm chính hãng có hóa đơn VAT điện tử.<br>
      • Đổi mới 1 - 1 trong 30 ngày nếu phát sinh lỗi phần cứng.<br>
      • Gói bảo hành VIP 24 tháng hỗ trợ mượn máy thay thế khi bảo hành.<br>
      • Miễn phí giao nhận máy bảo hành tận nhà toàn quốc.
    `;
  }

  return `
    Cảm ơn bạn đã nhắn tin cho Trợ lý AI TechStore! Mình có thể hỗ trợ bạn tìm kiếm bất kỳ thiết bị công nghệ nào (iPhone, MacBook, ROG Gaming, B&O, Marshall, Apple Watch...), kiểm tra mã voucher hoặc chính sách bảo hành. Bạn cần tư vấn sản phẩm cụ thể nào ạ?
  `;
}

function applyAndNotify(code) {
  const res = applyCoupon(code);
  showToast(res.message, res.success ? 'success' : 'warning');
}

// ==================== CÁC TIỆN ÍCH DÙNG CHUNG ====================

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

function openAuthModal(tab = 'login') {
  switchAuthTab(tab);
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
    if (btnLogin) btnLogin.classList.add('active');
    if (btnRegister) btnRegister.classList.remove('active');
    if (paneLogin) paneLogin.classList.add('active');
    if (paneRegister) paneRegister.classList.remove('active');
  } else {
    if (btnLogin) btnLogin.classList.remove('active');
    if (btnRegister) btnRegister.classList.add('active');
    if (paneLogin) paneLogin.classList.remove('active');
    if (paneRegister) paneRegister.classList.add('active');
  }
}

function fillUserDemo() {
  const accInput = document.getElementById('user-login-acc');
  const passInput = document.getElementById('user-login-pass');
  if (accInput) accInput.value = 'khachhang@gmail.com';
  if (passInput) passInput.value = '123456';
}

function copyToClipboard(text, successMsg = 'Đã sao chép vào bộ nhớ tạm!') {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg, 'success');
    }).catch(() => fallbackCopy(text, successMsg));
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  showToast(successMsg, 'success');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icons = {
    success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    warning: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
    info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
  };

  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-message">${escapeHtml(message)}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
