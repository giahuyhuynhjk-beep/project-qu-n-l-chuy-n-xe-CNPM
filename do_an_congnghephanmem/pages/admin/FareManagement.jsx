import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Filter,
  Plus,
  Search,
  Sparkles,
  Tag,
  TicketPercent,
  X,
} from "lucide-react";
import { routes } from "../../data/adminMockData";

const fareRows = [

  
  {
    id: "CB87FA-A7",
    name: "Giá vé xe lớn 45 chỗ Sài Gòn - Cần Thơ",
    route: "TP. Hồ Chí Minh - Cần Thơ (Miền Tây - Trung tâm Cần Thơ)",
    vehicleTags: ["Xe Fuso 45", "Lọc trong ví"],
    from: "Bến xe Miền Tây",
    to: "Bến xe Trung tâm Cần Thơ",
    basePrice: "160.000 VND",
    surcharge: "",
    rules: ["Cuối tuần", "Lễ/Tết", "Trẻ em"],
    validFrom: "14/5/2026",
    validTo: "10/11/2026",
    status: "Đang hoạt động",
  },
  {
    id: "A6D4-2458",
    name: "Giá vé giường nằm VIP Sài Gòn - Đà Lạt",
    route: "TP. Hồ Chí Minh - Đà Lạt (Miền Đông - Liên tỉnh Đà Lạt)",
    vehicleTags: ["Xe giường nằm VIP 32 chỗ", "Lọc trong ví"],
    from: "Bến xe Miền Đông",
    to: "Bến xe Liên tỉnh Đà Lạt",
    basePrice: "380.000 VND",
    surcharge: "",
    rules: ["Cuối tuần", "Lễ/Tết", "Trẻ em"],
    validFrom: "6/5/2026",
    validTo: "6/5/2027",
    status: "Đang hoạt động",
  },
  {
    id: "53D4E145",
    name: "Giá vé giường nằm Đà Nẵng - Huế",
    route: "Đà Nẵng - Huế (Trung tâm Đà Nẵng - Phía Nam Huế)",
    vehicleTags: ["Xe Phương Trang 01", "Lọc trong ví"],
    from: "Bến xe Trung tâm Đà Nẵng",
    to: "Bến xe Phía Nam Huế",
    basePrice: "150.000 VND",
    surcharge: "",
    rules: ["Cuối tuần", "Lễ/Tết", "Trẻ em"],
    validFrom: "4/5/2026",
    validTo: "21/8/2026",
    status: "Đang hoạt động",
  },
  {
    id: "46ABAF73",
    name: "Giá vé Limousine 9 chỗ Sài Gòn - Vũng Tàu",
    route: "TP. Hồ Chí Minh - Vũng Tàu (Miền Đông - Bến xe Vũng Tàu)",
    vehicleTags: ["Xe Limousine 9 chỗ", "Lọc trong ví"],
    from: "Bến xe Miền Đông",
    to: "Bến xe Vũng Tàu",
    basePrice: "250.000 VND",
    surcharge: "+ 10.000 phụ phí",
    rules: ["Cuối tuần", "Lễ/Tết", "Trẻ em"],
    validFrom: "1/5/2026",
    validTo: "20/8/2026",
    status: "Đang hoạt động",
  },
  {
    id: "CF4F-6C7C",
    name: "Giá vé phòng nằm đôi VIP Hà Nội - Sài Gòn",
    route: "Hà Nội - TP. Hồ Chí Minh (Giáp Bát - Miền Đông)",
    vehicleTags: ["Xe Sao Việt 06", "Lọc trong ví"],
    from: "Bến xe Giáp Bát",
    to: "Bến xe Miền Đông",
    basePrice: "1.500.000 VND",
    surcharge: "+ 100.000 phụ phí",
    rules: ["Cuối tuần", "Lễ/Tết", "Trẻ em"],
    validFrom: "24/4/2026",
    validTo: "23/7/2026",
    status: "Đang hoạt động",
  },
  {
    id: "35F4-543",
    name: "Giá vé phòng nằm Sài Gòn - Cần Thơ",
    route: "TP. Hồ Chí Minh - Cần Thơ (Miền Tây - Trung tâm Cần Thơ)",
    vehicleTags: ["Xe Sao Việt 06", "Lọc trong ví"],
    from: "Bến xe Miền Tây",
    to: "Bến xe Trung tâm Cần Thơ",
    basePrice: "350.000 VND",
    surcharge: "+ 20.000 phụ phí",
    rules: ["Cuối tuần", "Lễ/Tết", "Trẻ em"],
    validFrom: "19/4/2026",
    validTo: "11/2/2027",
    status: "Đang hoạt động",
  },
  {
    id: "74E7B5A2",
    name: "Giá vé đoàn Hà Nội - Nha Trang",
    route: "Hà Nội - TP. Hồ Chí Minh (Giáp Bát - Miền Đông)",
    vehicleTags: ["Xe Phương Trang 01", "Lọc trong ví"],
    from: "Bến xe Giáp Bát",
    to: "Bến xe Phía Nam Nha Trang",
    basePrice: "650.000 VND",
    surcharge: "",
    rules: ["Cuối tuần", "Lễ/Tết", "Trẻ em"],
    validFrom: "14/4/2026",
    validTo: "23/7/2026",
    status: "Đang hoạt động",
  },
  {
    id: "F52D002",
    name: "Giá vé giường nằm thường Hà Nội - Sài Gòn",
    route: "Hà Nội - TP. Hồ Chí Minh (Giáp Bát - Miền Đông)",
    vehicleTags: ["Xe Phương Trang 01", "Lọc trong ví"],
    from: "Bến xe Giáp Bát",
    to: "Bến xe Miền Đông",
    basePrice: "850.000 VND",
    surcharge: "",
    rules: ["Cuối tuần", "Lễ/Tết", "Trẻ em"],
    validFrom: "6/4/2026",
    validTo: "6/10/2026",
    status: "Đang hoạt động",
  },
];

