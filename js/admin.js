/**
 * admin.js - Logic Quản trị CRUD sản phẩm (Thêm, Xem, Sửa, Xóa, Lưu LocalStorage)
 */

let adminSearchQuery = '';
let adminCategoryFilter = 'all';
let editingProductId = null;
let deletingProductId = null;

// Bản đồ tên hiển thị danh mục
const CATEGORY_MAP = {
  phone: 'Điện thoại',
  laptop: 'Laptop',
  audio: 'Âm thanh',
  watch: 'Đồng hồ',
  other: 'Khác'
};

document.addEventListener('DOMContentLoaded', () => {
  initAdminEvents();
  loadAndRenderAdminTable();
});

// Khởi tạo các sự kiện giao diện Admin
function initAdminEvents() {
  // 1. Tìm kiếm trong bảng
  const searchInput = document.getElementById('admin-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      adminSearchQuery = e.target.value.trim().toLowerCase();
      loadAndRenderAdminTable();
    });
  }

  // 2. Lọc danh mục trong bảng
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

  // 4. Live preview ảnh khi gõ link
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

  // 6. Đóng modal khi nhấn Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAdminModal('product-form-modal');
      closeAdminModal('delete-confirm-modal');
    }
  });

  // 7. Đồng bộ nếu dữ liệu thay đổi từ tab khác
  window.addEventListener('storage', (e) => {
    if (e.key === 'techstore_products_data') {
      loadAndRenderAdminTable();
    }
  });
}

// Nạp và hiển thị bảng sản phẩm & cập nhật thống kê
function loadAndRenderAdminTable() {
  const allProducts = getStoredProducts();

  // 1. Cập nhật thẻ thống kê
  updateDashboardStats(allProducts);

  // 2. Lọc danh sách theo từ khóa & danh mục
  const filtered = allProducts.filter(p => {
    const matchCat = adminCategoryFilter === 'all' || p.category === adminCategoryFilter;
    const matchSearch = p.name.toLowerCase().includes(adminSearchQuery) ||
                        (p.categoryName && p.categoryName.toLowerCase().includes(adminSearchQuery));
    return matchCat && matchSearch;
  });

  const tbody = document.getElementById('admin-products-tbody');
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
        <img src="${p.image}" alt="${p.name}" class="admin-prod-thumb" onerror="this.src='https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80'">
      </td>
      <td>
        <div class="admin-prod-name">${p.name}</div>
        <small style="color: var(--text-muted); font-size: 0.78rem;">ID: #${p.id}</small>
      </td>
      <td>
        <span class="admin-category-badge">${p.categoryName || CATEGORY_MAP[p.category] || 'Chưa phân loại'}</span>
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

// Cập nhật các thẻ thống kê tổng quan
function updateDashboardStats(allProducts) {
  // 1. Tổng số sản phẩm
  const totalProdEl = document.getElementById('stat-total-products');
  if (totalProdEl) totalProdEl.textContent = allProducts.length;

  // 2. Tổng số danh mục duy nhất
  const totalCatEl = document.getElementById('stat-total-categories');
  if (totalCatEl) {
    const cats = new Set(allProducts.map(p => p.category));
    totalCatEl.textContent = cats.size;
  }

  // 3. Sản phẩm có huy hiệu / khuyến mãi
  const totalBadgeEl = document.getElementById('stat-total-badges');
  if (totalBadgeEl) {
    const count = allProducts.filter(p => p.badge).length;
    totalBadgeEl.textContent = count;
  }

  // 4. Giá bán trung bình
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

// Mở Modal Thêm mới sản phẩm (Create)
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

  // Gán giá trị mặc định cho rating và review
  document.getElementById('prod-rating').value = 5.0;
  document.getElementById('prod-reviews').value = 1;

  openAdminModal('product-form-modal');
}

// Mở Modal Chỉnh sửa sản phẩm (Update)
function openEditProductModal(id) {
  const allProducts = getStoredProducts();
  const prod = allProducts.find(p => p.id === Number(id));
  if (!prod) return;

  editingProductId = prod.id;

  const titleEl = document.getElementById('modal-form-title');
  if (titleEl) titleEl.textContent = `Chỉnh Sửa Sản Phẩm #${prod.id}`;

  // Điền dữ liệu cũ vào form
  document.getElementById('prod-name').value = prod.name || '';
  document.getElementById('prod-category').value = prod.category || 'phone';
  document.getElementById('prod-price').value = prod.price || 0;
  document.getElementById('prod-old-price').value = prod.oldPrice || '';
  document.getElementById('prod-badge').value = prod.badge || '';
  document.getElementById('prod-rating').value = prod.rating || 5.0;
  document.getElementById('prod-reviews').value = prod.reviewsCount || 0;
  document.getElementById('prod-image').value = prod.image || '';
  document.getElementById('prod-desc').value = prod.description || '';

  // Xem trước ảnh
  const preview = document.getElementById('img-preview-el');
  if (preview) {
    preview.src = prod.image || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';
  }

  openAdminModal('product-form-modal');
}

// Xử lý gửi Form Thêm / Sửa sản phẩm
function handleProductFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('prod-name').value.trim();
  const category = document.getElementById('prod-category').value;
  const price = Number(document.getElementById('prod-price').value);
  const oldPriceInput = document.getElementById('prod-old-price').value;
  const oldPrice = oldPriceInput ? Number(oldPriceInput) : null;
  const badge = document.getElementById('prod-badge').value.trim();
  const rating = Number(document.getElementById('prod-rating').value) || 5.0;
  const reviewsCount = Number(document.getElementById('prod-reviews').value) || 0;
  const imageInput = document.getElementById('prod-image').value.trim();
  const image = imageInput || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';
  const description = document.getElementById('prod-desc').value.trim() || 'Chưa có mô tả chi tiết cho sản phẩm này.';

  if (!name || isNaN(price) || price <= 0) {
    showToast('Vui lòng nhập tên sản phẩm và giá hợp lệ!', 'warning');
    return;
  }

  let allProducts = getStoredProducts();

  if (editingProductId !== null) {
    // Chế độ Sửa (UPDATE)
    const index = allProducts.findIndex(p => p.id === editingProductId);
    if (index > -1) {
      allProducts[index] = {
        ...allProducts[index],
        name,
        category,
        categoryName: CATEGORY_MAP[category] || 'Khác',
        price,
        oldPrice,
        badge,
        rating,
        reviewsCount,
        image,
        description
      };
      saveStoredProducts(allProducts);
      showToast(`Đã cập nhật sản phẩm "${name}" thành công!`, 'success');
    }
  } else {
    // Chế độ Thêm mới (CREATE)
    const newId = allProducts.length > 0 ? Math.max(...allProducts.map(p => p.id)) + 1 : 1;
    const newProduct = {
      id: newId,
      name,
      category,
      categoryName: CATEGORY_MAP[category] || 'Khác',
      price,
      oldPrice,
      badge,
      rating,
      reviewsCount,
      image,
      description
    };
    allProducts.unshift(newProduct); // Đưa sản phẩm mới lên đầu
    saveStoredProducts(allProducts);
    showToast(`Đã thêm sản phẩm "${name}" thành công!`, 'success');
  }

  closeAdminModal('product-form-modal');
  loadAndRenderAdminTable();
}

