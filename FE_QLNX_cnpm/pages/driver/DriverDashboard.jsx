import React, { useState } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';
import { useChuyenXe } from '../../src/hooks/useChuyenXe';
import { formatDateTime, formatMoney } from '../../src/utils';
import { Calendar, MapPin, Users, Clock, CheckCircle, PlayCircle, Loader } from 'lucide-react';

// ============================================================
// DRIVER DASHBOARD – Tài xế xem lịch chạy của mình
// ============================================================
const STATUS_STYLE = {
  'ĐANG CHẠY':   { bg: '#dcfce7', color: '#16a34a', dot: '#22c55e' },
  'ĐÃ ĐẾN':     { bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6' },
  'KHỞI TẠO':   { bg: '#f1f5f9', color: '#475569', dot: '#94a3b8' },
  'ĐÃ PHÂN CÔNG': { bg: '#fef9c3', color: '#a16207', dot: '#eab308' },
};

export default function DriverDashboard() {
  const { user } = useAuth();
  const { data: trips, loading, error, update } = useChuyenXe();
  const [activeTab, setActiveTab] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  // Filter chuyến theo tab
  const myTrips = trips; // Trong thực tế: filter theo MaTaiXe của user
  const filtered = myTrips.filter((t) => {
    if (activeTab === 'upcoming') return t.TrangThai === 'ĐÃ PHÂN CÔNG' || t.TrangThai === 'KHỞI TẠO';
    if (activeTab === 'running')  return t.TrangThai === 'ĐANG CHẠY';
    return true;
  });

  // Cập nhật trạng thái chuyến
  const updateStatus = async (maChuyen, newStatus) => {
    setUpdatingId(maChuyen);
    try {
      await update(maChuyen, { TrangThai: newStatus });
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, color: '#64748b' }}>
      <Loader size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: 12 }} />
      <p style={{ fontWeight: 600 }}>Đang tải lịch chạy...</p>
    </div>
  );

  if (error) return (
    <div style={{ margin: 20, padding: '16px 20px', background: 'rgba(239,68,68,0.15)', borderRadius: 12, color: '#fca5a5', fontSize: 13 }}>
      ⚠️ {error}
    </div>
  );

  return (
    <div style={{ padding: '20px 16px', maxWidth: 680, margin: '0 auto' }}>

      {/* --- Welcome card --- */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f, #0d2137)',
        borderRadius: 20, padding: '24px 20px', marginBottom: 24,
        border: '1px solid rgba(34,211,238,0.2)',
      }}>
        <p style={{ color: '#22d3ee', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', marginBottom: 6 }}>XIN CHÀO</p>
        <h2 style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 900, margin: '0 0 4px' }}>
          {user?.HoTen || user?.username || 'Tài xế'}
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>
          <Calendar size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
        </p>

        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 20 }}>
          {[
            { label: 'Tổng chuyến', value: myTrips.length, color: '#22d3ee' },
            { label: 'Đang chạy',   value: myTrips.filter(t => t.TrangThai === 'ĐANG CHẠY').length, color: '#4ade80' },
            { label: 'Hoàn thành',  value: myTrips.filter(t => t.TrangThai === 'ĐÃ ĐẾN').length, color: '#a78bfa' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
              <p style={{ color, fontSize: 22, fontWeight: 900, margin: 0 }}>{value}</p>
              <p style={{ color: '#64748b', fontSize: 10, fontWeight: 700, marginTop: 4 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- Tabs --- */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[
          { key: 'all',      label: 'Tất cả' },
          { key: 'upcoming', label: 'Sắp tới' },
          { key: 'running',  label: 'Đang chạy' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
              background: activeTab === key ? '#22d3ee' : 'rgba(255,255,255,0.06)',
              color: activeTab === key ? '#0f172a' : '#64748b',
              transition: 'all 0.2s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* --- Trip list --- */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#475569' }}>
          <p style={{ fontSize: 36, marginBottom: 12 }}>🚌</p>
          <p style={{ fontWeight: 700 }}>Không có chuyến nào</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((trip) => {
            const st = STATUS_STYLE[trip.TrangThai] || STATUS_STYLE['KHỞI TẠO'];
            const isUpdating = updatingId === trip.MaChuyen;
            return (
              <div key={trip.MaChuyen} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16, padding: '18px 16px', transition: 'border-color 0.2s',
              }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <p style={{ color: '#22d3ee', fontSize: 11, fontWeight: 800, marginBottom: 4 }}>{trip.MaChuyen}</p>
                    <p style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 900 }}>
                      {trip.DiemDi} → {trip.DiemDen}
                    </p>
                  </div>
                  <span style={{ background: st.bg, color: st.color, padding: '4px 10px', borderRadius: 8, fontSize: 10, fontWeight: 800 }}>
                    {trip.TrangThai}
                  </span>
                </div>

                {/* Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 12 }}>
                    <Clock size={12} />
                    {formatDateTime(trip.ThoiGianKhoiHanh)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 12 }}>
                    <Users size={12} />
                    Còn {trip.SoGheTrong || '?'} ghế trống
                  </div>
                </div>

                {/* Action buttons */}
                {trip.TrangThai === 'ĐÃ PHÂN CÔNG' && (
                  <button
                    onClick={() => updateStatus(trip.MaChuyen, 'ĐANG CHẠY')}
                    disabled={isUpdating}
                    style={{
                      width: '100%', padding: '10px', borderRadius: 10, border: 'none', cursor: 'pointer',
                      background: '#22d3ee', color: '#0f172a', fontWeight: 800, fontSize: 13,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}
                  >
                    <PlayCircle size={16} />
                    {isUpdating ? 'Đang cập nhật...' : 'Bắt đầu chuyến'}
                  </button>
                )}
                {trip.TrangThai === 'ĐANG CHẠY' && (
                  <button
                    onClick={() => updateStatus(trip.MaChuyen, 'ĐÃ ĐẾN')}
                    disabled={isUpdating}
                    style={{
                      width: '100%', padding: '10px', borderRadius: 10, border: 'none', cursor: 'pointer',
                      background: '#4ade80', color: '#14532d', fontWeight: 800, fontSize: 13,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}
                  >
                    <CheckCircle size={16} />
                    {isUpdating ? 'Đang cập nhật...' : 'Xác nhận đã đến'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
