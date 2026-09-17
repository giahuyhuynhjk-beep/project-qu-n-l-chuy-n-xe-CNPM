import React, { useState } from 'react';
import {
  MapPinned, Search, Plus, X, ChevronRight,
  Route, Clock, Ruler, Wallet, CheckCircle2, Wrench, Edit3, Trash2
} from 'lucide-react';
import { routes as initialRoutes } from '../../data/adminMockData';

// ============================================================
// QUẢN LÝ TUYẾN ĐƯỜNG – Giao diện dành cho Nhân viên
// ============================================================

const STATUS_CONFIG = {
  'Hoạt động': { bg: '#d1fae5', color: '#065f46', label: 'Hoạt động', icon: CheckCircle2 },
  'Bảo trì':   { bg: '#fef3c7', color: '#92400e', label: 'Bảo trì',   icon: Wrench },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { bg: '#f1f5f9', color: '#64748b', label: status, icon: CheckCircle2 };
  const Icon = cfg.icon;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: cfg.bg, color: cfg.color,
      padding: '4px 10px', borderRadius: 999,
      fontSize: 12, fontWeight: 700,
    }}>
      <Icon size={12} /> {cfg.label}
    </span>
  );
}

// Modal thêm / sửa tuyến đường
function RouteModal({ mode, data, onClose, onSave }) {
  const [form, setForm] = useState(data || { id: '', name: '', distance: '', duration: '', price: '', status: 'Hoạt động' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: 16,
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: 32, width: '100%', maxWidth: 480,
        boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: 0 }}>
            {mode === 'add' ? '➕ Thêm tuyến đường mới' : '✏️ Chỉnh sửa tuyến đường'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
            <X size={22} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Mã tuyến', key: 'id', placeholder: 'VD: RT-HN-BH', disabled: mode === 'edit' },
            { label: 'Tên tuyến', key: 'name', placeholder: 'VD: Hà Nội - Bình Hòa' },
            { label: 'Khoảng cách', key: 'distance', placeholder: 'VD: 250 km' },
            { label: 'Thời lượng', key: 'duration', placeholder: 'VD: 5 giờ' },
            { label: 'Giá vé chuẩn', key: 'price', placeholder: 'VD: 280.000đ' },
          ].map(({ label, key, placeholder, disabled }) => (
            <div key={key}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {label}
              </label>
              <input
                value={form[key]}
                disabled={disabled}
                onChange={e => set(key, e.target.value)}
                placeholder={placeholder}
                style={{
                  marginTop: 6, width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 14,
                  border: '1.5px solid #e2e8f0', outline: 'none', boxSizing: 'border-box',
                  background: disabled ? '#f8fafc' : '#fff', color: '#0f172a',
                }}
              />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Trạng thái
            </label>
            <select
              value={form.status}
              onChange={e => set('status', e.target.value)}
              style={{
                marginTop: 6, width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 14,
                border: '1.5px solid #e2e8f0', outline: 'none', background: '#fff', color: '#0f172a',
              }}
            >
              <option value="Hoạt động">Hoạt động</option>
              <option value="Bảo trì">Bảo trì</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '12px', borderRadius: 10, border: '1.5px solid #e2e8f0',
              background: '#fff', color: '#64748b', fontWeight: 700, cursor: 'pointer', fontSize: 14,
            }}
          >
            Hủy
          </button>
          <button
            onClick={() => onSave(form)}
            style={{
              flex: 2, padding: '12px', borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
              color: '#fff', fontWeight: 900, cursor: 'pointer', fontSize: 14,
              boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
            }}
          >
            💾 Lưu tuyến đường
          </button>
        </div>
      </div>
    </div>
  );
}

