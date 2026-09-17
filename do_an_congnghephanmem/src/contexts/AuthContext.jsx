import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/authApi";
import { ROLE_TYPES } from "../constants";

// ============================================================
// AUTH CONTEXT – Quản lý trạng thái đăng nhập toàn app
// ============================================================
const AuthContext = createContext(null);

/**
 * AuthProvider bọc bên ngoài toàn bộ app (trong main.jsx)
 * Cung cấp: user, role, token, isLoading, login(), logout()
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [role, setRole]       = useState(null);
  const [token, setToken]     = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Đang kiểm tra session

  // Helper kiểm tra token hợp lệ
  const isValidTokenStr = (str) => {
    return Boolean(str && str !== "undefined" && str !== "null" && str !== "NaN" && str.trim() !== "");
  };

  // Khi app khởi động: kiểm tra token đã lưu trong localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    const savedUser  = localStorage.getItem("user_info");

    if (isValidTokenStr(savedToken) && isValidTokenStr(savedUser)) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && parsedUser.role) {
          setToken(savedToken);
          setUser(parsedUser);
          setRole(parsedUser.role);
        } else {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_info");
        }
      } catch {
        // Dữ liệu localStorage bị hỏng → xóa sạch
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_info");
      }
    } else {
      // Token không hợp lệ hoặc dính chuỗi 'undefined' / 'null' → dọn dẹp sạch
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_info");
    }
    setIsLoading(false);
  }, []);

  /**
   * Đăng nhập: gọi API → lưu token → set state
   * @param {string} username
   * @param {string} password
   * @returns {{ success: boolean, role: string, error?: string }}
   */
  // Map MaQuyen từ Backend (Q001/Q002/Q003) sang role FE (admin/staff/driver)
  const mapBackendRole = (maQuyen) => {
    const roleMap = {
      'Q001': ROLE_TYPES.ADMIN,
      'Q002': ROLE_TYPES.STAFF,
      'Q003': ROLE_TYPES.DRIVER,
      'Q004': ROLE_TYPES.CLIENT,
    };
    return roleMap[maQuyen] || maQuyen;
  };

  const login = async (username, password) => {
    try {
      const response = await authApi.login(username, password);
      const { access_token, role: rawRole, username: uname, ...userInfo } = response.data;

      // Chuyển đổi role từ mã BE (Q001...) sang role FE (admin/staff/driver)
      const userRole = mapBackendRole(rawRole);

      // Lưu vào localStorage
      localStorage.setItem("access_token", access_token);
      localStorage.setItem(
        "user_info",
        JSON.stringify({ ...userInfo, role: userRole, username: uname || username })
      );

      // Cập nhật state
      setToken(access_token);
      setRole(userRole);
      setUser({ ...userInfo, role: userRole, username: uname || username });

      return { success: true, role: userRole };
    } catch (error) {
      let msg = "Tên đăng nhập hoặc mật khẩu không đúng";
      if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
        msg = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra Backend FastAPI đã chạy chưa.";
      } else if (error.response?.data?.detail) {
        msg = error.response.data.detail;
      }
      return { success: false, error: msg };
    }
  };

  /**
   * Đăng xuất: xóa token → reset state
   */
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");
    setToken(null);
    setUser(null);
    setRole(null);
  };

  /** Kiểm tra xem user có quyền cần thiết không */
  const hasRole = (...allowedRoles) => {
    return role && allowedRoles.includes(role);
  };

  const value = {
    user,
    role,
    token,
    isLoading,
    isAuthenticated: Boolean(token && token !== "undefined" && token !== "null" && token !== "NaN"),
    isAdmin:  role === ROLE_TYPES.ADMIN,
    isStaff:  role === ROLE_TYPES.STAFF,
    isDriver: role === ROLE_TYPES.DRIVER,
    isClient: role === ROLE_TYPES.CLIENT,
    login,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook để sử dụng AuthContext trong các component
 * Ví dụ: const { user, role, login, logout } = useAuth();
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải được dùng bên trong <AuthProvider>");
  return ctx;
};

export default AuthContext;
