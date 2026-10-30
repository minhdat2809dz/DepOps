/**
 * admin.js - Logic Quản trị VIP PRO
 * CRUD sản phẩm + Xem đơn hàng + Dashboard thống kê
 */

let adminSearchQuery = '';
let adminCategoryFilter = 'all';
let editingProductId = null;
let deletingProductId = null;

// Bản đồ tên hiển thị danh mục (đã bổ sung gaming)
const CATEGORY_MAP = {
  phone:       'Điện thoại',
  laptop:      'Laptop',
  tablet:      'Máy tính bảng',
  audio:       'Âm thanh',
  watch:       'Đồng hồ',
  gaming:      'Gaming & VR',
  camera:      'Máy ảnh & Flycam',
  smarthome:   'Nhà thông minh',
  accessories: 'Phụ kiện & Màn hình',
  other:       'Khác'
};

// Trạng thái đơn hàng
const ORDER_STATUS_LABELS = {
  pending:    'Chờ xác nhận',
  confirmed:  'Đã xác nhận',
  shipping:   'Đang giao hàng',
  delivered:  'Đã giao hàng',
  cancelled:  'Đã hủy'
};

document.addEventListener('DOMContentLoaded', () => {
  initAdminEvents();
  loadAndRenderAdminTable();
  loadAndRenderAdminOrders();
});

/* ============================================================
   KHỞI TẠO SỰ KIỆN
   ============================================================ */
function initAdminEvents() {
  // 1. Tìm kiếm trong bảng sản phẩm
  const searchInput = document.getElementById('admin-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      adminSearchQuery = e.target.value.trim().toLowerCase();
      loadAndRenderAdminTable();
    });
  }

  // 2. Lọc danh mục
  const filterSelect = document.getElementById('admin-filter-category');
  if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
      adminCategoryFilter = e.target.value;
      loadAndRenderAdminTable();
    });
  }

  // 3. Form thêm / sửa sản phẩm
  const productForm = document.getElementById('product-form');
  if (productForm) {
    productForm.addEventListener('submit', handleProductFormSubmit);
  }

  // 4. Live preview ảnh
  const imgInput = document.getElementById('prod-image');
  const imgPreview = document.getElementById('img-preview-el');
  if (imgInput && imgPreview) {
    imgInput.addEventListener('input', (e) => {
      const url = e.target.value.trim();
      imgPreview.src = url || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';
    });
  }

  // 5. Nút xác nhận xóa trong modal
  const confirmDeleteBtn = document.getElementById('btn-confirm-delete');
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', executeDeleteProduct);
  }

  // 6. Đóng modal bằng Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAdminModal('product-form-modal');
      closeAdminModal('delete-confirm-modal');
    }
  });

  // 7. Đồng bộ khi dữ liệu thay đổi từ tab khác
  window.addEventListener('storage', (e) => {
    if (e.key === 'techstore_products_data') {
      loadAndRenderAdminTable();
    }
    if (e.key === 'techstore_master_orders') {
      loadAndRenderAdminOrders();
      updateDashboardStats(getStoredProducts());
    }
  });
}

/* ============================================================
   CHUYỂN TAB ADMIN (Products / Orders)
   ============================================================ */
function switchAdminView(view) {
  // Cập nhật nội dung hiển thị
  const viewProducts = document.getElementById('admin-view-products');
  const viewOrders   = document.getElementById('admin-view-orders');

  if (viewProducts) viewProducts.style.display = view === 'products' ? '' : 'none';
  if (viewOrders)   viewOrders.style.display   = view === 'orders'   ? '' : 'none';

  // Cập nhật tab active
  document.querySelectorAll('.admin-view-tab-btn').forEach(btn => {
    const btnView = btn.id === 'view-tab-products' ? 'products' : 'orders';
    btn.classList.toggle('active', btnView === view);
  });

  // Lazy load orders khi chuyển sang tab đó
  if (view === 'orders') loadAndRenderAdminOrders();
}

/* ============================================================
   BẢNG SẢN PHẨM & THỐNG KÊ
   ============================================================ */
