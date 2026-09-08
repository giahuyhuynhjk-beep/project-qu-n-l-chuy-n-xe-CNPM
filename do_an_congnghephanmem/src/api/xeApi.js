import axiosClient from "./axiosClient";

// ============================================================
// XE API – /xe/
// Fields: BienSo, LoaiXe, SoGhe, TrangThai, HangXe, NamSanXuat
// ============================================================
export const xeApi = {
  /** GET /xe/ – Danh sách tất cả xe */
  getAll: () => axiosClient.get("/xe/"),

  /** GET /xe/{bien_so} – Chi tiết xe theo biển số */
  getById: (bienSo) => axiosClient.get(`/xe/${encodeURIComponent(bienSo)}`),

  /** POST /xe/ – Thêm xe mới */
  create: (data) => axiosClient.post("/xe/", data),

  /** PUT /xe/{bien_so} – Cập nhật thông tin xe */
  update: (bienSo, data) =>
    axiosClient.put(`/xe/${encodeURIComponent(bienSo)}`, data),

  /** DELETE /xe/{bien_so} – Xóa xe */
  delete: (bienSo) =>
    axiosClient.delete(`/xe/${encodeURIComponent(bienSo)}`),
};
