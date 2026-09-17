import React, { useState } from 'react';
import './XacnhanTT.css';

import { 
  Search, 
  RotateCcw, 
  User, 
  Bus, 
  CreditCard, 
  FileText, 
  XCircle, 
  PauseCircle, 
  CheckCircle,
  MapPin,
  Clock,
  Wallet,
  ChevronDown
} from 'lucide-react';

const App = () => {
  const [selectedId, setSelectedId] = useState('#TK-TR5-19-A19');

  const transactions = [
    {
      id: '#TK-TR5-19-A19',
      name: 'Phan Ánh Ngọc',
      route: 'TR-SG-DL-001',
      price: '380.000 đ',
      method: 'Ví điện tử',
      time: '28/4/26 12:53',
      status: 'CHỜ THANH TOÁN',
      statusClass: 'status-waiting'
    },
    {
      id: '#TK-TR4-18-A18',
      name: 'Mai Tiến Đạt',
      route: 'TR-SG-VT-001',
      price: '260.000 đ',
      method: 'Tiền mặt tại quầy',
      time: '28/4/26 12:53',
      status: 'ĐÃ THANH TOÁN',
      statusClass: 'status-paid'
    },
    {
      id: '#TK-TR6-20-A20',
      name: 'Đào Tuấn Anh',
      route: 'TR-SG-CT-002',
      price: '160.000 đ',
      method: 'Chuyển khoản',
      time: '28/4/26 12:53',
      status: 'ĐÃ THANH TOÁN',
      statusClass: 'status-paid'
    },
    {
      id: '#TK-TR8-21-A08',
      name: 'Đào Tuấn Anh',
      route: 'TR-SG-VT-002',
      price: '260.000 đ',
      method: 'Ví điện tử',
      time: '28/4/26 12:53',
      status: 'CHỜ THANH TOÁN',
      statusClass: 'status-waiting'
    }
  ];

  return (
    <div className="payment-container">
      {/* Header Filters */}
      <header className="header-filter">
        <div className="search-input-group">
          <Search className="search-icon-pos" size={18} />
          <input type="text" placeholder="Tìm theo mã đơn, mã GD, SĐT..." />
        </div>
        <select className="dropdown-select">
          <option>Tất cả trạng thái</option>
        </select>
        <select className="dropdown-select">
          <option>Tất cả phương thức</option>
        </select>
        <button className="btn-search-main">Tìm kiếm</button>
        <button style={{ background: 'none', border: 'none', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }}>
          <RotateCcw size={16} /> Xóa lọc
        </button>
      </header>

      <div className="workplace-body">
        {/* Left List */}
        <aside className="queue-sidebar">
          <div className="queue-title-bar">
            <span>HÀNG ĐỢI GIAO DỊCH</span>
            <span className="record-count">24 BẢN GHI</span>
          </div>
          <div className="queue-scroll">
            {transactions.map((item) => (
              <div 
                key={item.id} 
                className={`transaction-card ${selectedId === item.id ? 'selected' : ''}`}
                onClick={() => setSelectedId(item.id)}
              >
                <div className="card-top">
                  <span className="id-text">{item.id}</span>
                  <span className={`status-badge ${item.statusClass}`}>{item.status}</span>
                </div>
                <h4 style={{ margin: '4px 0', fontSize: '15px', fontWeight: 900 }}>{item.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
                  <Bus size={12} /> <span style={{ fontWeight: 700 }}>{item.route}</span>
                  <span style={{ marginLeft: 'auto', fontWeight: 900, color: '#0f172a' }}>{item.price}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontSize: '10px', color: '#94a3b8', fontWeight: 700 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Wallet size={12} /> {item.method}</div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Right Detail */}
        <section className="detail-main">
          <div className="detail-inner">
            <div className="detail-header-block">
              <div>
                <p className="sys-id-label">Mã giao dịch hệ thống</p>
                <h2 className="sys-id-value">PAY-BKG-20</h2>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <span style={{ border: '1px solid #ffedd5', background: '#fff7ed', color: '#f97316', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>Vé: Chờ thanh toán</span>
                <span style={{ background: '#f97316', color: '#fff', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>TT: Chờ thanh toán</span>
              </div>
            </div>

            <div className="info-section-grid">
              <div className="info-left-col">
                <h3 className="info-title"><User size={16} /> KHÁCH HÀNG & CHUYẾN ĐI</h3>
                <div className="data-group">
                  <div>
                    <label className="data-label">Hành khách:</label>
                    <p className="data-value">Phan Ánh Ngọc</p>
                  </div>
                  <div>
                    <label className="data-label">Điện thoại:</label>
                    <p className="data-value">0990001112</p>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label className="data-label">Tuyến đường:</label>
                    <p className="data-value" style={{ color: '#1d4ed8' }}>TP. Hồ Chí Minh - Đà Lạt (Miền Đông - Liên tỉnh Đà Lạt)</p>
                  </div>
                  <div>
                    <label className="data-label">Khởi hành:</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <span className="data-value">9/5/26</span>
                       <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>05:00</span>
                    </div>
                  </div>
                </div>

                {/* Chặng đường */}
                <div style={{ marginTop: '24px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                   <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                         <MapPin size={16} color="#cbd5e1" />
                         <div style={{ width: '2px', height: '32px', background: '#e2e8f0', margin: '4px 0' }} />
                         <MapPin size={16} color="#2563eb" />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '13px', fontWeight: 700 }}>
                         <span>Bến xe Miền Đông</span>
                         <span>Bến xe Liên tỉnh Đà Lạt</span>
                      </div>
                   </div>
                </div>

                {/* Mã chuyến & Ghế */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <div style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                    <p className="data-label">Mã chuyến</p>
                    <p className="data-value" style={{ color: '#2563eb' }}>TR-SG-DL-001</p>
                  </div>
                  <div style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                    <p className="data-label">Số ghế</p>
                    <p className="data-value" style={{ color: '#2563eb' }}>A19</p>
                  </div>
                </div>

                <div style={{ marginTop: '32px' }}>
                  <div style={{ display: 'flex', justify: 'space-between', marginBottom: '12px' }}>
                     <h3 className="info-title" style={{ marginBottom: 0 }}><FileText size={16} /> GHI CHÚ NỘI BỘ</h3>
                     <button style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 900, fontSize: '11px', cursor: 'pointer' }}>LƯU THAY ĐỔI</button>
                  </div>
                  <textarea 
                    style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', minHeight: '100px', outline: 'none' }}
                    defaultValue="Chờ chuyển khoản qua ví"
                  />
                </div>
              </div>

              <div className="info-right-col">
                <div className="payment-summary-box">
                  <h3 className="info-title"><CreditCard size={16} /> CHI TIẾT THANH TOÁN</h3>
                  <div style={{ borderBottom: '1px dashed #cbd5e1', paddingBottom: '16px', marginBottom: '16px' }}>
                    <div className="summary-row">
                      <span style={{ color: '#64748b' }}>Phương thức:</span>
                      <span style={{ fontWeight: 900 }}>Ví điện tử</span>
                    </div>
                    <div className="summary-row">
                      <span style={{ color: '#64748b' }}>Mã tham chiếu:</span>
                      <span style={{ fontWeight: 800, color: '#16a34a' }}>SPAY-020</span>
                    </div>
                  </div>
                  <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                    <div className="summary-row">
                      <span style={{ color: '#64748b' }}>Giá vé cơ bản</span>
                      <span style={{ fontWeight: 700 }}>380.000 đ</span>
                    </div>
                    <div className="summary-row">
                      <span style={{ color: '#64748b' }}>Phụ phí</span>
                      <span style={{ fontWeight: 700 }}>0 đ</span>
                    </div>
                    <div className="summary-row" style={{ color: '#ef4444' }}>
                      <span style={{ fontStyle: 'italic' }}>Giảm giá</span>
                      <span style={{ fontWeight: 700 }}>-0 đ</span>
                    </div>
                  </div>
                  <div className="total-payment-row">
                    <span className="total-label">TỔNG THANH TOÁN</span>
                    <span className="total-amount">380.000 đ</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="action-footer-bar">
              <button className="btn-base btn-decline"><XCircle size={18} /> Từ chối & Hủy vé</button>
              <button className="btn-base btn-hold"><PauseCircle size={18} /> Từ chối & Giữ chỗ</button>
              <button className="btn-base btn-confirm-final"><CheckCircle size={18} /> Xác nhận thanh toán</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;