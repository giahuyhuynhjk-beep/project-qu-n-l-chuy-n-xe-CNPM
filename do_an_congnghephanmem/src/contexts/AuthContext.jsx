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

  // Khi app khởi động: kiểm tra token đã lưu trong localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    const savedUser  = localStorage.getItem("user_info");

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsedUser);
        setRole(parsedUser.role);
      } catch {
        // Dữ liệu localStorage bị hỏng → xóa sạch
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_info");
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * Đăng nhập: gọi API → lưu token → set state
   * @param {string} username
   * @param {string} password
   * @returns {{ success: boolean, role: string, error?: string }}
   */
  const login = async (username, password) => {
    // --- BẮT ĐẦU MOCK LOGIN (Tạm dừng backend) ---
    const MOCK_USERS = {
      admin: { password: 'admin123', role: ROLE_TYPES.ADMIN },
      staff: { password: 'staff123', role: ROLE_TYPES.STAFF },
      driver: { password: 'driver123', role: ROLE_TYPES.DRIVER },
    };

    if (MOCK_USERS[username] && MOCK_USERS[username].password === password) {
      const userRole = MOCK_USERS[username].role;
      const fakeToken = `mock_token_${username}_${Date.now()}`;
      const userInfo = { name: `Người dùng Demo (${username})`, username };

      localStorage.setItem("access_token", fakeToken);
      localStorage.setItem("user_info", JSON.stringify({ ...userInfo, role: userRole }));

      setToken(fakeToken);
      setRole(userRole);
      setUser({ ...userInfo, role: userRole });

      return { success: true, role: userRole };
    }
    // --- KẾT THÚC MOCK LOGIN ---

    try {
      const response = await authApi.login(username, password);
      const { access_token, role: userRole, ...userInfo } = response.data;

      // Lưu vào localStorage
      localStorage.setItem("access_token", access_token);
      localStorage.setItem(
        "user_info",
        JSON.stringify({ ...userInfo, role: userRole, username })
      );

      // Cập nhật state
      setToken(access_token);
      setRole(userRole);
      setUser({ ...userInfo, role: userRole, username });

      return { success: true, role: userRole };
    } catch (error) {
      let msg = "Tên đăng nhập hoặc mật khẩu không đúng";
      if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
        msg = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra backend (FastAPI) đã chạy chưa.";
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
    isAuthenticated: !!token,
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
