import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../src/contexts/AuthContext';
import {
  LayoutDashboard, Ticket, Bus, UserCheck,
  CreditCard, Headphones, RotateCcw, LogOut, User, Route
} from 'lucide-react';
import '../components/shared/sidebar.css';

// ============================================================
// STAFF LAYOUT – Sidebar + Outlet (giữ nguyên giao diện cũ,
//                thêm useAuth để logout và hiển thị tên
// ============================================================
export default function StaffLayout() {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = React.useState(false);

  const menuGroups = [
    {
      group: 'QUẢN LÝ VẬN HÀNH',
      items: [
        { id: 'chuyen-xe',    label: 'Quản lý chuyến xe',    icon: Bus,    path: '/quan-ly-chuyen-xe' },
        { id: 'tai-xe',       label: 'Phân công tài xế & xe', icon: UserCheck, path: '/driver' },
        { id: 'tuyen-duong',  label: 'Quản lý tuyến đường',   icon: Route,  path: '/tuyen-duong' },
      ],
    },
    {
      group: 'QUẢN LÝ ĐẶT VÉ & CSKH',
      items: [
        { id: 'dat-ve',     label: 'Quản lý đặt vé',       icon: Ticket,       path: '/' },
        { id: 'thanh-toan', label: 'Xác nhận thanh toán',  icon: CreditCard,   path: '/payment' },
        { id: 'huy-ve',     label: 'Xử lý hủy/đổi vé',    icon: RotateCcw,    path: '/refund' },
        { id: 'ho-tro',     label: 'Hỗ trợ khách hàng',   icon: Headphones,   path: '/support' },
      ],
    },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* ---- SIDEBAR ---- */}
      <aside className={`sidebar ${collapsed ? 'collapsed' : 'expanded'}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Bus size={18} color="#ffffff" />
          </div>
          {!collapsed && <span className="sidebar-logo-text">Vận Trình</span>}
        </div>

        {/* Dashboard link */}
        <div className="sidebar-top">
          <NavLink
            to="/tongquan"
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <span style={{ flexShrink: 0 }}>
              <LayoutDashboard size={18} />
            </span>
            {!collapsed && <span className="sidebar-item-label">Dashboard</span>}
          </NavLink>
        </div>

        {/* Menu groups */}
        <div className="sidebar-scroll">
          {menuGroups.map((group) => (
            <div key={group.group} className="sidebar-group">
              {!collapsed
                ? <div className="sidebar-group-label">{group.group}</div>
                : <div className="sidebar-group-divider" />
              }
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                    title={collapsed ? item.label : ''}
                  >
                    <span style={{ flexShrink: 0 }}><Icon size={18} /></span>
                    {!collapsed && <span className="sidebar-item-label">{item.label}</span>}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer: user info + logout */}
        <div className="sidebar-footer">
          {/* Tên người dùng */}
          {!collapsed && (
            <div style={{ padding: '8px 12px', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f5f9', borderRadius: 10, padding: '8px 10px' }}>
                <User size={14} color="#3b82f6" />
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 900, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.username || 'Nhân viên'}
                  </p>
                  <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>Nhân viên vận hành</p>
                </div>
              </div>
            </div>
          )}

          <button onClick={logout} className="sidebar-logout" title={collapsed ? 'Đăng xuất' : ''}>
            <span style={{ flexShrink: 0 }}><LogOut size={18} color="#ef4444" /></span>
            {!collapsed && <span className="sidebar-logout-text">Đăng xuất</span>}
          </button>

          <div className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
            <span style={{ flexShrink: 0, fontSize: 18 }}>{collapsed ? '›' : '‹'}</span>
            {!collapsed && <span>Thu gọn</span>}
          </div>
        </div>
      </aside>

      {/* ---- NỘI DUNG CHÍNH ---- */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <Outlet />
      </div>
    </div>
  );
}