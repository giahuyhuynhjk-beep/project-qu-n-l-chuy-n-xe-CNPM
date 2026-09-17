import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../src/contexts/AuthContext';
import { LayoutDashboard, CalendarDays, AlertTriangle, UserCircle, LogOut } from 'lucide-react';

// ============================================================
// DRIVER LAYOUT – Mobile-first, dark theme, bottom navigation
// Tối ưu cho màn hình điện thoại (375px+)
// ============================================================
export default function DriverLayout() {
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/driver-dashboard',           label: 'Tổng quan', icon: LayoutDashboard },
    { path: '/driver-dashboard/schedule',  label: 'Lịch chạy', icon: CalendarDays },
    { path: '/driver-dashboard/incident',  label: 'Sự cố',     icon: AlertTriangle },
    { path: '/driver-dashboard/profile',   label: 'Hồ sơ',     icon: UserCircle },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0a1128', color: '#fff', fontFamily: 'sans-serif', paddingBottom: 72 }}>
      {/* ---- TOP HEADER (mobile) ---- */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: '#0d1635', position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Logo dot */}
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22d3ee' }} />
          <span style={{ fontWeight: 900, fontSize: 16, letterSpacing: '-0.3px' }}>Vận Trình</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>
            {user?.username || 'Tài xế'}
          </span>
          <button
            onClick={logout}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.15)', border: 'none', color: '#f87171', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
          >
            <LogOut size={14} />
            Thoát
          </button>
        </div>
      </header>

      {/* ---- MAIN CONTENT ---- */}
      <main style={{ minHeight: 'calc(100vh - 140px)' }}>
        <Outlet />
      </main>

      {/* ---- BOTTOM NAVIGATION (mobile) ---- */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: '#0d1635', borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '8px 0', height: 72,
      }}>
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/driver-dashboard'}
            style={({ isActive }) => ({
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              color: isActive ? '#22d3ee' : '#64748b',
              textDecoration: 'none', flex: 1, padding: '4px 0',
              transition: 'color 0.2s',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={22} />
                <span style={{ fontSize: 10, fontWeight: 700 }}>{label}</span>
                {isActive && (
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#22d3ee', marginTop: -2 }} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