function loadAndRenderAdminTable() {
  const allProducts = getStoredProducts();

  // Cập nhật thẻ thống kê
  updateDashboardStats(allProducts);

  // Lọc
  const filtered = allProducts.filter(p => {
    const matchCat    = adminCategoryFilter === 'all' || p.category === adminCategoryFilter;
    const matchSearch = p.name.toLowerCase().includes(adminSearchQuery) ||
                        (p.brand && p.brand.toLowerCase().includes(adminSearchQuery)) ||
                        (p.categoryName && p.categoryName.toLowerCase().includes(adminSearchQuery));
    return matchCat && matchSearch;
  });

  const tbody    = document.getElementById('admin-products-tbody');
  const emptyBox = document.getElementById('admin-table-empty');
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    if (emptyBox) emptyBox.style.display = 'block';
    return;
  }
  if (emptyBox) emptyBox.style.display = 'none';

  tbody.innerHTML = filtered.map(p => `
    <tr>
      <td>
        <img src="${p.image}" alt="${p.name}" class="admin-prod-thumb"
             onerror="this.src='https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80'">
      </td>
      <td>
        <div class="admin-prod-name">${p.name}</div>
        <small style="color: var(--text-muted); font-size: 0.78rem;">ID: #${p.id}</small>
      </td>
      <td>
        <span class="admin-category-badge">${p.categoryName || CATEGORY_MAP[p.category] || 'Chưa phân loại'}</span>
      </td>
      <td>
        <span style="color: var(--accent-primary); font-weight: 600; font-size: 0.82rem;">${p.brand || '-'}</span>
      </td>
      <td>
        <span class="admin-prod-price">${formatVND(p.price)}</span>
        ${p.oldPrice ? `<br><small style="text-decoration: line-through; color: var(--text-light); font-size: 0.8rem;">${formatVND(p.oldPrice)}</small>` : ''}
      </td>
      <td>
        ${p.badge ? `<span class="table-badge-tag">${p.badge}</span>` : '<span style="color: var(--text-light);">-</span>'}
      </td>
      <td>
        <span style="color: #f59e0b; font-weight: 700;">★ ${p.rating || 5.0}</span>
        <span style="color: var(--text-muted); font-size: 0.8rem;">(${p.reviewsCount || 0})</span>
      </td>
      <td>
        <div class="admin-actions-cell">
          <button class="btn-icon btn-edit" onclick="openEditProductModal(${p.id})" title="Chỉnh sửa">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="btn-icon btn-delete" onclick="confirmDeleteProduct(${p.id})" title="Xóa">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

/* ============================================================
   THỐNG KÊ DASHBOARD
   ============================================================ */
function updateDashboardStats(allProducts) {
  // Tổng sản phẩm
  const totalProdEl = document.getElementById('stat-total-products');
  if (totalProdEl) totalProdEl.textContent = allProducts.length;

  // Tổng đơn hàng
  const masterOrders = getAllMasterOrders ? getAllMasterOrders() : [];
  const totalOrdersEl = document.getElementById('stat-total-orders');
  if (totalOrdersEl) totalOrdersEl.textContent = masterOrders.length;

  // Tổng doanh thu
  const totalRevenueEl = document.getElementById('stat-total-revenue');
  if (totalRevenueEl) {
    const revenue = masterOrders.reduce((acc, o) => acc + (o.total || 0), 0);
    totalRevenueEl.textContent = formatVND(revenue);
  }

  // Giá bán trung bình
  const avgPriceEl = document.getElementById('stat-avg-price');
  if (avgPriceEl) {
    if (allProducts.length === 0) {
      avgPriceEl.textContent = '0 đ';
    } else {
      const sum = allProducts.reduce((acc, p) => acc + (p.price || 0), 0);
      avgPriceEl.textContent = formatVND(Math.round(sum / allProducts.length));
    }
  }
}

/* ============================================================
   BẢNG ĐƠN HÀNG (Đồng bộ SQL Server)
   ============================================================ */
async function loadAndRenderAdminOrders() {
  let masterOrders = getAllMasterOrders ? getAllMasterOrders() : [];

  // Lấy đơn hàng từ SQL Server nếu có kết nối
  if (typeof apiGetOrders === 'function') {
    try {
      const sqlOrders = await apiGetOrders();
      if (sqlOrders && Array.isArray(sqlOrders) && sqlOrders.length > 0) {
        masterOrders = sqlOrders;
        if (typeof saveMasterOrders === 'function') saveMasterOrders(sqlOrders);
      }
    } catch (e) {
      console.warn('Lỗi lấy đơn từ SQL Server, dùng LocalStorage:', e);
    }
  }

  const tbody    = document.getElementById('admin-orders-tbody');
  const emptyBox = document.getElementById('admin-orders-empty');

  if (!tbody) return;

  if (!masterOrders || masterOrders.length === 0) {
    tbody.innerHTML = '';
    if (emptyBox) emptyBox.style.display = 'block';
    return;
  }
  if (emptyBox) emptyBox.style.display = 'none';

  tbody.innerHTML = masterOrders.map(order => {
    const statusClass = `order-status-${order.status || 'pending'}`;
    const statusLabel = ORDER_STATUS_LABELS[order.status] || order.status || 'Chờ xác nhận';
    const itemsHtml = (order.items || []).map(it =>
      `<div style="font-size:0.8rem; color: var(--text-muted);">• ${it.name} x${it.qty || it.quantity || 1}</div>`
    ).join('');
    const orderDate = order.createdAt
      ? new Date(order.createdAt).toLocaleString('vi-VN')
      : '-';
    const paymentLabel = {
      cod:     '🚗 COD',
      banking: '🏦 Chuyển khoản',
      momo:    '💜 MoMo',
      vnpay:   '🔵 VNPay'
    }[order.paymentMethod || order.payment] || order.paymentMethod || order.payment || 'COD';

    return `
      <tr>
        <td>
          <span style="font-family: monospace; font-size: 0.82rem; color: var(--accent-primary);">#${order.orderCode || order.id || '-'}</span>
        </td>
        <td style="font-size: 0.83rem; white-space: nowrap;">${orderDate}</td>
        <td>
          <div style="font-weight: 600; font-size: 0.88rem;">${escapeAdminHtml(order.customerName || 'Khách')}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${escapeAdminHtml(order.userEmail || order.email || '')}</div>
        </td>
        <td>
          <div style="font-size: 0.82rem;">${escapeAdminHtml(order.customerPhone || order.phone || '-')}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted); max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeAdminHtml(order.customerAddress || order.address || '')}">
            ${escapeAdminHtml(order.customerAddress || order.address || '-')}
          </div>
        </td>
        <td style="min-width: 180px;">${itemsHtml}</td>
        <td>
          <span style="font-weight: 700; color: var(--accent-primary);">${formatVND(order.total || 0)}</span>
        </td>
        <td style="font-size: 0.85rem;">${paymentLabel}</td>
        <td>
          <select class="order-status-select ${statusClass}"
                  onchange="updateOrderStatus('${order.id}', this.value)"
                  title="Cập nhật trạng thái đơn hàng">
            ${Object.entries(ORDER_STATUS_LABELS).map(([val, label]) =>
              `<option value="${val}" ${(order.status === val || order.status === label) ? 'selected' : ''}>${label}</option>`
            ).join('')}
          </select>
        </td>
      </tr>
    `;
  }).join('');
}

/* Cập nhật trạng thái đơn hàng và lưu lại vào SQL Server */
async function updateOrderStatus(orderId, newStatus) {
  const KEY = 'techstore_master_orders';
  try {
    let orders = JSON.parse(localStorage.getItem(KEY) || '[]');
    const idx = orders.findIndex(o => o.id === orderId || o.id === Number(orderId));
    if (idx > -1) {
      orders[idx].status = newStatus;
      localStorage.setItem(KEY, JSON.stringify(orders));
    }

    // Gửi cập nhật lên SQL Server
    if (typeof apiUpdateOrderStatus === 'function') {
      await apiUpdateOrderStatus(orderId, newStatus);
    }

    showToast(`Cập nhật trạng thái đơn #${orderId} thành công trên SQL Server!`, 'success');
    loadAndRenderAdminOrders();
  } catch (err) {
    showToast('Lỗi khi cập nhật trạng thái!', 'warning');
  }
}

