// ============================================================
// UTILS – Helper functions dùng chung toàn app
// ============================================================

/**
 * Format số tiền sang định dạng VNĐ
 * @param {number} amount
 * @returns {string} ví dụ: "380.000 ₫"
 */
export const formatMoney = (amount) => {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
};

/**
 * Format ngày sang dd/mm/yyyy
 * @param {string|Date} date
 * @returns {string} ví dụ: "29/04/2026"
 */
export const formatDate = (date) => {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d)) return "—";
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * Format ngày giờ đầy đủ
 * @param {string|Date} datetime
 * @returns {string} ví dụ: "20:00 29/04/2026"
 */
export const formatDateTime = (datetime) => {
  if (!datetime) return "—";
  const d = new Date(datetime);
  if (isNaN(d)) return "—";
  const time = d.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const date = d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return `${time} ${date}`;
};

/**
 * Trả về class CSS màu sắc theo trạng thái vé/chuyến
 * @param {string} status
 * @returns {string} tailwind class string
 */
export const statusColor = (status) => {
  const map = {
    // Vé
    "CHỜ THANH TOÁN":  "bg-yellow-100 text-yellow-700 border-yellow-200",
    "CHỜ XÁC NHẬN":    "bg-orange-100 text-orange-700 border-orange-200",
    "ĐÃ XÁC NHẬN":     "bg-green-100  text-green-700  border-green-200",
    "HOÀN THÀNH":      "bg-blue-100   text-blue-700   border-blue-200",
    "ĐÃ HỦY":          "bg-red-100    text-red-700    border-red-200",
    // Thanh toán
    "CHỜ XỬ LÝ":       "bg-yellow-100 text-yellow-700 border-yellow-200",
    "ĐÃ HOÀN TIỀN":    "bg-purple-100 text-purple-700 border-purple-200",
    // Chuyến xe
    "KHỞI TẠO":        "bg-slate-100  text-slate-700  border-slate-200",
    "ĐÃ LÊN LỊCH":     "bg-cyan-100   text-cyan-700   border-cyan-200",
    "ĐÃ PHÂN CÔNG":    "bg-indigo-100 text-indigo-700 border-indigo-200",
    "ĐANG CHẠY":       "bg-green-100  text-green-700  border-green-200",
    "ĐÃ ĐẾN":          "bg-blue-100   text-blue-700   border-blue-200",
    "YÊU CẦU PHÂN CÔNG": "bg-orange-100 text-orange-700 border-orange-200",
    // Xe
    "Đang hoạt động":  "bg-green-100  text-green-700  border-green-200",
    "Đang bảo dưỡng":  "bg-yellow-100 text-yellow-700 border-yellow-200",
    "Tạm ngưng":       "bg-red-100    text-red-700    border-red-200",
    // Account
    "Chờ duyệt":       "bg-yellow-100 text-yellow-700 border-yellow-200",
    "Hoạt động":       "bg-green-100  text-green-700  border-green-200",
  };
  return map[status] || "bg-slate-100 text-slate-600 border-slate-200";
};

/**
 * Rút gọn chuỗi dài nếu vượt quá maxLength
 * @param {string} str
 * @param {number} maxLength
 */
export const truncate = (str, maxLength = 40) => {
  if (!str) return "";
  return str.length > maxLength ? str.slice(0, maxLength) + "…" : str;
};

/**
 * Chuyển date string dạng yyyy-mm-dd sang dd/mm/yyyy (cho date filter)
 * @param {string} dateStr – "2026-04-29"
 * @returns {string} – "29/04/2026"
 */
export const isoToVietDate = (dateStr) => {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
};
