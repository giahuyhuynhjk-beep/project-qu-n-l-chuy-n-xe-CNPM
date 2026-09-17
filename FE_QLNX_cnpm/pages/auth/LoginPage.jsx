import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../src/contexts/AuthContext';
import { ROLE_TYPES, APP_ROUTES } from '../../src/constants';
import { Bus, Eye, EyeOff, ShieldCheck, UserRound, Car, User } from 'lucide-react';

// ============================================================
// LOGIN PAGE – Đăng nhập thật với JWT, phân quyền 4 vai trò
// ============================================================
const ROLE_OPTIONS = [
  { key: ROLE_TYPES.ADMIN,  label: 'Quản trị viên', icon: ShieldCheck, hint: 'admin / admin123' },
  { key: ROLE_TYPES.STAFF,  label: 'Nhân viên',     icon: UserRound,   hint: 'staff / staff123' },
  { key: ROLE_TYPES.DRIVER, label: 'Tài xế',        icon: Car,         hint: 'driver / driver123' },
];

// Redirect map: sau login → đi đâu theo role
const REDIRECT_MAP = {
  [ROLE_TYPES.ADMIN]:  '/admin',
  [ROLE_TYPES.STAFF]:  '/',
  [ROLE_TYPES.DRIVER]: '/driver-dashboard',
  [ROLE_TYPES.CLIENT]: '/client',
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState(ROLE_TYPES.STAFF);
  const [username, setUsername]         = useState('');
  const [password, setPassword]         = useState('');
  const [showPass, setShowPass]         = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Vui lòng nhập tên đăng nhập và mật khẩu.');
      return;
    }
    setError('');
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      // Redirect dựa trên role trả về từ server
      const dest = REDIRECT_MAP[result.role] || '/';
      navigate(dest, { replace: true });
    } else {
      setError(result.error || 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
    setLoading(false);
  };

  const activeRoleData = ROLE_OPTIONS.find((r) => r.key === selectedRole);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
      fontFamily: "'Inter', 'Segoe UI', sans-serif", padding: 24,
    }}>
      {/* Decorative blobs */}
      <div style={{ position: 'fixed', top: '-20%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-15%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{
        width: '100%', maxWidth: 440, background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 24, padding: '40px 36px',
        backdropFilter: 'blur(20px)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        position: 'relative', zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, background: 'linear-gradient(135deg, #2563eb, #06b6d4)', borderRadius: 16, marginBottom: 16, boxShadow: '0 8px 24px rgba(37,99,235,0.4)' }}>
            <Bus size={28} color="#fff" />
          </div>
          <h1 style={{ color: '#f1f5f9', fontSize: 24, fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>Vận Trình</h1>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 6, fontWeight: 500 }}>Hệ thống quản lý nhà xe</p>
        </div>

        {/* Role selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 28 }}>
          {ROLE_OPTIONS.map(({ key, label, icon: Icon }) => {
            const active = selectedRole === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedRole(key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 14px', borderRadius: 12, cursor: 'pointer',
                  border: active ? '1px solid #2563eb' : '1px solid rgba(255,255,255,0.08)',
                  background: active ? 'rgba(37,99,235,0.2)' : 'rgba(255,255,255,0.03)',
                  color: active ? '#93c5fd' : '#64748b', fontWeight: 700, fontSize: 13,
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={16} />
                {label}
              </button>
            );
          })}
        </div>

        {/* Hint */}
        {activeRoleData && (
          <div style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 10, padding: '8px 14px', marginBottom: 20, fontSize: 12, color: '#93c5fd', fontWeight: 600 }}>
            💡 Demo: {activeRoleData.hint}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập..."
              autoComplete="username"
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 12, fontSize: 14, outline: 'none',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#f1f5f9', boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Mật khẩu
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                autoComplete="current-password"
                style={{
                  width: '100%', padding: '12px 44px 12px 16px', borderRadius: 12, fontSize: 14, outline: 'none',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#f1f5f9', boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '10px 14px', color: '#fca5a5', fontSize: 13, fontWeight: 600 }}>
              ⚠️ {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px', borderRadius: 12, border: 'none',
              background: loading ? '#374151' : 'linear-gradient(135deg, #2563eb, #06b6d4)',
              color: '#fff', fontSize: 15, fontWeight: 900, cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 4, transition: 'opacity 0.2s',
              boxShadow: loading ? 'none' : '0 8px 24px rgba(37,99,235,0.35)',
            }}
          >
            {loading ? '⏳ Đang đăng nhập...' : '🚀 Đăng nhập hệ thống'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => navigate('/client')}
            style={{
              background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
              color: '#f1f5f9', fontSize: 14, fontWeight: 700,
              padding: '12px 24px', borderRadius: 12, cursor: 'pointer',
              transition: 'background 0.2s', width: '100%'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
            onMouseOut={(e) => e.target.style.background = 'transparent'}
          >
            🚌 Truy cập dành cho Khách hàng
            <br/>
            <span style={{ fontSize: 12, fontWeight: 500, color: '#94a3b8' }}>(Không cần đăng nhập)</span>
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#475569', marginTop: 24 }}>
          © 2026 Vận Trình – Hệ thống quản lý nhà xe
        </p>
      </div>
    </div>
  );
}