/* ============================================================
   MODAL THÊM SẢN PHẨM (CREATE)
   ============================================================ */
function openAddProductModal() {
  editingProductId = null;
  const form = document.getElementById('product-form');
  if (form) form.reset();

  const titleEl = document.getElementById('modal-form-title');
  if (titleEl) titleEl.textContent = 'Thêm Sản Phẩm Mới';

  const preview = document.getElementById('img-preview-el');
  if (preview) {
    preview.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';
  }

  const ratingEl = document.getElementById('prod-rating');
  const reviewsEl = document.getElementById('prod-reviews');
  if (ratingEl) ratingEl.value = 5.0;
  if (reviewsEl) reviewsEl.value = 1;

  openAdminModal('product-form-modal');
}

/* ============================================================
   MODAL CHỈNH SỬA SẢN PHẨM (UPDATE)
   ============================================================ */
function openEditProductModal(id) {
  const allProducts = getStoredProducts();
  const prod = allProducts.find(p => p.id === Number(id));
  if (!prod) return;

  editingProductId = prod.id;

  const titleEl = document.getElementById('modal-form-title');
  if (titleEl) titleEl.textContent = `Chỉnh Sửa Sản Phẩm #${prod.id}`;

  // Điền dữ liệu cũ vào form
  const set = (elId, val) => {
    const el = document.getElementById(elId);
    if (el) el.value = val ?? '';
  };

  set('prod-name',      prod.name);
  set('prod-category',  prod.category || 'phone');
  set('prod-brand',     prod.brand);
  set('prod-price',     prod.price);
  set('prod-old-price', prod.oldPrice);
  set('prod-badge',     prod.badge);
  set('prod-rating',    prod.rating || 5.0);
  set('prod-reviews',   prod.reviewsCount || 0);
  set('prod-image',     prod.image);
  set('prod-desc',      prod.description);
  set('prod-gift',      prod.gift);

  const preview = document.getElementById('img-preview-el');
  if (preview) {
    preview.src = prod.image || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';
  }

  openAdminModal('product-form-modal');
}

