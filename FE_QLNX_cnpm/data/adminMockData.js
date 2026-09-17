import {
  BarChart3,
  Bus,
  CalendarClock,
  CarFront,
  LayoutDashboard,
  Receipt,
  Repeat2,
  Route,
  Users,
  WalletCards,
  UserCog,
} from "lucide-react";

export const adminMenuGroups = [
  {
    title: "TỔNG QUAN",
    items: [{ key: "dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "VẬN HÀNH ADMIN",
    items: [
      { key: "trips", label: "Quản lý chuyến tuyến", icon: Bus },
      { key: "assignments", label: "Quản lý tài xế & xe", icon: Users },
      { key: "bookings", label: "Quản lý đặt vé", icon: Receipt },
    ],
  },
  {
    title: "DỮ LIỆU HỆ THỐNG",
    items: [
      { key: "accounts", label: "Quản lý tài khoản", icon: UserCog },
      { key: "vehicles", label: "Quản lý phương tiện", icon: CarFront },
      { key: "routes", label: "Quản lý tuyến đường", icon: Route },
      { key: "schedules", label: "Quản lý lịch trình", icon: CalendarClock },
      { key: "fares", label: "Quản lý giá vé", icon: WalletCards },
    ],
  },
  {
    title: "BÁO CÁO & XỬ LÝ",
    items: [
      { key: "reports", label: "Báo cáo thống kê", icon: BarChart3 },
      { key: "refunds", label: "Xử lý hủy/đổi vé", icon: Repeat2 },
    ],
  },
];

export const trips = [
  {
    id: "TR-DN-HUE-002",
    date: "2026-05-11",
    time: "09:00",
    route: "Đà Nẵng - Huế",
    routeDetail: "Trung tâm Đà Nẵng - Phía Nam Huế",
    bus: "65B-876.54",
    busType: "Xe limousine 16 chỗ",
    driver: "Chưa phân công tài xế",
    driverPhone: "Chưa xác nhận",
    seatsSold: 8,
    seatsTotal: 16,
    status: "Đã lên lịch",
    revenue: "1.600.000đ",
  },
  {
    id: "TR-SG-CT-010",
    date: "2026-05-15",
    time: "07:30",
    route: "TP. Hồ Chí Minh - Cần Thơ",
    routeDetail: "Bến xe Miền Tây - Trung tâm Cần Thơ",
    bus: "51B-678.90",
    busType: "Xe giường nằm 40 chỗ",
    driver: "Nguyễn Văn A",
    driverPhone: "0901 222 333",
    seatsSold: 6,
    seatsTotal: 45,
    status: "Đang vận hành",
    revenue: "2.280.000đ",
  },
  {
    id: "TR-HN-SP-006",
    date: "2026-05-18",
    time: "21:30",
    route: "Hà Nội - Sa Pa",
    routeDetail: "Bến xe Mỹ Đình - Trung tâm Sa Pa",
    bus: "43B-234.56",
    busType: "Limousine 9 chỗ",
    driver: "Đinh Thu K",
    driverPhone: "0909 111 222",
    seatsSold: 9,
    seatsTotal: 9,
    status: "Thiếu nguồn lực",
    revenue: "2.700.000đ",
  },
  {
    id: "TR-SG-DL-008",
    date: "2026-05-20",
    time: "22:00",
    route: "Sài Gòn - Đà Lạt",
    routeDetail: "Bến xe Miền Đông - Bến xe Liên tỉnh Đà Lạt",
    bus: "29B-123.45",
    busType: "Xe giường nằm 32 phòng",
    driver: "Bùi Thị H",
    driverPhone: "0903 333 666",
    seatsSold: 12,
    seatsTotal: 32,
    status: "Đã lên lịch",
    revenue: "3.600.000đ",
  },
];

export const drivers = [
  { id: "DR-001", name: "Nguyễn Văn A", phone: "0901 222 333", status: "Sẵn sàng", license: "D", rating: 4.8 },
  { id: "DR-002", name: "Bùi Thị H", phone: "0903 333 666", status: "Đang chạy", license: "E", rating: 4.7 },
  { id: "DR-003", name: "Đinh Thu K", phone: "0909 111 222", status: "Sẵn sàng", license: "D", rating: 4.9 },
  { id: "DR-004", name: "Lê Thị B", phone: "0912 555 777", status: "Nghỉ ca", license: "D", rating: 4.6 },
];

export const vehicles = [
  { plate: "43B-234.56", type: "Limousine 9 chỗ", seats: 9, status: "Đang hoạt động", route: "Hà Nội - Sa Pa" },
  { plate: "51B-678.90", type: "Giường nằm 40 chỗ", seats: 40, status: "Đang hoạt động", route: "Sài Gòn - Đà Lạt" },
  { plate: "65B-876.54", type: "Limousine 16 chỗ", seats: 16, status: "Đang bảo dưỡng", route: "Đà Nẵng - Huế" },
  { plate: "29B-123.45", type: "Giường nằm 32 phòng", seats: 32, status: "Đang hoạt động", route: "Sài Gòn - Phú Quốc" },
  { plate: "60B-345.88", type: "Ghế ngồi 29 chỗ", seats: 29, status: "Tạm ngưng", route: "Cần Thơ - Sài Gòn" },
];

export const routes = [
  { id: "RT-SG-CT", name: "Sài Gòn - Cần Thơ", distance: "170 km", duration: "3 giờ", status: "Hoạt động", price: "200.000đ" },
  { id: "RT-SG-DL", name: "Sài Gòn - Đà Lạt", distance: "308 km", duration: "7 giờ", status: "Hoạt động", price: "300.000đ" },
  { id: "RT-HN-SP", name: "Hà Nội - Sa Pa", distance: "315 km", duration: "6 giờ", status: "Hoạt động", price: "350.000đ" },
  { id: "RT-DN-HUE", name: "Đà Nẵng - Huế", distance: "105 km", duration: "2 giờ", status: "Bảo trì", price: "150.000đ" },
  { id: "RT-SG-PQ", name: "Sài Gòn - Phú Quốc", distance: "390 km", duration: "9 giờ", status: "Hoạt động", price: "420.000đ" },
];

export const bookings = [
  { code: "TK-2457989", passenger: "Nguyễn Văn A", trip: "Sài Gòn đi Phú Quốc", seat: "G04", status: "Chờ thanh toán", payment: "Chờ xử lý" },
  { code: "TK-6349822", passenger: "Ngọc Gia G", trip: "Sài Gòn đi Đà Lạt", seat: "A11", status: "Đã xác nhận", payment: "Đã xác nhận" },
  { code: "TK-7563100", passenger: "Đào Tuấn Anh", trip: "Hà Nội đi Sa Pa", seat: "A20", status: "Hoàn thành", payment: "Đã xác nhận" },
  { code: "TK-8830051", passenger: "Mai Tiến Đạt", trip: "Đà Nẵng đi Huế", seat: "B08", status: "Bị hủy", payment: "Đã hoàn tiền" },
];

export const accounts = [
  { name: "Phan Anh Ngọc", email: "ngoc@vantrinh.vn", role: "Nhân viên", status: "Chờ duyệt" },
  { name: "Dương Như Vy", email: "vy@vantrinh.vn", role: "Nhân viên", status: "Hoạt động" },
  { name: "Lý Đăng Khoa", email: "khoa@vantrinh.vn", role: "Tài xế", status: "Hoạt động" },
  { name: "Nguyễn Văn Admin", email: "admin@vantrinh.vn", role: "Quản trị", status: "Hoạt động" },
];

export const refundRequests = [
  { id: "REG-CHG-007", passenger: "Nguyễn Văn A", trip: "TR-SG-CT-010", type: "Đổi vé", status: "Đang xử lý", amount: "200.000đ" },
  { id: "REG-HUY-001", passenger: "Đào Tuấn Anh", trip: "TR-HN-SP-006", type: "Hủy vé", status: "Chờ xử lý", amount: "350.000đ" },
  { id: "REG-CHG-003", passenger: "Phan Anh Ngọc", trip: "TR-DN-HUE-002", type: "Đổi vé", status: "Đã duyệt", amount: "150.000đ" },
];

export const reportRows = [
  { date: "2026-04-15", trip: "TR-SG-CT-010", route: "Sài Gòn - Cần Thơ", revenue: "290.000đ", tickets: 8, status: "On time" },
  { date: "2026-04-22", trip: "TR-SG-DL-008", route: "Sài Gòn - Đà Lạt", revenue: "720.000đ", tickets: 12, status: "Delayed" },
  { date: "2026-04-29", trip: "TR-HN-SP-006", route: "Hà Nội - Sa Pa", revenue: "800.000đ", tickets: 9, status: "On time" },
];
