/**
 * products.js - Quản lý và lưu trữ dữ liệu sản phẩm VIP PRO cho TechStore
 * Đầy đủ thông số kỹ thuật, bộ sưu tập ảnh, màu sắc, tùy chọn bộ nhớ, đánh giá
 * Hỗ trợ lưu trữ ngoại tuyến (offline) qua LocalStorage và đồng bộ 2 chiều với Admin
 */

const PRODUCTS_STORAGE_KEY = 'techstore_products_data';
const PRODUCTS_VERSION_KEY = 'techstore_products_version';
const CURRENT_VERSION = 'v3_vip_pro_38sp';

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "iPhone 16 Pro Max 256GB Titan Sa Mạc",
    brand: "Apple",
    category: "phone",
    categoryName: "Điện thoại",
    price: 34990000,
    oldPrice: 38990000,
    rating: 5.0,
    reviewsCount: 384,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=700&q=80"
    ],
    badge: "Siêu Phẩm 2026",
    description: "Khung viền Titan sa mạc đẳng cấp hàng không vũ trụ. Chip Apple A18 Pro 3nm đem lại hiệu năng AI và đồ họa tối thượng. Nút Camera Control thế hệ mới và cụm camera Fusion 48MP zoom quang 5x đỉnh cao.",
    specs: {
      screen: "6.9 inch Super Retina XDR OLED, 120Hz ProMotion",
      cpu: "Apple A18 Pro (3nm) thế hệ mới",
      ram: "8GB LPDDR5X",
      storage: "256GB / 512GB / 1TB",
      battery: "4.685 mAh, Sạc nhanh MagSafe 25W",
      os: "iOS 18 tích hợp Apple Intelligence",
      weight: "227g",
      warranty: "24 tháng chính hãng VIP 1 đổi 1"
    },
    colors: [
      { name: "Titan Sa Mạc", hex: "#c3ab98" },
      { name: "Titan Tự Nhiên", hex: "#98948d" },
      { name: "Titan Đen", hex: "#343538" },
      { name: "Titan Trắng", hex: "#e2e3e5" }
    ],
    storageOptions: [
      { label: "256GB", priceDelta: 0 },
      { label: "512GB", priceDelta: 5000000 },
      { label: "1TB", priceDelta: 10000000 }
    ],
    stock: "Sẵn hàng giao hỏa tốc 1H",
    flashSale: true,
    flashDiscount: 10,
    soldCount: 92,
    gift: "Tặng Ốp lưng MagSafe chính hãng + Củ sạc nhanh Apple 30W",
    reviews: [
      { author: "Trần Anh Tuấn (VIP Diamond)", rating: 5, date: "18/10/2026", comment: "Máy màu Titan Sa Mạc cầm cực kỳ sang trọng, nhẹ hơn đời trước. Camera Control chụp ảnh nhanh như máy cơ chuyên nghiệp!" },
      { author: "Lê Hoàng Yến", rating: 5, date: "15/10/2026", comment: "Shop giao hàng hỏa tốc trong 45 phút, đóng gói sang chảnh, nhân viên hỗ trợ dán cường lực tận nơi rất ưng ý." }
    ]
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra 5G AI 512GB",
    brand: "Samsung",
    category: "phone",
    categoryName: "Điện thoại",
    price: 29990000,
    oldPrice: 34490000,
    rating: 4.9,
    reviewsCount: 265,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=700&q=80"
    ],
    badge: "Galaxy AI",
    description: "Kỷ nguyên công nghệ AI toàn diện với khoanh tròn tìm kiếm Circle to Search, phiên dịch trực tiếp Live Translate, khung viền Titanium siêu bền bỉ và bút S-Pen quyền năng.",
    specs: {
      screen: "6.8 inch Dynamic AMOLED 2X, 120Hz, 2600 nits kính Gorilla Armor chống lóa",
      cpu: "Snapdragon 8 Gen 3 for Galaxy (4nm)",
      ram: "12GB RAM",
      storage: "512GB UFS 4.0",
      battery: "5.000 mAh, Sạc nhanh 45W",
      os: "One UI 6.1 (Android 14, nâng cấp 7 năm OS)",
      weight: "232g",
      warranty: "24 tháng VIP bảo hiểm rơi vỡ"
    },
    colors: [
      { name: "Titan Xám", hex: "#7a7975" },
      { name: "Titan Đen", hex: "#2f2f31" },
      { name: "Titan Tím", hex: "#4b465c" },
      { name: "Titan Vàng", hex: "#d5c9a7" }
    ],
    storageOptions: [
      { label: "256GB", priceDelta: -3000000 },
      { label: "512GB", priceDelta: 0 },
      { label: "1TB", priceDelta: 6000000 }
    ],
    stock: "Sẵn hàng đủ màu",
    flashSale: true,
    flashDiscount: 13,
    soldCount: 88,
    gift: "Tặng Đế sạc không dây đôi Samsung 15W + Gói Samsung Care+ 1 năm",
    reviews: [
      { author: "Đặng Quang Huy", rating: 5, date: "16/10/2026", comment: "Màn hình phẳng chống lóa tốt nhất thế giới hiện nay, bút S-Pen ghi chú công việc cực kỳ tiện lợi." }
    ]
  },
  {
    id: 3,
    name: "Samsung Galaxy Z Fold6 5G 512GB AI",
    brand: "Samsung",
    category: "phone",
    categoryName: "Điện thoại",
    price: 43990000,
    oldPrice: 47990000,
    rating: 4.9,
    reviewsCount: 142,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=700&q=80"
    ],
    badge: "Flagship Gập",
    description: "Kiệt tác điện thoại màn hình gập mỏng nhẹ nhất lịch sử Samsung. Bản lề FlexHinge kép bền bỉ vô song cùng trải nghiệm đa nhiệm chia 3 ứng dụng đồng thời với Galaxy AI.",
    specs: {
      screen: "Màn hình trong 7.6 inch QXGA+ Dynamic AMOLED 2X, màn phụ 6.3 inch",
      cpu: "Snapdragon 8 Gen 3 for Galaxy",
      ram: "12GB",
      storage: "512GB",
      battery: "4.400 mAh, sạc nhanh 25W",
      os: "Android 14, One UI 6.1.1",
      weight: "239g siêu mỏng nhẹ",
      warranty: "24 tháng đặc quyền VIP Z Premier"
    },
    colors: [
      { name: "Xám Metal", hex: "#7d8085" },
      { name: "Hồng Rosé", hex: "#ddb4b5" },
      { name: "Xanh Navy", hex: "#24324a" }
    ],
    storageOptions: [
      { label: "256GB", priceDelta: -4000000 },
      { label: "512GB", priceDelta: 0 },
      { label: "1TB", priceDelta: 8000000 }
    ],
    stock: "Chỉ còn 4 máy VIP",
    flashSale: false,
    soldCount: 45,
    gift: "Tặng Bao da S-Pen chính hãng + Thẻ phòng chờ thương gia sân bay toàn cầu",
    reviews: [
      { author: "Phạm Hữu Nghĩa", rating: 5, date: "12/10/2026", comment: "Máy gập vuông vức rất nam tính, màn phụ rộng rãi hơn hẳn đời cũ gõ bàn phím rất dễ." }
    ]
  },
  {
    id: 4,
    name: "Xiaomi 14 Ultra Leica 512GB Titanium",
    brand: "Xiaomi",
    category: "phone",
    categoryName: "Điện thoại",
    price: 27990000,
    oldPrice: 31990000,
    rating: 4.8,
    reviewsCount: 118,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=700&q=80"
    ],
    badge: "Leica Master",
    description: "Hệ thống 4 camera 50MP cảm biến 1-inch Sony LYT-900 tinh chỉnh bởi huyền thoại quang học Leica. Khẩu độ biến thiên vô cấp f/1.63 - f/4.0 cùng chuẩn quay phim điện ảnh 8K.",
    specs: {
      screen: "6.73 inch LTPO AMOLED, 120Hz, 3000 nits, Dolby Vision",
      cpu: "Snapdragon 8 Gen 3 (4nm)",
      ram: "16GB LPDDR5X",
      storage: "512GB UFS 4.0",
      battery: "5.000 mAh, sạc có dây 90W, không dây 80W",
      os: "Xiaomi HyperOS",
      weight: "220g da nhân tạo nano",
      warranty: "18 tháng chính hãng"
    },
    colors: [
      { name: "Trắng Gốm", hex: "#f0f0f0" },
      { name: "Đen Titan", hex: "#1c1c1c" }
    ],
    storageOptions: [
      { label: "512GB", priceDelta: 0 },
      { label: "1TB", priceDelta: 4000000 }
    ],
    stock: "Sẵn hàng tại kho",
    flashSale: false,
    soldCount: 52,
    gift: "Tặng Photography Grip Kit chuyên nghiệp biến điện thoại thành máy ảnh Leica",
    reviews: [
      { author: "Nhiếp ảnh gia Tuấn Khang", rating: 5, date: "14/10/2026", comment: "Chất màu Leica Authentic quá xuất sắc, chụp chân dung xoá phông quang học tự nhiên không hề giả tạo." }
    ]
  },
  {
    id: 5,
    name: "MacBook Pro 16 inch M3 Max 64GB 1TB Space Black",
    brand: "Apple",
    category: "laptop",
    categoryName: "Laptop & PC",
    price: 89990000,
    oldPrice: 94990000,
    rating: 5.0,
    reviewsCount: 178,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=700&q=80"
    ],
    badge: "Quái Vật Đồ Họa",
    description: "Bộ vi xử lý M3 Max với 16 nhân CPU và 40 nhân GPU hỗ trợ phần cứng Ray Tracing. Màn hình Liquid Retina XDR 120Hz độ sáng đỉnh 1600 nits, thời lượng pin kinh ngạc lên đến 22 giờ liên tục.",
    specs: {
      screen: "16.2 inch Liquid Retina XDR (3456 x 2234), ProMotion 120Hz, 1600 nits",
      cpu: "Apple M3 Max 16 nhân CPU, 40 nhân GPU",
      ram: "64GB Unified Memory",
      storage: "1TB SSD siêu tốc độ 7.4GB/s",
      battery: "100Wh, pin 22 giờ, củ sạc USB-C 140W",
      os: "macOS Sequoia",
      weight: "2.16 kg Space Black",
      warranty: "24 tháng Apple Care+ VIP"
    },
    colors: [
      { name: "Đen Không Gian (Space Black)", hex: "#232428" },
      { name: "Bạc Ánh Kim (Silver)", hex: "#e1e2e5" }
    ],
    storageOptions: [
      { label: "1TB SSD", priceDelta: 0 },
      { label: "2TB SSD", priceDelta: 12000000 },
      { label: "4TB SSD", priceDelta: 28000000 }
    ],
    stock: "Sẵn hàng tại showroom VIP",
    flashSale: false,
    soldCount: 39,
    gift: "Tặng Chuột Apple Magic Mouse 2 Black + Túi chống sốc da Tomtoc cao cấp",
    reviews: [
      { author: "Đạo diễn Minh Đức (VIP Gold)", rating: 5, date: "19/10/2026", comment: "Render video 8K ProRes mượt mà không hề nghe tiếng quạt, màu Space Black chống bám vân tay cực tốt." }
    ]
  },
  {
    id: 6,
    name: "Laptop Gaming ASUS ROG Zephyrus G16 OLED RTX 4080",
    brand: "ASUS",
    category: "laptop",
    categoryName: "Laptop & PC",
    price: 68990000,
    oldPrice: 74990000,
    rating: 4.9,
    reviewsCount: 95,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=700&q=80"
    ],
    badge: "Gaming Beast",
    description: "Thiết kế nhôm nguyên khối CNC siêu mỏng chỉ 1.49cm với dải đèn Slash Lighting độc bản. Màn hình ROG Nebula OLED 2.5K 240Hz 0.2ms, kết hợp chip Intel Core Ultra 9 và card đồ họa RTX 4080 12GB.",
    specs: {
      screen: "16 inch ROG Nebula OLED 2.5K (2560x1600), 240Hz, 0.2ms, 100% DCI-P3, G-Sync",
      cpu: "Intel Core Ultra 9 185H (16 nhân, 22 luồng, NPU AI tích hợp)",
      ram: "32GB LPDDR5X 7467MHz",
      storage: "1TB PCIe 4.0 NVMe M.2 SSD",
      battery: "90Wh sạc nhanh 100W PD",
      os: "Windows 11 Home bản quyền",
      weight: "1.85 kg siêu mỏng nhẹ",
      warranty: "24 tháng bảo hành tận nơi ROG VIP"
    },
    colors: [
      { name: "Eclipse Gray", hex: "#3b3d42" },
      { name: "Platinum White", hex: "#e5e6eb" }
    ],
    storageOptions: [
      { label: "1TB SSD", priceDelta: 0 },
      { label: "2TB SSD", priceDelta: 3500000 }
    ],
    stock: "Chỉ còn 2 máy",
    flashSale: true,
    flashDiscount: 8,
    soldCount: 64,
    gift: "Tặng Chuột ROG Gladius III Wireless + Balo ROG Ranger Gaming thời thượng",
    reviews: [
      { author: "Game thủ Hoàng Long", rating: 5, date: "17/10/2026", comment: "Chiếc laptop gaming đẹp nhất từng sở hữu. Màn hình OLED 240Hz màu sắc sâu thăm thẳm, chiến Cyberpunk 2077 max setting cực phê." }
    ]
  },
  {
    id: 7,
    name: "Dell XPS 16 9640 Core Ultra 9 4K+ OLED Platinum",
    brand: "Dell",
    category: "laptop",
    categoryName: "Laptop & PC",
    price: 64990000,
    oldPrice: 69990000,
    rating: 4.8,
    reviewsCount: 82,
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=700&q=80"
    ],
    badge: "Doanh Nhân VIP",
    description: "Đỉnh cao thiết kế tương lai tối giản với bàn phím không viền, hàng phím chức năng cảm ứng phát sáng và Touchpad kính vô hình phủ đầy tinh tế. Màn hình cảm ứng 4K+ OLED sống động.",
    specs: {
      screen: "16.3 inch 4K+ (3840 x 2400) OLED Touch InfinityEdge, 100% DCI-P3",
      cpu: "Intel Core Ultra 9 185H",
      ram: "32GB LPDDR5X",
      storage: "1TB PCIe NVMe SSD",
      battery: "99.5Wh, sạc 130W Type-C",
      os: "Windows 11 Pro",
      weight: "2.13 kg nhôm gia công CNC",
      warranty: "24 tháng Dell ProSupport tận nơi"
    },
    colors: [
      { name: "Bạch Kim (Platinum)", hex: "#d8d9de" },
      { name: "Than Chì (Graphite)", hex: "#2b2c30" }
    ],
    storageOptions: [
      { label: "1TB SSD", priceDelta: 0 },
      { label: "2TB SSD", priceDelta: 4000000 }
    ],
    stock: "Sẵn hàng",
    flashSale: false,
    soldCount: 31,
    gift: "Tặng Adapter Hub Dell 7-in-1 Type C + Chuột không dây Dell Premier Multi-Device",
    reviews: [
      { author: "CEO Vũ Trọng Dũng", rating: 5, date: "11/10/2026", comment: "Thiết kế tương lai cực kỳ sang trọng khi họp với đối tác, Touchpad ẩn vô cùng mượt mà." }
    ]
  },
  {
    id: 8,
    name: "Lenovo Legion 9i Carbon RTX 4090 Tản Nhiệt Nước",
    brand: "Lenovo",
    category: "laptop",
    categoryName: "Laptop & PC",
    price: 99990000,
    oldPrice: 109990000,
    rating: 5.0,
    reviewsCount: 47,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=700&q=80"
    ],
    badge: "Flagship Độc Bản",
    description: "Laptop gaming đầu tiên trên thế giới trang bị nắp máy bằng carbon rèn độc bản (Forged Carbon) và hệ thống tản nhiệt nước tích hợp siêu nhỏ (Integrated Liquid Loop) làm mát RTX 4090 16GB tối đa công suất.",
    specs: {
      screen: "16 inch Mini-LED 3.2K (3200 x 2000), 165Hz, 1200 nits, 100% Adobe RGB",
      cpu: "Intel Core i9-14900HX (24 nhân, 32 luồng, xung nhịp 5.8GHz)",
      ram: "64GB DDR5 5600MHz ép xung",
      storage: "2TB (2x 1TB) PCIe 4.0 NVMe RAID 0",
      battery: "99.9Wh hỗ trợ sạc siêu tốc 330W GaN",
      os: "Windows 11 Home",
      weight: "2.56 kg",
      warranty: "36 tháng Legion Ultimate Support VIP"
    },
    colors: [
      { name: "Carbon Rèn Độc Bản", hex: "#1f2229" }
    ],
    storageOptions: [
      { label: "2TB RAID SSD", priceDelta: 0 }
    ],
    stock: "Chỉ còn duy nhất 1 chiếc tại Việt Nam",
    flashSale: false,
    soldCount: 15,
    gift: "Tặng Tai nghe Legion H600 Wireless + Bàn phím cơ Legion K500 RGB + Balo Carbon Armor",
    reviews: [
      { author: "Dương Minh Thắng (VIP Pro)", rating: 5, date: "09/10/2026", comment: "Tuyệt phẩm công nghệ! Mỗi máy có vân carbon độc nhất không đụng hàng, tản nhiệt nước chạy êm ru dù tải nặng." }
    ]
  },
  {
    id: 9,
    name: "Tai nghe chống ồn Sony WH-1000XM5 ANC Silver",
    brand: "Sony",
    category: "audio",
    categoryName: "Âm thanh Hi-End",
    price: 7690000,
    oldPrice: 8990000,
    rating: 4.9,
    reviewsCount: 520,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=700&q=80"
    ],
    badge: "Chống Ồn Số 1",
    description: "Bộ xử lý chống ồn kép HD QN1 và V1 cùng 8 micro lọc âm chủ động số 1 thế giới. Chất âm Hi-Res Audio Wireless chuẩn phòng thu và thời lượng pin khủng 30 giờ.",
    specs: {
      screen: "Củ loa 30mm màng carbon tổng hợp nhẹ",
      cpu: "Chip kép Sony Integrated Processor V1 + QN1",
      ram: "Hỗ trợ codec LDAC, DSEE Extreme",
      storage: "Micro 8 beamforming AI khử ồn đàm thoại",
      battery: "30 giờ bật chống ồn (sạc 3 phút dùng 3 giờ)",
      os: "Sony Headphones Connect App (iOS/Android)",
      weight: "250g đệm da êm ái",
      warranty: "12 tháng Sony Vietnam"
    },
    colors: [
      { name: "Bạc Ánh Kim (Silver)", hex: "#e2dfd9" },
      { name: "Đen Huyền Bí (Black)", hex: "#1a1a1a" },
      { name: "Xanh Midnight", hex: "#1f2a38" }
    ],
    storageOptions: [
      { label: "Bản Tiêu Chuẩn", priceDelta: 0 }
    ],
    stock: "Sẵn hàng số lượng lớn",
    flashSale: true,
    flashDiscount: 15,
    soldCount: 230,
    gift: "Tặng Hộp đựng tai nghe cao cấp bọc nhung + Dây cáp mạ vàng 3.5mm Audiophile",
    reviews: [
      { author: "Trịnh Thùy Linh", rating: 5, date: "16/10/2026", comment: "Đeo lên máy bay hoặc quán cafe ồn ào là như lạc vào không gian riêng, êm tai không bị đau đầu." }
    ]
  },
  {
    id: 10,
    name: "Loa Bluetooth Marshall Stanmore III Vintage Gold",
    brand: "Marshall",
    category: "audio",
    categoryName: "Âm thanh Hi-End",
    price: 8990000,
    oldPrice: 9990000,
    rating: 4.9,
    reviewsCount: 312,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1520523839898-50712825e617?auto=format&fit=crop&w=700&q=80"
    ],
    badge: "Quý Tộc Âm Nhạc",
    description: "Phong cách Rock'n'Roll biểu tượng từ nước Anh với lớp vỏ da vân sang trọng, mặt lưới ê-căng cổ điển viền đồng thau. Âm trường rộng mở ngập tràn không gian phòng khách 40m².",
    specs: {
      screen: "Hệ thống âm thanh Stereo 2.1 kênh công suất 80W RMS",
      cpu: "1 loa woofer 50W Class D + 2 loa tweeter 15W Class D",
      ram: "Tần số đáp ứng: 45Hz - 20.000Hz",
      storage: "Kết nối Bluetooth 5.2 LE Audio, RCA, 3.5mm AUX",
      battery: "Cắm nguồn trực tiếp 100-240V",
      os: "Ứng dụng Marshall Bluetooth tùy chỉnh EQ",
      weight: "4.25 kg hoàn thiện thủ công",
      warranty: "12 tháng bảo hành chính hãng ASH"
    },
    colors: [
      { name: "Đen Viền Vàng (Black & Brass)", hex: "#1e1e1e" },
      { name: "Kem Vintage (Cream)", hex: "#f0ece1" },
      { name: "Nâu Da Cổ Điển (Brown)", hex: "#5a3d28" }
    ],
    storageOptions: [
      { label: "Bản Tiêu Chuẩn", priceDelta: 0 }
    ],
    stock: "Sẵn hàng tại showroom",
    flashSale: false,
    soldCount: 110,
    gift: "Tặng Dây cáp RCA bọc dù mạ vàng Ugreen cao cấp",
    reviews: [
      { author: "Lê Khắc Huy", rating: 5, date: "13/10/2026", comment: "Tiếng Bass đánh chắc nịch, mid ấm áp nghe nhạc Trịnh và Acoustic mê mẩn, để bàn làm việc rất phong cách." }
    ]
  },
  {
    id: 11,
    name: "Loa Hi-End Bang & Olufsen Beosound A1 2nd Gen",
    brand: "B&O",
    category: "audio",
    categoryName: "Âm thanh Hi-End",
    price: 7490000,
    oldPrice: 8490000,
    rating: 4.8,
    reviewsCount: 145,
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=700&q=80"
    ],
    badge: "Đan Mạch Luxury",
    description: "Kiệt tác thiết kế loa di động cao cấp từ Đan Mạch bởi nhà thiết kế lừng danh Cecilie Manz. Vỏ nhôm nguyên khối ngọc trai bắn cát, dây đeo da thật chống nước chuẩn IP67.",
    specs: {
      screen: "Âm thanh vòm 360 độ True360 Sound",
      cpu: "Bộ khuếch đại 2x 30W Class D cho woofer và tweeter",
      ram: "Chống nước & bụi hoàn toàn chuẩn IP67",
      storage: "Codec aptX Adaptive, AAC",
      battery: "Pin 3.000 mAh nghe liên tục 18 giờ",
      os: "Hỗ trợ trợ lý ảo giọng nói Alexa tích hợp 3 micro",
      weight: "558g cầm gọn trong lòng bàn tay",
      warranty: "24 tháng chính hãng B&O toàn cầu"
    },
    colors: [
      { name: "Nhôm Bạc Tự Nhiên (Natural)", hex: "#cfd0d2" },
      { name: "Vàng Champagne (Gold Tone)", hex: "#e0d3bc" },
      { name: "Xám Than Chì (Anthracite)", hex: "#3a3c42" }
    ],
    storageOptions: [
      { label: "Bản Tiêu Chuẩn", priceDelta: 0 }
    ],
    stock: "Sẵn hàng",
    flashSale: false,
    soldCount: 80,
    gift: "Tặng Dây đeo da bò bổ sung + Túi đựng chống sốc cao cấp",
    reviews: [
      { author: "Đỗ Khánh Toàn", rating: 5, date: "08/10/2026", comment: "Âm thanh trong trẻo đến không ngờ đối với một chiếc loa nhỏ như vậy, sang trọng từng chi tiết." }
    ]
  },
  {
    id: 12,
    name: "Tai nghe Apple AirPods Max Space Black Hi-Res",
    brand: "Apple",
    category: "audio",
    categoryName: "Âm thanh Hi-End",
    price: 13490000,
    oldPrice: 14990000,
    rating: 4.9,
    reviewsCount: 289,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=700&q=80"
    ],
    badge: "Âm Thanh Không Gian",
    description: "Sự hòa quyện tuyệt đỉnh giữa chất âm trung thực cao cấp và sự diệu kỳ của chip Apple H1. Vòm lưới đệm đầu thoáng khí phân bổ trọng lượng nhẹ nhàng và công nghệ Spatial Audio dõi theo chuyển động đầu.",
    specs: {
      screen: "Driver động 40mm do Apple chế tạo độc quyền",
      cpu: "Chip Apple H1 ở mỗi bên tai nghe (10 nhân âm thanh tính toán)",
      ram: "Chống ồn chủ động ANC & chế độ Xuyên âm Transparency Mode",
      storage: "Âm thanh không gian Spatial Audio dò tìm cử động đầu",
      battery: "20 giờ phát nhạc hoặc đàm thoại liên tục",
      os: "Cổng sạc Type-C thế hệ mới, tương thích trọn vẹn hệ sinh thái Apple",
      weight: "384.8g khung thép không gỉ bọc vật liệu êm dịu",
      warranty: "12 tháng bảo hành chính hãng Apple"
    },
    colors: [
      { name: "Đen Không Gian (Midnight)", hex: "#1c1f26" },
      { name: "Ánh Sao (Starlight)", hex: "#ece6d9" },
      { name: "Xanh Dương (Blue)", hex: "#48627e" }
    ],
    storageOptions: [
      { label: "Bản Tiêu Chuẩn Type-C", priceDelta: 0 }
    ],
    stock: "Sẵn hàng tại kho",
    flashSale: true,
    flashDiscount: 10,
    soldCount: 95,
    gift: "Tặng Smart Case bảo vệ thông minh + Khắc tên miễn phí bằng tia laser",
    reviews: [
      { author: "Nguyễn Hải Đăng", rating: 5, date: "10/10/2026", comment: "Nghe nhạc Dolby Atmos trên Apple Music phê quên lối về, hoàn thiện nhôm anodized lạnh và đầm tay cực sang." }
    ]
  },
  {
    id: 13,
    name: "Apple Watch Ultra 2 GPS + Cellular 49mm Titanium",
    brand: "Apple",
    category: "watch",
    categoryName: "Đồng hồ thông minh",
    price: 21490000,
    oldPrice: 23990000,
    rating: 5.0,
    reviewsCount: 198,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=700&q=80"
    ],
    badge: "Titanium Siêu Bền",
    description: "Đồng hồ thông minh thể thao dã ngoại đỉnh cao nhất của Apple. Vỏ Titanium chuẩn hàng không 49mm, màn hình sáng kỷ lục 3000 nits, cảm biến độ sâu lặn 40m và định vị GPS tần số kép chính xác tuyệt đối.",
    specs: {
      screen: "Màn hình OLED Retina Always-On 49mm mặt kính Sapphire, 3000 nits",
      cpu: "Chip Apple S9 SiP thao tác Double Tap ma thuật",
      ram: "64GB bộ nhớ trong",
      storage: "Chống nước 100m, đạt chuẩn lặn EN13319 và độ bền quân đội MIL-STD 810H",
      battery: "Lên tới 72 giờ ở chế độ Tiết kiệm pin, sạc nhanh không dây",
      os: "watchOS 11",
      weight: "61.4g Titanium",
      warranty: "24 tháng VIP chính hãng"
    },
    colors: [
      { name: "Titan Tự Nhiên (Natural Titanium)", hex: "#a6a5a1" },
      { name: "Titan Đen Satin (Black Titanium)", hex: "#2b2b2d" }
    ],
    storageOptions: [
      { label: "49mm GPS + Cellular", priceDelta: 0 }
    ],
    stock: "Sẵn hàng đủ loại dây",
    flashSale: true,
    flashDiscount: 10,
    soldCount: 84,
    gift: "Tặng Dây đeo Trail Loop hoặc Ocean Band thể thao cao cấp",
    reviews: [
      { author: "VĐV Leo núi Phan Bảo Khang", rating: 5, date: "15/10/2026", comment: "Đi rừng và lặn biển cực kỳ yên tâm, GPS chuẩn xác từng mét dưới tán rừng rậm, pin 3 ngày thoải mái." }
    ]
  },
  {
    id: 14,
    name: "Đồng hồ Garmin Fenix 7 Pro Solar Sapphire Carbon",
    brand: "Garmin",
    category: "watch",
    categoryName: "Đồng hồ thông minh",
    price: 22490000,
    oldPrice: 24990000,
    rating: 4.9,
    reviewsCount: 165,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80"
    ],
    badge: "Pin Năng Lượng Mặt Trời",
    description: "Kính Sapphire sạc năng lượng mặt trời Power Sapphire siêu bền, tích hợp đèn pin LED siêu sáng phát tín hiệu SOS, bản đồ địa hình Topo đa lục địa dẫn đường và đo lường thể lực vận động viên chuyên nghiệp.",
    specs: {
      screen: "1.3 inch MIP chống chói dưới ánh nắng gắt, kính sạc Solar Sapphire",
      cpu: "Định vị đa băng tần Multi-Band GNSS với công nghệ SatIQ",
      ram: "32GB lưu bản đồ và hơn 2000 bài hát offline",
      storage: "Cảm biến tim thế hệ 5 Gen 5 Elevate, đo ECG, SpO2, HRV",
      battery: "Lên đến 37 ngày với sạc năng lượng mặt trời",
      os: "Garmin OS đồng bộ Strava / Garmin Connect",
      weight: "73g viền Titan phủ carbon DLC siêu cứng",
      warranty: "24 tháng Garmin Vietnam"
    },
    colors: [
      { name: "Carbon Xám DLC", hex: "#323337" },
      { name: "Titanium Bạc", hex: "#95969c" }
    ],
    storageOptions: [
      { label: "47mm Solar Sapphire", priceDelta: 0 },
      { label: "51mm Fenix 7X Pro", priceDelta: 3000000 }
    ],
    stock: "Sẵn hàng tại showroom",
    flashSale: false,
    soldCount: 41,
    gift: "Tặng Dây sạc Garmin dự phòng + Thắt lưng thể thao chuyên chạy bộ Marathon",
    reviews: [
      { author: "HLV Thể lực Trần Nam Phong", rating: 5, date: "11/10/2026", comment: "Chiếc đồng hồ bền bỉ nhất hành tinh, pin cả tháng mới phải sạc một lần, đèn LED cứu cánh khi chạy đêm." }
    ]
  },
  {
    id: 15,
    name: "Samsung Galaxy Watch Ultra LTE 47mm Titanium",
    brand: "Samsung",
    category: "watch",
    categoryName: "Đồng hồ thông minh",
    price: 16490000,
    oldPrice: 17990000,
    rating: 4.8,
    reviewsCount: 104,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=700&q=80"
    ],
    badge: "Galaxy AI Watch",
    description: "Đồng hồ phiêu lưu cao cấp với thiết kế Cushion vuông bo tròn độc đáo, vỏ Titanium cấp 4 chịu nhiệt độ khắc nghiệt từ -20°C đến 55°C, nút Action Button kích hoạt còi báo động khẩn cấp 86dB.",
    specs: {
      screen: "1.5 inch Super AMOLED kính Sapphire chống xước, 3000 nits",
      cpu: "Exynos W1000 3nm 5 nhân siêu tiết kiệm pin",
      ram: "2GB RAM + 32GB bộ nhớ",
      storage: "Cảm biến BioActive thế hệ mới theo dõi chỉ số AGEs chống lão hóa",
      battery: "590 mAh, pin lên đến 100 giờ ở chế độ Tiết kiệm năng lượng",
      os: "Wear OS Powered by Samsung (One UI 6 Watch)",
      weight: "60.5g Titanium",
      warranty: "12 tháng Samsung chính hãng"
    },
    colors: [
      { name: "Titan Xám (Titanium Gray)", hex: "#525254" },
      { name: "Titan Trắng (Titanium White)", hex: "#e8e9ec" },
      { name: "Titan Bạc (Titanium Silver)", hex: "#a4a5a9" }
    ],
    storageOptions: [
      { label: "47mm LTE eSIM", priceDelta: 0 }
    ],
    stock: "Sẵn hàng",
    flashSale: false,
    soldCount: 35,
    gift: "Tặng Đế sạc nhanh không dây Samsung + Dây đeo thể thao Marine Band",
    reviews: [
      { author: "Hoàng Gia Bảo", rating: 5, date: "14/10/2026", comment: "Mặt đồng hồ kiểu vuông bo tròn phối với dây cam cực ngầu, đo giấc ngủ và chỉ số năng lượng cơ thể rất chuẩn." }
    ]
  },
  {
    id: 16,
    name: "Kính Thực Tế Ảo Apple Vision Pro 512GB Spatial",
    brand: "Apple",
    category: "gaming",
    categoryName: "Gaming & Gear",
    price: 94990000,
    oldPrice: 99990000,
    rating: 5.0,
    reviewsCount: 79,
    image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=700&q=80"
    ],
    badge: "Công Nghệ Không Gian",
    description: "Máy tính không gian mang tính cách mạng đầu tiên của Apple. Tích hợp liền mạch nội dung số với thế giới vật lý của bạn. Điều khiển hoàn toàn tự nhiên bằng ánh mắt, cử chỉ bàn tay và giọng nói mà không cần tay cầm vật lý.",
    specs: {
      screen: "2 màn hình Micro-OLED 23 triệu điểm ảnh (hơn cả TV 4K cho mỗi mắt)",
      cpu: "Chip kép Apple M2 (xử lý ứng dụng) + Apple R1 (xử lý cảm biến thời gian thực)",
      ram: "16GB RAM hợp nhất",
      storage: "512GB SSD",
      battery: "Bộ pin ngoài nhôm nguyên khối sử dụng 2.5 giờ liên tục",
      os: "visionOS thế hệ 2",
      weight: "Khung hợp kim nhôm tùy chỉnh ôm sát gương mặt",
      warranty: "24 tháng gói VIP Pro Care toàn diện"
    },
    colors: [
      { name: "Nhôm Bạc Vũ Trụ", hex: "#bcc0c7" }
    ],
    storageOptions: [
      { label: "256GB", priceDelta: -5000000 },
      { label: "512GB", priceDelta: 0 },
      { label: "1TB", priceDelta: 9000000 }
    ],
    stock: "Hàng hiếm VIP - Trải nghiệm trước tại Studio",
    flashSale: false,
    soldCount: 28,
    gift: "Tặng Hộp đựng du lịch chống va đập Travel Case + Khăn lau quang học Apple độc quyền",
    reviews: [
      { author: "Kỹ sư Vũ Thành Trung (VIP Diamond)", rating: 5, date: "17/10/2026", comment: "Trải nghiệm xem phim 3D 4K màn hình 100 feet trong phòng ngủ là một phép màu thực sự. Điều khiển bằng mắt nhạy tuyệt đối!" }
    ]
  },
  {
    id: 17,
    name: "Màn hình cong Gaming Samsung Odyssey Neo G9 49 inch OLED 240Hz",
    brand: "Samsung",
    category: "gaming",
    categoryName: "Gaming & Gear",
    price: 39990000,
    oldPrice: 45990000,
    rating: 4.9,
    reviewsCount: 112,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=700&q=80"
    ],
    badge: "Màn Cong Vô Cực",
    description: "Màn hình cong OLED 49 inch tỷ lệ 32:9 siêu rộng tương đương 2 màn hình 27 inch ghép lại. Độ cong 1800R chuẩn tầm nhìn, tốc độ phản hồi chớp nhoáng 0.03ms và tần số quét 240Hz đỉnh cao thể thao điện tử.",
    specs: {
      screen: "49 inch Dual QHD (5120 x 1440) OLED cong 1800R, DisplayHDR True Black 400",
      cpu: "Bộ xử lý Neo Quantum Processor Pro nâng cấp hình ảnh bằng AI",
      ram: "Tốc độ phản hồi 0.03ms (GtG), tần số quét 240Hz, AMD FreeSync Premium Pro",
      storage: "Cổng HDMI 2.1, Micro HDMI 2.1, DisplayPort 1.4, USB Hub",
      battery: "Dải đèn sau lưng CoreSync & Core Lighting+ đồng bộ màu game",
      os: "Tích hợp Samsung Gaming Hub chơi game đám mây không cần PC",
      weight: "12.9 kg (có chân đế kim loại cao cấp)",
      warranty: "36 tháng chính hãng bảo hành chống lưu ảnh Burn-in"
    },
    colors: [
      { name: "Bạc Ánh Kim Vũ Trụ", hex: "#d1d5db" }
    ],
    storageOptions: [
      { label: "49 inch OLED 240Hz", priceDelta: 0 }
    ],
    stock: "Sẵn hàng giao và lắp đặt miễn phí",
    flashSale: true,
    flashDiscount: 13,
    soldCount: 45,
    gift: "Tặng Giá treo màn hình trợ lực Human Motion T9 Pro trị giá 2.500.000đ",
    reviews: [
      { author: "Streamer Quang Tuấn", rating: 5, date: "13/10/2026", comment: "Góc nhìn siêu rộng đắm chìm vào game đua xe Forza Horizon và làm việc mở 4 cửa sổ song song cực kỳ năng suất." }
    ]
  },
  {
    id: 18,
    name: "Bàn phím cơ Custom Keychron Q1 Pro RGB Wireless",
    brand: "Keychron",
    category: "gaming",
    categoryName: "Gaming & Gear",
    price: 4990000,
    oldPrice: 5690000,
    rating: 4.9,
    reviewsCount: 220,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80"
    ],
    badge: "Custom Cao Cấp",
    description: "Vỏ nhôm CNC nguyên khối chuẩn hàng không, kết nối không dây Bluetooth 5.1 và có dây Type-C. Thiết kế đệm lót Double-Gasket êm dịu, mạch xuôi Hotswap và núm xoay Knob kim loại lập trình đa năng qua QMK/VIA.",
    specs: {
      screen: "Layout 75% gọn gàng 81 phím + Núm xoay đa năng",
      cpu: "Chip ARM Cortex-M4 32-bit tiết kiệm điện năng",
      ram: "Hotswap 3-pin & 5-pin thay switch không cần hàn mạch",
      storage: "Keycap KSA profile PBT Double-shot chống bóng",
      battery: "4.000 mAh sử dụng tới 300 giờ",
      os: "Tương thích 100% macOS và Windows với switch gạt nhanh",
      weight: "1.73 kg đầm chắc",
      warranty: "12 tháng chính hãng"
    },
    colors: [
      { name: "Carbon Black", hex: "#222326" },
      { name: "Silver Grey", hex: "#b5b7bb" },
      { name: "Shell White", hex: "#efeff1" }
    ],
    storageOptions: [
      { label: "Red Switch (Linear êm ái)", priceDelta: 0 },
      { label: "Brown Switch (Tactile)", priceDelta: 0 },
      { label: "Banana Switch (Custom gõ đầm)", priceDelta: 200000 }
    ],
    stock: "Sẵn hàng",
    flashSale: false,
    soldCount: 98,
    gift: "Tặng Kê tay gỗ tự nhiên nguyên khối cao cấp + Dụng cụ gắp phím Switch Puller mạ vàng",
    reviews: [
      { author: "Lập trình viên Huy Cường", rating: 5, date: "12/10/2026", comment: "Âm thanh gõ phím 'thock' trầm đầm ấm cực đã tai, hoàn thiện vỏ nhôm nặng nề không hề xê dịch trên bàn." }
    ]
  },
  {
    id: 19,
    name: "Chuột không dây Gaming Siêu nhẹ Razer Viper V3 Pro",
    brand: "Razer",
    category: "gaming",
    categoryName: "Gaming & Gear",
    price: 3990000,
    oldPrice: 4590000,
    rating: 4.9,
    reviewsCount: 310,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=700&q=80"
    ],
    badge: "Chuẩn Esports",
    description: "Vũ khí thống trị giải đấu Esports quốc tế với trọng lượng siêu nhẹ kỷ lục chỉ 54g. Cảm biến quang học Focus Pro 35K Gen-2 độ chính xác 99.8% và tần số phản hồi không dây đỉnh cao 8000Hz HyperPolling không độ trễ.",
    specs: {
      screen: "Cảm biến quang Razer Focus Pro 35K Gen-2 (35.000 DPI, 750 IPS, 70G)",
      cpu: "Razer HyperPolling Wireless Dongle thực tế 8.000Hz (0.125ms)",
      ram: "Optical Mouse Switches Gen-3 tuổi thọ 90 triệu lần nhấn không double-click",
      storage: "Feet chuột 100% PTFE bo tròn lướt siêu êm",
      battery: "Lên đến 95 giờ chơi game liên tục ở 1000Hz",
      os: "Razer Synapse 3",
      weight: "54g siêu nhẹ hoàn hảo",
      warranty: "24 tháng 1 đổi 1 chính hãng"
    },
    colors: [
      { name: "Đen Nhám (Matte Black)", hex: "#1f1f21" },
      { name: "Trắng Tinh Khôi (White)", hex: "#f3f3f5" }
    ],
    storageOptions: [
      { label: "Bao gồm Dongle 8000Hz", priceDelta: 0 }
    ],
    stock: "Sẵn hàng tại kho",
    flashSale: true,
    flashDiscount: 13,
    soldCount: 185,
    gift: "Tặng Bộ Grip Tape dán chống trượt cao cấp Razer chính hãng",
    reviews: [
      { author: "Tuyển thủ FPS Minh Khang", rating: 5, date: "15/10/2026", comment: "Cảm giác vẩy tâm súng AWP trong CS2 và Valorant chuẩn từng milimet, trọng lượng 54g cầm như không cầm." }
    ]
  },
  {
    id: 20,
    name: "Tai nghe Gaming Razer BlackShark V2 Pro White 2026",
    brand: "Razer",
    category: "audio",
    categoryName: "Âm thanh Hi-End",
    price: 4890000,
    oldPrice: 5490000,
    rating: 4.8,
    reviewsCount: 175,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=700&q=80"
    ],
    badge: "Esports Edition",
    description: "Củ loa TriForce Titanium 50mm tái tạo âm thanh không gian 3D THX Spatial Audio định vị tiếng bước chân đối thủ siêu rõ. Micro HyperClear Super Wideband thu âm giọng nói rõ ràng như mic thu âm studio.",
    specs: {
      screen: "Driver Razer TriForce Titanium 50mm",
      cpu: "Kết nối không dây Razer HyperSpeed Wireless 2.4GHz + Bluetooth 5.2",
      ram: "Âm thanh vòm THX Spatial Audio vòm 7.1",
      storage: "Microphone tháo rời 9.9mm siêu rộng",
      battery: "Thời lượng pin khủng lên đến 70 giờ liên tục",
      os: "Tương thích PC, Mac, PS5, Switch, Điện thoại",
      weight: "320g đệm mút hoạt tính bọc vải thoáng khí",
      warranty: "24 tháng chính hãng"
    },
    colors: [
      { name: "Trắng Tuyết (White)", hex: "#f0f1f4" },
      { name: "Đen Cổ Điển (Black)", hex: "#1d1e22" }
    ],
    storageOptions: [
      { label: "Bản Tiêu Chuẩn", priceDelta: 0 }
    ],
    stock: "Sẵn hàng",
    flashSale: false,
    soldCount: 88,
    gift: "Tặng Giá treo tai nghe kim loại để bàn thời thượng",
    reviews: [
      { author: "Đoàn Thế Anh", rating: 5, date: "10/10/2026", comment: "Đeo cả ngày không đau tai, nghe tiếng bước chân trong PUBG cực rõ hướng, mic đàm thoại Discord trong vắt." }
    ]
  },
  // ==================== SẢN PHẨM MỚI BỔ SUNG (ID 21-38) ====================
  {
    id: 21,
    name: "iPad Pro 13 inch M4 WiFi + Cellular 512GB Titan",
    brand: "Apple",
    category: "tablet",
    categoryName: "Máy tính bảng",
    price: 39990000,
    oldPrice: 43990000,
    rating: 5.0,
    reviewsCount: 215,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=700&q=80",
    gallery: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=700&q=80"],
    badge: "Ultra Thin Siêu Mỏng",
    description: "iPad Pro thế hệ đột phá với chip M4 thần thánh và màn hình OLED Tandem 2 lớp sáng 1600 nits chưa từng có. Mỏng nhất trong lịch sử Apple chỉ 5.1mm với bút Apple Pencil Pro và bàn phím Magic Keyboard mới cải tiến.",
    specs: { screen: "13 inch Ultra Retina XDR OLED Tandem (2752x2064), ProMotion 120Hz, 1600 nits", cpu: "Apple M4 (3nm) 10 nhân CPU, 10 nhân GPU", ram: "16GB RAM hợp nhất", storage: "512GB SSD", battery: "10.890 mAh, sạc USB-C 20W, 10-13 giờ", os: "iPadOS 18 tích hợp Apple Intelligence", weight: "579g mỏng kỷ lục 5.1mm", warranty: "12 tháng Apple Care+ VIP" },
    colors: [{ name: "Titan Bạc", hex: "#cdd0d4" }, { name: "Titan Đen", hex: "#2b2c2e" }],
    storageOptions: [{ label: "256GB WiFi", priceDelta: -8000000 }, { label: "512GB WiFi+Cell", priceDelta: 0 }, { label: "1TB WiFi+Cell", priceDelta: 8000000 }],
    stock: "Sẵn hàng tại showroom VIP", flashSale: true, flashDiscount: 9, soldCount: 78,
    gift: "Tặng Apple Pencil Pro + Bộ đầu chuyển đổi USB-C Hub 4-in-1 chính hãng",
    reviews: [{ author: "Kiến trúc sư Đặng Bảo Long", rating: 5, date: "17/10/2026", comment: "Màn OLED Tandem đẹp đến khóc, vẽ trên ProCreate mượt không lag, mỏng đến mức không tin đây là iPad." }]
  },
  {
    id: 22,
    name: "Samsung Galaxy Tab S9 Ultra 5G 512GB X926",
    brand: "Samsung",
    category: "tablet",
    categoryName: "Máy tính bảng",
    price: 29990000,
    oldPrice: 33990000,
    rating: 4.9,
    reviewsCount: 138,
    image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=700&q=80",
    gallery: ["https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=700&q=80"],
    badge: "14.6\" Siêu Khủng",
    description: "Màn hình Dynamic AMOLED 2X 14.6 inch kèm S-Pen tích hợp sẵn - to nhất trong dòng Tab S. Chip Snapdragon 8 Gen 2 mạnh mẽ cùng AI Galaxy viết, vẽ và dịch thuật tức thì cho năng suất vượt bậc.",
    specs: { screen: "14.6 inch Dynamic AMOLED 2X (2960x1848), 120Hz, 930 nits kèm S-Pen", cpu: "Snapdragon 8 Gen 2 for Galaxy (4nm)", ram: "12GB RAM", storage: "512GB UFS 3.1", battery: "11.200 mAh, sạc nhanh 45W", os: "Android 14, One UI 6.1 nâng cấp 4 năm OS", weight: "732g viền nhôm 6013", warranty: "12 tháng Samsung chính hãng" },
    colors: [{ name: "Graphite", hex: "#2e2e30" }, { name: "Beige", hex: "#e8e2d6" }],
    storageOptions: [{ label: "256GB WiFi", priceDelta: -5000000 }, { label: "512GB 5G", priceDelta: 0 }],
    stock: "Sẵn hàng", flashSale: false, soldCount: 55,
    gift: "Tặng Book Cover Keyboard Samsung chính hãng + Ốp lưng EF trong suốt",
    reviews: [{ author: "Trưởng phòng thiết kế Hương Giang", rating: 5, date: "14/10/2026", comment: "Màn to đến mức xem phim YouTube full màn mà vẫn còn chỗ multi-task, S-Pen ghi chú trong cuộc họp quá đỉnh." }]
  },
  {
    id: 23,
    name: "Google Pixel 9 Pro XL 256GB Obsidian AI Camera",
    brand: "Google",
    category: "phone",
    categoryName: "Điện thoại",
    price: 24990000,
    oldPrice: 27990000,
    rating: 4.8,
    reviewsCount: 92,
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=700&q=80",
    gallery: ["https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=700&q=80"],
    badge: "Google AI Camera",
    description: "Siêu phẩm AI đến từ cha đẻ Android. Camera Tensor G4 chụp ảnh đêm sáng nhất thế giới, tính năng Magic Eraser xóa vật thể và Best Take chọn khuôn mặt đẹp nhất từ nhiều ảnh. 7 năm cập nhật Android.",
    specs: { screen: "6.8 inch LTPO OLED (1344x2992), 120Hz, 3000 nits", cpu: "Google Tensor G4 với NPU AI tùy chỉnh", ram: "16GB RAM", storage: "256GB UFS 3.1", battery: "5.060 mAh, sạc nhanh 37W + sạc không dây 23W", os: "Android 15 thuần khiết, 7 năm cập nhật OS và bảo mật", weight: "221g viền nhôm bóng", warranty: "12 tháng chính hãng" },
    colors: [{ name: "Obsidian (Đen Huyền Bí)", hex: "#1a1a1c" }, { name: "Porcelain (Sứ Trắng)", hex: "#ebe8e1" }, { name: "Hazel (Nâu Hazel)", hex: "#736956" }],
    storageOptions: [{ label: "128GB", priceDelta: -3000000 }, { label: "256GB", priceDelta: 0 }, { label: "1TB", priceDelta: 8000000 }],
    stock: "Sẵn hàng tại kho", flashSale: true, flashDiscount: 11, soldCount: 67,
    gift: "Tặng Google Pixel Buds Pro 2 chính hãng trị giá 4.5 triệu",
    reviews: [{ author: "Nhiếp ảnh gia Hoàng Nam", rating: 5, date: "16/10/2026", comment: "Chụp ảnh đêm không flash mà sáng như ban ngày, Magic Eraser xóa người đi lại cực kỳ ảo diệu." }]
  },
  {
    id: 24,
    name: "OPPO Find X8 Ultra 5G 512GB Hasselblad Camera",
    brand: "OPPO",
    category: "phone",
    categoryName: "Điện thoại",
    price: 31990000,
    oldPrice: 35990000,
    rating: 4.8,
    reviewsCount: 76,
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=700&q=80",
    gallery: ["https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=700&q=80"],
    badge: "Hasselblad Pro",
    description: "Hệ thống camera 4 ống kính tinh chỉnh bởi huyền thoại nhiếp ảnh Hasselblad Thụy Điển. Cảm biến 1 inch Sony LYT-900 zoom quang học biến thiên vô cấp 6x cùng chip Snapdragon 8 Elite mạnh nhất.",
    specs: { screen: "6.82 inch LTPO AMOLED (1264x2780), 120Hz, 2500 nits", cpu: "Qualcomm Snapdragon 8 Elite (3nm)", ram: "16GB LPDDR5X", storage: "512GB UFS 4.0", battery: "6.000 mAh, sạc có dây 100W siêu tốc, không dây 50W", os: "ColorOS 15 (Android 15)", weight: "229g chất liệu ceramic vân da cao cấp", warranty: "24 tháng OPPO Vietnam" },
    colors: [{ name: "Space Black", hex: "#1a1c20" }, { name: "White Ceramic", hex: "#efefef" }],
    storageOptions: [{ label: "256GB", priceDelta: -4000000 }, { label: "512GB", priceDelta: 0 }],
    stock: "Sẵn hàng tại showroom", flashSale: false, soldCount: 42,
    gift: "Tặng OPPO Watch X thể thao + Củ sạc nhanh 100W SUPERVOOC",
    reviews: [{ author: "Blogger công nghệ Minh Vũ", rating: 5, date: "15/10/2026", comment: "Zoom quang 6x sắc nét khó tin, màu sắc Hasselblad Natural và Vivid đẹp đến mức không cần chỉnh hậu kỳ." }]
  },
  {
    id: 25,
    name: "Sony Alpha A7C II Full-Frame 33MP Mirrorless",
    brand: "Sony",
    category: "camera",
    categoryName: "Máy ảnh & Camera",
    price: 52990000,
    oldPrice: 57990000,
    rating: 4.9,
    reviewsCount: 89,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=80",
    gallery: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=80", "https://images.unsplash.com/photo-1502920917128-1aa500764bed?auto=format&fit=crop&w=700&q=80"],
    badge: "Full-Frame Siêu Gọn",
    description: "Máy ảnh mirrorless full-frame nhỏ nhất thế giới với 33MP BSI CMOS và quay phim 4K 60fps full-pixel. Chip BIONZ XR xử lý AI với nhận diện khuôn mặt và mắt đa chủ thể siêu chính xác.",
    specs: { screen: "3 inch LCD lật ngang 180° cảm ứng (1.036.800 điểm)", cpu: "Chip xử lý BIONZ XR + AI Processing Unit", ram: "Chống rung quang học 7 bậc IBIS, ISO tối đa 51.200", storage: "Dual CFexpress Type A / SD Card UHS-II", battery: "NP-FZ100 (759 khung/lần sạc), sạc USB-C", os: "Sony Imaging Edge Mobile 2 kết nối WiFi 5GHz", weight: "514g nhỏ gọn", warranty: "12 tháng Sony Vietnam" },
    colors: [{ name: "Đen Sang Trọng (Black)", hex: "#1d1e1f" }, { name: "Bạc Cổ Điển (Silver)", hex: "#c8c9cb" }],
    storageOptions: [{ label: "Body Only", priceDelta: 0 }, { label: "Kit 28-60mm f/4-5.6", priceDelta: 6000000 }],
    stock: "Sẵn hàng tại showroom", flashSale: false, soldCount: 38,
    gift: "Tặng Túi đeo chéo da bò cao cấp + Thẻ nhớ Sony Tough 160MB/s 128GB",
    reviews: [{ author: "Nhiếp ảnh gia wedding Duy Phong", rating: 5, date: "13/10/2026", comment: "Nhỏ gọn nhất trong full-frame mà không đánh đổi chất lượng, nhận diện mắt cô dâu cực nhạy kể cả khi che bởi voan." }]
  },
  {
    id: 26,
    name: "DJI Osmo Pocket 3 Creator Combo 4K Gimbal",
    brand: "DJI",
    category: "camera",
    categoryName: "Máy ảnh & Camera",
    price: 12490000,
    oldPrice: 13990000,
    rating: 4.9,
    reviewsCount: 156,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=700&q=80",
    gallery: ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=700&q=80"],
    badge: "Vlog Creator",
    description: "Camera gimbal 3 trục mini cỡ lòng bàn tay đạt chất lượng điện ảnh. Màn hình lật 2 inch vuông cảm ứng preview trực tiếp, quay 4K 120fps slow-motion đẹp như máy Cinema và chống rung ActiveTrack.",
    specs: { screen: "2 inch cảm ứng xoay 360° OLED vuông", cpu: "Cảm biến 1/1.3 inch, f/2.0, ISO tối đa 6.400", ram: "Chống rung 3 trục cơ học + EIS điện tử kết hợp", storage: "Micro SD tới 2TB (UHS-I Class 10)", battery: "1.300 mAh pin 166 phút quay liên tục", os: "DJI Mimo App kết nối Bluetooth + WiFi 5GHz", weight: "179g siêu nhẹ", warranty: "12 tháng DJI Vietnam" },
    colors: [{ name: "Xám Không Gian (Space Gray)", hex: "#3a3c40" }],
    storageOptions: [{ label: "Standard Combo", priceDelta: 0 }, { label: "Creator Combo", priceDelta: 2000000 }],
    stock: "Sẵn hàng", flashSale: true, flashDiscount: 11, soldCount: 120,
    gift: "Tặng Thẻ nhớ DJI MicroSD 128GB + Đế sạc nhanh DJI chính hãng",
    reviews: [{ author: "Travel Vlogger Bảo Châu", rating: 5, date: "12/10/2026", comment: "Nhỏ gọn bỏ túi quần mà quay 4K màu sắc đẹp lung linh như máy chuyên nghiệp, bỏ xa GoPro Hero về màu sắc." }]
  },
  {
    id: 27,
    name: "Màn hình 4K LG UltraFine 32UN880 Ergo 32 inch",
    brand: "LG",
    category: "gaming",
    categoryName: "Gaming & Gear",
    price: 18990000,
    oldPrice: 22990000,
    rating: 4.8,
    reviewsCount: 98,
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=700&q=80",
    gallery: ["https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=700&q=80"],
    badge: "4K Thiết Kế",
    description: "Màn hình 4K Nano IPS chuyên nghiệp với chân đế Ergo tự động điều chỉnh chiều cao, xoay trái-phải và lật dọc 90°. Cổng USB-C 96W sạc laptop và hub 3 cổng USB tiện lợi trên thân màn hình.",
    specs: { screen: "32 inch 4K (3840x2160) Nano IPS, 60Hz, 400 nits, 99% sRGB, DCI-P3 98%", cpu: "Chân đế Ergo điều chỉnh chiều cao/xoay/nghiêng/lật dọc", ram: "Thời gian phản hồi 5ms (GtG), HDR10", storage: "USB-C 96W, HDMI 2.0 x2, DP 1.4, USB 3.0 x3", battery: "Tiêu thụ điện 55W, chứng nhận Energy Star", os: "LG Screen Split phần mềm chia màn hình thông minh", weight: "7.3 kg (có chân Ergo)", warranty: "36 tháng LG chính hãng" },
    colors: [{ name: "Trắng Tinh Tế (White)", hex: "#f5f5f5" }],
    storageOptions: [{ label: "32 inch 4K Ergo USB-C", priceDelta: 0 }],
    stock: "Sẵn hàng", flashSale: true, flashDiscount: 17, soldCount: 61,
    gift: "Tặng Cáp USB-C 2m 100W chính hãng LG + Dây HDMI 2.1 8K",
    reviews: [{ author: "Lập trình viên Phúc An", rating: 5, date: "11/10/2026", comment: "Chân đế Ergo quá hay, điều chỉnh đặt để bất kỳ góc độ nào với một tay, USB-C cắm laptop sạc đồng thời cực tiện." }]
  },
  {
    id: 28,
    name: "Loa di động JBL Charge 5 30W IP67 Chống Nước",
    brand: "JBL",
    category: "audio",
    categoryName: "Âm thanh Hi-End",
    price: 3490000,
    oldPrice: 3990000,
    rating: 4.8,
    reviewsCount: 445,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80",
    gallery: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80"],
    badge: "Chống Nước IP67",
    description: "Loa Bluetooth di động huyền thoại với chuẩn chống nước IP67 (chịu ngâm nước 1m trong 30 phút) và chống bụi hoàn toàn. Tích hợp cổng USB-A sạc điện thoại khẩn cấp từ pin khủng 7.500 mAh lên đến 20 giờ.",
    specs: { screen: "Công suất 30W RMS, Tần số 65Hz - 20kHz", cpu: "Bluetooth 5.3, kết nối PartyBoost ghép 100+ loa", ram: "JBL Deep Bass radiator tái tạo bass căng phồng", storage: "USB-A ra sạc điện thoại, cổng sạc USB-C 30W vào", battery: "7.500 mAh pin nghe 20 giờ liên tục", os: "JBL Portable App điều chỉnh EQ và Soundscapes", weight: "960g vỏ vải silicon siêu bền", warranty: "12 tháng JBL Vietnam" },
    colors: [{ name: "Đen Huyền Bí (Black)", hex: "#1a1b1e" }, { name: "Xanh Teal", hex: "#0d7377" }, { name: "Đỏ Squad", hex: "#c0392b" }, { name: "Xám", hex: "#7f8c8d" }],
    storageOptions: [{ label: "Bản Tiêu Chuẩn", priceDelta: 0 }],
    stock: "Sẵn hàng số lượng lớn", flashSale: true, flashDiscount: 13, soldCount: 380,
    gift: "Tặng Dây đeo vai JBL chính hãng + Túi đựng chống nước JBL",
    reviews: [{ author: "Phạm Thị Hoa", rating: 5, date: "18/10/2026", comment: "Mang ra bãi biển thả thẳng vào nước vẫn hoạt động bình thường, bass mạnh mẽ quái đản cho một loa size nhỏ." }]
  },
  {
    id: 29,
    name: "PC Gaming ASUS ROG RTX 4090 Core i9-14900K",
    brand: "ASUS",
    category: "laptop",
    categoryName: "Laptop & PC",
    price: 148000000,
    oldPrice: 158000000,
    rating: 5.0,
    reviewsCount: 28,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=700&q=80",
    gallery: ["https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=700&q=80"],
    badge: "PC Beast Tuyệt Đỉnh",
    description: "PC Gaming lắp ráp theo yêu cầu với hiệu suất không giới hạn: CPU Intel Core i9-14900K 24 nhân ép xung 6.0GHz, GPU ASUS ROG STRIX RTX 4090 24GB GDDR6X, tản nhiệt nước ASUS ROG RYUJIN III 360mm RGB.",
    specs: { screen: "Intel Core i9-14900K 24 nhân 32 luồng, xung nhịp đến 6.0GHz", cpu: "ASUS ROG STRIX GeForce RTX 4090 24GB GDDR6X", ram: "64GB DDR5 6400MHz CL32 Corsair Dominator Titanium", storage: "4TB (2x Samsung 990 Pro 2TB PCIe 5.0 NVMe RAID 0)", battery: "Nguồn Corsair HX1500i Titanium 80+ 1500W", os: "Windows 11 Pro bản quyền + ASUS Armoury Crate", weight: "ROG Helios 601 Full Tower RGB Flow", warranty: "36 tháng linh kiện lắp ráp toàn bộ" },
    colors: [{ name: "ROG Black RGB Phantom", hex: "#111115" }],
    storageOptions: [{ label: "Cấu hình tiêu chuẩn", priceDelta: 0 }, { label: "Nâng RAM 128GB", priceDelta: 8000000 }],
    stock: "Chỉ còn 1 bộ - Hàng độc bản", flashSale: false, soldCount: 7,
    gift: "Tặng bộ ROG Peripherals: Chuột Gladius III + Bàn phím Strix Flare II + Tai nghe Delta S",
    reviews: [{ author: "Streamer chuyên nghiệp KingStar", rating: 5, date: "10/10/2026", comment: "Render 4K ProRes RAW không cần xem đồng hồ, stream 8K trong khi chơi Cyberpunk Ultra RT Overdrive FPS 165 mượt như mơ." }]
  },
  {
    id: 30,
    name: "Apple MacBook Air 15 M3 18GB 512GB Starlight",
    brand: "Apple",
    category: "laptop",
    categoryName: "Laptop & PC",
    price: 37990000,
    oldPrice: 41990000,
    rating: 4.9,
    reviewsCount: 189,
    image: "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?auto=format&fit=crop&w=700&q=80",
    gallery: ["https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?auto=format&fit=crop&w=700&q=80"],
    badge: "Siêu Nhẹ 18 Giờ Pin",
    description: "MacBook Air lớn nhất từ trước đến nay với màn hình Liquid Retina 15.3 inch sắc nét siêu mỏng và nhẹ nhàng chỉ 1.51kg. Chip M3 hiệu suất vượt trội, pin bền 18 giờ - lý tưởng cho học sinh sinh viên và dân văn phòng.",
    specs: { screen: "15.3 inch Liquid Retina (2880x1864), 500 nits, True Tone, P3 Wide Color", cpu: "Apple M3 8 nhân CPU, 10 nhân GPU (3nm)", ram: "18GB Unified Memory", storage: "512GB SSD tốc độ 3.7GB/s", battery: "66.5Wh, pin 18 giờ, sạc MagSafe 70W", os: "macOS Sequoia + Apple Intelligence", weight: "1.51kg mỏng chỉ 11.5mm", warranty: "12 tháng Apple Care+ VIP" },
    colors: [{ name: "Starlight (Ánh Sao)", hex: "#e8e3d5" }, { name: "Midnight (Đêm Đen)", hex: "#1a1d24" }, { name: "Space Gray", hex: "#696969" }, { name: "Sky Blue (Xanh Trời)", hex: "#6ea6c8" }],
    storageOptions: [{ label: "8GB RAM 256GB SSD", priceDelta: -8000000 }, { label: "18GB RAM 512GB SSD", priceDelta: 0 }, { label: "18GB RAM 1TB SSD", priceDelta: 6000000 }],
    stock: "Sẵn hàng đủ màu", flashSale: true, flashDiscount: 9, soldCount: 112,
    gift: "Tặng Túi chống sốc da cao cấp Tomtoc + Hub USB-C 7-in-1 Anker",
    reviews: [{ author: "Sinh viên Bách Khoa Minh Tâm", rating: 5, date: "19/10/2026", comment: "Pin trâu dùng cả ngày không cần sạc trong lớp, máy êm ru không quạt mà render After Effects vẫn nhanh hơn hẳn Intel." }]
  },
  {
    id: 31,
    name: "Soundbar Samsung HW-Q990D 11.1.4ch Dolby Atmos",
    brand: "Samsung",
    category: "audio",
    categoryName: "Âm thanh Hi-End",
    price: 29990000,
    oldPrice: 34990000,
    rating: 4.9,
    reviewsCount: 74,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=700&q=80",
    gallery: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=700&q=80"],
    badge: "Dolby Atmos 11.1.4",
    description: "Thanh soundbar flagship 11.1.4 kênh đỉnh nhất Samsung với loa rear wireless và loa siêu trầm không dây kèm theo. Công nghệ Space Fit Sound Pro tự động hiệu chỉnh âm thanh theo không gian phòng.",
    specs: { screen: "11.1.4 kênh: Soundbar chính + Loa đỉnh 4 cửa + Loa rear + Sub không dây", cpu: "Tổng công suất 656W, Space Fit Sound Pro tự động hiệu chỉnh", ram: "Dolby Atmos + DTS:X True 3D Surround Sound", storage: "HDMI eARC 2.1, HDMI 2.0 In, Optical, WiFi, Bluetooth 5.0", battery: "Cắm nguồn trực tiếp, Loa rear & Sub pin 10 giờ không dây", os: "Samsung SmartThings tích hợp hệ sinh thái TV", weight: "Thanh chính 6.3 kg, Sub 7.5 kg", warranty: "12 tháng Samsung chính hãng" },
    colors: [{ name: "Titanium Black", hex: "#1f2022" }],
    storageOptions: [{ label: "HW-Q990D Bộ Đầy Đủ 11.1.4ch", priceDelta: 0 }],
    stock: "Giao và lắp đặt tại nhà miễn phí", flashSale: true, flashDiscount: 14, soldCount: 32,
    gift: "Tặng Dịch vụ lắp đặt tận nhà + Cánh âm tường Sound Panel trang trí",
    reviews: [{ author: "Kỹ thuật âm thanh Trần Hữu Long", rating: 5, date: "08/10/2026", comment: "Xem phim Dolby Atmos như rạp chiếu phim thực sự ngay tại phòng khách, loa rear không dây đặt sau lưng cực linh hoạt." }]
  },
  {
    id: 32,
    name: "Vivo X200 Pro 5G 512GB Zeiss Camera Titan Gray",
    brand: "Vivo",
    category: "phone",
    categoryName: "Điện thoại",
    price: 21990000,
    oldPrice: 24990000,
    rating: 4.7,
    reviewsCount: 58,
    image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=700&q=80",
    gallery: ["https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=700&q=80"],
    badge: "Zeiss T* Coating",
    description: "Siêu phẩm tầm trung cao cấp với hệ thống camera Zeiss T* Coating chống phản chiếu và cảm biến 1 inch Sony LYT-818 50MP. Pin khổng lồ 6.000 mAh sạc nhanh 90W đầy trong 35 phút.",
    specs: { screen: "6.78 inch AMOLED (1260x2800), 144Hz, 3000 nits, LTPO tự điều chỉnh", cpu: "MediaTek Dimensity 9400 (3nm)", ram: "16GB LPDDR5X", storage: "512GB UFS 4.0", battery: "6.000 mAh siêu khủng, sạc nhanh FlashCharge 90W (35 phút đầy)", os: "Funtouch 15 (Android 15)", weight: "229g mặt lưng da nhân tạo cao cấp", warranty: "12 tháng Vivo Vietnam" },
    colors: [{ name: "Titan Gray", hex: "#4a4e55" }, { name: "Cosmic Black", hex: "#0d0f14" }],
    storageOptions: [{ label: "256GB", priceDelta: -3000000 }, { label: "512GB", priceDelta: 0 }],
    stock: "Sẵn hàng tại kho", flashSale: false, soldCount: 45,
    gift: "Tặng Củ sạc Vivo 90W + Ốp lưng Vivo chính hãng",
    reviews: [{ author: "Nguyễn Thành Đạt", rating: 5, date: "09/10/2026", comment: "Pin 6000mAh sạc từ 0 lên 100% chỉ 35 phút quá điên rồ, camera đêm Zeiss T* chụp sắc nét hơn cả Galaxy S24." }]
  },
  {
    id: 33,
    name: "Bàn phím cơ Anne Pro 2 Wireless 60% RGB",
    brand: "Anne Pro",
    category: "gaming",
    categoryName: "Gaming & Gear",
    price: 1890000,
    oldPrice: 2290000,
    rating: 4.8,
    reviewsCount: 312,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=700&q=80",
    gallery: ["https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=700&q=80"],
    badge: "Tầm Giá Tốt Nhất",
    description: "Bàn phím cơ 60% không dây RGB giá tốt nhất phân khúc tầm trung. Kết nối 4 thiết bị đồng thời qua Bluetooth, hỗ trợ USB Type-C có dây và pin 1.900 mAh dùng 3-4 tuần mỗi lần sạc.",
    specs: { screen: "60% Layout 61 phím compact bàn phím cơ không viền", cpu: "Chip Bluetooth 5.0 kết nối 4 thiết bị, chuyển đổi nhanh", ram: "RGB đèn nền mỗi phím độc lập 16.7 triệu màu", storage: "Macro và remapping qua ObinsKit (Windows, Mac, Linux)", battery: "1.900 mAh dùng 3-4 tuần (đèn tắt), 2-3 ngày (đèn bật)", os: "Windows 10/11, macOS, Linux, iOS, Android", weight: "560g vỏ nhựa ABS nhám cao cấp", warranty: "12 tháng chính hãng" },
    colors: [{ name: "Đen (Black)", hex: "#1e1e1e" }, { name: "Trắng (White)", hex: "#f0f0f0" }],
    storageOptions: [{ label: "Red Switch (Linear)", priceDelta: 0 }, { label: "Blue Switch (Clicky)", priceDelta: 0 }, { label: "Brown Switch (Tactile)", priceDelta: 0 }],
    stock: "Sẵn hàng nhiều màu switch", flashSale: false, soldCount: 240,
    gift: "Tặng Keycap set PBT gradient bổ sung + Dây cáp USB-C bện dù",
    reviews: [{ author: "Sinh viên IT Tuấn Kiệt", rating: 5, date: "16/10/2026", comment: "Bàn phím cơ tốt nhất tầm giá dưới 2 triệu, kết nối Bluetooth ổn định không mất kết nối." }]
  },
  {
    id: 34,
    name: "Tai nghe TWS Bose QuietComfort Ultra Earbuds ANC",
    brand: "Bose",
    category: "audio",
    categoryName: "Âm thanh Hi-End",
    price: 8990000,
    oldPrice: 9990000,
    rating: 4.9,
    reviewsCount: 198,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=700&q=80",
    gallery: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=700&q=80"],
    badge: "ANC TWS Số 1",
    description: "Tai nghe True Wireless tốt nhất thế giới với công nghệ chống ồn QuietComfort thế hệ mới mạnh hơn 40%. Âm thanh Immersive Audio theo dõi chuyển động đầu tạo âm trường 3D như rạp phim mini trong tai bạn.",
    specs: { screen: "Driver 9.3mm tùy chỉnh + 3 micro mỗi bên", cpu: "Chip Bose xử lý chống ồn kép ANC + Transparency Mode", ram: "Immersive Audio 3D đa chiều theo dõi chuyển động đầu", storage: "Bluetooth 5.3, Multipoint 2 thiết bị, codec AAC + SBC", battery: "6 giờ earbud + 24 giờ hộp sạc (tổng 30 giờ), sạc USB-C", os: "Bose Music App tùy chỉnh EQ và chế độ ANC", weight: "8.3g/bên + Hộp sạc 51g compact", warranty: "12 tháng Bose Vietnam" },
    colors: [{ name: "Đen Huyền Bí (Black)", hex: "#1a1a1a" }, { name: "Trắng Sương Mù (White Smoke)", hex: "#f0efeb" }, { name: "Tím Moonstone", hex: "#7c73a0" }],
    storageOptions: [{ label: "Bản Standard", priceDelta: 0 }],
    stock: "Sẵn hàng tại kho", flashSale: true, flashDiscount: 10, soldCount: 144,
    gift: "Tặng Hộp đựng đi du lịch cứng + Cáp USB-C Bose chính hãng",
    reviews: [{ author: "Kỹ sư hàng không Thanh Phong", rating: 5, date: "14/10/2026", comment: "Đeo trên máy bay nội địa Hà Nội - Sài Gòn như ngồi trong căn phòng yên tĩnh, ANC mạnh hơn hẳn Sony XM5." }]
  },
  {
    id: 35,
    name: "Laptop ASUS Zenbook Pro 16X OLED UX7602 4K",
    brand: "ASUS",
    category: "laptop",
    categoryName: "Laptop & PC",
    price: 59990000,
    oldPrice: 65990000,
    rating: 4.8,
    reviewsCount: 67,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=80",
    gallery: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=80"],
    badge: "OLED 4K Creator",
    description: "Laptop sáng tạo chuyên nghiệp với màn hình OLED 4K ASUS ProArt 120Hz hiệu chỉnh chuyên sắc Pantone Validated. Tính năng độc đáo ScreenPad Plus - màn hình cảm ứng OLED thứ hai 4K ngay dưới bàn phím.",
    specs: { screen: "16 inch 4K ASUS ProArt OLED (3840x2400), 120Hz, 0.2ms, 550 nits, Pantone Validated", cpu: "Intel Core i9-13980HX (24 nhân) + ScreenPad Plus OLED 4K cảm ứng", ram: "32GB LPDDR5 4800MHz", storage: "2TB PCIe Gen4 NVMe SSD", battery: "96Wh, sạc 240W Hypercharge", os: "Windows 11 Pro + ASUS ProArt Creator Hub", weight: "2.55kg vỏ nhôm CNC", warranty: "24 tháng ASUS VIP" },
    colors: [{ name: "Tech Black", hex: "#232527" }],
    storageOptions: [{ label: "RTX 4060 8GB", priceDelta: 0 }, { label: "RTX 4070 8GB", priceDelta: 6000000 }],
    stock: "Sẵn hàng tại showroom", flashSale: false, soldCount: 24,
    gift: "Tặng Bút cảm ứng ASUS Pen 2.0 + Đế tản nhiệt ASUS TUF cao cấp",
    reviews: [{ author: "Đạo diễn MV âm nhạc Hải Đăng", rating: 5, date: "07/10/2026", comment: "Hai màn hình OLED 4K cùng lúc khi chỉnh màu video trên Resolve và Premiere quá sang chảnh." }]
  },
  {
    id: 36,
    name: "Chuột không dây Logitech MX Master 3S Graphite",
    brand: "Logitech",
    category: "gaming",
    categoryName: "Gaming & Gear",
    price: 2390000,
    oldPrice: 2790000,
    rating: 4.9,
    reviewsCount: 456,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=700&q=80",
    gallery: ["https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=700&q=80"],
    badge: "Best Productivity",
    description: "Chuột năng suất số 1 thế giới cho dân văn phòng và lập trình viên. Cuộn bánh xe MagSpeed điện từ 1000 tờ/giây siêu mượt, cảm biến 8K DPI trên mọi bề mặt kể cả kính, kết nối 3 máy tính đồng thời Logitech Flow.",
    specs: { screen: "Cảm biến quang Darkfield 8.000 DPI, hoạt động trên kính", cpu: "Bánh xe cuộn MagSpeed điện từ siêu nhanh 1000 tờ giấy/giây", ram: "Bluetooth LE + USB Receiver Logi Bolt, kết nối 3 máy đồng thời", storage: "7 nút có thể lập trình qua Logi Options+ App", battery: "Pin 500 mAh sạc USB-C dùng 70 ngày", os: "Windows 10/11, macOS 11+, Linux", weight: "141g vừa tay phải, vải phủ Logitech Nano bền bỉ", warranty: "24 tháng Logitech Vietnam" },
    colors: [{ name: "Graphite", hex: "#2c2c2e" }, { name: "Pale Gray", hex: "#c8c4c0" }],
    storageOptions: [{ label: "Bản Tiêu Chuẩn", priceDelta: 0 }],
    stock: "Sẵn hàng tại kho", flashSale: false, soldCount: 310,
    gift: "Tặng Lót chuột Logitech Desk Mat đế chống trượt 70cm",
    reviews: [{ author: "Kỹ sư phần mềm Lê Bình An", rating: 5, date: "18/10/2026", comment: "Bánh cuộn MagSpeed cảm giác cuộn trên không khí, copy file và cuộn code dài mà không cần nhấc tay." }]
  },
  {
    id: 37,
    name: "Xiaomi Robot Vacuum S20+ Ultra Smart Mapping",
    brand: "Xiaomi",
    category: "smarthome",
    categoryName: "Nhà Thông Minh",
    price: 8990000,
    oldPrice: 10990000,
    rating: 4.7,
    reviewsCount: 213,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=700&q=80",
    gallery: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=700&q=80"],
    badge: "Smart Home AI",
    description: "Robot hút bụi lau nhà thông minh với công suất hút 10.000 Pa kỷ lục và hệ thống điều hướng laser LDS tạo bản đồ 3D chính xác từng centimet. Tự động làm sạch giẻ lau bằng nước nóng 75°C và tự đổ rác sau mỗi lần dọn.",
    specs: { screen: "Lực hút 10.000 Pa, giẻ lau rung tần số cao 3.000 lần/phút", cpu: "Điều hướng LDS Laser 3D bản đồ đa tầng chính xác 2cm", ram: "Tự vệ sinh giẻ lau nước nóng 75°C diệt khuẩn + tự đổ rác 45 ngày", storage: "Túi rác dùng 45 ngày, thùng nước 3L tự động pha nước giặt", battery: "Pin 5.200 mAh, tự động về sạc và tiếp tục dọn", os: "Xiaomi Home App (iOS/Android), tích hợp Google Home & Alexa", weight: "4.5 kg (trạm sạc) + 3.8 kg (robot)", warranty: "12 tháng Xiaomi Vietnam" },
    colors: [{ name: "Trắng (White)", hex: "#f5f5f5" }],
    storageOptions: [{ label: "Bản S20+ Ultra Trạm Đầy Đủ", priceDelta: 0 }],
    stock: "Giao và lắp đặt miễn phí", flashSale: true, flashDiscount: 18, soldCount: 165,
    gift: "Tặng 12 túi rác dùng 1 năm + Nước lau sàn Xiaomi chính hãng 500ml",
    reviews: [{ author: "Nguyễn Thị Mai Lan", rating: 5, date: "17/10/2026", comment: "Mua cho bố mẹ già, robot tự chạy hút bụi và lau sàn cả nhà 4 phòng ngủ không cần can thiệp, nước giặt giẻ tự pha quá tiện." }]
  },
  {
    id: 38,
    name: "Apple TV 4K WiFi + Ethernet 128GB 2026",
    brand: "Apple",
    category: "smarthome",
    categoryName: "Nhà Thông Minh",
    price: 5990000,
    oldPrice: 6490000,
    rating: 4.8,
    reviewsCount: 127,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=700&q=80",
    gallery: ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=700&q=80"],
    badge: "Trung Tâm Smart Home",
    description: "Trung tâm giải trí và nhà thông minh nhỏ gọn nhất của Apple với chip A16 Bionic cực mạnh. Xuất hình ảnh 4K HDR Dolby Vision 120fps tới TV, điều khiển toàn bộ thiết bị HomeKit bằng giọng nói và hành động Thread.",
    specs: { screen: "Xuất 4K HDR Dolby Vision + Dolby Atmos + ARC/eARC, HDMI 2.1", cpu: "Apple A16 Bionic chip (cùng chip iPhone 15)", ram: "4GB RAM + 128GB bộ nhớ trong", storage: "Thread radio trung tâm Smart Home, kết nối 100+ thiết bị HomeKit", battery: "Nguồn 6W cực tiết kiệm điện, không có pin", os: "tvOS 18 + Siri + Apple Intelligence", weight: "Siri Remote aluminum mới, chỉ 98g thiết bị", warranty: "12 tháng Apple Care+ VIP" },
    colors: [{ name: "Đen Không Gian (Space Black)", hex: "#1d1e20" }],
    storageOptions: [{ label: "WiFi (Không Ethernet)", priceDelta: -500000 }, { label: "WiFi + Ethernet (Đầy Đủ)", priceDelta: 0 }],
    stock: "Sẵn hàng giao hỏa tốc 2H", flashSale: false, soldCount: 88,
    gift: "Tặng Cáp HDMI 2.1 8K siêu tốc 2m + Giá đỡ gắn tường Apple TV",
    reviews: [{ author: "Nguyễn Anh Tuấn", rating: 5, date: "15/10/2026", comment: "Xem Apple TV+ Dolby Vision 4K 120fps mượt kinh khủng, điều khiển cả hệ thống nhà thông minh Homekit bằng giọng nói Siri cực nhạy." }]
  }
];

