import { useState } from "react";
import "./QuanLyChuyenXe.css";

const MOCK_CHUYEN = [
  {
    id: "TRIP-HANSAPA-NEXT-06",
    route: "Hà Nội đi Sa Pa (Chuyến đêm VIP)",
    lichTrinh: "21:30",
    diThucTe: "04:30 5/5/2026",
    denThucTe: "10:30",
    denMuon: false,
    xe: "43B-234.56",
    taiXe: "Đinh Thu K",
    tongGhe: 9,
    trong: 9,
    trangThai: "KHỞI TẠO",
  },
  {
    id: "TRIP-SGNPQC-NEXT-05",
    route: "Sài Gòn đi Phú Quốc (Kết hợp xe và phà)",
    lichTrinh: "13:00",
    diThucTe: "20:00 29/4/2026",
    denThucTe: "01:30",
    denMuon: true,
    xe: null,
    taiXe: null,
    tongGhe: 29,
    trong: 5,
    trangThai: "YÊU CẦU PHÂN CÔNG",
  },
  {
    id: "TRIP-SGNDLI-NEXT-04",
    route: "Sài Gòn đi Đà Lạt (Tốc hành)",
    lichTrinh: "22:00",
    diThucTe: "05:00 27/4/2026",
    denThucTe: "13:00",
    denMuon: false,
    xe: "51B-678.90",
    taiXe: "Bùi Thị H",
    tongGhe: 29,
    trong: 0,
    trangThai: "ĐÃ PHÂN CÔNG",
  },
  {
    id: "TRIP-SGNPQC-NOW-03",
    route: "Sài Gòn đi Phú Quốc (Kết hợp xe và phà)",
    lichTrinh: "05:00",
    diThucTe: "12:00 24/4/2026",
    denThucTe: "17:30",
    denMuon: false,
    xe: "29B-123.45",
    taiXe: "Lê Thị B",
    tongGhe: 40,
    trong: 4,
    trangThai: "ĐÃ ĐẾN",
  },
  {
    id: "TRIP-HANSAPA-20231101-02",
    route: "Hà Nội đi Sa Pa (Chuyến đêm VIP)",
    lichTrinh: "21:30",
    diThucTe: "04:30 10/4/2026",
    denThucTe: "10:30",
    denMuon: false,
    xe: "43B-234.56",
    taiXe: "Đinh Thu K",
    tongGhe: 9,
    trong: 0,
    trangThai: "ĐÃ ĐẾN",
  },
  {
    id: "TRIP-SGNDLI-20231015-01",
    route: "Sài Gòn đi Đà Lạt (Tốc hành)",
    lichTrinh: "06:00",
    diThucTe: "13:00 25/3/2026",
    denThucTe: "21:00",
    denMuon: false,
    xe: "29B-123.45",
    taiXe: "Lê Thị B",
    tongGhe: 40,
    trong: 39,
    trangThai: "ĐÃ ĐẾN",
  },
];

// ============================================================
// ICON NHỎ
// ============================================================
const IcClock = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
  </svg>
);
const IcBus = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="5" width="18" height="13" rx="2"/>
    <path d="M3 10h18"/><circle cx="7" cy="18" r="1.5"/><circle cx="17" cy="18" r="1.5"/>
  </svg>
);
const IcUser = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0112 0v2"/>
  </svg>
);
const IcEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IcTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3,6 5,6 21,6"/>
    <path d="M19,6l-1,14H6L5,6"/>
    <path d="M10,11v6M14,11v6M9,6V4h6v2"/>
  </svg>
);
const IcEye = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const IcRefresh = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="1,4 1,10 7,10"/>
    <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
  </svg>
);
const IcPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IcChevL = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="15,18 9,12 15,6"/>
  </svg>
);
const IcChevR = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="9,18 15,12 9,6"/>
  </svg>
);

// ============================================================
// BADGE TRẠNG THÁI
// ============================================================
function TrangThaiBadge({ value }) {
  const map = {
    "KHỞI TẠO":          "cxe-badge b-init",
    "YÊU CẦU PHÂN CÔNG": "cxe-badge b-init",
    "ĐÃ PHÂN CÔNG":      "cxe-badge b-asgn",
    "ĐÃ ĐẾN":            "cxe-badge b-arrv",
    "ĐANG CHẠY":         "cxe-badge b-run",
  };
  const label = value === "YÊU CẦU PHÂN CÔNG" ? "KHỞI TẠO" : value;
  return <span className={map[value] || "cxe-badge b-arrv"}>{label}</span>;
}

// ============================================================
// THANH GHẾ
// ============================================================
function SeatBar({ trong, tong }) {
  const pct = tong > 0 ? Math.round(((tong - trong) / tong) * 100) : 0;
  const color = trong === 0 ? "#dc3545" : trong <= 5 ? "#fd7e14" : "#1a6efd";
  return (
    <div>
      <div className="seat-top">
        <span className="seat-num">Trống: {trong}</span>
        <span className="seat-tot">{tong} ghế</span>
      </div>
      <div className="seat-bar">
        <div className="seat-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="seat-lnk">Chi tiết đặt vé</span>
    </div>
  );
}

