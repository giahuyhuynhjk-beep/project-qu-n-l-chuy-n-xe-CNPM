// ============================================================
// ROLE TYPES – 4 vai trò trong hệ thống
// ============================================================
export const ROLE_TYPES = {
  ADMIN: "admin",
  STAFF: "staff",
  DRIVER: "driver",
  CLIENT: "client",
};

// ============================================================
// APP ROUTES – Đường dẫn theo vai trò
// ============================================================
export const APP_ROUTES = {
  LOGIN: "/login",

  // Admin routes
  ADMIN_ROOT: "/admin",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_TRIPS: "/admin/trips",
  ADMIN_ASSIGNMENTS: "/admin/assignments",
  ADMIN_BOOKINGS: "/admin/bookings",
  ADMIN_ACCOUNTS: "/admin/accounts",
  ADMIN_VEHICLES: "/admin/vehicles",
  ADMIN_ROUTES: "/admin/routes",
  ADMIN_SCHEDULES: "/admin/schedules",
  ADMIN_FARES: "/admin/fares",
  ADMIN_REPORTS: "/admin/reports",
  ADMIN_REFUNDS: "/admin/refunds",

  // Staff routes
  STAFF_ROOT: "/",
  STAFF_OVERVIEW: "/tongquan",
  STAFF_BOOKINGS: "/",
  STAFF_TRIPS: "/quan-ly-chuyen-xe",
  STAFF_DRIVER: "/driver",
  STAFF_PAYMENT: "/payment",
  STAFF_SUPPORT: "/support",
  STAFF_REFUND: "/refund",

  // Driver routes
  DRIVER_ROOT: "/driver-dashboard",
  DRIVER_SCHEDULE: "/driver-dashboard/schedule",
  DRIVER_INCIDENT: "/driver-dashboard/incident",
  DRIVER_PROFILE: "/driver-dashboard/profile",

  // Client routes
  CLIENT_ROOT: "/client",
  CLIENT_SEARCH: "/client/search",
  CLIENT_BOOKING: "/client/booking",
  CLIENT_MY_TICKETS: "/client/my-tickets",
};

// ============================================================
// TRIP STATUS – Trạng thái chuyến xe
// ============================================================
export const TRIP_STATUS = {
  INIT: "KHỞI TẠO",
  SCHEDULED: "ĐÃ LÊN LỊCH",
  ASSIGNED: "ĐÃ PHÂN CÔNG",
  DEPARTING: "SẮP KHỞI HÀNH",
  RUNNING: "ĐANG CHẠY",
  ARRIVED: "ĐÃ ĐẾN",
  COMPLETED: "HOÀN THÀNH",
  CANCELLED: "ĐÃ HỦY",
  NEED_ASSIGN: "YÊU CẦU PHÂN CÔNG",
};

// ============================================================
// TICKET STATUS – Trạng thái vé
// ============================================================
export const TICKET_STATUS = {
  PENDING_PAYMENT: "CHỜ THANH TOÁN",
  PENDING_CONFIRM: "CHỜ XÁC NHẬN",
  CONFIRMED: "ĐÃ XÁC NHẬN",
  COMPLETED: "HOÀN THÀNH",
  CANCELLED: "ĐÃ HỦY",
};

// ============================================================
// PAYMENT STATUS – Trạng thái thanh toán
// ============================================================
export const PAYMENT_STATUS = {
  PENDING: "CHỜ XỬ LÝ",
  CONFIRMED: "ĐÃ XÁC NHẬN",
  REFUNDED: "ĐÃ HOÀN TIỀN",
};
