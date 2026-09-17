import axiosClient from "./axiosClient";

// ============================================================
// TUYẾN XE API – /tuyen-xe/
// Fields: MaTuyen, DiemDi, DiemDen, KhoangCach, ThoiGianDuKien, GiaCoBan, TrangThai
// ============================================================
export const tuyenXeApi = {
  /** GET /tuyen-xe/ – Lấy danh sách tất cả tuyến */
  getAll: () => axiosClient.get("/tuyen-xe/"),

  /** GET /tuyen-xe/{ma_tuyen} – Lấy chi tiết một tuyến */
  getById: (maTuyen) => axiosClient.get(`/tuyen-xe/${maTuyen}`),

  /** POST /tuyen-xe/ – Tạo tuyến mới */
  create: (data) => axiosClient.post("/tuyen-xe/", data),

  /** PUT /tuyen-xe/{ma_tuyen} – Cập nhật tuyến */
  update: (maTuyen, data) => axiosClient.put(`/tuyen-xe/${maTuyen}`, data),
};
