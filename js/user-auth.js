/**
 * user-auth.js - Quản lý Đăng Ký, Đăng Nhập, Hạng VIP Thành Viên và Đơn Hàng TechStore
 * Hỗ trợ lưu trữ ngoại tuyến (offline) bằng LocalStorage
 */

const USERS_STORAGE_KEY = 'techstore_users_list';
const CURRENT_USER_KEY = 'techstore_current_user';
const MASTER_ORDERS_KEY = 'techstore_master_orders';

// Khởi tạo tài khoản mẫu ban đầu nếu chưa có
const DEFAULT_DEMO_USERS = [
  {
    id: 1001,
    fullname: "Nguyễn Văn Khách (VIP Pro)",
    email: "khachhang@gmail.com",
    phone: "0912345678",
    password: "123456",
    vipPoints: 850,
    vipTier: "Diamond",
    totalSpent: 85000000,
    createdAt: "2026-01-01T00:00:00.000Z"
  }
];

// Lấy danh sách tài khoản đã đăng ký
function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Lỗi khi đọc danh sách tài khoản:', e);
  }
  // Khởi tạo tài khoản mẫu
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_DEMO_USERS));
  return [...DEFAULT_DEMO_USERS];
}

// Lưu danh sách tài khoản
function saveRegisteredUsers(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Lỗi khi lưu danh sách tài khoản:', e);
  }
}

// Lấy thông tin người dùng đang đăng nhập hiện tại
function getCurrentUser() {
  try {
    const sessionData = sessionStorage.getItem(CURRENT_USER_KEY);
    if (sessionData) return JSON.parse(sessionData);

    const localData = localStorage.getItem(CURRENT_USER_KEY);
    if (localData) return JSON.parse(localData);
  } catch (e) {
    console.error('Lỗi khi đọc thông tin user hiện tại:', e);
  }
  return null;
}

