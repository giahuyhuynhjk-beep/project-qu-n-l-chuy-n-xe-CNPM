import axiosClient from "./axiosClient";

// ============================================================
// NHÂN VIÊN API – /nhan-vien/
// Fields: MaNV, HoTen, Email, SoDienThoai, ChucVu, TrangThai, MaTaiKhoan
// ============================================================
export const nhanVienApi = {
  /** GET /nhan-vien/ – Danh sách tất cả nhân viên */
  getAll: () => axiosClient.get("/nhan-vien/"),

  /** GET /nhan-vien/{ma_nv} – Chi tiết nhân viên */
  getById: (maNV) => axiosClient.get(`/nhan-vien/${maNV}`),

  /** POST /nhan-vien/ – Thêm nhân viên mới */
  create: (data) => axiosClient.post("/nhan-vien/", data),

  /** PUT /nhan-vien/{ma_nv} – Cập nhật nhân viên */
  update: (maNV, data) => axiosClient.put(`/nhan-vien/${maNV}`, data),

  /** DELETE /nhan-vien/{ma_nv} – Xóa nhân viên */
  delete: (maNV) => axiosClient.delete(`/nhan-vien/${maNV}`),
};
