import axiosClient from "./axiosClient";

// ============================================================
// CHUYẾN XE API – /chuyen-xe/
// Fields: MaChuyen, MaTuyen, BienSo, MaTaiXe, ThoiGianKhoiHanh,
//         ThoiGianDenDuKien, TrangThai, SoGheTrong, GiaVe
// ============================================================
export const chuyenXeApi = {
  /** GET /chuyen-xe/ – Danh sách tất cả chuyến xe */
  getAll: () => axiosClient.get("/chuyen-xe/"),

  /** GET /chuyen-xe/{ma_chuyen} – Chi tiết một chuyến */
  getById: (maChuyen) => axiosClient.get(`/chuyen-xe/${maChuyen}`),

  /**
   * GET /chuyen-xe/search – Tìm kiếm chuyến theo điểm đi/đến/thời gian
   * @param {string} diemDi
   * @param {string} diemDen
   * @param {string} thoiGianKhoiHanh – ISO datetime string
   */
  search: (diemDi, diemDen, thoiGianKhoiHanh) =>
    axiosClient.get("/chuyen-xe/search", {
      params: {
        diem_di: diemDi,
        diem_den: diemDen,
        thoi_gian_khoi_hanh: thoiGianKhoiHanh,
      },
    }),

  /** POST /chuyen-xe/ – Tạo chuyến mới */
  create: (data) => axiosClient.post("/chuyen-xe/", data),

  /** PUT /chuyen-xe/{ma_chuyen} – Cập nhật chuyến */
  update: (maChuyen, data) => axiosClient.put(`/chuyen-xe/${maChuyen}`, data),

  /** POST /chuyen-xe/goi-y – Gợi ý xe & tài xế cho chuyến */
  goiY: (data) => axiosClient.post("/chuyen-xe/goi-y", data),
};
