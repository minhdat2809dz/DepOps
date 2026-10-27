const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { getPool } = require('./config/db');
const productsRoutes = require('./routes/products');
const categoriesRoutes = require('./routes/categories');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const statsRoutes = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', statsRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🚀 TechStore Backend API is running!',
    database: 'SQL Server (TechStoreDB @ SQLEXPRESS2025)',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      categories: '/api/categories',
      orders: '/api/orders',
      stats: '/api/stats',
      auth: '/api/auth'
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Lỗi hệ thống máy chủ',
    error: err.message
  });
});

// Start Server
app.listen(PORT, async () => {
  console.log(`=======================================================`);
  console.log(`🚀 TechStore Backend API đang chạy tại: http://localhost:${PORT}`);
  console.log(`📊 Kiểm tra trạng thái DB: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);

  try {
    await getPool();
  } catch (err) {
    console.error('⚠️ Chưa thể kết nối ngay tới SQL Server:', err.message);
  }
});
