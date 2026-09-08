import { useState } from "react";
import "./TongQuan.css";

const IcGrid = ({ color = "currentColor" }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
);
const IcBus = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
    <rect x="3" y="5" width="18" height="13" rx="2"/>
    <path d="M3 10h18"/><circle cx="7" cy="18" r="1"/><circle cx="17" cy="18" r="1"/>
  </svg>
);
const IcTicket = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M2 9a3 3 0 010 6v2a2 2 0 002 2h16a2 2 0 002-2v-2a3 3 0 010-6V7a2 2 0 00-2-2H4a2 2 0 00-2 2v2z"/>
  </svg>
);
const IcMoney = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
  </svg>
);
const IcPulse = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#1a6efd" strokeWidth="1.5" strokeLinecap="round">
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
  </svg>
);
const IcClock = ({ size = 11 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
  </svg>
);
const IcAlert = ({ size = 15, color = "#a32d2d" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IcPlus = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IcCard = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
);

// ============================================================
// DỮ LIỆU MẪU
// ============================================================
const DIEU_HANH = [
  { id: "TR-SG-DL-003", tuyen: "TP. Hồ Chí Minh – Đà Lạt (Miền Đông – Liên tỉnh Đà Lạt)", xe: "29B-654.32", gio: "05:00", da: 25, tong: 24, tt: "ĐANG DI CHUYỂN" },
  { id: "TR-SG-VT-003", tuyen: "TP. Hồ Chí Minh – Vũng Tàu (Miền Đông – Bến xe Vũng Tàu)", xe: "43B-789.01", gio: "21:00", da: 9,  tong: 9,  tt: "ĐANG DI CHUYỂN" },
  { id: "TR-DN-HUE-003",tuyen: "Đà Nẵng – Huế (Trung tâm Đà Nẵng – Phía Nam Huế)",           xe: "65B-876.54", gio: "19:00", da: 14, tong: 16, tt: "ĐÃ XUẤT PHÁT"   },
  { id: "TR-HN-SG-003", tuyen: "Hà Nội – TP. Hồ Chí Minh (Giáp Bát – Miền Đông)",             xe: "51B-123.45", gio: "15:00", da: 31, tong: 34, tt: "ĐÃ XUẤT PHÁT"   },
];

const SU_CO = [
  { id: "INC-302318-006", title: "Nổ lốp xe sau bên phụ",              desc: "Xe vừa qua trạm thu phí thì cần đinh nổ lốp sau. Đang lập vào lề để tiến hành thay lốp dự phòng, hành khách vẫn an toàn trên xe.", time: "12:53:54 22/4/2026" },
  { id: "INC-302318-005", title: "Va quẹt nhẹ với xe máy tại ngã tư", desc: "Một xe máy vượt đèn đỏ và va quẹt sơn đầu xe bên trái. Đã chụp hình hiện trường, không ai bị thương, đang đợi CSGT giải quyết nhanh.", time: "12:53:54 22/4/2026" },
];

const HANG_DOI_TT = [
  { tag: "1 thanh toán", id: "BKG-TR8-19-A19", price: "380.000 ₫", warn: null },
  { tag: "1 thanh toán", id: "BKG-TR3-17-A17", price: "150.000 ₫", warn: null },
  { tag: "1 thanh toán", id: "BKG-TR8-21-A88", price: "260.000 ₫", warn: "Trễ hạn – 13:03:54 22/4/2026" },
];

const BAR_HEIGHTS = [30, 20, 50, 35, 100, 45, 25];

// ============================================================
// COMPONENT
// ============================================================
export default function TongQuan() {
  const [filterActive, setFilterActive] = useState("Hôm nay");
  const [tabChart,     setTabChart]     = useState("Cột");
  const [tabHangDoi,   setTabHangDoi]   = useState("THANH TOÁN");
  const [activeBar,    setActiveBar]    = useState(4);

  const filters = ["Hôm nay", "Tuần này", "Tháng này", "Năm nay"];

  return (
    <div className="page-tongquan">

      {/* ---- HEADER ---- */}
      <div className="tq-head">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div className="tq-title">
              <IcGrid color="#1a6efd" />
              Tổng quan hoạt động
            </div>
            <div className="tq-sub">Theo dõi hiệu suất vận hành và doanh thu thời gian thực</div>
          </div>
          <div className="tq-topbar-extra">
            <div className="tq-filter-wrap">
              {filters.map((f) => (
                <button
                  key={f}
                  className={`tq-filter-btn ${filterActive === f ? "active" : ""}`}
                  onClick={() => setFilterActive(f)}
                >
                  {f}
                </button>
              ))}
            </div>
            <button className="btn-tao-chuyen-tq"><IcPlus /> Tạo chuyến</button>
            <button className="btn-ban-ve"><IcCard /> Bán vé nhanh</button>
          </div>
        </div>
      </div>

      {/* ---- STAT CARDS ---- */}
      <div className="tq-stat-grid">
        <div className="tq-stat-card">
          <div className="tq-sc-label">SỐ CHUYẾN XE <IcBus /></div>
          <div className="tq-sc-value">6 <span className="unit">chuyến</span></div>
          <div className="tq-sc-trend up"><span className="val">▲ +4.2%</span> so với trước</div>
        </div>
        <div className="tq-stat-card">
          <div className="tq-sc-label">SỐ VÉ ĐÃ BÁN <IcTicket /></div>
          <div className="tq-sc-value">1 <span className="unit">vé</span></div>
          <div className="tq-sc-trend up"><span className="val">▲ +12.6%</span> so với trước</div>
        </div>
        <div className="tq-stat-card">
          <div className="tq-sc-label">DOANH THU TỔNG <IcMoney /></div>
          <div className="tq-sc-value">260.000 <span className="unit-currency">₫</span></div>
          <div className="tq-sc-trend up"><span className="val">▲ +8.1%</span> so với trước</div>
        </div>
        <div className="tq-stat-card">
          <div className="tq-sc-label">CHUYẾN ĐANG CHẠY <IcPulse /></div>
          <div className="tq-sc-value">4 <span className="unit">chuyến</span></div>
          <div className="tq-sc-trend">
            <span className="tq-dot-active" />Đang hoạt động
          </div>
        </div>
      </div>

      {/* ---- 2 CỘT ---- */}
      <div className="tq-two-col">

        {/* CỘT TRÁI */}
        <div className="tq-left-col">

          {/* Panel phân tích doanh thu */}
          <div className="tq-panel">
            <div className="tq-panel-head">
              <div>
                <div className="tq-panel-title">Phân tích doanh thu</div>
                <div className="tq-panel-sub">Dữ liệu tổng hợp theo chu kỳ {filterActive}</div>
              </div>
              <div className="tq-tab-wrap">
                {["Cột", "Đường"].map((t) => (
                  <button
                    key={t}
                    className={`tq-tab ${tabChart === t ? "active" : ""}`}
                    onClick={() => setTabChart(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <table className="tq-rev-table">
              <thead>
                <tr>
                  <th>Thời gian</th>
                  <th>Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2025-04-29</td>
                  <td>260.000 ₫</td>
                </tr>
              </tbody>
            </table>

            <div className="tq-chart-wrap">
              <div className="tq-bar-chart">
                {BAR_HEIGHTS.map((h, i) => (
                  <div
                    key={i}
                    className={`tq-bar ${activeBar === i ? "active" : ""}`}
                    style={{ height: `${h}%` }}
                    onClick={() => setActiveBar(i)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Panel điều hành chuyến */}
          <div className="tq-panel">
            <div className="tq-panel-head">
              <div>
                <div className="tq-panel-title">Điều hành chuyến đang hoạt động</div>
                <div className="tq-panel-sub">Quản lý thời gian thực các tuyến đang vận hành</div>
              </div>
            </div>
            <table className="tq-dh-table">
              <thead>
                <tr>
                  <th className="col-ma-dh">Mã</th>
                  <th className="col-tuyen-dh">Tuyến đường</th>
                  <th className="col-pt-dh">Phương tiện</th>
                  <th className="col-gio-dh">Giờ KH</th>
                  <th className="col-lap-dh">Lấp đầy</th>
                  <th className="col-tt-dh">Trạng thái</th>
                  <th className="col-act-dh">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {DIEU_HANH.map((r) => {
                  const pct = Math.min(100, Math.round((r.da / r.tong) * 100));
                  const barColor = pct >= 100 ? "#dc3545" : pct >= 85 ? "#fd7e14" : "#1a6efd";
                  return (
                    <tr key={r.id}>
                      <td><span className="trip-link">{r.id}</span></td>
                      <td style={{ fontSize: 11.5 }}>{r.tuyen}</td>
                      <td style={{ fontSize: 11.5 }}>{r.xe}</td>
                      <td>
                        <div className="tq-time-cell">
                          <IcClock /> {r.gio}
                        </div>
                      </td>
                      <td>
                        <div className="tq-prog-wrap">
                          <div className="tq-prog-bar">
                            <div className="tq-prog-fill" style={{ width: `${pct}%`, background: barColor }} />
                          </div>
                          <span className="tq-prog-txt">{r.da}/{r.tong}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`tq-badge ${r.tt === "ĐANG DI CHUYỂN" ? "tq-badge-run" : "tq-badge-xuat"}`}>
                          {r.tt}
                        </span>
                      </td>
                      <td>
                        <button className="btn-more">···</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* CỘT PHẢI */}
        <div className="tq-right-col">

          {/* Trung tâm sự cố */}
          <div className="tq-sc-panel">
            <div className="tq-sc-head">
              <IcAlert />
              <span className="tq-sc-head-title">Trung tâm Sự cố</span>
              <span className="tq-sc-head-count">Có 8 cảnh báo đang mở</span>
            </div>
            <div className="tq-sc-body">
              {SU_CO.map((sc) => (
                <div key={sc.id} className="tq-sc-item">
                  <div className="tq-sci-top">
                    <span className="tq-badge-urgent">Ưu tiên</span>
                    <span className="tq-sci-id">{sc.id}</span>
                  </div>
                  <div className="tq-sci-title">{sc.title}</div>
                  <div className="tq-sci-desc">{sc.desc}</div>
                  <div className="tq-sci-footer">
                    <span className="tq-sci-time">{sc.time}</span>
                    <button className="btn-phan-hoi">Phản hồi</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hàng đợi xử lý */}
          <div className="tq-hq-panel">
            <div className="tq-hq-head">
              <span className="tq-hq-title">Hàng đợi xử lý</span>
              <span className="tq-hq-count">7</span>
            </div>
            <div className="tq-hq-tabs">
              {["THANH TOÁN", "ĐỔI/HỦY"].map((t) => (
                <div
                  key={t}
                  className={`tq-hqt ${tabHangDoi === t ? "active" : ""}`}
                  onClick={() => setTabHangDoi(t)}
                >
                  {t}
                </div>
              ))}
            </div>
            <div className="tq-hq-body">
              {tabHangDoi === "THANH TOÁN" ? (
                HANG_DOI_TT.map((item) => (
                  <div key={item.id} className="tq-hq-item">
                    <div className="tq-hqi-top">
                      <span className="tq-hqi-tag">{item.tag}</span>
                      <span className="tq-hqi-id">{item.id}</span>
                    </div>
                    <div className="tq-hqi-row">
                      <span className="tq-hqi-price">{item.price}</span>
                      <button className="btn-duyet-tq">Duyệt</button>
                    </div>
                    {item.warn && (
                      <div className="tq-hqi-warn">
                        <IcAlert size={10} />
                        {item.warn}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ padding: "20px 0", textAlign: "center", fontSize: 12, color: "#9ca3af" }}>
                  Không có yêu cầu đổi/hủy vé
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}