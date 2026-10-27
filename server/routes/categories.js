const express = require('express');
const router = express.Router();
const { getPool } = require('../config/db');

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM dbo.Categories ORDER BY DisplayOrder ASC');
    res.json({
      success: true,
      data: result.recordset
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi lấy danh mục', error: err.message });
  }
});

module.exports = router;
