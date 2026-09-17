import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Clock, Bus, ArrowRight, Filter, AlertCircle } from 'lucide-react';
import { chuyenXeApi } from '../../src/api/chuyenXeApi';
import { tuyenXeApi } from '../../src/api/tuyenXeApi';

export default function ClientSearch() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [diemDi, setDiemDi] = useState(searchParams.get('diemDi') || '');
  const [diemDen, setDiemDen] = useState(searchParams.get('diemDen') || '');
  const [ngay, setNgay] = useState(searchParams.get('ngay') || '');

  const [tuyenList, setTuyenList] = useState([]);
  const [chuyenList, setChuyenList] = useState([]);
  const [filteredChuyen, setFilteredChuyen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (overrideDiemDi, overrideDiemDen, overrideNgay) => {
    try {
      setLoading(true);
      setError(null);
      const di = overrideDiemDi !== undefined ? overrideDiemDi : diemDi;
      const den = overrideDiemDen !== undefined ? overrideDiemDen : diemDen;
      const date = overrideNgay !== undefined ? overrideNgay : ngay;

      const [tuyenRes, chuyenRes] = await Promise.all([
        tuyenXeApi.getAll(),
        chuyenXeApi.getUpcoming({ diem_di: di || undefined, diem_den: den || undefined, ngay: date || undefined }),
      ]);
      setTuyenList(tuyenRes.data || []);
      const allChuyen = chuyenRes.data || [];
      setChuyenList(allChuyen);
      setFilteredChuyen(allChuyen);
    } catch (err) {
      console.error('Lỗi nạp chuyến xe:', err);
      setError('Không thể kết nối đến Backend FastAPI để lấy dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const filterTrips = (chuyens, tuyens, from, to, dateStr) => {
    let result = [...chuyens];
    if (from || to) {
      result = result.filter(c => {
        const tuyen = tuyens.find(t => t.MaTuyen === c.MaTuyen);
        if (!tuyen) return true;
        const matchFrom = !from || tuyen.DiemDi?.toLowerCase().includes(from.toLowerCase());
        const matchTo = !to || tuyen.DiemDen?.toLowerCase().includes(to.toLowerCase());
        return matchFrom && matchTo;
      });
    }
    if (dateStr) {
      result = result.filter(c => {
        if (!c.ThoiGianKhoiHanh) return true;
        return c.ThoiGianKhoiHanh.startsWith(dateStr);
      });

    }
    setFilteredChuyen(result);
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchData(diemDi, diemDen, ngay);
  };

  const getTuyenInfo = (maTuyen) => {
    return tuyenList.find(t => t.MaTuyen === maTuyen) || {};
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '32px 24px 60px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Title */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', margin: 0 }}>
            🔍 Tìm Kiếm Chuyến Xe
          </h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
            Tra cứu tất cả lịch trình, giờ khởi hành và giá vé xe khách hiện có
          </p>
        </div>

        {/* Filter Bar */}
        <form
          onSubmit={handleFilter}
          style={{
            background: '#fff', padding: 20, borderRadius: 16, border: '1px solid #e2e8f0',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) auto', gap: 16,
            marginBottom: 32, boxShadow: '0 4px 12px rgba(0,0,0,0.04)', alignItems: 'end'
          }}
        >
          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 6 }}>
              ĐIỂM ĐI
            </label>
            <input
              type="text"
              placeholder="VD: Gia Lai, TP.HCM..."
              value={diemDi}
              onChange={(e) => setDiemDi(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 14, outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 6 }}>
              ĐIỂM ĐẾN
            </label>
            <input
              type="text"
              placeholder="VD: Quy Nhơn, Hà Nội..."
              value={diemDen}
              onChange={(e) => setDiemDen(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 14, outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 6 }}>
              NGÀY ĐI
            </label>
            <input
              type="date"
              value={ngay}
              onChange={(e) => setNgay(e.target.value)}
              style={{ width: '100%', padding: '9px 14px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 14, outline: 'none' }}
            />
          </div>
          <button
            type="submit"
            style={{
              background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10,
              padding: '12px 24px', fontWeight: 800, fontSize: 14, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8, height: 42
            }}
          >
            <Filter size={16} /> Lọc Chuyến
          </button>
        </form>

        {/* Results */}
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#64748b' }}>
            ⏳ Đang tìm kiếm chuyến xe...
          </div>
        ) : error ? (
          <div style={{ padding: 20, background: '#fef2f2', color: '#ef4444', borderRadius: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        ) : filteredChuyen.length === 0 ? (
          <div style={{ background: '#fff', padding: 60, borderRadius: 16, textAlign: 'center', border: '1px solid #e2e8f0' }}>
            <Bus size={48} color="#cbd5e1" style={{ marginBottom: 12 }} />
            <h3 style={{ fontSize: 18, color: '#1e293b', margin: 0 }}>Không tìm thấy chuyến xe phù hợp</h3>
            <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Vui lòng thử thay đổi điểm đi/đến hoặc ngày tìm kiếm.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredChuyen.map((chuyen) => {
              const tuyen = getTuyenInfo(chuyen.MaTuyen);
              const startTime = chuyen.ThoiGianKhoiHanh
                ? new Date(chuyen.ThoiGianKhoiHanh).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
                : 'N/A';

              return (
                <div
                  key={chuyen.MaChuyen}
                  style={{
                    background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e2e8f0',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: 12, fontWeight: 800, padding: '3px 8px', borderRadius: 6 }}>
                        {chuyen.MaChuyen}
                      </span>
                      <span style={{ fontSize: 13, color: '#64748b' }}>
                        Tuyến: <strong>{chuyen.MaTuyen}</strong>
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{tuyen.DiemDi || 'N/A'}</span>
                      <ArrowRight size={18} color="#2563eb" />
                      <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{tuyen.DiemDen || 'N/A'}</span>
                    </div>

                    <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 13, color: '#475569' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Clock size={14} color="#2563eb" /> {startTime}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Bus size={14} color="#059669" /> Xe: {chuyen.MaXe || 'Đang xếp'}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: 160 }}>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Giá vé chính thức</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#2563eb', marginBottom: 10 }}>
                      {Number(chuyen.GiaVe || 0).toLocaleString('vi-VN')} đ
                    </div>
                    <button
                      onClick={() => navigate(`/client/booking?maChuyen=${chuyen.MaChuyen}`)}
                      style={{
                        background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10,
                        padding: '10px 20px', fontWeight: 800, fontSize: 14, cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
                      }}
                    >
                      Chọn Chuyến này
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
