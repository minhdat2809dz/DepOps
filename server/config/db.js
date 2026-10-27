const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER || 'techstore_user',
  password: process.env.DB_PASSWORD || 'TechStore@2026',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'TechStoreDB',
  options: {
    instanceName: process.env.DB_INSTANCE || 'SQLEXPRESS2025',
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let poolPromise;

function getPool() {
  if (!poolPromise) {
    poolPromise = sql.connect(config)
      .then(pool => {
        console.log('✅ Đã kết nối thành công tới SQL Server (TechStoreDB @ SQLEXPRESS2025)!');
        return pool;
      })
      .catch(err => {
        console.error('❌ Lỗi kết nối SQL Server:', err);
        poolPromise = null;
        throw err;
      });
  }
  return poolPromise;
}

module.exports = {
  sql,
  getPool
};