// Lấy danh sách sản phẩm từ LocalStorage và tự động nâng cấp nếu đang dùng bản cũ
function getStoredProducts() {
  try {
    const version = localStorage.getItem(PRODUCTS_VERSION_KEY);
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    
    // Nếu chưa nâng cấp lên phiên bản VIP PRO, cập nhật tự động
    if (version !== CURRENT_VERSION || !raw) {
      saveStoredProducts(DEFAULT_PRODUCTS);
      localStorage.setItem(PRODUCTS_VERSION_KEY, CURRENT_VERSION);
      return [...DEFAULT_PRODUCTS];
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Lỗi khi đọc danh sách sản phẩm từ LocalStorage:', e);
  }

  // Khởi tạo lần đầu
  saveStoredProducts(DEFAULT_PRODUCTS);
  localStorage.setItem(PRODUCTS_VERSION_KEY, CURRENT_VERSION);
  return [...DEFAULT_PRODUCTS];
}

// Lưu danh sách sản phẩm vào LocalStorage và đồng bộ SQL Server
function saveStoredProducts(newList) {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(newList));
    products = newList;
  } catch (e) {
    console.error('Lỗi khi ghi danh sách sản phẩm vào LocalStorage:', e);
  }
}

// Khôi phục về danh sách 38 sản phẩm mẫu VIP PRO gốc
async function resetDefaultProducts() {
  if (typeof apiResetProducts === 'function' && API_CONFIG?.isOnline) {
    try {
      const res = await apiResetProducts();
      if (res && res.success && res.data) {
        saveStoredProducts(res.data);
        return res.data;
      }
    } catch (e) {
      console.warn('Lỗi gọi apiResetProducts, dùng fallback local:', e);
    }
  }
  saveStoredProducts(DEFAULT_PRODUCTS);
  localStorage.setItem(PRODUCTS_VERSION_KEY, CURRENT_VERSION);
  return [...DEFAULT_PRODUCTS];
}

