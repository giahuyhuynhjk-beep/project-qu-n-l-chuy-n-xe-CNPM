import axios from "axios";

// ============================================================
// BASE AXIOS CLIENT – Mọi API call đều đi qua đây
// baseURL trỏ đến FastAPI backend đang chạy ở localhost:8000
// ============================================================
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://3.104.2.96:8000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 giây timeout
});

// ============================================================
// REQUEST INTERCEPTOR – Tự động gắn JWT token vào mọi request
// ============================================================
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================
// RESPONSE INTERCEPTOR – Xử lý lỗi toàn cục
// ============================================================
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isAuthEndpoint = error.config?.url?.includes("/auth/login");
    const isLoginPage = typeof window !== "undefined" && window.location.pathname === "/login";

    if (status === 401 && !isAuthEndpoint && !isLoginPage) {
      // Token hết hạn → xóa và redirect về login (tránh redirect loop khi sai mật khẩu hoặc ở trang login)
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_info");
      window.location.href = "/login";
    } else if (status === 403) {
      console.error("[API] 403 Forbidden – Không có quyền truy cập");
    } else if (status >= 500) {
      console.error("[API] Server error:", error.response?.data);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
