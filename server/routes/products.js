const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../config/db');
const { mapProductFromDb } = require('../utils/productMapper');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    const pool = await getPool();

    let query = 'SELECT * FROM dbo.Products WHERE 1=1';
    const request = pool.request();

    if (category && category !== 'all') {
      query += ' AND Category = @category';
      request.input('category', sql.NVarChar(50), category);
    }

    if (search && search.trim() !== '') {
      query += ' AND (Name LIKE @search OR Brand LIKE @search OR Description LIKE @search)';
      request.input('search', sql.NVarChar(255), `%${search.trim()}%`);
    }

    if (sort === 'price-asc') {
      query += ' ORDER BY Price ASC';
    } else if (sort === 'price-desc') {
      query += ' ORDER BY Price DESC';
    } else if (sort === 'rating') {
      query += ' ORDER BY Rating DESC, ReviewsCount DESC';
    } else {
      query += ' ORDER BY Id ASC';
    }

    const result = await request.query(query);
    const products = result.recordset.map(mapProductFromDb);

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy danh sách sản phẩm', error: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM dbo.Products WHERE Id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }

    res.json({ success: true, data: mapProductFromDb(result.recordset[0]) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ', error: err.message });
  }
});

// POST /api/products (Thêm mới)
router.post('/', async (req, res) => {
  try {
    const p = req.body;
    if (!p.name || !p.price || !p.category) {
      return res.status(400).json({ success: false, message: 'Tên, giá và danh mục là bắt buộc' });
    }

    const pool = await getPool();
    const request = pool.request();

    request.input('name', sql.NVarChar(255), p.name);
    request.input('brand', sql.NVarChar(100), p.brand || '');
    request.input('category', sql.NVarChar(50), p.category);
    request.input('categoryName', sql.NVarChar(100), p.categoryName || '');
    request.input('price', sql.BigInt, p.price);
    request.input('oldPrice', sql.BigInt, p.oldPrice || null);
    request.input('rating', sql.Decimal(3, 2), p.rating || 5.0);
    request.input('reviewsCount', sql.Int, p.reviewsCount || 0);
    request.input('image', sql.NVarChar(sql.MAX), p.image || '');
    request.input('badge', sql.NVarChar(100), p.badge || '');
    request.input('description', sql.NVarChar(sql.MAX), p.description || '');
    request.input('stock', sql.NVarChar(100), p.stock || 'Sẵn hàng');
    request.input('flashSale', sql.Bit, p.flashSale ? 1 : 0);
    request.input('flashDiscount', sql.Int, p.flashDiscount || 0);
    request.input('soldCount', sql.Int, p.soldCount || 0);
    request.input('gift', sql.NVarChar(500), p.gift || '');
    request.input('specsJson', sql.NVarChar(sql.MAX), p.specs ? JSON.stringify(p.specs) : null);
    request.input('colorsJson', sql.NVarChar(sql.MAX), p.colors ? JSON.stringify(p.colors) : null);
    request.input('storageOptionsJson', sql.NVarChar(sql.MAX), p.storageOptions ? JSON.stringify(p.storageOptions) : null);
    request.input('galleryJson', sql.NVarChar(sql.MAX), p.gallery ? JSON.stringify(p.gallery) : (p.image ? JSON.stringify([p.image]) : null));
    request.input('reviewsJson', sql.NVarChar(sql.MAX), p.reviews ? JSON.stringify(p.reviews) : null);

    const query = `
      INSERT INTO dbo.Products (
        Name, Brand, Category, CategoryName, Price, OldPrice, Rating, ReviewsCount,
        Image, Badge, Description, Stock, FlashSale, FlashDiscount, SoldCount, Gift,
        SpecsJson, ColorsJson, StorageOptionsJson, GalleryJson, ReviewsJson
      ) OUTPUT INSERTED.* VALUES (
        @name, @brand, @category, @categoryName, @price, @oldPrice, @rating, @reviewsCount,
        @image, @badge, @description, @stock, @flashSale, @flashDiscount, @soldCount, @gift,
        @specsJson, @colorsJson, @storageOptionsJson, @galleryJson, @reviewsJson
      );
    `;

    const result = await request.query(query);
    const newProduct = mapProductFromDb(result.recordset[0]);

    res.status(201).json({
      success: true,
      message: 'Thêm sản phẩm thành công vào SQL Server',
      data: newProduct
    });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ success: false, message: 'Lỗi tạo sản phẩm', error: err.message });
  }
});

