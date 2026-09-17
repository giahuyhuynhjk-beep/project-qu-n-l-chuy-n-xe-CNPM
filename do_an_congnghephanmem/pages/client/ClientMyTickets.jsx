import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Search, CheckCircle, Clock, User, Phone, LogIn } from 'lucide-react';
import { useAuth } from '../../src/contexts/AuthContext';
import { veApi } from '../../src/api/veApi';

export default function ClientMyTickets() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPhone, setSearchPhone] = useState('');
  const [searchMaVe, setSearchMaVe] = useState('');
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchPhone.trim() && !searchMaVe.trim()) {
      setErrorMsg('Vui lòng nhập Số điện thoại hoặc Mã vé để tra cứu');
      return;
    }
    try {
      setLoading(true);
      setSearched(true);
      setErrorMsg('');
      const res = await veApi.search(searchPhone.trim() || undefined, searchMaVe.trim() || undefined);
      setTickets(res.data || []);
    } catch (err) {
      console.error('Lỗi tìm vé:', err);
      setErrorMsg('Không thể kết nối đến server. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '32px 24px 60px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <Ticket size={28} color="#2563eb" />
            Tra Cứu & Quản Lý Vé Xe
          </h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
            Kiểm tra chi tiết mã vé, thông tin chuyến xe và trạng thái thanh toán
          </p>
        </div>

        {/* Tra cứu theo SDT hoặc Mã vé */}
        <div style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0', marginBottom: 32, boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>
            🔎 Tra cứu vé theo Số Điện Thoại hoặc Mã Vé
          </h3>
          {errorMsg && (
            <div style={{ background: '#fef2f2', color: '#ef4444', padding: '10px 16px', borderRadius: 10, marginBottom: 12, fontSize: 13 }}>
              {errorMsg}
            </div>
          )}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Số điện thoại (VD: 0901111111)"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              style={{ flex: 1, minWidth: 180, padding: '12px 16px', borderRadius: 12, border: '1px solid #cbd5e1', fontSize: 14, outline: 'none' }}
            />
            <input
              type="text"
              placeholder="Mã vé (VD: CX001.01)"
              value={searchMaVe}
              onChange={(e) => setSearchMaVe(e.target.value)}
              style={{ flex: 1, minWidth: 180, padding: '12px 16px', borderRadius: 12, border: '1px solid #cbd5e1', fontSize: 14, outline: 'none' }}
            />
            <button
              type="submit"
              style={{
                background: '#2563eb', color: '#fff', border: 'none', borderRadius: 12,
                padding: '12px 24px', fontWeight: 800, fontSize: 14, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8
              }}
            >
              <Search size={16} /> Tìm vé
            </button>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
            ⏳ Đang kiểm tra thông tin vé...
          </div>
        ) : tickets.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {tickets.map((ve) => {
              const isPaid = ve.TrangThaiV === 'Đã thanh toán';
              const isBooked = ve.TrangThaiV === 'Đã đặt';
              const isCancelled = ve.TrangThaiV === 'Đã huỷ' || ve.TrangThaiV === 'Đã hủy';
              const badgeBg = isPaid ? '#dcfce7' : isCancelled ? '#fee2e2' : '#fef3c7';
              const badgeColor = isPaid ? '#15803d' : isCancelled ? '#dc2626' : '#d97706';
              return (
              <div
                key={ve.MaVe}
                style={{
                  background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', flexWrap: 'wrap', gap: 20
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ background: '#2563eb', color: '#fff', fontWeight: 900, fontSize: 13, padding: '4px 10px', borderRadius: 8 }}>
                      MÃ VÉ: {ve.MaVe}
                    </span>
                    <span style={{
                      background: badgeBg,
                      color: badgeColor,
                      fontWeight: 800, fontSize: 12, padding: '4px 10px', borderRadius: 8
                    }}>
                      ● {ve.TrangThaiV || 'Đã đặt'}
                    </span>
                  </div>

                  <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
                    Mã chuyến: {ve.MaChuyen} | Ghế số: <span style={{ color: '#2563eb' }}>{ve.SoGhe}</span>
                  </div>

                  <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#64748b' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <User size={14} color="#475569" /> Hành khách: {ve.TenKhachHang || 'Hành khách'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Phone size={14} color="#475569" /> SĐT: {ve.SoDienThoai}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: '#64748b' }}>Tổng tiền</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#2563eb' }}>
                    {Number(ve.GiaVe || 0).toLocaleString('vi-VN')} đ
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        ) : (
          <div style={{ background: '#fff', padding: 40, borderRadius: 16, textAlign: 'center', border: '1px solid #e2e8f0' }}>
            <Ticket size={44} color="#cbd5e1" style={{ marginBottom: 12 }} />
            <h3 style={{ fontSize: 16, color: '#1e293b', margin: 0 }}>
              {searched ? 'Không tìm thấy vé nào phù hợp với SĐT trên.' : 'Chưa có thông tin vé.'}
            </h3>
            <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
              Thử tra cứu bằng Số Điện Thoại ở khung tìm kiếm phía trên hoặc nhấp nút dưới để tìm chuyến mới.
            </p>
            <button
              onClick={() => navigate('/client/search')}
              style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 800, fontSize: 13, marginTop: 12, cursor: 'pointer' }}
            >
              Đặt vé xe ngay
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
