import React, { useState } from 'react';
import { useNhanVien } from '../../src/hooks/useNhanVien';
import { useXe } from '../../src/hooks/useXe';
import { useChuyenXe } from '../../src/hooks/useChuyenXe';
import { Loader, UserCheck, Bus, Search, ChevronRight } from 'lucide-react';

// ============================================================
// PHÂN CÔNG TÀI XẾ – Giao diện đầy đủ thay cho placeholder
// Kết nối 3 hooks: useNhanVien, useXe, useChuyenXe
// ============================================================
export default function PhanCongTaiXe() {
  const { drivers, loading: loadingNV } = useNhanVien();
  const { data: vehicles, loading: loadingXe } = useXe();
  const { data: trips, loading: loadingChuyen, update: updateTrip, refresh } = useChuyenXe();

  const [search, setSearch]        = useState('');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [assigning, setAssigning]  = useState(false);
  const [successId, setSuccessId]  = useState(null);

  const loading = loadingNV || loadingXe || loadingChuyen;

  // Chỉ hiện chuyến cần phân công (chưa có tài xế hoặc trạng thái KHỞI TẠO)
  const needAssign = trips.filter((t) =>
    !t.MaTaiXe || t.TrangThai === 'KHỞI TẠO' || t.TrangThai === 'YÊU CẦU PHÂN CÔNG'
  );

  const filteredTrips = needAssign.filter((t) => {
    const q = search.toLowerCase();
    return !q || (t.MaChuyen || '').toLowerCase().includes(q) || (t.DiemDi || '').toLowerCase().includes(q);
  });

  // Xe và tài xế sẵn sàng
  const availableDrivers  = drivers.filter((d) => !d.TrangThai || d.TrangThai === 'Sẵn sàng');
  const availableVehicles = vehicles.filter((v) => v.TrangThai === 'Đang hoạt động' || !v.TrangThai);

  const handleAssign = async () => {
    if (!selectedTrip || !selectedDriver || !selectedVehicle) return;
    setAssigning(true);
    try {
      await updateTrip(selectedTrip.MaChuyen, {
        MaTaiXe:   selectedDriver,
        BienSo:    selectedVehicle,
        TrangThai: 'ĐÃ PHÂN CÔNG',
      });
      setSuccessId(selectedTrip.MaChuyen);
      setSelectedTrip(null);
      setSelectedDriver('');
      setSelectedVehicle('');
      setTimeout(() => setSuccessId(null), 3000);
    } finally {
      setAssigning(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, flexDirection: 'column', gap: 12, color: '#6b7280' }}>
      <Loader size={28} style={{ animation: 'spin 1s linear infinite' }} />
      <p style={{ fontWeight: 600 }}>Đang tải dữ liệu...</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 4px' }}>

      {/* HEADER */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <UserCheck size={20} color="#1a6efd" />
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#1e293b', margin: 0 }}>Phân công tài xế & xe</h2>
        </div>
        <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
          {needAssign.length} chuyến cần phân công · {availableDrivers.length} tài xế sẵn sàng · {availableVehicles.length} xe khả dụng
        </p>
      </div>

      {/* SUCCESS BANNER */}
      {successId && (
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: '#15803d', fontWeight: 700, fontSize: 13 }}>
          ✅ Đã phân công thành công chuyến {successId}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: selectedTrip ? '1fr 380px' : '1fr', gap: 20 }}>

        {/* DANH SÁCH CHUYẾN CẦN PHÂN CÔNG */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {/* Search */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Search size={15} color="#94a3b8" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo mã chuyến hoặc điểm đi..."
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, color: '#1e293b' }}
            />
          </div>

          {/* Trip list */}
          {filteredTrips.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>
              <Bus size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
              <p style={{ fontWeight: 600 }}>Không có chuyến nào cần phân công</p>
            </div>
          ) : (
            filteredTrips.map((trip) => {
              const isSelected = selectedTrip?.MaChuyen === trip.MaChuyen;
              return (
                <div
                  key={trip.MaChuyen}
                  onClick={() => setSelectedTrip(trip)}
                  style={{
                    padding: '16px 20px', borderBottom: '1px solid #f8fafc',
                    cursor: 'pointer', transition: 'background 0.15s',
                    background: isSelected ? '#eff6ff' : '#fff',
                    borderLeft: isSelected ? '3px solid #1a6efd' : '3px solid transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 800, fontSize: 13, color: '#1d4ed8', margin: '0 0 4px' }}>
                      {trip.MaChuyen}
                    </p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: '0 0 4px' }}>
                      {trip.DiemDi} → {trip.DiemDen}
                    </p>
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
                      {trip.ThoiGianKhoiHanh} · {trip.SoGheTrong || '?'} ghế trống
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ background: '#fef9c3', color: '#a16207', padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 800 }}>
                      {trip.TrangThai || 'KHỞI TẠO'}
                    </span>
                    <ChevronRight size={16} color="#94a3b8" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* PANEL PHÂN CÔNG */}
        {selectedTrip && (
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24, height: 'fit-content' }}>
            <h3 style={{ fontSize: 15, fontWeight: 900, color: '#1e293b', marginBottom: 4 }}>
              Phân công chuyến
            </h3>
            <p style={{ fontSize: 13, color: '#1d4ed8', fontWeight: 700, marginBottom: 20 }}>
              {selectedTrip.MaChuyen} · {selectedTrip.DiemDi} → {selectedTrip.DiemDen}
            </p>

            {/* Chọn tài xế */}
            <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <UserCheck size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
              Tài xế *
            </label>
            <select
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, marginBottom: 16, outline: 'none', color: '#1e293b' }}
            >
              <option value="">— Chọn tài xế —</option>
              {availableDrivers.map((d) => (
                <option key={d.MaNV || d.id} value={d.MaNV || d.id}>
                  {d.HoTen} · {d.SoDienThoai || ''}
                </option>
              ))}
            </select>

            {/* Chọn xe */}
            <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <Bus size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
              Phương tiện *
            </label>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, marginBottom: 24, outline: 'none', color: '#1e293b' }}
            >
              <option value="">— Chọn xe —</option>
              {availableVehicles.map((v) => (
                <option key={v.BienSo} value={v.BienSo}>
                  {v.BienSo} · {v.LoaiXe} · {v.SoGhe} chỗ
                </option>
              ))}
            </select>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setSelectedTrip(null)}
                style={{ flex: 1, padding: '10px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}
              >
                Hủy
              </button>
              <button
                onClick={handleAssign}
                disabled={!selectedDriver || !selectedVehicle || assigning}
                style={{
                  flex: 2, padding: '10px', borderRadius: 10, border: 'none',
                  background: (!selectedDriver || !selectedVehicle || assigning) ? '#e2e8f0' : '#1a6efd',
                  color: (!selectedDriver || !selectedVehicle || assigning) ? '#94a3b8' : '#fff',
                  fontWeight: 800, cursor: (!selectedDriver || !selectedVehicle || assigning) ? 'not-allowed' : 'pointer', fontSize: 13,
                }}
              >
                {assigning ? '⏳ Đang lưu...' : '✅ Xác nhận phân công'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