// PUT /api/products/:id (Cập nhật)
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const p = req.body;
    const pool = await getPool();

    const request = pool.request();
    request.input('id', sql.Int, id);
    request.input('name', sql.NVarChar(255), p.name);
    request.input('brand', sql.NVarChar(100), p.brand || '');
    request.input('category', sql.NVarChar(50), p.category);
    request.input('categoryName', sql.NVarChar(100), p.categoryName || '');
    request.input('price', sql.BigInt, p.price);
    request.input('oldPrice', sql.BigInt, p.oldPrice || null);
    request.input('rating', sql.Decimal(3, 2), p.rating || 5.0);
    request.input('reviewsCount', sql.Int, p.reviewsCount || 0);
    request.input('image', sql.NVarChar(sql.MAX), p.image || '');
    request.input('badge', sql.NVarChar(100), p.badge || '');
    request.input('description', sql.NVarChar(sql.MAX), p.description || '');
    request.input('stock', sql.NVarChar(100), p.stock || 'Sẵn hàng');
    request.input('flashSale', sql.Bit, p.flashSale ? 1 : 0);
    request.input('flashDiscount', sql.Int, p.flashDiscount || 0);
    request.input('soldCount', sql.Int, p.soldCount || 0);
    request.input('gift', sql.NVarChar(500), p.gift || '');
    request.input('specsJson', sql.NVarChar(sql.MAX), p.specs ? JSON.stringify(p.specs) : null);
    request.input('colorsJson', sql.NVarChar(sql.MAX), p.colors ? JSON.stringify(p.colors) : null);
    request.input('storageOptionsJson', sql.NVarChar(sql.MAX), p.storageOptions ? JSON.stringify(p.storageOptions) : null);
    request.input('galleryJson', sql.NVarChar(sql.MAX), p.gallery ? JSON.stringify(p.gallery) : null);
    request.input('reviewsJson', sql.NVarChar(sql.MAX), p.reviews ? JSON.stringify(p.reviews) : null);

    const query = `
      UPDATE dbo.Products SET
        Name = @name,
        Brand = @brand,
        Category = @category,
        CategoryName = @categoryName,
        Price = @price,
        OldPrice = @oldPrice,
        Rating = @rating,
        ReviewsCount = @reviewsCount,
        Image = @image,
        Badge = @badge,
        Description = @description,
        Stock = @stock,
        FlashSale = @flashSale,
        FlashDiscount = @flashDiscount,
        SoldCount = @soldCount,
        Gift = @gift,
        SpecsJson = @specsJson,
        ColorsJson = @colorsJson,
        StorageOptionsJson = @storageOptionsJson,
        GalleryJson = @galleryJson,
        ReviewsJson = @reviewsJson,
        UpdatedAt = GETDATE()
      OUTPUT INSERTED.*
      WHERE Id = @id;
    `;

    const result = await request.query(query);
    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm để cập nhật' });
    }

    res.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      data: mapProductFromDb(result.recordset[0])
    });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ success: false, message: 'Lỗi cập nhật sản phẩm', error: err.message });
  }
});

// DELETE /api/products/:id (Xóa)
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const pool = await getPool();

    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM dbo.Products WHERE Id = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }

    res.json({ success: true, message: `Đã xóa sản phẩm ID ${id} khỏi SQL Server` });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ success: false, message: 'Lỗi xóa sản phẩm', error: err.message });
  }
});

