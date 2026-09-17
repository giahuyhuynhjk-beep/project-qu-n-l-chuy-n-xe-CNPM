import React, { useMemo, useState } from "react";
import {
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Edit3,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { AdminPage, StatCard, StatusPill } from "../../layouts/AdminLayout";
import { routes, trips } from "../../data/adminMockData";

const schedules = trips.map((trip, index) => ({
  code: `SCH-${trip.id.slice(3)}`,
  route: trip.route,
  time: `${trip.time} - ${index % 2 ? "15:30" : "10:30"}`,
  cycle: index % 2 ? "Hàng tuần" : "Hằng ngày",
  startDate: trip.date,
  active: index !== 3,
  note: index % 2 ? "Cuối tuần tăng cường" : "Tuyến cố định",
}));

export default function ScheduleManagement() {
  const [list, setList] = useState(schedules);
  const [keyword, setKeyword] = useState("");
  const [routeFilter, setRouteFilter] = useState("all");
  const [cycleFilter, setCycleFilter] = useState("all");

  const filtered = useMemo(() => {
    return list.filter((item) => {
      const text = [item.code, item.route, item.cycle, item.note].join(" ").toLowerCase();
      return text.includes(keyword.toLowerCase()) && (routeFilter === "all" || item.route === routeFilter) && (cycleFilter === "all" || item.cycle === cycleFilter);
    });
  }, [list, keyword, routeFilter, cycleFilter]);

  const toggle = (code) => setList((prev) => prev.map((item) => item.code === code ? { ...item, active: !item.active } : item));
  const reset = () => {
    setKeyword("");
    setRouteFilter("all");
    setCycleFilter("all");
  };

  return (
    <AdminPage title="Quản lý lịch trình vận hành" subtitle="Thiết lập chu kỳ, thời gian và trạng thái chạy xe." actionLabel="+ Tạo lịch trình mới" onAction={() => alert("Mở form tạo lịch trình mới. Chưa kết nối backend.")}>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={CalendarClock} label="Tổng lịch trình" value={list.length} hint="Lịch trình đang cấu hình" />
        <StatCard icon={CheckCircle2} label="Đang hoạt động" value={list.filter((i) => i.active).length} tone="emerald" hint="Đang áp dụng trong hệ thống" />
        <StatCard icon={CalendarCheck} label="Tạm ngưng" value={list.filter((i) => !i.active).length} tone="slate" hint="Chưa chạy trong kỳ này" />
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px_160px_110px_110px]">
          <label className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Mã lịch trình, tuyến đường..." className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white" />
          </label>
          <select value={routeFilter} onChange={(e) => setRouteFilter(e.target.value)} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white">
            <option value="all">Tất cả tuyến đường</option>
            {routes.map((r) => <option key={r.id}>{r.name}</option>)}
          </select>
          <select value={cycleFilter} onChange={(e) => setCycleFilter(e.target.value)} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white">
            <option value="all">Tần suất</option>
            <option>Hằng ngày</option>
            <option>Hàng tuần</option>
          </select>
          <button className="h-11 rounded-xl bg-blue-600 text-sm font-black text-white hover:bg-blue-700">Tìm kiếm</button>
          <button onClick={reset} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-black text-slate-600 hover:bg-slate-50"><RefreshCw size={15}/> Reset</button>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-black uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Mã lịch trình</th>
                <th className="px-4 py-3">Tuyến đường</th>
                <th className="px-4 py-3">Thời gian chạy</th>
                <th className="px-4 py-3">Chu kỳ</th>
                <th className="px-4 py-3">Thời hạn hiệu lực</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.code} className="text-sm hover:bg-blue-50/40">
                  <td className="px-4 py-4"><p className="font-black text-blue-700">{item.code}</p><p className="mt-1 text-xs font-semibold text-slate-400">{item.note}</p></td>
                  <td className="px-4 py-4"><span className="inline-flex items-center gap-2 font-bold text-slate-800"><MapPin size={15} className="text-blue-500" />{item.route}</span></td>
                  <td className="px-4 py-4"><span className="inline-flex items-center gap-2 text-slate-600"><Clock3 size={15} className="text-slate-400" />{item.time}</span></td>
                  <td className="px-4 py-4"><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700">{item.cycle}</span></td>
                  <td className="px-4 py-4"><span className="inline-flex items-center gap-2 text-slate-500"><CalendarCheck size={15} className="text-emerald-500" />Từ {item.startDate}</span></td>
                  <td className="px-4 py-4"><StatusPill status={item.active ? "Hoạt động" : "Tạm ngưng"} /></td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => toggle(item.code)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50" title="Bật/tắt lịch trình">{item.active ? <ToggleRight size={22}/> : <ToggleLeft size={22}/>}</button>
                      <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-600"><Edit3 size={16}/></button>
                      <button className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-4 text-xs font-bold text-slate-500">
          <span>Hiển thị {filtered.length} lịch trình</span>
          <div className="flex items-center gap-3"><button className="rounded-lg border border-slate-200 p-2 text-slate-400"><ChevronLeft size={16}/></button><span className="text-slate-800">Trang 1 / 1</span><button className="rounded-lg border border-slate-200 p-2 text-slate-400"><ChevronRight size={16}/></button></div>
        </div>
      </div>
    </AdminPage>
  );
}