// Mở hộp thoại xác nhận xóa (Delete Confirmation)
function confirmDeleteProduct(id) {
  const allProducts = getStoredProducts();
  const prod = allProducts.find(p => p.id === Number(id));
  if (!prod) return;

  deletingProductId = prod.id;

  const targetNameEl = document.getElementById('delete-prod-target-name');
  if (targetNameEl) {
    targetNameEl.textContent = prod.name;
  }

  openAdminModal('delete-confirm-modal');
}

// Thực hiện xóa sản phẩm (DELETE)
function executeDeleteProduct() {
  if (deletingProductId === null) return;

  let allProducts = getStoredProducts();
  const prodToDelete = allProducts.find(p => p.id === deletingProductId);
  allProducts = allProducts.filter(p => p.id !== deletingProductId);

  saveStoredProducts(allProducts);
  closeAdminModal('delete-confirm-modal');
  loadAndRenderAdminTable();

  showToast(`Đã xóa "${prodToDelete ? prodToDelete.name : 'sản phẩm'}" khỏi hệ thống!`, 'info');
  deletingProductId = null;
}

// Khôi phục dữ liệu gốc
function triggerResetDefaultData() {
  if (confirm('Bạn có chắc chắn muốn khôi phục lại danh sách 8 sản phẩm mẫu gốc không? Các thay đổi trước đó sẽ bị đặt lại.')) {
    resetDefaultProducts();
    loadAndRenderAdminTable();
    showToast('Đã khôi phục dữ liệu mẫu ban đầu thành công!', 'success');
  }
}

// Điều khiển Modal Admin
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

// Hiển thị Toast thông báo
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
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="8"></line></svg>`;
  }

  toast.innerHTML = `
    <div class="toast-icon">${iconSvg}</div>
    <div class="toast-msg">${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 3000);
}
