import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './src/contexts/AuthContext';
import { ROLE_TYPES } from './src/constants';
import PrivateRoute from './components/common/PrivateRoute';

// ─── Layouts ───────────────────────────────────────────────
import StaffLayout  from './layouts/StaffLayout';
import DriverLayout from './layouts/DriverLayout';
import ClientLayout from './layouts/ClientLayout';

// ─── Auth ──────────────────────────────────────────────────
import LoginPage from './pages/auth/LoginPage';

// ─── Staff pages ───────────────────────────────────────────
import Tongquan       from './pages/staff/Tongquan';
import QuanLyDatVe    from './pages/staff/QuanLyDatVe';
import QuanLyChuyenXe from './pages/staff/QuanLyChuyenXe';
import PhanCongTaiXe  from './pages/staff/PhanCongTaiXe';
import HotroKH        from './pages/staff/HotroKH';
import XacnhanTT          from './pages/staff/XacnhanTT';
import QuanLyTuyenDuong   from './pages/staff/QuanLyTuyenDuong';

// ─── Admin (state-based, giữ nguyên AdminApp) ──────────────
import AdminApp from './pages/admin/AdminApp';

// ─── Driver pages ──────────────────────────────────────────
import DriverDashboard from './pages/driver/DriverDashboard';
import IncidentReport  from './pages/driver/IncidentReport';

// ============================================================
// APP ROUTER – Điều phối route theo vai trò sau khi đăng nhập
// ============================================================
export default function AppRouter() {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0f172a', color: '#475569', fontSize: 14, fontWeight: 600,
    }}>
      ⏳ Đang khởi động hệ thống...
    </div>
  );

  // Helper: redirect sau login theo role
  const homeByRole = () => {
    if (role === ROLE_TYPES.ADMIN)  return '/admin';
    if (role === ROLE_TYPES.DRIVER) return '/driver-dashboard';
    if (role === ROLE_TYPES.CLIENT) return '/client';
    return '/'; // staff
  };

  return (
    <Routes>

      {/* ── PUBLIC: Login ─────────────────────────────── */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={homeByRole()} replace /> : <LoginPage />}
      />

      {/* ── ADMIN ─────────────────────────────────────── */}
      <Route path="/admin" element={
        <PrivateRoute allowedRoles={[ROLE_TYPES.ADMIN]}>
          <AdminApp />
        </PrivateRoute>
      } />

      {/* ── STAFF ─────────────────────────────────────── */}
      <Route path="/" element={
        <PrivateRoute allowedRoles={[ROLE_TYPES.STAFF, ROLE_TYPES.ADMIN]}>
          <StaffLayout />
        </PrivateRoute>
      }>
        <Route index                    element={<QuanLyDatVe />} />
        <Route path="tongquan"          element={<Tongquan />} />
        <Route path="quan-ly-chuyen-xe" element={<QuanLyChuyenXe />} />
        <Route path="driver"            element={<PhanCongTaiXe />} />
        <Route path="payment"           element={<XacnhanTT />} />
        <Route path="support"           element={<HotroKH />} />
        <Route path="refund"            element={<div style={{padding:40,textAlign:'center',color:'#6b7280',fontSize:16}}>🚧 Module hủy/đổi vé đang phát triển</div>} />
        <Route path="status"            element={<div style={{padding:40,textAlign:'center',color:'#6b7280',fontSize:16}}>🚧 Module theo dõi trạng thái đang phát triển</div>} />
        <Route path="tuyen-duong"       element={<QuanLyTuyenDuong />} />
      </Route>

      {/* ── DRIVER ─────────────────────────────────────── */}
      <Route path="/driver-dashboard" element={
        <PrivateRoute allowedRoles={[ROLE_TYPES.DRIVER]}>
          <DriverLayout />
        </PrivateRoute>
      }>
        <Route index           element={<DriverDashboard />} />
        <Route path="schedule" element={<DriverDashboard />} />
        <Route path="incident" element={<IncidentReport />} />
        <Route path="profile"  element={
          <div style={{padding:32,color:'#f1f5f9',textAlign:'center'}}>
            🚧 Trang hồ sơ tài xế đang phát triển
          </div>
        } />
      </Route>

      {/* ── CLIENT ─────────────────────────────────────── */}
      <Route path="/client" element={<ClientLayout />}>
        <Route index element={
          <div style={{padding:'80px 24px',textAlign:'center',color:'#1e293b'}}>
            <h2 style={{fontSize:32,fontWeight:900,marginBottom:8}}>Chào mừng đến Vận Trình 🚌</h2>
            <p style={{color:'#64748b',fontSize:15,marginBottom:28}}>Đặt vé xe khách nhanh chóng, an toàn, tiện lợi</p>
            <a href="/client/search" style={{
              display:'inline-block', background:'#2563eb', color:'#fff',
              padding:'14px 32px', borderRadius:14, textDecoration:'none',
              fontWeight:800, fontSize:15, boxShadow:'0 4px 14px rgba(37,99,235,0.35)'
            }}>
              🔍 Tìm chuyến xe ngay →
            </a>
          </div>
        } />
        <Route path="search"     element={<div style={{padding:40,textAlign:'center',color:'#64748b'}}>🚧 Trang tìm kiếm đang phát triển</div>} />
        <Route path="booking"    element={<div style={{padding:40,textAlign:'center',color:'#64748b'}}>🚧 Trang đặt vé đang phát triển</div>} />
        <Route path="my-tickets" element={<div style={{padding:40,textAlign:'center',color:'#64748b'}}>🚧 Vé của tôi đang phát triển</div>} />
      </Route>

      {/* ── FALLBACK ──────────────────────────────────── */}
      <Route path="*" element={
        <Navigate to={isAuthenticated ? homeByRole() : '/login'} replace />
      } />

    </Routes>
  );
}
