import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../src/contexts/AuthContext';

// ============================================================
// PRIVATE ROUTE – Bảo vệ route theo role
// ============================================================
export default function PrivateRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, role, isLoading } = useAuth();
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

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

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

  return children;
}
