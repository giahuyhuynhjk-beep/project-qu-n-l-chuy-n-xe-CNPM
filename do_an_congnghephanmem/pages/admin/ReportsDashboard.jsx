import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock3,
  Download,
  FileSpreadsheet,
  Filter,
  RefreshCw,
  Route,
  Search,
  Ticket,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { AdminPage, DataTable, StatusPill } from "../../layouts/AdminLayout";
import { reportRows, routes, trips } from "../../data/adminMockData";

const tabs = ["Tổng quan", "Doanh thu", "Sản lượng khách", "Hiệu suất", "Sự cố"];

const revenueByPeriod = [
  { date: "2026-04-15", revenue: 0 },
  { date: "2026-04-22", revenue: 220000 },
  { date: "2026-04-24", revenue: 680000 },
  { date: "2026-04-29", revenue: 360000 },
  { date: "2026-05-01", revenue: 950000 },
  { date: "2026-05-05", revenue: 1280000 },
];

const fillRateData = [
  { label: "Đã đặt vé", value: 316, tone: "emerald" },
  { label: "Đang giữ chỗ", value: 0, tone: "amber" },
  { label: "Ghế còn trống", value: 240, tone: "slate" },
];

const tripStatusData = [
  { label: "ON_TIME", count: 7, percent: 72 },
  { label: "DELAYED", count: 0, percent: 0 },
  { label: "Đã hủy", count: 2, percent: 18 },
  { label: "OTHER", count: 15, percent: 58 },
];

const incidentData = [
  { label: "TRAFFIC_JAM", count: 2 },
  { label: "WEATHER", count: 1 },
  { label: "OTHER", count: 1 },
  { label: "ACCIDENT", count: 1 },
  { label: "VEHICLE_BREAKDOWN", count: 2 },
];

const detailedRows = [
  { date: "11/5/2026", trip: "TR-DN-HUE-002", route: "Đà Nẵng - Huế", driver: "Chưa phân công", revenue: "1.600.000đ", tickets: 8, status: "On time", incident: "-" },
  { date: "15/5/2026", trip: "TR-SG-CT-010", route: "TP. Hồ Chí Minh - Cần Thơ", driver: "Nguyễn Văn A", revenue: "2.280.000đ", tickets: 6, status: "On time", incident: "-" },
  { date: "18/5/2026", trip: "TR-HN-SP-006", route: "Hà Nội - Sa Pa", driver: "Đinh Thu K", revenue: "2.700.000đ", tickets: 9, status: "Delayed", incident: "Kẹt xe khu vực đèo" },
  { date: "20/5/2026", trip: "TR-SG-DL-008", route: "Sài Gòn - Đà Lạt", driver: "Bùi Thị H", revenue: "3.600.000đ", tickets: 12, status: "On time", incident: "-" },
  ...reportRows.map((row) => ({
    date: row.date,
    trip: row.trip,
    route: row.route,
    driver: "Hoàng Long",
    revenue: row.revenue,
    tickets: row.tickets,
    status: row.status,
    incident: row.status === "Delayed" ? "Chậm do thời tiết" : "-",
  })),
];

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}

