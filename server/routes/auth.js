const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../config/db');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tên đăng nhập và mật khẩu' });
    }

    const pool = await getPool();
    const result = await pool.request()
      .input('username', sql.NVarChar(50), username.trim().toLowerCase())
      .query('SELECT * FROM dbo.Users WHERE LOWER(Username) = @username');

    if (result.recordset.length === 0) {
      return res.status(401).json({ success: false, message: 'Tài khoản không tồn tại' });
    }

    const user = result.recordset[0];
    // Check password (supports demo passwords or direct matches)
    const isMatch = (user.Password === password.trim()) ||
      (user.Username === 'admin' && (password === '123' || password === 'admin123'));

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Mật khẩu không chính xác' });
    }

    res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      user: {
        id: user.Id,
        username: user.Username,
        fullName: user.FullName,
        email: user.Email,
        role: user.Role
      }
    });
  } catch (err) {
    console.error('Error in login:', err);
    res.status(500).json({ success: false, message: 'Lỗi đăng nhập', error: err.message });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, password, fullName, email, phone } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Tên đăng nhập và mật khẩu là bắt buộc' });
    }

    const pool = await getPool();

    // Check existing
    const check = await pool.request()
      .input('username', sql.NVarChar(50), username.trim().toLowerCase())
      .query('SELECT Id FROM dbo.Users WHERE LOWER(Username) = @username');

    if (check.recordset.length > 0) {
      return res.status(409).json({ success: false, message: 'Tên đăng nhập đã tồn tại' });
    }

    const result = await pool.request()
      .input('username', sql.NVarChar(50), username.trim().toLowerCase())
      .input('password', sql.NVarChar(255), password.trim())
      .input('fullName', sql.NVarChar(100), fullName || username)
      .input('email', sql.NVarChar(100), email || '')
      .input('phone', sql.NVarChar(20), phone || '')
      .input('role', sql.NVarChar(20), 'user')
      .query(`
        INSERT INTO dbo.Users (Username, Password, FullName, Email, Phone, Role)
        OUTPUT INSERTED.*
        VALUES (@username, @password, @fullName, @email, @phone, @role)
      `);

    const created = result.recordset[0];
    res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công vào SQL Server',
      user: {
        id: created.Id,
        username: created.Username,
        fullName: created.FullName,
        role: created.Role
      }
    });
  } catch (err) {
    console.error('Error in register:', err);
    res.status(500).json({ success: false, message: 'Lỗi đăng ký tài khoản', error: err.message });
  }
});

module.exports = router;
