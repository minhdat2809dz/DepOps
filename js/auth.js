/**
 * auth.js - Quản lý xác thực đăng nhập Quản trị viên (Admin)
 */

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: '123' // Hoặc admin123
};

const AUTH_STORAGE_KEY = 'techstore_admin_session';

// Kiểm tra xem quản trị viên đã đăng nhập hay chưa
function isAdminLoggedIn() {
  const sessionAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);
  const localAuth = localStorage.getItem(AUTH_STORAGE_KEY);
  return sessionAuth === 'true' || localAuth === 'true';
}

// Thực hiện đăng nhập
function loginAdmin(username, password, remember = false) {
  const user = username.trim().toLowerCase();
  const pass = password.trim();

  // Chấp nhận cả mật khẩu '123' và 'admin123'
  const isMatch = (user === 'admin') && (pass === '123' || pass === 'admin123');

  if (isMatch) {
    if (remember) {
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
    }
    return { success: true };
  } else {
    return { 
      success: false, 
      message: 'Tài khoản hoặc mật khẩu không chính xác! (Mẫu: admin / 123)' 
    };
  }
}

// Đăng xuất
function logoutAdmin() {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(AUTH_STORAGE_KEY);
  window.location.href = 'login.html';
}

// Bảo vệ trang admin (nếu chưa đăng nhập sẽ chuyển hướng về login.html)
function requireAdminAuth() {
  if (!isAdminLoggedIn()) {
    window.location.href = 'login.html';
  }
}