/* ============================================================
   XỬ LÝ FORM SUBMIT (CREATE / UPDATE)
   ============================================================ */
function handleProductFormSubmit(e) {
  e.preventDefault();

  const name         = document.getElementById('prod-name').value.trim();
  const category     = document.getElementById('prod-category').value;
  const brandEl      = document.getElementById('prod-brand');
  const brand        = brandEl ? brandEl.value.trim() : '';
  const price        = Number(document.getElementById('prod-price').value);
  const oldPriceRaw  = document.getElementById('prod-old-price').value;
  const oldPrice     = oldPriceRaw ? Number(oldPriceRaw) : null;
  const badge        = document.getElementById('prod-badge').value.trim();
  const rating       = Number(document.getElementById('prod-rating').value) || 5.0;
  const reviewsCount = Number(document.getElementById('prod-reviews').value) || 0;
  const imageInput   = document.getElementById('prod-image').value.trim();
  const image        = imageInput || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';
  const description  = document.getElementById('prod-desc').value.trim() || 'Chưa có mô tả chi tiết.';
  const giftEl       = document.getElementById('prod-gift');
  const gift         = giftEl ? giftEl.value.trim() : '';

  if (!name || isNaN(price) || price <= 0) {
    showToast('Vui lòng nhập tên sản phẩm và giá hợp lệ!', 'warning');
    return;
  }

  let allProducts = getStoredProducts();

  if (editingProductId !== null) {
    // UPDATE
    const index = allProducts.findIndex(p => p.id === editingProductId);
    if (index > -1) {
      allProducts[index] = {
        ...allProducts[index],
        name,
        category,
        categoryName: CATEGORY_MAP[category] || 'Khác',
        brand,
        price,
        oldPrice,
        badge,
        rating,
        reviewsCount,
        image,
        description,
        gift
      };
      saveStoredProducts(allProducts);

      // Đồng bộ cập nhật vào SQL Server
      if (typeof apiUpdateProduct === 'function') {
        apiUpdateProduct(editingProductId, allProducts[index]).then(res => {
          if (res && res.success) console.log('✅ Đã cập nhật sản phẩm vào SQL Server!');
        });
      }

      showToast(`Đã cập nhật sản phẩm "${name}" thành công!`, 'success');
    }
  } else {
    // CREATE
    const newId = allProducts.length > 0 ? Math.max(...allProducts.map(p => p.id)) + 1 : 1;
    const newProduct = {
      id: newId,
      name,
      category,
      categoryName: CATEGORY_MAP[category] || 'Khác',
      brand,
      price,
      oldPrice,
      badge,
      rating,
      reviewsCount,
      image,
      description,
      gift,
      gallery: [image],
      colors: [],
      storageOptions: [],
      specs: {},
      reviews: [],
      stock: 99,
      soldCount: 0,
      flashSale: false
    };
    allProducts.unshift(newProduct);
    saveStoredProducts(allProducts);

    // Đồng bộ thêm mới vào SQL Server
    if (typeof apiCreateProduct === 'function') {
      apiCreateProduct(newProduct).then(res => {
        if (res && res.success) {
          console.log('✅ Đã thêm sản phẩm mới vào SQL Server (TechStoreDB)!');
          // Cập nhật lại ID từ DB nếu có
          if (res.data && res.data.id) {
            newProduct.id = res.data.id;
            saveStoredProducts(allProducts);
            loadAndRenderAdminTable();
          }
        }
      });
    }

    showToast(`Đã thêm sản phẩm "${name}" thành công!`, 'success');
  }

  closeAdminModal('product-form-modal');
  loadAndRenderAdminTable();
}