// ============================================================
// COMPONENT CHÍNH
// ============================================================
export default function QuanLyChuyenXe() {
  const [dateFilter,   setDateFilter]   = useState("");
  const [routeFilter,  setRouteFilter]  = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search,       setSearch]       = useState("");

  const uniqueRoutes   = [...new Set(MOCK_CHUYEN.map((c) => c.route))];
  const uniqueStatuses = [...new Set(MOCK_CHUYEN.map((c) => c.trangThai))];

  const filtered = MOCK_CHUYEN.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch  = !q || c.id.toLowerCase().includes(q) || c.route.toLowerCase().includes(q);
    const matchRoute   = !routeFilter  || c.route === routeFilter;
    const matchStatus  = !statusFilter || c.trangThai === statusFilter;
    return matchSearch && matchRoute && matchStatus;
  });

  const tongSo    = MOCK_CHUYEN.length;
  const dangChay  = MOCK_CHUYEN.filter((c) => c.trangThai === "ĐANG CHẠY").length;
  const choPC     = MOCK_CHUYEN.filter((c) => c.trangThai === "YÊU CẦU PHÂN CÔNG").length;

  const handleReset = () => {
    setDateFilter(""); setRouteFilter(""); setStatusFilter(""); setSearch("");
  };

  return (
    <div className="page-chuyenxe">

      {/* HEADER */}
      <div className="cxe-header">
        <div>
          <div className="cxe-title-row">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a6efd" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="5" width="18" height="13" rx="2"/>
              <path d="M3 10h18"/><circle cx="7" cy="18" r="1.5"/><circle cx="17" cy="18" r="1.5"/>
            </svg>
            <h2 className="cxe-title">Quản lý chuyến xe</h2>
          </div>
          <div className="cxe-stats">
            <span className="cxe-stat"><span className="cxe-dot blue" />Tổng: {tongSo}</span>
            <span className="cxe-stat"><span className="cxe-dot green" />Đang chạy: {dangChay}</span>
            <span className="cxe-stat"><span className="cxe-dot orange" />Chờ phân công: {choPC}</span>
          </div>
        </div>
        <button className="btn-tao-chuyen"><IcPlus /> Tạo chuyến xe</button>
      </div>

      {/* BỘ LỌC */}
      <div className="cxe-filter-bar">
        <input
          type="date"
          className="cxe-f-date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        <select
          className="cxe-f-select cxe-f-route"
          value={routeFilter}
          onChange={(e) => setRouteFilter(e.target.value)}
        >
          <option value="">Tất cả tuyến đường</option>
          {uniqueRoutes.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <select
          className="cxe-f-select cxe-f-status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          {uniqueStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="cxe-search-wrap">
          <span className="cxe-search-icon">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            type="text"
            className="cxe-f-search"
            placeholder="Tìm nhanh mã chuyến xe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn-lam-moi" onClick={handleReset}>
          <IcRefresh /> Làm mới
        </button>
      </div>

      {/* BẢNG */}
      <div className="cxe-card">
        <table className="cxe-table">
          <thead>
            <tr>
              <th className="col-ma">Mã chuyến</th>
              <th className="col-tuyen">Tuyến &amp; Lịch trình</th>
              <th className="col-tg">Thời gian thực tế</th>
              <th className="col-xe">Xe &amp; Tài xế</th>
              <th className="col-ghe">Tình trạng ghế</th>
              <th className="col-tt">Trạng thái</th>
              <th className="col-act">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 36, color: "#adb5bd", fontSize: 13 }}>
                  Không tìm thấy chuyến xe phù hợp
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id}>

                  {/* MÃ CHUYẾN */}
                  <td><span className="trip-id">{c.id}</span></td>

                  {/* TUYẾN & LỊCH TRÌNH */}
                  <td>
                    <div className="trip-route">{c.route}</div>
                    <div className="trip-sch">
                      <IcClock /> Lịch trình: {c.lichTrinh}
                    </div>
                  </td>

                  {/* THỜI GIAN THỰC TẾ */}
                  <td>
                    <div className="time-row">
                      <span style={{ color: "#28a745", fontSize: 8 }}>●</span>
                      <span className="time-lbl">Đi:</span>
                      <span className="time-bold">{c.diThucTe}</span>
                    </div>
                    <div className="time-row">
                      <span style={{ color: "#dc3545", fontSize: 8 }}>●</span>
                      <span className="time-lbl">Đến:</span>
                      <span className={c.denMuon ? "time-late" : "time-bold"}>{c.denThucTe}</span>
                    </div>
                  </td>

                  {/* XE & TÀI XẾ */}
                  <td>
                    {c.xe ? (
                      <>
                        <div className="xe-row"><IcBus /> {c.xe}</div>
                        <div className="drv-row"><IcUser /> {c.taiXe}</div>
                      </>
                    ) : (
                      <span className="cxe-badge b-pend">Yêu cầu phân công</span>
                    )}
                  </td>

                  {/* TÌNH TRẠNG GHẾ */}
                  <td><SeatBar trong={c.trong} tong={c.tongGhe} /></td>

                  {/* TRẠNG THÁI */}
                  <td><TrangThaiBadge value={c.trangThai} /></td>

                  {/* THAO TÁC */}
                  <td>
                    <div className="act-wrap">
                      <button className="btn-ic" title="Chỉnh sửa"><IcEdit /></button>
                      <button className="btn-ic del" title="Xóa"><IcTrash /></button>
                      <button className="btn-theo-doi"><IcEye /> Theo dõi</button>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PHÂN TRANG */}
        <div className="cxe-footer">
          <span className="cxe-footer-info">Hiển thị trang 1 trên tổng 1</span>
          <div className="cxe-page-btns">
            <button className="btn-prev-next" disabled><IcChevL /> Previous</button>
            <button className="btn-prev-next" disabled>Next <IcChevR /></button>
          </div>
        </div>
      </div>
    </div>
  );
}