// POST /api/products/reset (Khôi phục mẫu 38 sản phẩm)
router.post('/reset', async (req, res) => {
  try {
    const productsFilePath = path.join(__dirname, '..', '..', 'js', 'products.js');
    let code = fs.readFileSync(productsFilePath, 'utf8');
    code = code.replace('const DEFAULT_PRODUCTS =', 'this.DEFAULT_PRODUCTS =');

    const sandbox = {
      localStorage: { getItem: () => null, setItem: () => {} },
      sessionStorage: { getItem: () => null, setItem: () => {} },
      window: {}
    };
    vm.runInNewContext(code, sandbox);
    const defaultProducts = sandbox.DEFAULT_PRODUCTS;

    const pool = await getPool();
    await pool.request().query('DELETE FROM dbo.Products; DBCC CHECKIDENT (\'dbo.Products\', RESEED, 0);');

    for (const p of defaultProducts) {
      const request = pool.request();
      request.input('id', sql.Int, p.id);
      request.input('name', sql.NVarChar(255), p.name);
      request.input('brand', sql.NVarChar(100), p.brand || null);
      request.input('category', sql.NVarChar(50), p.category);
      request.input('categoryName', sql.NVarChar(100), p.categoryName || null);
      request.input('price', sql.BigInt, p.price || 0);
      request.input('oldPrice', sql.BigInt, p.oldPrice || null);
      request.input('rating', sql.Decimal(3, 2), p.rating || 5.0);
      request.input('reviewsCount', sql.Int, p.reviewsCount || 0);
      request.input('image', sql.NVarChar(sql.MAX), p.image || null);
      request.input('badge', sql.NVarChar(100), p.badge || null);
      request.input('description', sql.NVarChar(sql.MAX), p.description || null);
      request.input('stock', sql.NVarChar(100), p.stock || null);
      request.input('flashSale', sql.Bit, p.flashSale ? 1 : 0);
      request.input('flashDiscount', sql.Int, p.flashDiscount || 0);
      request.input('soldCount', sql.Int, p.soldCount || 0);
      request.input('gift', sql.NVarChar(500), p.gift || null);
      request.input('specsJson', sql.NVarChar(sql.MAX), p.specs ? JSON.stringify(p.specs) : null);
      request.input('colorsJson', sql.NVarChar(sql.MAX), p.colors ? JSON.stringify(p.colors) : null);
      request.input('storageOptionsJson', sql.NVarChar(sql.MAX), p.storageOptions ? JSON.stringify(p.storageOptions) : null);
      request.input('galleryJson', sql.NVarChar(sql.MAX), p.gallery ? JSON.stringify(p.gallery) : null);
      request.input('reviewsJson', sql.NVarChar(sql.MAX), p.reviews ? JSON.stringify(p.reviews) : null);

      await request.query(`
        SET IDENTITY_INSERT dbo.Products ON;
        INSERT INTO dbo.Products (
          Id, Name, Brand, Category, CategoryName, Price, OldPrice, Rating, ReviewsCount,
          Image, Badge, Description, Stock, FlashSale, FlashDiscount, SoldCount, Gift,
          SpecsJson, ColorsJson, StorageOptionsJson, GalleryJson, ReviewsJson
        ) VALUES (
          @id, @name, @brand, @category, @categoryName, @price, @oldPrice, @rating, @reviewsCount,
          @image, @badge, @description, @stock, @flashSale, @flashDiscount, @soldCount, @gift,
          @specsJson, @colorsJson, @storageOptionsJson, @galleryJson, @reviewsJson
        );
        SET IDENTITY_INSERT dbo.Products OFF;
      `);
    }

    const result = await pool.request().query('SELECT * FROM dbo.Products ORDER BY Id ASC');
    const products = result.recordset.map(mapProductFromDb);

    res.json({
      success: true,
      message: 'Đã khôi phục 38 sản phẩm mẫu VIP PRO trong SQL Server',
      count: products.length,
      data: products
    });
  } catch (err) {
    console.error('Error resetting products:', err);
    res.status(500).json({ success: false, message: 'Lỗi khôi phục mẫu', error: err.message });
  }
});

module.exports = router;