function RuleBadge({ rule }) {
  const styles = {
    "Cuối tuần": "bg-blue-50 text-blue-700",
    "Lễ/Tết": "bg-rose-50 text-rose-700",
    "Trẻ em": "bg-emerald-50 text-emerald-700",
  };

  return (
    <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-black ${styles[rule] || "bg-slate-100 text-slate-600"}`}>
      {rule}
    </span>
  );
}

function RouteTag({ children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-black text-blue-700">
      <Tag size={10} />
      {children}
    </span>
  );
}

function FareModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">Tạo bảng giá mới</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">Form demo giữ cấu trúc hiện tại, sau này backend sẽ thay dữ liệu select.</p>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"><X size={20} /></button>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-xs font-black text-slate-600">Tên bảng giá</span>
            <input placeholder="VD: Giá vé limousine Sài Gòn - Đà Lạt" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500" />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-black text-slate-600">Tuyến đường</span>
            <select className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500">
              {routes.map((route) => <option key={route.id}>{route.name}</option>)}
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-black text-slate-600">Loại xe áp dụng</span>
            <select className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500">
              <option>Limousine 9 chỗ</option>
              <option>Giường nằm VIP 32 chỗ</option>
              <option>Xe lớn 45 chỗ</option>
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-black text-slate-600">Giá chuẩn</span>
            <input placeholder="VD: 250000" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500" />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-black text-slate-600">Ngày bắt đầu</span>
            <input type="date" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500" />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-black text-slate-600">Ngày kết thúc</span>
            <input type="date" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500" />
          </label>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-600 hover:bg-slate-50">Hủy</button>
          <button onClick={onClose} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-black text-white hover:bg-blue-700">Tạo bảng giá</button>
        </div>
      </div>
    </div>
  );
}

export default function FareManagement() {
  const [keyword, setKeyword] = useState("");
  const [routeFilter, setRouteFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    return fareRows.filter((item) => {
      const text = [item.id, item.name, item.route, item.from, item.to, item.basePrice, item.status].join(" ").toLowerCase();
      return text.includes(keyword.toLowerCase()) && (routeFilter === "all" || item.route.includes(routeFilter)) && (statusFilter === "all" || item.status === statusFilter);
    });
  }, [keyword, routeFilter, statusFilter]);

  const resetFilters = () => {
    setKeyword("");
    setRouteFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Quản lý giá vé</h1>
            <p className="mt-1 text-sm font-semibold text-slate-500">Thiết lập và điều chỉnh cấu trúc giá cho toàn bộ tuyến xe.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-600 shadow-sm hover:bg-slate-50">
              <Download size={15} />
              Xuất dữ liệu
            </button>
            <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-black text-white shadow-sm hover:bg-blue-700">
              <Plus size={16} />
              Tạo bảng giá mới
            </button>
          </div>
        </div>
      </header>

      <main className="p-5 lg:p-6">
        <div className="grid max-w-3xl gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-blue-50 bg-blue-50/60 p-7 text-center shadow-sm">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Sparkles size={19} />
            </div>
            <p className="mt-4 text-xs font-black uppercase tracking-wide text-slate-500">Mức giá active</p>
            <p className="mt-1 text-3xl font-black text-slate-900">12</p>
          </div>
          <div className="rounded-2xl border border-amber-50 bg-amber-50/60 p-7 text-center shadow-sm">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Clock3 size={19} />
            </div>
            <p className="mt-4 text-xs font-black uppercase tracking-wide text-slate-500">Sắp hết hạn</p>
            <p className="mt-1 text-3xl font-black text-slate-900">0</p>
          </div>
        </div>

        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-3 border-b border-slate-200 bg-slate-50/70 p-4 lg:grid-cols-[1fr_230px_190px_120px_120px]">
            <label className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Tìm kiếm theo tên bảng giá..." className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm font-semibold outline-none focus:border-blue-500" />
            </label>
            <select value={routeFilter} onChange={(e) => setRouteFilter(e.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-blue-500">
              <option value="all">Tất cả tuyến đường</option>
              <option>TP. Hồ Chí Minh - Cần Thơ</option>
              <option>TP. Hồ Chí Minh - Đà Lạt</option>
              <option>Đà Nẵng - Huế</option>
              <option>Hà Nội - TP. Hồ Chí Minh</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-blue-500">
              <option value="all">Tất cả trạng thái</option>
              <option>Đang hoạt động</option>
              <option>Tạm ngưng</option>
            </select>
            <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-950 text-sm font-black text-white hover:bg-slate-800">
              <Search size={15} />
              Tìm kiếm
            </button>
            <button onClick={resetFilters} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-black text-slate-500 hover:bg-slate-100">
              <Filter size={14} />
              Xóa bộ lọc
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1260px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-white text-[11px] font-black uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Thông tin Bảng giá</th>
                  <th className="px-4 py-3">Áp dụng cho</th>
                  <th className="px-4 py-3">Chặng đường</th>
                  <th className="px-4 py-3">Cấu trúc Giá</th>
                  <th className="px-4 py-3">Quy tắc</th>
                  <th className="px-4 py-3">Hiệu lực</th>
                  <th className="px-4 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((fare) => (
                  <tr key={fare.id} className="text-[13px] hover:bg-blue-50/40">
                    <td className="max-w-[260px] px-4 py-4 align-top">
                      <p className="font-black leading-snug text-slate-900">{fare.name}</p>
                      <p className="mt-1 text-[10px] font-black uppercase text-slate-400">{fare.id}</p>
                    </td>
                    <td className="max-w-[300px] px-4 py-4 align-top">
                      <p className="font-bold leading-snug text-slate-700">{fare.route}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {fare.vehicleTags.map((tag) => <RouteTag key={tag}>{tag}</RouteTag>)}
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top text-slate-600">
                      <div className="flex items-center gap-2 font-semibold">
                        <span className="max-w-[88px] truncate">{fare.from}</span>
                        <span className="text-slate-300">→</span>
                        <span className="max-w-[95px] truncate">{fare.to}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <p className="font-black text-slate-900">{fare.basePrice}</p>
                      {fare.surcharge && <p className="mt-1 text-[11px] font-semibold text-slate-500">{fare.surcharge}</p>}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex flex-col items-start gap-1">
                        {fare.rules.map((rule) => <RuleBadge key={rule} rule={rule} />)}
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="space-y-1 text-[11px] font-semibold text-slate-500">
                        <p className="inline-flex items-center gap-1"><CalendarDays size={12} /> {fare.validFrom}</p>
                        <p>đến {fare.validTo}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span className="inline-flex rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-black text-white">
                        {fare.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-4 text-xs font-bold text-slate-500">
            <span>Hiển thị {filtered.length} bảng giá trên tổng số {fareRows.length}</span>
            <div className="flex items-center gap-3">
              <button className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:bg-slate-50"><ChevronLeft size={16} /></button>
              <span className="font-black text-slate-800">Trang 1 / 1</span>
              <button className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:bg-slate-50"><ChevronRight size={16} /></button>
            </div>
          </div>
        </section>
      </main>

      {isModalOpen && <FareModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
