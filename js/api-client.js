/**
 * api-client.js - Cầu nối kết nối Frontend trực tiếp với Backend API & SQL Server (TechStoreDB)
 * Hỗ trợ đồng bộ 2 chiều thời gian thực giữa Website và SQL Server 2025.
 */

const API_CONFIG = {
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
  isOnline: false,
  dbInfo: null
};

// 1. Kiểm tra trạng thái kết nối SQL Server
async function checkDatabaseConnection() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    const res = await fetch(`${API_CONFIG.baseURL}/health`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      API_CONFIG.isOnline = (data.status === 'Connected');
      API_CONFIG.dbInfo = data;
      renderDbStatusBadge(true, data);
      return { online: true, data };
    }
  } catch (err) {
    API_CONFIG.isOnline = false;
    API_CONFIG.dbInfo = null;
    renderDbStatusBadge(false);
  }
  return { online: false };
}

// 2. Hiển thị huy hiệu trạng thái Database trên Header
function renderDbStatusBadge(isOnline, info = null) {
  let badge = document.getElementById('sql-db-badge');
  if (!badge) {
    badge = document.createElement('div');
    badge.id = 'sql-db-badge';
    badge.className = 'sql-db-badge';

    // Thêm vào header hoặc admin header
    const headerActions = document.querySelector('.header-actions') || 
                          document.querySelector('.admin-nav-actions') || 
                          document.body;
    if (headerActions) {
      headerActions.prepend(badge);
    }
  }

  if (isOnline) {
    badge.className = 'sql-db-badge connected';
    badge.title = `Đã kết nối SQL Server (${info?.server || 'SQLEXPRESS2025'} / DB: ${info?.database || 'TechStoreDB'}) - ${info?.totalProducts || 38} SP`;
    badge.innerHTML = `
      <span class="sql-db-dot"></span>
      <span class="sql-db-label">SQL Server: <strong>${info?.database || 'TechStoreDB'}</strong> (${info?.totalProducts || 0} SP)</span>
    `;
  } else {
    badge.className = 'sql-db-badge offline';
    badge.title = 'Chưa kết nối Backend SQL Server. Đang sử dụng chế độ lưu trữ LocalStorage.';
    badge.innerHTML = `
      <span class="sql-db-dot offline"></span>
      <span class="sql-db-label">Offline (LocalStorage)</span>
    `;
  }
}

// 3. API Sản Phẩm (Products)
async function apiGetProducts(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const url = `${API_CONFIG.baseURL}/products${query ? '?' + query : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network error');
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn('API getProducts không khả dụng, dùng LocalStorage:', err);
    return null;
  }
}

async function apiCreateProduct(product) {
  try {
    const res = await fetch(`${API_CONFIG.baseURL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    return await res.json();
  } catch (err) {
    console.error('API createProduct lỗi:', err);
    return { success: false, error: err.message };
  }
}

async function apiUpdateProduct(id, product) {
  try {
    const res = await fetch(`${API_CONFIG.baseURL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    return await res.json();
  } catch (err) {
    console.error('API updateProduct lỗi:', err);
    return { success: false, error: err.message };
  }
}

async function apiDeleteProduct(id) {
  try {
    const res = await fetch(`${API_CONFIG.baseURL}/products/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  } catch (err) {
    console.error('API deleteProduct lỗi:', err);
    return { success: false, error: err.message };
  }
}

async function apiResetProducts() {
  try {
    const res = await fetch(`${API_CONFIG.baseURL}/products/reset`, {
      method: 'POST'
    });
    return await res.json();
  } catch (err) {
    console.error('API resetProducts lỗi:', err);
    return { success: false, error: err.message };
  }
}

// 4. API Đơn Hàng (Orders)
async function apiCreateOrder(order) {
  try {
    const res = await fetch(`${API_CONFIG.baseURL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    return await res.json();
  } catch (err) {
    console.warn('API createOrder lỗi, lưu tạm offline:', err);
    return { success: false, error: err.message };
  }
}

async function apiGetOrders() {
  try {
    const res = await fetch(`${API_CONFIG.baseURL}/orders`);
    if (!res.ok) throw new Error('Network error');
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn('API getOrders lỗi:', err);
    return null;
  }
}

async function apiUpdateOrderStatus(id, status) {
  try {
    const res = await fetch(`${API_CONFIG.baseURL}/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// 5. API Thống Kê (Dashboard Stats)
async function apiGetStats() {
  try {
    const res = await fetch(`${API_CONFIG.baseURL}/stats`);
    if (!res.ok) throw new Error('Network error');
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    return null;
  }
}

// Tự động kiểm tra kết nối khi nạp trang
document.addEventListener('DOMContentLoaded', () => {
  checkDatabaseConnection();
  // Kiểm tra định kỳ mỗi 30 giây
  setInterval(checkDatabaseConnection, 30000);
});