function KpiCard({ icon: Icon, label, value, description, tone = "blue", progress }) {
  const tones = {
    blue: "border-blue-100 bg-blue-50 text-blue-700",
    emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
    amber: "border-amber-100 bg-amber-50 text-amber-700",
    rose: "border-rose-100 bg-rose-50 text-rose-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon size={18} />
        </div>
      </div>
      {description && <p className="mt-3 text-xs font-semibold text-slate-500">{description}</p>}
      {typeof progress === "number" && (
        <div className="mt-3 h-2 rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-blue-600" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

function BarRow({ label, value, max, suffix = "" }) {
  const percent = max ? Math.max((value / max) * 100, 4) : 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-sm font-bold text-slate-600">
        <span className="truncate">{label}</span>
        <span className="shrink-0 text-blue-700">{typeof value === "number" ? value.toLocaleString("vi-VN") : value}{suffix}</span>
      </div>
      <div className="h-7 overflow-hidden rounded-lg bg-slate-100">
        <div className="flex h-full items-center justify-end rounded-lg bg-blue-200 px-2 text-[11px] font-black text-blue-800" style={{ width: `${percent}%` }}>
          {percent > 22 ? (typeof value === "number" ? value.toLocaleString("vi-VN") : value) : ""}
        </div>
      </div>
    </div>
  );
}

function MetricList({ title, items }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-black text-slate-900">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="mb-2 flex items-center justify-between text-sm font-bold text-slate-600">
              <span>{item.label}</span>
              <span>{item.count}</span>
            </div>
            <div className="h-2 rounded-full bg-white">
              <div className="h-full rounded-full bg-blue-600" style={{ width: `${item.percent || Math.min(item.count * 12, 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ReportsDashboard() {
  const [activeTab, setActiveTab] = useState("Tổng quan");

  const totalRevenue = useMemo(() => revenueByPeriod.reduce((sum, item) => sum + item.revenue, 0), []);
  const maxRevenue = Math.max(...revenueByPeriod.map((item) => item.revenue));
  const topRoutes = routes.map((route, index) => ({ ...route, tickets: 98 - index * 12, revenue: 1550000 - index * 180000 })).slice(0, 5);
  const totalSeats = trips.reduce((sum, trip) => sum + trip.seatsTotal, 0);
  const soldSeats = trips.reduce((sum, trip) => sum + trip.seatsSold, 0);
  const fillRate = Math.round((soldSeats / totalSeats) * 100);

  return (
    <AdminPage
      title="Báo cáo & Thống kê"
      subtitle="Cập nhật dữ liệu kinh doanh, hiệu suất vận hành và sự cố theo từng kỳ."
      actionLabel="Xuất dữ liệu CSV"
      onAction={() => alert("Demo xuất dữ liệu CSV. Khi có backend sẽ gọi API export báo cáo.")}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-4 py-2 text-sm font-black transition ${
                activeTab === tab ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-3 xl:grid-cols-[170px_170px_220px_190px_1fr_110px]">
          <label className="relative">
            <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="date" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white" />
          </label>
          <label className="relative">
            <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="date" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white" />
          </label>
          <select className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-600 outline-none focus:border-blue-500 focus:bg-white">
            <option>Tất cả tuyến đường</option>
            {routes.map((route) => <option key={route.id}>{route.name}</option>)}
          </select>
          <select className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-600 outline-none focus:border-blue-500 focus:bg-white">
            <option>Tất cả báo cáo</option>
            <option>Doanh thu</option>
            <option>Hiệu suất lấp đầy</option>
            <option>Sự cố vận hành</option>
          </select>
          <label className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input placeholder="Tìm mã chuyến, tuyến, tài xế..." className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white" />
          </label>
          <button className="flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-black text-white hover:bg-blue-700">
            <Filter size={15} /> Áp dụng
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={Wallet} label="Tổng doanh thu" value={formatCurrency(totalRevenue)} description="+25% so với kỳ trước" tone="blue" />
        <KpiCard icon={Users} label="Số lượng khách" value="316 khách" description="+12% lượt đặt vé" tone="emerald" />
        <KpiCard icon={Ticket} label="Tỷ lệ lấp đầy" value={`${fillRate}%`} description={`${soldSeats}/${totalSeats} ghế đã bán`} tone="amber" progress={fillRate} />
        <KpiCard icon={AlertTriangle} label="Vận hành & Sự cố" value="100% tổng quát" description="2 chuyến cần theo dõi" tone="rose" progress={100} />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.35fr_0.9fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900">Doanh thu theo kỳ</h2>
              <p className="text-sm font-medium text-slate-500">Biểu đồ giả lập dựa trên doanh thu từng ngày.</p>
            </div>
            <BarChart3 className="text-blue-600" size={22} />
          </div>
          <div className="mt-5 space-y-4">
            {revenueByPeriod.map((item) => (
              <BarRow key={item.date} label={item.date} value={item.revenue} max={maxRevenue} suffix="đ" />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900">Top tuyến đường</h2>
              <p className="text-sm font-medium text-slate-500">Tuyến có lượng khách cao nhất.</p>
            </div>
            <Route className="text-blue-600" size={22} />
          </div>
          <div className="mt-5 space-y-4">
            {topRoutes.map((route) => (
              <div key={route.id}>
                <div className="mb-1 flex items-center justify-between gap-3 text-sm font-bold text-slate-600">
                  <span className="truncate">{route.name}</span>
                  <span className="shrink-0 text-blue-700">{route.tickets} vé</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: `${route.tickets}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-black text-slate-900">Hiệu suất lấp đầy</h2>
          <div className="mt-4 space-y-3">
            {fillRateData.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={item.tone === "emerald" ? "text-emerald-600" : item.tone === "amber" ? "text-amber-600" : "text-slate-400"} size={18} />
                  <span className="text-sm font-black text-slate-700">{item.label}</span>
                </div>
                <span className="text-lg font-black text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </section>

        <MetricList title="Tình trạng chuyến đi" items={tripStatusData} />

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-black text-slate-900">Báo cáo sự cố</h2>
          <div className="mt-4 space-y-3">
            {incidentData.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50 px-3 py-2.5">
                <div className="flex items-center gap-2 text-sm font-black text-rose-700">
                  <AlertTriangle size={15} />
                  {item.label}
                </div>
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-rose-600 px-2 text-xs font-black text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">Chi tiết vận hành</h2>
            <p className="text-sm font-medium text-slate-500">Danh sách chuyến theo thời gian, doanh thu, vé bán và sự cố.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-black text-slate-600 hover:bg-slate-50">
              <RefreshCw size={15} /> Làm mới
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-black text-blue-700 hover:bg-blue-100">
              <FileSpreadsheet size={15} /> Xuất báo cáo
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-black text-white hover:bg-blue-700">
              <Download size={15} /> Tải CSV
            </button>
          </div>
        </div>
        <div className="mt-4">
          <DataTable
            columns={["Ngày xuất phát", "Mã chuyến", "Tuyến đường", "Tài xế", "Doanh thu", "Vé bán", "Trạng thái", "Sự cố"]}
            rows={detailedRows}
            renderRow={(row) => (
              <tr key={`${row.trip}-${row.date}`} className="text-sm hover:bg-blue-50/40">
                <td className="px-4 py-3 font-bold text-slate-600">{row.date}</td>
                <td className="px-4 py-3 font-black text-blue-700">{row.trip}</td>
                <td className="px-4 py-3 font-bold text-slate-700">{row.route}</td>
                <td className="px-4 py-3 text-slate-500">{row.driver}</td>
                <td className="px-4 py-3 font-black text-slate-800">{row.revenue}</td>
                <td className="px-4 py-3 font-bold text-slate-600">{row.tickets}</td>
                <td className="px-4 py-3"><StatusPill status={row.status} /></td>
                <td className={`px-4 py-3 font-bold ${row.incident === "-" ? "text-slate-400" : "text-rose-600"}`}>{row.incident}</td>
              </tr>
            )}
          />
        </div>
      </section>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3 text-sm font-black text-slate-700"><TrendingUp className="text-emerald-600" size={18}/> Doanh thu tăng ổn định</div>
          <p className="mt-2 text-sm text-slate-500">Các tuyến trọng điểm vẫn có mức doanh thu cao trong kỳ.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3 text-sm font-black text-slate-700"><Clock3 className="text-blue-600" size={18}/> Tỷ lệ đúng giờ tốt</div>
          <p className="mt-2 text-sm text-slate-500">Phần lớn chuyến đang ở trạng thái đúng giờ hoặc đã lên lịch.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3 text-sm font-black text-slate-700"><ArrowUpRight className="text-amber-600" size={18}/> Cần theo dõi sự cố</div>
          <p className="mt-2 text-sm text-slate-500">Các sự cố kẹt xe, thời tiết và phương tiện cần được lọc nhanh khi có backend.</p>
        </div>
      </div>
    </AdminPage>
  );
}