// Lưu phiên đăng nhập người dùng
function setCurrentUser(user, remember = false) {
  try {
    const userJson = JSON.stringify(user);
    if (remember) {
      localStorage.setItem(CURRENT_USER_KEY, userJson);
      sessionStorage.setItem(CURRENT_USER_KEY, userJson);
    } else {
      sessionStorage.setItem(CURRENT_USER_KEY, userJson);
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (e) {
    console.error('Lỗi khi lưu phiên đăng nhập user:', e);
  }
}

// Tính hạng VIP
function calculateVIPTier(totalSpent = 0) {
  if (totalSpent >= 50000000) {
    return { name: "VIP Diamond", code: "diamond", color: "#06b6d4", icon: "💎", perk: "Giảm 5% mọi đơn hàng + Quà sinh nhật VIP" };
  } else if (totalSpent >= 20000000) {
    return { name: "VIP Gold", code: "gold", color: "#f59e0b", icon: "👑", perk: "Freeship trọn đời + Ưu đãi độc quyền" };
  } else {
    return { name: "Thành Viên Silver", code: "silver", color: "#94a3b8", icon: "⭐", perk: "Tích điểm 1% đổi quà công nghệ" };
  }
}

// Đăng ký tài khoản mới
function registerUser(fullname, email, phone, password) {
  const users = getRegisteredUsers();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone = phone.trim();

  // Kiểm tra trùng email hoặc số điện thoại
  const existingUser = users.find(u => 
    u.email.toLowerCase() === cleanEmail || u.phone === cleanPhone
  );

  if (existingUser) {
    return {
      success: false,
      message: 'Email hoặc Số điện thoại này đã được đăng ký trước đó!'
    };
  }

  const newUser = {
    id: Date.now(),
    fullname: fullname.trim(),
    email: cleanEmail,
    phone: cleanPhone,
    password: password.trim(),
    vipPoints: 50, // Thưởng ngay 50 điểm khi đăng ký mới
    vipTier: "Silver",
    totalSpent: 0,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveRegisteredUsers(users);

  // Tự động đăng nhập ngay sau khi đăng ký
  const safeUser = {
    id: newUser.id,
    fullname: newUser.fullname,
    email: newUser.email,
    phone: newUser.phone,
    vipPoints: newUser.vipPoints,
    vipTier: newUser.vipTier,
    totalSpent: newUser.totalSpent
  };
  setCurrentUser(safeUser, true);

  return {
    success: true,
    user: safeUser,
    message: 'Chào mừng bạn gia nhập câu lạc bộ thành viên VIP TechStore! Tặng 50 điểm thưởng khởi đầu.'
  };
}

// Đăng nhập người dùng (hỗ trợ cả tài khoản Khách hàng lẫn Admin)
function loginUser(account, password, remember = false) {
  const users = getRegisteredUsers();
  const cleanAccount = account.trim().toLowerCase();
  const cleanPass = password.trim();

  // 1. Nhận diện nếu đăng nhập bằng tài khoản Quản trị viên
  if (cleanAccount === 'admin' && (cleanPass === '123' || cleanPass === 'admin123')) {
    if (typeof loginAdmin === 'function') {
      loginAdmin('admin', cleanPass, remember);
    }
    const adminUser = {
      id: 0,
      fullname: "Quản Trị Viên VIP",
      email: "admin@techstore.vn",
      phone: "0999999999",
      isAdmin: true,
      vipTier: "Diamond",
      vipPoints: 9999
    };
    setCurrentUser(adminUser, remember);
    return {
      success: true,
      role: 'admin',
      user: adminUser,
      message: 'Đăng nhập Quản Trị Viên thành công!'
    };
  }

  // 2. Nhận diện tài khoản Khách hàng
  const user = users.find(u => 
    (u.email.toLowerCase() === cleanAccount || u.phone === cleanAccount) && 
    u.password === cleanPass
  );

  if (!user) {
    return {
      success: false,
      message: 'Tài khoản (Email/SĐT) hoặc mật khẩu không chính xác!'
    };
  }

  const safeUser = {
    id: user.id,
    fullname: user.fullname,
    email: user.email,
    phone: user.phone,
    vipPoints: user.vipPoints || 0,
    vipTier: user.vipTier || "Silver",
    totalSpent: user.totalSpent || 0,
    isAdmin: false
  };

  setCurrentUser(safeUser, remember);

  return {
    success: true,
    role: 'user',
    user: safeUser,
    message: `Chào mừng ${safeUser.fullname} trở lại TechStore!`
  };
}

// Đăng xuất người dùng
function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
  sessionStorage.removeItem(CURRENT_USER_KEY);
  updateHeaderUserUI();
  showToast('Đã đăng xuất tài khoản thành công!', 'info');
}

// Quản lý Lịch sử đơn hàng của người dùng
function getUserOrdersKey(userId) {
  return `techstore_orders_user_${userId}`;
}

function getUserOrders(userId) {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(getUserOrdersKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Lỗi khi đọc lịch sử đơn hàng:', e);
    return [];
  }
}

// Lấy toàn bộ đơn hàng của toàn hệ thống (dành cho Admin)
function getAllMasterOrders() {
  try {
    const raw = localStorage.getItem(MASTER_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveMasterOrders(orders) {
  try {
    localStorage.setItem(MASTER_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Lỗi khi lưu master orders:', e);
  }
}

function saveUserOrder(order) {
  const currentUser = getCurrentUser();
  const targetUserId = currentUser ? currentUser.id : 'guest';
  const userKey = getUserOrdersKey(targetUserId);

  try {
    // 1. Lưu vào danh sách đơn của user
    const rawUserOrders = localStorage.getItem(userKey);
    const userOrders = rawUserOrders ? JSON.parse(rawUserOrders) : [];
    userOrders.unshift(order);
    localStorage.setItem(userKey, JSON.stringify(userOrders));

    // 2. Lưu vào Master Orders để Admin quản lý
    const masterOrders = getAllMasterOrders();
    masterOrders.unshift({
      ...order,
      userId: targetUserId,
      userEmail: currentUser ? currentUser.email : 'Khách vãng lai'
    });
    saveMasterOrders(masterOrders);

    // 2b. Đồng bộ trực tiếp vào SQL Server (TechStoreDB.dbo.Orders)
    if (typeof apiCreateOrder === 'function') {
      apiCreateOrder({
        orderCode: order.orderCode || order.id || ('TECH-' + Date.now()),
        customerName: order.customerName || 'Khách Hàng',
        customerPhone: order.customerPhone || order.phone || '0900000000',
        customerAddress: order.customerAddress || order.address || 'Hà Nội',
        paymentMethod: order.paymentMethod || order.payment || 'COD',
        note: order.note || '',
        items: order.items || [],
        subtotal: order.subtotal || order.total || 0,
        discount: order.discount || 0,
        total: order.total || 0
      }).then(res => {
        if (res && res.success) {
          console.log('✅ Đơn hàng đã được lưu thành công vào SQL Server (TechStoreDB)!');
        }
      }).catch(err => {
        console.warn('Lưu đơn vào SQL Server lỗi:', err);
      });
    }

    // 3. Cộng điểm tích lũy VIP nếu có đăng nhập
    if (currentUser && currentUser.id !== 0) {
      const earnedPoints = Math.round(order.total / 10000); // 10k = 1 điểm
      const users = getRegisteredUsers();
      const userIndex = users.findIndex(u => u.id === currentUser.id);

      if (userIndex > -1) {
        users[userIndex].totalSpent = (users[userIndex].totalSpent || 0) + order.total;
        users[userIndex].vipPoints = (users[userIndex].vipPoints || 0) + earnedPoints;
        
        // Cập nhật hạng
        const newTier = calculateVIPTier(users[userIndex].totalSpent);
        users[userIndex].vipTier = newTier.name;
        
        saveRegisteredUsers(users);

        currentUser.totalSpent = users[userIndex].totalSpent;
        currentUser.vipPoints = users[userIndex].vipPoints;
        currentUser.vipTier = users[userIndex].vipTier;
        setCurrentUser(currentUser, true);
      }
    }
  } catch (e) {
    console.error('Lỗi khi lưu đơn hàng:', e);
  }
}

// Cập nhật hiển thị Trạng thái người dùng trên Header
function updateHeaderUserUI() {
  const userBtnWrap = document.getElementById('user-header-wrap');
  if (!userBtnWrap) return;

  const currentUser = getCurrentUser();

  if (currentUser) {
    const firstLetter = currentUser.fullname ? currentUser.fullname.charAt(0).toUpperCase() : 'U';
    const tierInfo = calculateVIPTier(currentUser.totalSpent || 0);

    userBtnWrap.innerHTML = `
      <div class="user-menu-dropdown-wrapper">
        <button id="user-avatar-btn" class="user-avatar-btn" onclick="toggleUserMenu(event)">
          <div class="user-avatar-badge">${firstLetter}</div>
          <div class="user-header-text">
            <span class="user-display-name">${currentUser.fullname}</span>
            <span class="user-vip-pill" style="border-color: ${tierInfo.color}; color: ${tierInfo.color};">
              ${tierInfo.icon} ${currentUser.vipTier || tierInfo.name}
            </span>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        <div id="user-dropdown-menu" class="user-dropdown-menu">
          <div class="user-dropdown-header">
            <strong>${currentUser.fullname}</strong>
            <small>${currentUser.email}</small>
            <div class="user-vip-summary-box">
              <span>Hạng: <strong>${currentUser.vipTier || tierInfo.name}</strong></span>
              <span>Điểm thưởng: <strong class="text-warning">${currentUser.vipPoints || 0} pts</strong></span>
            </div>
          </div>
          ${currentUser.isAdmin ? `
          <a href="admin.html" class="user-dropdown-item" style="color: var(--primary); font-weight: 700;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
            Trang Quản Trị (Admin)
          </a>` : ''}
          <a href="#!" class="user-dropdown-item" onclick="openProfileModal(event)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Thông tin tài khoản & VIP
          </a>
          <a href="#!" class="user-dropdown-item" onclick="openOrderHistoryModal(event)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            Lịch sử đơn hàng
          </a>
          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 6px 0;">
          <a href="#!" class="user-dropdown-item text-danger" onclick="logoutUser(); return false;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Đăng xuất
          </a>
        </div>
      </div>
    `;
  } else {
    userBtnWrap.innerHTML = `
      <button class="btn btn-secondary user-auth-header-btn" onclick="openAuthModal('login')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>Đăng nhập VIP</span>
      </button>
    `;
  }
}

// Đóng mở User dropdown menu
function toggleUserMenu(e) {
  e.stopPropagation();
  const menu = document.getElementById('user-dropdown-menu');
  if (menu) {
    menu.classList.toggle('show');
  }
}

// Tự động đóng menu khi nhấp ra ngoài
document.addEventListener('click', (e) => {
  const menu = document.getElementById('user-dropdown-menu');
  if (menu && !menu.contains(e.target)) {
    menu.classList.remove('show');
  }
});
