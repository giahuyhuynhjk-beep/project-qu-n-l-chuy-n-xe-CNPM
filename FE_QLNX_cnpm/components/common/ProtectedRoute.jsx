import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../src/contexts/AuthContext';

// ============================================================
// PROTECTED ROUTE – Bảo vệ route theo role
// ============================================================
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, role, isLoading, token } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0f172a', color: '#64748b', fontSize: 14, fontWeight: 600,
      }}>
        Đang tải hệ thống...
      </div>
    );
  }

  // Kiểm tra token (hoặc trạng thái đăng nhập), loại trừ 'undefined', 'null', 'NaN'
  const rawToken = token || (typeof localStorage !== 'undefined' ? localStorage.getItem("access_token") : null);
  const hasValidToken = Boolean(
    isAuthenticated &&
    rawToken &&
    rawToken !== "undefined" &&
    rawToken !== "null" &&
    rawToken !== "NaN"
  );

  if (!hasValidToken) {
    // Nếu chưa có token hợp lệ, kiểm tra nếu đường dẫn hiện tại đang ở /login thì KHÔNG kích hoạt <Navigate> nữa
    const currentPath = location?.pathname || (typeof window !== 'undefined' ? window.location.pathname : '');
    if (currentPath === '/login') {
      return children ? children : <Outlet />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kiểm tra quyền (Role)
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#f8fafc', color: '#1e293b', fontFamily: 'sans-serif',
      }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🚫</div>
        <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>Không có quyền truy cập</h2>
        <p style={{ color: '#64748b', marginBottom: 24 }}>Tài khoản của bạn không có quyền vào trang này.</p>
        <a href="/login" style={{
          background: '#2563eb', color: '#fff', padding: '10px 24px',
          borderRadius: 10, textDecoration: 'none', fontWeight: 700,
        }}>
          Quay về đăng nhập
        </a>
      </div>
    );
  }

  return children ? children : <Outlet />;
}