/* ============================================================
   XÓA SẢN PHẨM
   ============================================================ */
function confirmDeleteProduct(id) {
  const allProducts = getStoredProducts();
  const prod = allProducts.find(p => p.id === Number(id));
  if (!prod) return;

  deletingProductId = prod.id;

  const targetNameEl = document.getElementById('delete-prod-target-name');
  if (targetNameEl) targetNameEl.textContent = prod.name;

  openAdminModal('delete-confirm-modal');
}

function executeDeleteProduct() {
  if (deletingProductId === null) return;

  let allProducts = getStoredProducts();
  const prodToDelete = allProducts.find(p => p.id === deletingProductId);
  allProducts = allProducts.filter(p => p.id !== deletingProductId);

  saveStoredProducts(allProducts);

  // Xóa trực tiếp trên SQL Server
  if (typeof apiDeleteProduct === 'function') {
    apiDeleteProduct(deletingProductId).then(res => {
      if (res && res.success) console.log(`✅ Đã xóa sản phẩm #${deletingProductId} khỏi SQL Server!`);
    });
  }

  closeAdminModal('delete-confirm-modal');
  loadAndRenderAdminTable();

  showToast(`Đã xóa "${prodToDelete ? prodToDelete.name : 'sản phẩm'}" khỏi hệ thống!`, 'info');
  deletingProductId = null;
}

/* ============================================================
   KHÔI PHỤC DỮ LIỆU MẪU
   ============================================================ */
async function triggerResetDefaultData() {
  if (confirm('Bạn có chắc chắn muốn khôi phục lại danh sách 60 sản phẩm mẫu VIP gốc không? Dữ liệu trên SQL Server và Website sẽ được đặt lại.')) {
    showToast('Đang khôi phục 60 sản phẩm từ SQL Server...', 'info');
    await resetDefaultProducts();
    loadAndRenderAdminTable();
    showToast('Đã khôi phục 60 sản phẩm mẫu VIP PRO thành công!', 'success');
  }
}

/* ============================================================
   ĐIỀU KHIỂN MODAL ADMIN
   ============================================================ */
function openAdminModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

function closeAdminModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
}

/* ============================================================
   TOAST THÔNG BÁO
   ============================================================ */
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
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  }

  toast.innerHTML = `
    <div class="toast-icon">${iconSvg}</div>
    <div class="toast-message">${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    toast.addEventListener('animationend', () => toast.remove());
  }, 3000);
}

/* ============================================================
   HELPER: XSS ESCAPE (dùng trong admin, không dùng escapeHtml của app.js)
   ============================================================ */
function escapeAdminHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
