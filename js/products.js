/**
 * products.js - Quản lý và lưu trữ dữ liệu sản phẩm VIP PRO cho TechStore
 * Đầy đủ thông số kỹ thuật, bộ sưu tập ảnh, màu sắc, tùy chọn bộ nhớ, đánh giá
 * Hỗ trợ lưu trữ ngoại tuyến (offline) qua LocalStorage và đồng bộ 2 chiều với Admin
 */

const PRODUCTS_STORAGE_KEY = 'techstore_products_data';
const PRODUCTS_VERSION_KEY = 'techstore_products_version';
const CURRENT_VERSION = 'v2_vip_pro';

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

// Lưu danh sách sản phẩm vào LocalStorage
function saveStoredProducts(newList) {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(newList));
    products = newList;
  } catch (e) {
    console.error('Lỗi khi ghi danh sách sản phẩm vào LocalStorage:', e);
  }
}

// Khôi phục về danh sách 20 sản phẩm mẫu VIP PRO gốc
function resetDefaultProducts() {
  saveStoredProducts(DEFAULT_PRODUCTS);
  localStorage.setItem(PRODUCTS_VERSION_KEY, CURRENT_VERSION);
  return [...DEFAULT_PRODUCTS];
}

// Mảng products sử dụng toàn cục
let products = getStoredProducts();

// Hàm định dạng tiền tệ VNĐ: ví dụ 29990000 -> 29.990.000 đ
function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount || 0);
}
