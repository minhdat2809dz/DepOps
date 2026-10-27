const fs = require('fs');
const path = require('path');
const vm = require('vm');
const sql = require('mssql');

const config = {
  user: 'techstore_user',
  password: 'TechStore@2026',
  server: 'localhost',
  database: 'TechStoreDB',
  options: {
    instanceName: 'SQLEXPRESS2025',
    encrypt: false,
    trustServerCertificate: true
  }
};

async function seed() {
  console.log('Extracting DEFAULT_PRODUCTS from js/products.js...');
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
    throw new Error('Failed to load DEFAULT_PRODUCTS from js/products.js');
  }

  console.log(`Loaded ${products.length} products to seed.`);

  const pool = await sql.connect(config);
  await pool.request().query('DELETE FROM dbo.Products; DBCC CHECKIDENT (\'dbo.Products\', RESEED, 0);');

  for (const p of products) {
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

  const countResult = await pool.request().query('SELECT COUNT(*) AS total FROM dbo.Products;');
  console.log(`SUCCESS: Seeded ${countResult.recordset[0].total} products into TechStoreDB.dbo.Products!`);

  await pool.close();
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
