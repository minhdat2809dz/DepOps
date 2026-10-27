const express = require('express');
const router = express.Router();
const { getPool } = require('../config/db');

// GET /api/stats
router.get('/stats', async (req, res) => {
  try {
    const pool = await getPool();

    const pStats = await pool.request().query(`
      SELECT 
        COUNT(*) AS totalProducts,
        COUNT(DISTINCT Category) AS totalCategories,
        SUM(CASE WHEN Badge IS NOT NULL AND LEN(Badge) > 0 THEN 1 ELSE 0 END) AS totalBadges,
        AVG(CAST(Price AS FLOAT)) AS avgPrice
      FROM dbo.Products
    `);

    const oStats = await pool.request().query(`
      SELECT 
        COUNT(*) AS totalOrders,
        ISNULL(SUM(Total), 0) AS totalRevenue
      FROM dbo.Orders
    `);

    const p = pStats.recordset[0] || {};
    const o = oStats.recordset[0] || {};

    res.json({
      success: true,
      data: {
        totalProducts: p.totalProducts || 0,
        totalCategories: p.totalCategories || 0,
        totalBadges: p.totalBadges || 0,
        avgPrice: Math.round(p.avgPrice || 0),
        totalOrders: o.totalOrders || 0,
        totalRevenue: Number(o.totalRevenue || 0)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi lấy thống kê', error: err.message });
  }
});

// GET /api/health
router.get('/health', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT DB_NAME() AS db, @@SERVERNAME AS srv, @@VERSION AS ver');
    const countRes = await pool.request().query('SELECT COUNT(*) AS total FROM dbo.Products');

    res.json({
      success: true,
      status: 'Connected',
      database: result.recordset[0].db,
      server: result.recordset[0].srv,
      totalProducts: countRes.recordset[0].total,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 'Disconnected',
      error: err.message
    });
  }
});

module.exports = router;
