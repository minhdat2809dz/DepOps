# TechStore - Dự Án Frontend Web Bán Hàng & Quản Trị (Admin CRUD) Cho VS Code

Trang web thương mại điện tử hiện đại kết hợp trang **Quản Trị Viên (Admin CRUD)**, được xây dựng hoàn toàn bằng **HTML5, CSS3 và Vanilla JavaScript (ES6)** thuần. Hoạt động ngoại tuyến (offline) bằng **LocalStorage**, chạy ngay lập tức trong **Visual Studio Code** mà không cần cài đặt Node.js hay bất kỳ thư viện ngoài phức tạp nào.

---

## 🌟 Tính Năng Nổi Bật

### 🛒 Dành cho Khách hàng (`index.html`)
1. **Giao diện hiện đại & chuẩn Mobile-Responsive**: Tối ưu hiển thị đẹp mắt trên máy tính, laptop, tablet và điện thoại.
2. **Tìm kiếm thời gian thực (Live Search)**: Lọc tức thì theo tên thiết bị hoặc danh mục.
3. **Phân loại danh mục & Sắp xếp**: Lọc theo *Tất cả*, *Điện thoại*, *Laptop*, *Âm thanh*, *Đồng hồ*; sắp xếp theo giá tăng/giảm hoặc đánh giá sao.
4. **Xem nhanh chi tiết sản phẩm (Quick View Modal)**: Popup hiển thị thông số mô tả, chọn số lượng và nút thêm vào giỏ.
5. **Giỏ hàng trượt mượt mà (Cart Drawer & LocalStorage)**: Tăng/giảm số lượng món đồ, xóa món hoặc dọn sạch giỏ hàng. Dữ liệu không mất khi F5 tải lại trang.
6. **Thanh toán mô phỏng (Checkout)**: Nhập thông tin nhận hàng (COD / Chuyển khoản), tự cấp mã đơn hàng.
7. **Nút chuyển nhanh sang Trang Quản Trị**: Nằm ngay trên thanh Header và Footer.

### ⚙️ Dành cho Quản trị viên (`admin.html`)
1. **Thống kê Dashboard**: Tổng sản phẩm, số danh mục, số sản phẩm có khuyến mãi/huy hiệu, và giá bán trung bình.
2. **CRUD Đầy Đủ**:
   - **Create (Thêm mới)**: Form modal thêm sản phẩm (Tên, Danh mục, Giá bán, Giá cũ, Huy hiệu, Đánh giá, Link ảnh có preview trực tiếp, Mô tả).
   - **Read (Xem danh sách)**: Bảng dữ liệu sản phẩm trực quan, hỗ trợ tìm kiếm và lọc danh mục.
   - **Update (Chỉnh sửa)**: Nhấn nút Sửa trên từng dòng để nạp dữ liệu cũ vào modal và cập nhật.
   - **Delete (Xóa)**: Hộp thoại xác nhận xóa an toàn.
3. **Đồng bộ thời gian thực (Real-time Sync)**: Mọi thao tác Thêm, Sửa, Xóa trên trang Admin sẽ lập tức cập nhật vào `index.html` của khách hàng!
4. **Khôi phục dữ liệu mẫu (Reset Data)**: Nút "Khôi phục mẫu" giúp bạn dễ dàng khôi phục lại 8 sản phẩm ban đầu bất cứ lúc nào.

---

## 📁 Cấu Trúc Thư Mục

```text
e:\deop\
│── index.html              # Trang chủ và cửa hàng dành cho khách mua hàng
│── admin.html              # Trang Dashboard quản trị hệ thống (CRUD sản phẩm)
│── css/
│   ├── style.css           # Toàn bộ mã CSS chung (biến màu, responsive, layout cửa hàng)
│   └── admin.css           # Giao diện trang quản trị Dashboard, bảng dữ liệu và form CRUD
│── js/
│   ├── products.js         # Quản lý nạp/lưu dữ liệu sản phẩm qua LocalStorage và đồng bộ 2 chiều
│   ├── cart.js             # Logic giỏ hàng, tính toán tổng tiền, lưu trữ LocalStorage
│   ├── app.js              # Xử lý sự kiện giao diện cửa hàng (tìm kiếm, lọc, modal, checkout)
│   └── admin.js            # Toàn bộ logic CRUD cho trang Admin (thêm, sửa, xóa, thống kê)
│── .vscode/
│   ├── extensions.json     # Gợi ý extension Live Server và Prettier cho VS Code
│   └── settings.json       # Thiết lập Live Server và tự động căn chỉnh code khi lưu
└── README.md               # Tài liệu hướng dẫn sử dụng
```

---

## 🚀 Hướng Dẫn Chạy Trên Visual Studio Code

### Cách 1: Sử dụng Extension "Live Server" (Khuyên dùng - tiện lợi nhất)
1. Mở thư mục `e:\deop` bằng **Visual Studio Code**:
   - Mở VS Code -> chọn **File** -> **Open Folder...** -> chọn thư mục `e:\deop`.
2. Bấm **Install** khi VS Code gợi ý cài extension **Live Server** (hoặc mở Extensions `Ctrl + Shift + X` và tìm `Live Server` của *Ritwick Dey*).
3. Chuột phải vào file `index.html` (hoặc `admin.html`) -> chọn **"Open with Live Server"** (hoặc bấm nút **"Go Live"** ở góc dưới cùng bên phải màn hình).
4. Trang web sẽ mở tại:
   - Cửa hàng: `http://localhost:5500/index.html`
   - Quản trị: `http://localhost:5500/admin.html`

### Cách 2: Mở trực tiếp bằng trình duyệt (Không cần cài gì thêm)
- Nhấp đúp chuột vào file `index.html` hoặc `admin.html` trong thư mục `e:\deop` để mở ngay trên Chrome / Edge.

---

## 💡 Thử Nghiệm Tính Năng Đồng Bộ 2 Chiều:
1. Mở 2 tab trên trình duyệt: một tab là Cửa hàng (`http://localhost:5500/index.html`) và một tab là Quản trị (`http://localhost:5500/admin.html`).
2. Trên tab **Quản trị**, bấm **"Thêm sản phẩm mới"** và nhập thông tin một chiếc điện thoại hoặc laptop mới.
3. Chuyển sang tab **Cửa hàng**: Sản phẩm mới xuất hiện ngay lập tức trên trang mua hàng!
4. Tương tự, khi bạn sửa giá hoặc xóa sản phẩm từ trang Admin, trang Cửa hàng sẽ được đồng bộ hóa tức thì.
