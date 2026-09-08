import { useState, useEffect } from "react";
import "./QuanLyDatVe.css";
import { useVe } from "../../src/hooks/useVe";
import { formatDate } from "../../src/utils";

// ============================================================
// STATUS BADGE
// ============================================================
const STATUS_CLASS = {
  "CHỜ THANH TOÁN": "status-cho-tt",
  "CHỜ XÁC NHẬN":   "status-cho-xn",
  "ĐÃ XÁC NHẬN":    "status-da-xn",
  "HOÀN THÀNH":     "status-hoan-thanh",
  "ĐÃ HỦY":         "status-da-huy",
  "CHỜ XỬ LÝ":      "status-cho-xl",
  "ĐÃ HOÀN TIỀN":   "status-da-hoan",
};

function StatusBadge({ text }) {
  const cls = STATUS_CLASS[text] || "status-default";
  return <span className={`status-badge ${cls}`}>{text || "—"}</span>;
}

// ============================================================
// QUẢN LÝ ĐẶT VÉ – kết nối API thật qua useVe hook
// ============================================================
export default function QuanLyDatVe() {
  const { data: tickets, loading, error, updateVe, refresh } = useVe();

  const [search, setSearch]             = useState("");
  const [dateFilter, setDateFilter]     = useState("");
  const [routeFilter, setRouteFilter]   = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Normalize field names: backend dùng PascalCase (MaVe, MaChuyen, v.v.)
  // hoặc camelCase → map cả hai trường hợp
  const normalize = (t) => ({
    id:            t.MaVe      || t.id         || "—",
    route:         t.TuyenXe   || t.route      || t.MaChuyen || "—",
    datetime:      t.ThoiGianKhoiHanh || t.datetime || "—",
    seat:          t.SoGhe     || t.seat       || "—",
    seatType:      t.LoaiGhe   || t.seatType   || "—",
    passenger:     t.TenKhach  || t.passenger  || t.HoTen || "—",
    phone:         t.SoDienThoai || t.phone    || "—",
    source:        t.source    || "Hệ thống",
    statusTicket:  t.TrangThaiVe || t.statusTicket || "—",
    statusPayment: t.TrangThaiThanhToan || t.statusPayment || "—",
    raw:           t,
  });

  const normalized = tickets.map(normalize);

  const filtered = normalized.filter((t) => {
    const q     = search.toLowerCase();
    const matchSearch = !q || t.id.toLowerCase().includes(q) || t.passenger.toLowerCase().includes(q);
    const matchDate   = dateFilter   ? t.datetime.includes(dateFilter.split("-").reverse().join("/")) : true;
    const matchRoute  = routeFilter  ? t.route === routeFilter : true;
    const matchStatus = statusFilter ? t.statusTicket === statusFilter : true;
    return matchSearch && matchDate && matchRoute && matchStatus;
  });

  const uniqueRoutes   = [...new Set(normalized.map((t) => t.route))];
  const uniqueStatuses = [...new Set(normalized.map((t) => t.statusTicket))];
  const totalTickets   = tickets.length;
  const activeTickets  = normalized.filter(
    (t) => t.statusTicket !== "ĐÃ HỦY" && t.statusTicket !== "HOÀN THÀNH"
  ).length;

  if (loading) return (
    <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
      <p style={{ fontWeight: 600 }}>Đang tải dữ liệu từ server...</p>
    </div>
  );

  if (error) return (
    <div style={{ margin: 20, padding: 16, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, color: "#dc2626" }}>
      <strong>Lỗi kết nối API:</strong> {error}
      <button onClick={refresh} style={{ marginLeft: 12, background: "#dc2626", color: "#fff", border: "none", padding: "4px 12px", borderRadius: 6, cursor: "pointer" }}>
        Thử lại
      </button>
    </div>
  );

  return (
    <div className="page-datve">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <div className="page-title-wrap">
            <span style={{ fontSize: 18 }}>📋</span>
            <h2 className="page-title">Quản lý đặt vé</h2>
          </div>
          <p className="page-subtitle">Dữ liệu thời gian thực từ server</p>
        </div>
        <div className="page-header-right">
          <div className="stat-box">
            <div className="stat-box-label">TỔNG VÉ</div>
            <div className="stat-box-value">{totalTickets}</div>
          </div>
          <div className="stat-box">
            <div className="stat-box-label">ĐANG XỬ LÝ</div>
            <div className="stat-box-value">{activeTickets}</div>
          </div>
          <button className="btn-primary" onClick={refresh}>⟳ Làm mới</button>
        </div>
      </div>

      {/* CARD */}
      <div className="card">

        {/* BỘ LỌC */}
        <div className="filter-bar">
          <div className="filter-group filter-group-wide">
            <label className="filter-label">TÌM THEO MÃ VÉ / TÊN</label>
            <input className="filter-input" type="text" placeholder="Nhập mã vé hoặc tên khách..."
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="filter-group">
            <label className="filter-label">NGÀY KHỞI HÀNH</label>
            <input className="filter-input" type="date"
              value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
          </div>
          <div className="filter-group">
            <label className="filter-label">CHUYẾN XE</label>
            <select className="filter-select" value={routeFilter} onChange={(e) => setRouteFilter(e.target.value)}>
              <option value="">Tất cả chuyến ↕</option>
              {uniqueRoutes.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">TRẠNG THÁI</label>
            <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Tất cả trạng thái ↕</option>
              {uniqueStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="filter-actions">
            <button className="btn-reset" title="Đặt lại"
              onClick={() => { setSearch(""); setDateFilter(""); setRouteFilter(""); setStatusFilter(""); }}>
              ↺
            </button>
          </div>
        </div>

        {/* BẢNG */}
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                {["MÃ VÉ", "CHUYẾN XE", "GHẾ", "HÀNH KHÁCH", "NGUỒN", "TRẠNG THÁI VÉ", "THANH TOÁN", "TÁC VỤ"].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: 40, color: "#adb5bd" }}>
                    {tickets.length === 0 ? "Không có vé nào trong hệ thống" : "Không tìm thấy vé phù hợp"}
                  </td>
                </tr>
              ) : (
                filtered.map((ticket) => (
                  <tr key={ticket.id}>
                    <td><span className="ticket-id">{ticket.id}</span></td>
                    <td>
                      <div className="cell-main">{ticket.route}</div>
                      <div className="cell-sub">📅 {ticket.datetime}</div>
                    </td>
                    <td>
                      <div className="cell-main">{ticket.seat}</div>
                      <div className="cell-subsm">{ticket.seatType}</div>
                    </td>
                    <td>
                      <div className="cell-main">{ticket.passenger}</div>
                      <div className="cell-sub">{ticket.phone}</div>
                    </td>
                    <td><span className="source-badge">{ticket.source}</span></td>
                    <td><StatusBadge text={ticket.statusTicket} /></td>
                    <td><StatusBadge text={ticket.statusPayment} /></td>
                    <td>
                      <button
                        className="btn-action"
                        onClick={() => alert(`Chi tiết vé: ${ticket.id}`)}
                      >···</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PHÂN TRANG */}
        <div className="pagination">
          <span className="pagination-info">
            Hiển thị <strong>{filtered.length}</strong> / <strong>{totalTickets}</strong> vé
          </span>
          <div className="pagination-controls">
            <button className="btn-page">‹ Trước</button>
            <button className="btn-page active">1</button>
            <button className="btn-page">Sau ›</button>
          </div>
        </div>
      </div>
    </div>
  );
}