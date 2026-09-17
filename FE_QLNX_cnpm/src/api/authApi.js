import axiosClient from "./axiosClient";

// ============================================================
// AUTH API – Đăng nhập / phân quyền
// POST /auth/login → trả về { access_token, token_type, role }
// ============================================================
export const authApi = {
  /**
   * Đăng nhập hệ thống
   * @param {string} username
   * @param {string} password
   * @returns {{ access_token, token_type, role }}
   */
  login: (username, password) => {
    // FastAPI OAuth2 dùng form-data, không phải JSON
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    return axiosClient.post("/auth/login", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
  },

  /**
   * Lấy thông tin user đang đăng nhập (nếu backend có endpoint này)
   */
  getMe: () => axiosClient.get("/auth/me"),
};