// Mảng products sử dụng toàn cục (khởi tạo ban đầu)
let products = getStoredProducts();

// Đồng bộ sản phẩm từ SQL Server (TechStoreDB)
async function syncProductsWithSQLServer() {
  if (typeof apiGetProducts === 'function') {
    try {
      const apiProducts = await apiGetProducts();
      if (apiProducts && Array.isArray(apiProducts) && apiProducts.length > 0) {
        products = apiProducts;
        try {
          localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(apiProducts));
        } catch (e) {}

        // Tự động re-render các bảng/lưới nếu đang hiển thị
        if (typeof renderProducts === 'function') renderProducts();
        if (typeof loadAndRenderAdminTable === 'function') loadAndRenderAdminTable();
        console.log(`✅ [SQL Server] Đã nạp thành công ${products.length} sản phẩm từ TechStoreDB @ SQLEXPRESS2025!`);
      }
    } catch (err) {
      console.warn('Chưa thể lấy sản phẩm từ SQL Server, đang dùng LocalStorage cache.', err);
    }
  }
}

// Lắng nghe sự kiện trang tải xong để đồng bộ SQL Server
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    syncProductsWithSQLServer();
  });
}

// Hàm định dạng tiền tệ VNĐ: ví dụ 29990000 -> 29.990.000 đ
function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount || 0);
}
