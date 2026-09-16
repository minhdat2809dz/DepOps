/**
 * products.js - Quản lý và lưu trữ dữ liệu sản phẩm mẫu cho web bán hàng TechStore
 * Hỗ trợ lưu trữ ngoại tuyến (offline) qua LocalStorage và đồng bộ 2 chiều với Admin
 */

const PRODUCTS_STORAGE_KEY = 'techstore_products_data';

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "iPhone 15 Pro Max 256GB",
    category: "phone",
    categoryName: "Điện thoại",
    price: 29990000,
    oldPrice: 34990000,
    rating: 4.9,
    reviewsCount: 128,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80",
    badge: "Bán chạy",
    description: "Khung viền Titan chuẩn hàng không vũ trụ siêu nhẹ và bền. Chip Apple A17 Pro đem lại hiệu năng đồ họa đột phá. Cụm camera 48MP zoom quang học 5x sắc nét đỉnh cao."
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra 5G",
    category: "phone",
    categoryName: "Điện thoại",
    price: 28490000,
    oldPrice: 31990000,
    rating: 4.8,
    reviewsCount: 94,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80",
    badge: "Mới ra mắt",
    description: "Tích hợp quyền năng Galaxy AI vượt bậc, vi xử lý Snapdragon 8 Gen 3 for Galaxy mạnh mẽ, bút S-Pen tiện dụng và camera siêu cảm biến zoom quang học AI 100x."
  },
  {
    id: 3,
    name: "MacBook Air 15 inch M3 16GB",
    category: "laptop",
    categoryName: "Laptop",
    price: 32990000,
    oldPrice: 36990000,
    rating: 4.9,
    reviewsCount: 76,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
    badge: "Hot Deal",
    description: "Thiết kế siêu mỏng nhẹ chỉ 11.5mm, màn hình Liquid Retina 15.3 inch rực rỡ, thời lượng pin ấn tượng lên tới 18 giờ liên tục."
  },
  {
    id: 4,
    name: "Laptop Gaming ASUS ROG Zephyrus G16",
    category: "laptop",
    categoryName: "Laptop",
    price: 45990000,
    oldPrice: 49990000,
    rating: 4.7,
    reviewsCount: 42,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80",
    badge: "Gaming",
    description: "Sức mạnh từ Intel Core Ultra 9 và card đồ họa NVIDIA GeForce RTX 4070, màn hình OLED ROG Nebula 2.5K 240Hz siêu mượt mà."
  },
  {
    id: 5,
    name: "Tai nghe chống ồn Sony WH-1000XM5",
    category: "audio",
    categoryName: "Âm thanh",
    price: 7490000,
    oldPrice: 8990000,
    rating: 4.9,
    reviewsCount: 215,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    badge: "-17%",
    description: "Công nghệ chống ồn chủ động đỉnh cao số 1 thị trường với hai bộ xử lý và 8 micro, chất âm Hi-Res chuẩn phòng thu, pin 30 giờ."
  },
  {
    id: 6,
    name: "Loa Bluetooth Marshall Acton III",
    category: "audio",
    categoryName: "Âm thanh",
    price: 6790000,
    oldPrice: 7290000,
    rating: 4.8,
    reviewsCount: 68,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80",
    badge: "Cổ điển",
    description: "Âm thanh không gian tràn ngập căn phòng với củ loa kép hướng ra ngoài, thiết kế cổ điển phong cách hoàng gia đặc trưng của Marshall."
  },
  {
    id: 7,
    name: "Apple Watch Series 9 GPS 45mm",
    category: "watch",
    categoryName: "Đồng hồ",
    price: 10490000,
    oldPrice: 11990000,
    rating: 4.8,
    reviewsCount: 110,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80",
    badge: "Bán chạy",
    description: "Chip S9 SiP đột phá, thao tác chạm hai lần (Double Tap) diệu kỳ không cần chạm màn hình, theo dõi nồng độ oxy trong máu và điện tâm đồ ECG."
  },
  {
    id: 8,
    name: "Đồng hồ Garmin Fenix 7 Pro Solar",
    category: "watch",
    categoryName: "Đồng hồ",
    price: 19990000,
    oldPrice: 21990000,
    rating: 4.9,
    reviewsCount: 35,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    badge: "Thể thao",
    description: "Kính sạc năng lượng mặt trời siêu bền, đèn pin LED tích hợp, định vị đa băng tần GNSS chính xác tuyệt đối, thời lượng pin lên đến hàng tuần."
  }
];

// Lấy danh sách sản phẩm từ LocalStorage
function getStoredProducts() {
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Lỗi khi đọc danh sách sản phẩm từ LocalStorage:', e);
  }

  // Khởi tạo lần đầu
  saveStoredProducts(DEFAULT_PRODUCTS);
  return [...DEFAULT_PRODUCTS];
}

// Lưu danh sách sản phẩm vào LocalStorage
function saveStoredProducts(newList) {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(newList));
    products = newList;
  } catch (e) {
    console.error('Lỗi khi ghi danh sách sản phẩm vào LocalStorage:', e);
  }
}

// Khôi phục về danh sách 8 sản phẩm mẫu gốc
function resetDefaultProducts() {
  saveStoredProducts(DEFAULT_PRODUCTS);
  return [...DEFAULT_PRODUCTS];
}

// Mảng products sử dụng toàn cục
let products = getStoredProducts();

// Hàm định dạng tiền tệ VNĐ: ví dụ 29990000 -> 29.990.000 đ
function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount || 0);
}
