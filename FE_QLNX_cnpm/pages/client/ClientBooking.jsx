import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Bus, User, Phone, CheckCircle, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { chuyenXeApi } from '../../src/api/chuyenXeApi';
import { veApi } from '../../src/api/veApi';

export default function ClientBooking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const maChuyen = searchParams.get('maChuyen') || 'CX001';

  const [chuyen, setChuyen] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState('A1');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const availableSeats = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4'];

  useEffect(() => {
    fetchChuyenDetail();
  }, [maChuyen]);

  const fetchChuyenDetail = async () => {
    try {
      setLoading(true);
      const res = await chuyenXeApi.getById(maChuyen);
      setChuyen(res.data);
    } catch (err) {
      console.error('Lỗi lấy chi tiết chuyến:', err);
      // Fallback
      setChuyen({
        MaChuyen: maChuyen,
        MaTuyen: 'TX001',
        GiaVe: 150000,
        ThoiGianKhoiHanh: new Date().toISOString(),
        TrangThaiCX: 'Sap chay'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ Họ tên và Số điện thoại');
      return;
    }

    // Validate phone - chỉ số, 10 chữ số
    if (!/^0\d{9}$/.test(phone.trim())) {
      setErrorMsg('Số điện thoại không hợp lệ (phải bắt đầu bằng 0, đủ 10 chữ số)');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');

      const ticketData = {
        // Không truyền MaVe - để backend tự generate
        MaChuyen: maChuyen,
        SoGhe: selectedSeat,
        TenKhachHang: name.trim(),
        SoDienThoai: phone.trim(),
        GiaVe: Number(chuyen?.GiaVe || 150000),
        TrangThaiV: 'Đã đặt'
      };

      const res = await veApi.create(ticketData);
      const maVeTao = res.data?.MaVe || '';
      setSuccessMsg(`✅ Đặt vé thành công! Mã vé: ${maVeTao} — Ghế: ${selectedSeat}`);
      setTimeout(() => {
        navigate('/client/my-tickets');
      }, 2500);

    } catch (err) {
      console.error('Lỗi tạo vé:', err);
      const detail = err?.response?.data?.detail;
      if (typeof detail === 'string') {
        setErrorMsg(detail);
      } else if (Array.isArray(detail?.errors)) {
        setErrorMsg(detail.errors.map(e => e.message).join(', '));
      } else {
        setErrorMsg('Đặt vé thất bại. Vui lòng thử lại hoặc chọn ghế khác.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '32px 24px 60px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', margin: 0 }}>
            🎫 Đặt Vé Chuyến Xe {maChuyen}
          </h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
            Chọn vị trí ghế ngồi và nhập thông tin hành khách để hoàn tất đặt giữ chỗ
          </p>
        </div>

        {successMsg && (
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#15803d', padding: 20, borderRadius: 16, marginBottom: 24, fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckCircle size={24} />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', padding: 16, borderRadius: 12, marginBottom: 24, fontSize: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertCircle size={20} />
            <span>{errorMsg}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          
          {/* Sơ đồ chọn ghế */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bus size={18} color="#2563eb" /> Sơ Đồ Ghế Ngồi
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
              {availableSeats.map(seat => {
                const isSelected = selectedSeat === seat;
                return (
                  <button
                    key={seat}
                    type="button"
                    onClick={() => setSelectedSeat(seat)}
                    style={{
                      padding: '12px 8px', borderRadius: 12, border: '2px solid',
                      borderColor: isSelected ? '#2563eb' : '#e2e8f0',
                      background: isSelected ? '#2563eb' : '#f8fafc',
                      color: isSelected ? '#fff' : '#1e293b',
                      fontWeight: 800, fontSize: 14, cursor: 'pointer',
                      transition: 'all 0.2s', textAlign: 'center'
                    }}
                  >
                    {seat}
                  </button>
                );
              })}
            </div>

            <div style={{ background: '#f1f5f9', borderRadius: 12, padding: 12, fontSize: 13, color: '#475569', textAlign: 'center' }}>
              Ghế đang chọn: <strong style={{ color: '#2563eb', fontSize: 15 }}>{selectedSeat}</strong>
            </div>
          </div>

          {/* Form thông tin hành khách */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>
              👤 Thông Tin Hành Khách
            </h3>

            <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 6 }}>
                  HỌ VÀ TÊN HÀNH KHÁCH *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nhập họ và tên đầy đủ..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #cbd5e1', fontSize: 14, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 6 }}>
                  SỐ ĐIỆN THOẠI LIÊN HỆ *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Nhập số điện thoại..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #cbd5e1', fontSize: 14, outline: 'none' }}
                />
              </div>

              {/* Tóm tắt giá */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16, marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13, color: '#64748b' }}>
                  <span>Giá vé (1 ghế):</span>
                  <span>{Number(chuyen?.GiaVe || 150000).toLocaleString('vi-VN')} đ</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 900, color: '#2563eb' }}>
                  <span>TỔNG CỘNG:</span>
                  <span>{Number(chuyen?.GiaVe || 150000).toLocaleString('vi-VN')} đ</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: '#fff', border: 'none', borderRadius: 12,
                  padding: '14px', fontWeight: 800, fontSize: 15, cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.35)', marginTop: 8,
                  opacity: submitting ? 0.7 : 1
                }}
              >
                {submitting ? '⌛ Đang xử lý...' : 'XÁC NHẬN ĐẶT VÉ'}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
