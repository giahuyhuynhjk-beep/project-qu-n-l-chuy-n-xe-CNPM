import axiosClient from "./axiosClient";

// ============================================================
// VÉ API – /ve/
// Fields: MaVe, MaChuyen, MaKhachHang, SoGhe, GiaVe, TrangThaiVe,
//         TrangThaiThanhToan, NgayDat, PhuongThucTT
// ============================================================
export const veApi = {
  /** GET /ve/ – Danh sách tất cả vé */
  getAll: () => axiosClient.get("/ve/"),

  /** GET /ve/{ma_ve} – Chi tiết một vé */
  getById: (maVe) => axiosClient.get(`/ve/${maVe}`),

  /** POST /ve/ – Đặt vé mới */
  create: (data) => axiosClient.post("/ve/", data),

  /** PUT /ve/{ma_ve} – Cập nhật vé (xác nhận, hủy, đổi vé) */
  update: (maVe, data) => axiosClient.put(`/ve/${maVe}`, data),

  /** DELETE /ve/{ma_ve} – Xóa vé */
  delete: (maVe) => axiosClient.delete(`/ve/${maVe}`),
};
