const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../config/db');

// GET /api/orders (Dành cho Admin)
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM dbo.Orders ORDER BY CreatedAt DESC');
    const orders = result.recordset.map(row => {
      let items = [];
      try {
        items = JSON.parse(row.ItemsJson);
      } catch {}
      return {
        id: row.Id,
        orderCode: row.OrderCode,
        customerName: row.CustomerName,
        customerPhone: row.CustomerPhone,
        customerAddress: row.CustomerAddress,
        paymentMethod: row.PaymentMethod,
        note: row.Note || '',
        items: items,
        subtotal: Number(row.Subtotal),
        discount: Number(row.Discount),
        total: Number(row.Total),
        status: row.Status,
        createdAt: row.CreatedAt
      };
    });

    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách đơn hàng', error: err.message });
  }
});

// POST /api/orders (Tạo đơn hàng từ Checkout)
router.post('/', async (req, res) => {
  try {
    const o = req.body;
    if (!o.customerName || !o.customerPhone || !o.customerAddress || !o.items || o.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đủ thông tin nhận hàng và sản phẩm' });
    }

    const orderCode = o.orderCode || ('TECH-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 900 + 100));
    const pool = await getPool();
    const request = pool.request();

    request.input('orderCode', sql.NVarChar(50), orderCode);
    request.input('customerName', sql.NVarChar(100), o.customerName);
    request.input('customerPhone', sql.NVarChar(20), o.customerPhone);
    request.input('customerAddress', sql.NVarChar(255), o.customerAddress);
    request.input('paymentMethod', sql.NVarChar(50), o.paymentMethod || 'COD');
    request.input('note', sql.NVarChar(sql.MAX), o.note || '');
    request.input('itemsJson', sql.NVarChar(sql.MAX), JSON.stringify(o.items));
    request.input('subtotal', sql.BigInt, o.subtotal || 0);
    request.input('discount', sql.BigInt, o.discount || 0);
    request.input('total', sql.BigInt, o.total || 0);
    request.input('status', sql.NVarChar(50), 'Chờ xác nhận');

    const query = `
      INSERT INTO dbo.Orders (
        OrderCode, CustomerName, CustomerPhone, CustomerAddress,
        PaymentMethod, Note, ItemsJson, Subtotal, Discount, Total, Status
      ) OUTPUT INSERTED.* VALUES (
        @orderCode, @customerName, @customerPhone, @customerAddress,
        @paymentMethod, @note, @itemsJson, @subtotal, @discount, @total, @status
      );
    `;

    const result = await request.query(query);
    const saved = result.recordset[0];

    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công! Đơn hàng đã được lưu vào SQL Server.',
      data: {
        id: saved.Id,
        orderCode: saved.OrderCode,
        total: Number(saved.Total),
        status: saved.Status
      }
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ success: false, message: 'Lỗi tạo đơn hàng', error: err.message });
  }
});

// PUT /api/orders/:id/status (Cập nhật trạng thái)
router.put('/:id/status', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const pool = await getPool();

    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('status', sql.NVarChar(50), status)
      .query('UPDATE dbo.Orders SET Status = @status WHERE Id = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }

    res.json({ success: true, message: 'Cập nhật trạng thái thành công' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi cập nhật đơn hàng', error: err.message });
  }
});

module.exports = router;
