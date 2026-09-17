import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Clock, Bus, ShieldCheck, ArrowRight, DollarSign, Star, AlertCircle } from 'lucide-react';
import { chuyenXeApi } from '../../src/api/chuyenXeApi';
import { tuyenXeApi } from '../../src/api/tuyenXeApi';

export default function ClientHome() {
  const navigate = useNavigate();
  const [diemDi, setDiemDi] = useState('');
  const [diemDen, setDiemDen] = useState('');
  const [ngayDi, setNgayDi] = useState('');
  
  const [tuyenList, setTuyenList] = useState([]);
  const [chuyenList, setChuyenList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [tuyenRes, chuyenRes] = await Promise.all([
        tuyenXeApi.getAll(),
        chuyenXeApi.getUpcoming(), // chỉ lấy chuyến sắp chạy
      ]);
      setTuyenList(tuyenRes.data || []);
      setChuyenList(chuyenRes.data || []);
    } catch (err) {
      console.error('Lỗi fetch chuyến xe:', err);
      setError('Không thể nạp danh sách chuyến xe từ server (FastAPI). Vui lòng kiểm tra backend.');
    } finally {
      setLoading(false);
    }
  };


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/client/search?diemDi=${encodeURIComponent(diemDi)}&diemDen=${encodeURIComponent(diemDen)}&ngay=${ngayDi}`);
  };

  // Helper map TuyenXe ID to info
  const getTuyenInfo = (maTuyen) => {
    return tuyenList.find(t => t.MaTuyen === maTuyen) || {};
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: 60 }}>
      {/* ── HERO BANNER SEARCH ─────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0284c7 100%)',
        color: '#fff',
        padding: '60px 24px 80px',
        textAlign: 'center',
        position: 'relative',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <span style={{
            background: 'rgba(255,255,255,0.15)', color: '#bfdbfe',
            fontSize: 13, fontWeight: 800, padding: '6px 16px', borderRadius: 20,
            letterSpacing: '0.5px', textTransform: 'uppercase'
          }}>
            🚌 ĐẶT VÉ XE KHÁCH TRỰC TUYẾN 24/7
          </span>
          <h1 style={{ fontSize: 38, fontWeight: 900, marginTop: 16, marginBottom: 12, lineHeight: 1.2 }}>
            Hành Trình An Toàn - Trải Nghiệm Trọn Vẹn
          </h1>
          <p style={{ fontSize: 16, color: '#e0f2fe', marginBottom: 36, fontWeight: 500 }}>
            Tìm kiếm & Đặt vé xe khách chất lượng cao từ các nhà xe uy tín trên toàn quốc
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              background: '#fff',
              borderRadius: 20,
              padding: '20px 24px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) auto',
              gap: 16,
              alignItems: 'end',
              textAlign: 'left'
            }}
          >
            {/* Điểm đi */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 800, color: '#475569', marginBottom: 6, textTransform: 'uppercase' }}>
                <MapPin size={14} color="#2563eb" /> Điểm Đi
              </label>
              <select
                value={diemDi}
                onChange={(e) => setDiemDi(e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #cbd5e1',
                  fontSize: 14, fontWeight: 600, color: '#0f172a', outline: 'none', background: '#f8fafc'
                }}
              >
                <option value="">-- Tất cả điểm đi --</option>
                {[...new Set(tuyenList.map(t => t.DiemDi))].map((diem, i) => (
                  <option key={i} value={diem}>{diem}</option>
                ))}
              </select>
            </div>

            {/* Điểm đến */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 800, color: '#475569', marginBottom: 6, textTransform: 'uppercase' }}>
                <MapPin size={14} color="#ef4444" /> Điểm Đến
              </label>
              <select
                value={diemDen}
                onChange={(e) => setDiemDen(e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #cbd5e1',
                  fontSize: 14, fontWeight: 600, color: '#0f172a', outline: 'none', background: '#f8fafc'
                }}
              >
                <option value="">-- Tất cả điểm đến --</option>
                {[...new Set(tuyenList.map(t => t.DiemDen))].map((diem, i) => (
                  <option key={i} value={diem}>{diem}</option>
                ))}
              </select>
            </div>

            {/* Ngày đi */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 800, color: '#475569', marginBottom: 6, textTransform: 'uppercase' }}>
                <Calendar size={14} color="#059669" /> Ngày Khởi Hành
              </label>
              <input
                type="date"
                value={ngayDi}
                onChange={(e) => setNgayDi(e.target.value)}
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: 12, border: '1px solid #cbd5e1',
                  fontSize: 14, fontWeight: 600, color: '#0f172a', outline: 'none', background: '#f8fafc'
                }}
              />
            </div>

            {/* Nút tìm */}
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#fff',
                border: 'none',
                borderRadius: 14,
                padding: '14px 28px',
                fontWeight: 800,
                fontSize: 15,
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(37,99,235,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                height: 48
              }}
            >
              <Search size={18} />
              Tìm Chuyến
            </button>
          </form>
        </div>
      </section>

      {/* ── LIVE CHUYẾN XE TỪ DATABASE LOCAL ─────────────────── */}
      <section style={{ maxWidth: 1200, margin: '-30px auto 40px', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Bus size={24} color="#2563eb" />
                Danh Sách Chuyến Xe Đang Mở Bán
              </h2>
              <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Dữ liệu trực tiếp từ MySQL Local Server</p>
            </div>
            <button
              onClick={() => navigate('/client/search')}
              style={{ background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: 10, padding: '8px 16px', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              Xem tất cả <ArrowRight size={14} />
            </button>
          </div>

          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
              ⏳ Đang nạp danh sách chuyến xe từ MySQL...
            </div>
          ) : error ? (
            <div style={{ padding: 20, background: '#fef2f2', borderRadius: 12, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          ) : chuyenList.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
              Chưa có chuyến xe nào được cập nhật trong MySQL Local.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
              {chuyenList.map((chuyen) => {
                const tuyen = getTuyenInfo(chuyen.MaTuyen);
                const startTime = chuyen.ThoiGianKhoiHanh
                  ? new Date(chuyen.ThoiGianKhoiHanh).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
                  : 'N/A';

                return (
                  <div
                    key={chuyen.MaChuyen}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: 16,
                      padding: 20,
                      background: '#fff',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      {/* Header trip card */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: 12, fontWeight: 800, padding: '4px 10px', borderRadius: 8 }}>
                          {chuyen.MaChuyen}
                        </span>
                        <span style={{
                          background: chuyen.TrangThaiCX === 'Sap chay' ? '#dcfce7' : '#f1f5f9',
                          color: chuyen.TrangThaiCX === 'Sap chay' ? '#15803d' : '#64748b',
                          fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 8
                        }}>
                          ● {chuyen.TrangThaiCX || 'Sẵn sàng'}
                        </span>
                      </div>

                      {/* Route */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
                            {tuyen.DiemDi || 'Gia Lai'}
                          </div>
                        </div>
                        <ArrowRight size={18} color="#94a3b8" />
                        <div style={{ flex: 1, textAlign: 'right' }}>
                          <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
                            {tuyen.DiemDen || 'Quy Nhơn'}
                          </div>
                        </div>
                      </div>

                      {/* Time & Vehicle */}
                      <div style={{ background: '#f8fafc', borderRadius: 12, padding: 12, marginBottom: 16, fontSize: 13, color: '#475569', display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Clock size={14} color="#2563eb" />
                          <span>Khởi hành: <strong>{startTime}</strong></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Bus size={14} color="#059669" />
                          <span>Mã xe: <strong>{chuyen.MaXe || '51B-12345'}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
                      <div>
                        <span style={{ fontSize: 11, color: '#64748b', display: 'block' }}>Giá vé từ</span>
                        <span style={{ fontSize: 18, fontWeight: 900, color: '#2563eb' }}>
                          {Number(chuyen.GiaVe || 150000).toLocaleString('vi-VN')} đ
                        </span>
                      </div>
                      <button
                        onClick={() => navigate(`/client/booking?maChuyen=${chuyen.MaChuyen}`)}
                        style={{
                          background: '#2563eb', color: '#fff', border: 'none',
                          borderRadius: 10, padding: '10px 18px', fontWeight: 800,
                          fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.25)'
                        }}
                      >
                        Đặt vé ngay
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURE HIGHLIGHTS ─────────────────────────────── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 40px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 900, color: '#0f172a', marginBottom: 32 }}>
          Tại Sao Chọn Vận Trình Express?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0' }}>
            <div style={{ background: '#dbeafe', width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <ShieldCheck size={24} color="#2563eb" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Thanh Toán An Toàn</h3>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>Hỗ trợ đa dạng phương thức thanh toán an toàn, bảo mật và xác nhận giữ chỗ tức thì.</p>
          </div>

          <div style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0' }}>
            <div style={{ background: '#dcfce7', width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Bus size={24} color="#16a34a" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Xe Chất Lượng Cao</h3>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>Dàn xe giường nằm, Limousine cao cấp hiện đại được bảo trì định kỳ đầy đủ.</p>
          </div>

          <div style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0' }}>
            <div style={{ background: '#fef3c7', width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Star size={24} color="#d97706" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Hỗ Trợ 24/7</h3>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>Đội ngũ CSKH và Chatbot thông minh hỗ trợ giải đáp mọi thắc mắc của bạn mọi lúc.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
