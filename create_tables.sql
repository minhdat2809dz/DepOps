USE TechStoreDB;
GO

-- 1. Bảng Danh Mục (Categories)
IF OBJECT_ID('dbo.Categories', 'U') IS NOT NULL DROP TABLE dbo.Categories;
CREATE TABLE dbo.Categories (
    Id NVARCHAR(50) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Icon NVARCHAR(50) NULL,
    DisplayOrder INT DEFAULT 0
);

-- 2. Bảng Sản Phẩm (Products)
IF OBJECT_ID('dbo.Products', 'U') IS NOT NULL DROP TABLE dbo.Products;
CREATE TABLE dbo.Products (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL,
    Brand NVARCHAR(100) NULL,
    Category NVARCHAR(50) NOT NULL,
    CategoryName NVARCHAR(100) NULL,
    Price BIGINT NOT NULL,
    OldPrice BIGINT NULL,
    Rating DECIMAL(3,2) DEFAULT 5.0,
    ReviewsCount INT DEFAULT 0,
    Image NVARCHAR(MAX) NULL,
    Badge NVARCHAR(100) NULL,
    Description NVARCHAR(MAX) NULL,
    Stock NVARCHAR(100) NULL,
    FlashSale BIT DEFAULT 0,
    FlashDiscount INT DEFAULT 0,
    SoldCount INT DEFAULT 0,
    Gift NVARCHAR(500) NULL,
    SpecsJson NVARCHAR(MAX) NULL,
    ColorsJson NVARCHAR(MAX) NULL,
    StorageOptionsJson NVARCHAR(MAX) NULL,
    GalleryJson NVARCHAR(MAX) NULL,
    ReviewsJson NVARCHAR(MAX) NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- 3. Bảng Người Dùng (Users)
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL DROP TABLE dbo.Users;
CREATE TABLE dbo.Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) UNIQUE NOT NULL,
    Password NVARCHAR(255) NOT NULL,
    FullName NVARCHAR(100) NULL,
    Email NVARCHAR(100) NULL,
    Phone NVARCHAR(20) NULL,
    Role NVARCHAR(20) DEFAULT 'user', -- 'admin' hoặc 'user'
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- 4. Bảng Đơn Hàng (Orders)
IF OBJECT_ID('dbo.Orders', 'U') IS NOT NULL DROP TABLE dbo.Orders;
CREATE TABLE dbo.Orders (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    OrderCode NVARCHAR(50) UNIQUE NOT NULL,
    CustomerName NVARCHAR(100) NOT NULL,
    CustomerPhone NVARCHAR(20) NOT NULL,
    CustomerAddress NVARCHAR(255) NOT NULL,
    PaymentMethod NVARCHAR(50) NOT NULL,
    Note NVARCHAR(MAX) NULL,
    ItemsJson NVARCHAR(MAX) NOT NULL,
    Subtotal BIGINT NOT NULL,
    Discount BIGINT DEFAULT 0,
    Total BIGINT NOT NULL,
    Status NVARCHAR(50) DEFAULT N'Chờ xác nhận',
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Nạp sẵn các Danh mục
INSERT INTO dbo.Categories (Id, Name, Icon, DisplayOrder) VALUES
('all', N'Tất Cả Sản Phẩm', 'fa-th-large', 1),
('phone', N'Điện Thoại', 'fa-mobile-alt', 2),
('laptop', N'Laptop', 'fa-laptop', 3),
('tablet', N'Máy Tính Bảng', 'fa-tablet-alt', 4),
('audio', N'Âm Thanh', 'fa-headphones', 5),
('watch', N'Đồng Hồ', 'fa-clock', 6),
('camera', N'Máy Ảnh & Camera', 'fa-camera', 7),
('smarthome', N'Nhà Thông Minh', 'fa-home', 8),
('accessories', N'Phụ Kiện', 'fa-plug', 9);

-- Nạp sẵn tài khoản Admin và User mẫu
INSERT INTO dbo.Users (Username, Password, FullName, Email, Phone, Role) VALUES
('admin', '123', N'Quản Trị Viên VIP', 'admin@techstore.vn', '0988888888', 'admin'),
('user', '123', N'Khách Hàng Mẫu', 'khachhang@gmail.com', '0912345678', 'user');
GO