export default function QuanLyTuyenDuong() {
  const [routes, setRoutes] = useState(initialRoutes);
  const [selected, setSelected] = useState(routes[0]);
  const [keyword, setKeyword] = useState('');
  const [modal, setModal] = useState(null); // null | { mode: 'add' | 'edit', data? }
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  };

  const filtered = routes.filter(r =>
    [r.id, r.name, r.status].join(' ').toLowerCase().includes(keyword.toLowerCase())
  );

  const handleSave = (form) => {
    if (modal.mode === 'add') {
      if (!form.id || !form.name) return alert('Vui lòng nhập Mã tuyến và Tên tuyến!');
      if (routes.find(r => r.id === form.id)) return alert('Mã tuyến đã tồn tại!');
      const newRoute = { ...form };
      setRoutes(prev => [...prev, newRoute]);
      setSelected(newRoute);
      showToast('✅ Đã thêm tuyến đường mới!');
    } else {
      setRoutes(prev => prev.map(r => r.id === form.id ? form : r));
      setSelected(form);
      showToast('✅ Đã cập nhật tuyến đường!');
    }
    setModal(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm(`Xác nhận xóa tuyến ${id}?`)) return;
    setRoutes(prev => prev.filter(r => r.id !== id));
    setSelected(routes.find(r => r.id !== id) || null);
    showToast('🗑️ Đã xóa tuyến đường!');
  };

  const infoCards = selected ? [
    { label: 'Khoảng cách', value: selected.distance, icon: Ruler,  color: '#2563eb' },
    { label: 'Thời lượng',  value: selected.duration, icon: Clock,  color: '#0891b2' },
    { label: 'Giá vé chuẩn', value: selected.price,   icon: Wallet, color: '#059669' },
  ] : [];

  return (
    <div style={{ padding: '24px', fontFamily: "'Inter','Segoe UI',sans-serif", color: '#0f172a', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, background: '#0f172a', color: '#f1f5f9',
          padding: '12px 20px', borderRadius: 12, fontWeight: 700, fontSize: 14,
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)', zIndex: 99999,
          animation: 'slideIn 0.3s ease',
        }}>
          {toast}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <RouteModal
          mode={modal.mode}
          data={modal.data}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
          }}>
            <Route size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0, color: '#0f172a' }}>Quản lý tuyến đường</h1>
            <p style={{ fontSize: 13, color: '#64748b', margin: '2px 0 0', fontWeight: 500 }}>
              Thiết lập điểm đi, điểm đến và hành trình vận hành
            </p>
          </div>
        </div>
        <button
          onClick={() => setModal({ mode: 'add' })}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '11px 20px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
            color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
          }}
        >
          <Plus size={18} /> Thêm tuyến mới
        </button>
      </div>

      {/* Search bar */}
      <div style={{
        background: '#fff', borderRadius: 14, padding: '14px 16px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.07)', marginBottom: 20,
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="Tìm theo mã tuyến, tên tuyến hoặc trạng thái..."
            style={{
              width: '100%', padding: '10px 14px 10px 38px', borderRadius: 10,
              border: '1.5px solid #e2e8f0', outline: 'none', fontSize: 14,
              color: '#0f172a', boxSizing: 'border-box',
            }}
          />
        </div>
        <select style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, fontWeight: 600, color: '#0f172a', outline: 'none' }}>
          <option>Tất cả trạng thái</option>
          <option>Hoạt động</option>
          <option>Bảo trì</option>
        </select>
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'minmax(0,1fr)', }}>
        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>

          {/* LEFT: Danh sách */}
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <h2 style={{ fontSize: 12, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                Danh sách tuyến đường ({filtered.length})
              </h2>
            </div>
            <div style={{ maxHeight: 480, overflowY: 'auto' }}>
              {filtered.length === 0 && (
                <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
                  Không tìm thấy tuyến đường phù hợp.
                </div>
              )}
              {filtered.map((route) => (
                <div
                  key={route.id}
                  onClick={() => setSelected(route)}
                  style={{
                    padding: '14px 20px', cursor: 'pointer', borderBottom: '1px solid #f8fafc',
                    background: selected?.id === route.id ? '#eff6ff' : '#fff',
                    borderLeft: selected?.id === route.id ? '3px solid #2563eb' : '3px solid transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 800, color: '#2563eb', margin: 0 }}>{route.id}</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '4px 0 6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {route.name}
                      </p>
                      <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#64748b' }}>
                        <span>📏 {route.distance}</span>
                        <span>⏱️ {route.duration}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, marginLeft: 10 }}>
                      <StatusBadge status={route.status} />
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={e => { e.stopPropagation(); setModal({ mode: 'edit', data: { ...route } }); }}
                          title="Chỉnh sửa"
                          style={{ background: '#eff6ff', border: 'none', borderRadius: 8, padding: '5px 8px', cursor: 'pointer', color: '#2563eb' }}
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); handleDelete(route.id); }}
                          title="Xóa"
                          style={{ background: '#fff1f2', border: 'none', borderRadius: 8, padding: '5px 8px', cursor: 'pointer', color: '#ef4444' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Chi tiết */}
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', padding: 24 }}>
            {!selected ? (
              <div style={{ height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                <MapPinned size={48} strokeWidth={1.2} />
                <p style={{ marginTop: 12, fontWeight: 600 }}>Chọn một tuyến đường để xem chi tiết</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 16,
                    background: 'linear-gradient(135deg, #eff6ff, #e0f2fe)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <MapPinned size={28} color="#2563eb" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 900, margin: 0, color: '#0f172a' }}>{selected.name}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                      <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Mã tuyến: {selected.id}</span>
                      <StatusBadge status={selected.status} />
                    </div>
                  </div>
                </div>

                {/* Thông tin thống kê */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                  {infoCards.map(({ label, value, icon: Icon, color }) => (
                    <div key={label} style={{ background: '#f8fafc', borderRadius: 12, padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <Icon size={14} color={color} />
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>{label}</p>
                      </div>
                      <b style={{ fontSize: 16, color: '#0f172a' }}>{value}</b>
                    </div>
                  ))}
                </div>

                {/* Hành trình giả lập */}
                <div style={{ background: '#f8fafc', borderRadius: 12, padding: '20px', marginBottom: 20 }}>
                  <p style={{ fontSize: 12, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px' }}>Hành trình tuyến đường</p>
                  {[
                    { stop: 'Điểm xuất phát', desc: selected.name.split(' - ')[0] || '—', isStart: true },
                    { stop: 'Trạm dừng chân', desc: 'Điểm nghỉ giữa đường (dự kiến)', isStart: false },
                    { stop: 'Điểm đến cuối', desc: selected.name.split(' - ')[1] || '—', isEnd: true },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: i < 2 ? 12 : 0 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                          width: 12, height: 12, borderRadius: '50%', marginTop: 3,
                          background: s.isStart ? '#2563eb' : s.isEnd ? '#059669' : '#94a3b8',
                          border: '2px solid #fff', boxShadow: '0 0 0 2px ' + (s.isStart ? '#2563eb' : s.isEnd ? '#059669' : '#cbd5e1'),
                        }} />
                        {i < 2 && <div style={{ width: 2, height: 28, background: '#e2e8f0', marginTop: 2 }} />}
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: 0 }}>{s.stop}</p>
                        <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => setModal({ mode: 'edit', data: { ...selected } })}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                      padding: '11px', borderRadius: 10, border: '1.5px solid #2563eb',
                      background: '#eff6ff', color: '#2563eb', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                    }}
                  >
                    <Edit3 size={15} /> Chỉnh sửa
                  </button>
                  <button
                    onClick={() => handleDelete(selected.id)}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                      padding: '11px', borderRadius: 10, border: '1.5px solid #fca5a5',
                      background: '#fff1f2', color: '#ef4444', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={15} /> Xóa tuyến
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
