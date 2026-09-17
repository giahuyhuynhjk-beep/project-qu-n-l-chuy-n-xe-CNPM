import axiosClient from "./axiosClient";

// ============================================================
// VÉ API – /ve/
// Fields: MaVe, MaChuyen, SoGhe, TenKhachHang, SoDienThoai, GiaVe, TrangThaiV
// ============================================================
export const veApi = {
  /** GET /ve/ – Danh sách tất cả vé */
  getAll: (params) => axiosClient.get("/ve/", { params }),

  /** GET /ve/search – Tra cứu vé theo SĐT hoặc Mã vé */
  search: (sdt, maVe) => axiosClient.get("/ve/search", { params: { sdt, ma_ve: maVe } }),

  /** GET /ve/{ma_ve} – Chi tiết một vé */
  getById: (maVe) => axiosClient.get(`/ve/${maVe}`),

  /** POST /ve/ – Đặt vé mới */
  create: (data) => axiosClient.post("/ve/", data),

  /** PUT /ve/{ma_ve} – Cập nhật vé (xác nhận, hủy, đổi vé) */
  update: (maVe, data) => axiosClient.put(`/ve/${maVe}`, data),

  /** DELETE /ve/{ma_ve} – Xóa vé */
  delete: (maVe) => axiosClient.delete(`/ve/${maVe}`),

  /** PATCH /ve/{ma_ve}/pay – Thanh toán vé */
  pay: (maVe) => axiosClient.patch(`/ve/${maVe}/pay`),
};
