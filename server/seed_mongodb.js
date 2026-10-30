const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = 'TechStoreDB';

async function seedMongo() {
  console.log('Đang kết nối tới MongoDB...');
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  console.log(`✅ Kết nối thành công tới MongoDB: ${MONGO_URI}`);

  const db = client.db(DB_NAME);

  // 1. Trích xuất 38 sản phẩm mẫu từ js/products.js
  const productsFilePath = path.join(__dirname, '..', 'js', 'products.js');
  let code = fs.readFileSync(productsFilePath, 'utf8');
  code = code.replace('const DEFAULT_PRODUCTS =', 'this.DEFAULT_PRODUCTS =');

  const sandbox = {
    localStorage: { getItem: () => null, setItem: () => {} },
    sessionStorage: { getItem: () => null, setItem: () => {} },
    window: {}
  };
  vm.runInNewContext(code, sandbox);
  const products = sandbox.DEFAULT_PRODUCTS;

  if (!products || !Array.isArray(products) || products.length === 0) {
    throw new Error('Không thể tải DEFAULT_PRODUCTS từ js/products.js');
  }

  // 2. Nạp dữ liệu vào collection "products"
  const productsCol = db.collection('products');
  await productsCol.deleteMany({});
  
  // Format lại dữ liệu cho chuẩn MongoDB document
  const mongoProducts = products.map(p => ({
    ...p,
    createdAt: new Date(),
    updatedAt: new Date()
  }));

  const prodResult = await productsCol.insertMany(mongoProducts);
  console.log(`✅ Đã nạp thành công ${prodResult.insertedCount} sản phẩm vào MongoDB collection 'products'!`);

  // 3. Nạp danh mục vào collection "categories"
  const categoriesCol = db.collection('categories');
  await categoriesCol.deleteMany({});
  const categories = [
    { id: 'all', name: 'Tất Cả Sản Phẩm', icon: 'fa-th-large', displayOrder: 1 },
    { id: 'phone', name: 'Điện Thoại', icon: 'fa-mobile-alt', displayOrder: 2 },
    { id: 'laptop', name: 'Laptop', icon: 'fa-laptop', displayOrder: 3 },
    { id: 'tablet', name: 'Máy Tính Bảng', icon: 'fa-tablet-alt', displayOrder: 4 },
    { id: 'audio', name: 'Âm Thanh', icon: 'fa-headphones', displayOrder: 5 },
    { id: 'watch', name: 'Đồng Hồ', icon: 'fa-clock', displayOrder: 6 },
    { id: 'camera', name: 'Máy Ảnh & Camera', icon: 'fa-camera', displayOrder: 7 },
    { id: 'smarthome', name: 'Nhà Thông Minh', icon: 'fa-home', displayOrder: 8 },
    { id: 'accessories', name: 'Phụ Kiện', icon: 'fa-plug', displayOrder: 9 }
  ];
  await categoriesCol.insertMany(categories);
  console.log(`✅ Đã nạp thành công ${categories.length} danh mục vào collection 'categories'!`);

  // 4. Nạp người dùng vào collection "users"
  const usersCol = db.collection('users');
  await usersCol.deleteMany({});
  const defaultUsers = [
    {
      username: 'admin',
      password: '123',
      fullName: 'Quản Trị Viên VIP',
      email: 'admin@techstore.vn',
      phone: '0988888888',
      role: 'admin',
      createdAt: new Date()
    },
    {
      username: 'user',
      password: '123',
      fullName: 'Khách Hàng Mẫu',
      email: 'khachhang@gmail.com',
      phone: '0912345678',
      role: 'user',
      createdAt: new Date()
    }
  ];
  await usersCol.insertMany(defaultUsers);
  console.log(`✅ Đã nạp thành công tài khoản mẫu vào collection 'users'!`);

  // 5. Nạp đơn hàng mẫu vào collection "orders"
  const ordersCol = db.collection('orders');
  await ordersCol.deleteMany({});
  const sampleOrder = {
    orderCode: 'TECH-100001',
    customerName: 'Phạm Minh Đạt',
    customerPhone: '0987654321',
    customerAddress: 'Hà Nội',
    paymentMethod: 'COD',
    note: 'Đơn hàng khởi tạo kiểm thử trên MongoDB',
    items: [
      { id: 1, name: 'iPhone 16 Pro Max 256GB Titan Sa Mạc', price: 34990000, qty: 1 }
    ],
    subtotal: 34990000,
    discount: 0,
    total: 34990000,
    status: 'Chờ xác nhận',
    createdAt: new Date()
  };
  await ordersCol.insertOne(sampleOrder);
  console.log(`✅ Đã nạp đơn hàng mẫu vào collection 'orders'!`);

  console.log(`\n🎉 HOÀN TẤT: Database '${DB_NAME}' trên MongoDB đã sẵn sàng với đầy đủ dữ liệu!`);
  await client.close();
}

seedMongo().catch(err => {
  console.error('Lỗi khi nạp dữ liệu MongoDB:', err);
  process.exit(1);
});
